import { SearchOptions, SortOptions } from 'interfaces/search/search.options.interface';
import { ObjectLiteral, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import {
  Equals,
  HasElementThatMatches,
  NestedCriteria,
  ObjectArrayDoesNotExist,
  ObjectArrayExists,
  ObjectDoesNotExist,
  ObjectExists,
  ValueCondition
} from '../../../interfaces/search/search.conditions';
import { SearchCriteria } from '../../../interfaces/search/search.criteria.interface';
import { CompiledMapping } from '../../../object-entity-mapper/models/compiled.mapping';

export const formatSelectQuery = <E extends ObjectLiteral>(
  entityName: string,
  queryBuilder: SelectQueryBuilder<E>,
  criteria: Record<string, unknown>,
  options: SearchOptions<E>,
  compiledMapping: CompiledMapping,
  loadRelations?: boolean
): SelectQueryBuilder<E> => {
  //moved outside recursive function to persist state
  const nestedKeysAlreadyLoaded: string[] = [];

  //standard query
  formatSelectQueryImpl(entityName, queryBuilder, criteria, compiledMapping, nestedKeysAlreadyLoaded);

  if (loadRelations) {
    //load left relations, which were not loaded during standard query
    loadUnloadedRelatons(entityName, queryBuilder, compiledMapping, nestedKeysAlreadyLoaded);
  }

  if (options.sortBy) {
    let first = true;

    for (const key in options.sortBy) {
      const queryKey = entityName ? `${entityName}.${key}` : key;
      const sortOption = options.sortBy[key as keyof SortOptions<E>]?.toUpperCase() as 'ASC' | 'DESC';
      const nullsOptions = first ? (sortOption === 'ASC' ? 'NULLS FIRST' : 'NULLS LAST') : undefined;
      queryBuilder.orderBy(queryKey, sortOption, nullsOptions);
      first = false;
    }
  }

  if (nestedKeysAlreadyLoaded.length === 0) {
    //can be run on db side
    if (options.skip) queryBuilder.offset(options.skip);
    if (options.limit) queryBuilder.limit(options.limit);
  } else {
    //in there are joins, offset and limit could return incorrect number of entities
    //in this case, we need to use skip and take which are called after getting db results
    if (options.skip) queryBuilder.skip(options.skip);
    if (options.limit) queryBuilder.take(options.limit);
  }

  return queryBuilder;
};

const formatSelectQueryImpl = <E extends ObjectLiteral>(
  entityName: string | undefined,
  queryBuilder: SelectQueryBuilder<E>,
  criteria: Record<string, unknown>,
  compiledMapping: CompiledMapping,
  nestedKeysAlreadyLoaded: string[]
): SelectQueryBuilder<E> => {
  for (const key in criteria) {
    if (criteria[key] === undefined)
      //ignore undefined
      continue;

    const queryKey = entityName ? `${entityName}.${key}` : key;
    const nestedJoinEntityName = queryKey.replace('.', '_');

    //nested criteria requires left joins
    if (criteria[key] instanceof NestedCriteria || criteria[key] instanceof HasElementThatMatches) {
      const nestedCriteria = criteria[key] as ValueCondition<SearchCriteria<unknown>>;

      queryBuilder.leftJoinAndSelect(queryKey, nestedJoinEntityName);
      nestedKeysAlreadyLoaded.push(queryKey);

      queryBuilder.andWhere(`${nestedJoinEntityName}.id is not null`);

      //recursion
      const nestedCompiledMapping = compiledMapping.entityKeyToNestedMapping[key];
      formatSelectQueryImpl(
        nestedJoinEntityName,
        queryBuilder,
        nestedCriteria.value,
        nestedCompiledMapping,
        nestedKeysAlreadyLoaded
      );

      continue;
    }

    //special cases of Exists that requires left joins
    if (criteria[key] instanceof ObjectExists || criteria[key] instanceof ObjectArrayExists) {
      queryBuilder.leftJoinAndSelect(queryKey, nestedJoinEntityName);
      nestedKeysAlreadyLoaded.push(queryKey);

      queryBuilder.andWhere(`${nestedJoinEntityName}.id is not null`);
      continue;
    }

    //special cases of DoesNotExist that requires left joins
    if (criteria[key] instanceof ObjectDoesNotExist || criteria[key] instanceof ObjectArrayDoesNotExist) {
      queryBuilder.leftJoinAndSelect(queryKey, nestedJoinEntityName);
      nestedKeysAlreadyLoaded.push(queryKey);

      queryBuilder.andWhere(`${nestedJoinEntityName}.id is null`);
      continue;
    }

    //standard condition
    addConditionToQueryBuilder(queryBuilder, queryKey, criteria[key]);
  }

  return queryBuilder;
};

const loadUnloadedRelatons = <E extends ObjectLiteral>(
  entityName: string | undefined,
  queryBuilder: SelectQueryBuilder<E>,
  compiledMapping: CompiledMapping,
  nestedKeysAlreadyLoaded: string[]
): void => {
  for (const key of compiledMapping.nestedEntityKeys) {
    const queryKey = entityName ? `${entityName}.${key}` : key;
    const nestedJoinEntityName = queryKey.replace(/\./g, '_');

    if (nestedKeysAlreadyLoaded.includes(queryKey)) continue;

    queryBuilder.leftJoinAndSelect(queryKey, nestedJoinEntityName);

    if (compiledMapping.entityKeyToNestedMapping[key]) {
      const nestedMapping = compiledMapping.entityKeyToNestedMapping[key] as CompiledMapping;
      loadUnloadedRelatons(nestedJoinEntityName, queryBuilder, nestedMapping, nestedKeysAlreadyLoaded);
    }
  }
};

export const addConditionToQueryBuilder = <E extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<E> | UpdateQueryBuilder<E>,
  queryKey: string,
  condition: unknown
): void => {
  const c =
    condition === null || Array.isArray(condition) || typeof condition !== 'object'
      ? new Equals(condition)
      : (condition as ValueCondition<unknown>);

  const p = queryKey.replace('.', '');

  switch (c.conditionName) {
    case 'Equals':
      if (c.value === null) queryBuilder.andWhere(`${queryKey} is null`);
      else queryBuilder.andWhere(`${queryKey} = :${p}`, { [p]: c.value });
      return;
    case 'DoesNotEqual':
      if (c.value === null) queryBuilder.andWhere(`${queryKey} is not null`);
      else queryBuilder.andWhere(`${queryKey} is null or ${queryKey} != :${p}`, { [p]: c.value });
      return;
    ///////////////////////
    case 'Exists':
      queryBuilder.andWhere(`${queryKey} is not null`);
      return;
    case 'ArrayExists':
      queryBuilder.andWhere(`${queryKey} is not null and ${queryKey} != '{}'`);
      return;
    ///////////////////////
    case 'DoesNotExist':
      queryBuilder.andWhere(`${queryKey} is null`);
      return;
    case 'ArrayDoesNotExist':
      queryBuilder.andWhere(`${queryKey} is null or ${queryKey} = '{}'`);
      return;
    ///////////////////////
    case 'StartsWith':
      queryBuilder.andWhere(`${queryKey} like :${p}`, { [p]: `${c.value}%` });
      return;
    case 'DoesNotStartWith':
      queryBuilder.andWhere(`${queryKey} not like :${p}`, { [p]: `${c.value}%` });
      return;
    case 'EndsWith':
      queryBuilder.andWhere(`${queryKey} like :${p}`, { [p]: `%${c.value}` });
      return;
    case 'DoesNotEndWith':
      queryBuilder.andWhere(`${queryKey} not like :${p}`, { [p]: `%${c.value}` });
      return;
    case 'Contains':
      queryBuilder.andWhere(`${queryKey} like :${p}`, { [p]: `%${c.value}%` });
      return;
    case 'DoesNotContain':
      queryBuilder.andWhere(`${queryKey} not like :${p}`, { [p]: `%${c.value}%` });
      return;
    ///////////////////////
    case 'IsGreaterThan':
      queryBuilder.andWhere(`${queryKey} > :${p}`, { [p]: c.value });
      return;
    case 'IsGreaterThanOrEqual':
      queryBuilder.andWhere(`${queryKey} >= :${p}`, { [p]: c.value });
      return;
    case 'IsLesserThan':
      queryBuilder.andWhere(`${queryKey} < :${p}`, { [p]: c.value });
      return;
    case 'IsLesserThanOrEqual':
      queryBuilder.andWhere(`${queryKey} <= :${p}`, { [p]: c.value });
      return;
    ///////////////////////
    case 'IsOneOfTheValues':
      queryBuilder.andWhere(`${queryKey} in (:...${p})`, { [p]: c.value });
      return;
    case 'IsNoneOfTheValues':
      queryBuilder.andWhere(`${queryKey} not in (:...${p})`, { [p]: c.value });
      return;
    ///////////////////////
    case 'HasElement':
      queryBuilder.andWhere(`${queryKey} @> :${p}`, { [p]: [c.value] });
      return;
    case 'DoesNotHaveElement':
      queryBuilder.andWhere(`${queryKey} is null or not (${queryKey} @> :${p})`, { [p]: [c.value] });
      return;
    case 'HasAnyOfTheElements':
      queryBuilder.andWhere(`${queryKey} && :${p}`, { [p]: c.value });
      return;
    case 'HasNoneOfTheElements':
      queryBuilder.andWhere(`${queryKey} is null or not (${queryKey} && :${p})`, { [p]: c.value });
      return;
    case 'HasAllElements':
      queryBuilder.andWhere(`${queryKey} @> :${p}`, { [p]: c.value });
      return;
    ///////////////////////

    default:
      throw new Error('Unknown search condition: ' + condition);
  }
};
