import { CompiledMapping, Mapping, StrictTypeMapper } from 'strict-type-mapper';
import { DoesNotExist, Exists, ValueCondition } from '../interfaces/search/search.conditions';
import { SearchCriteria } from '../interfaces/search/search.criteria.interface';
import { SearchOptions, SortOptions } from '../interfaces/search/search.options.interface';
import { Clear, ValueAction } from '../interfaces/update/update.conditions';
import { UpdateCriteria } from '../interfaces/update/update.criteria.interface';

/**
 * Represents a general object-entity mapper.
 * @type `T` covariant object type.
 * @type `A` covariant attached domain object type.
 * @type `E` invariant DB entity type.
 */
export class ObjectEntityMapper<T, A extends T, E> {
  private readonly typeMapper: StrictTypeMapper<A, E>;
  private readonly compiledMapping: CompiledMapping;

  public constructor(mapping: Mapping<A, E>) {
    this.typeMapper = new StrictTypeMapper<A, E>(mapping);
    this.compiledMapping = this.typeMapper.getCompiledMapping();
  }

  /** Maps object criteria into entity criteria. */
  public mapSearchCriteria(criteria?: SearchCriteria<A>): SearchCriteria<E> {
    //treat empty criteria as find_all
    if (!criteria) return {};

    return this.mapInternal(criteria, this.compiledMapping);
  }

  /** Maps search options into entity search options. */
  public mapSearchOptions(options?: SearchOptions<A>): SearchOptions<E> {
    if (!options) return {};
    const mappedSortOptions: SearchOptions<E> = { ...options, sortBy: {} };
    if (options.sortBy && mappedSortOptions.sortBy) {
      for (const key in options.sortBy) {
        const value = options.sortBy[key as keyof SortOptions<A>] as 'asc' | 'desc';
        const mappedKey = this.compiledMapping.sourceKeyToTargetKeyMap[key];
        mappedSortOptions.sortBy[mappedKey as keyof SortOptions<E>] = value;
      }
    }

    return mappedSortOptions;
  }

  /** Maps new detached object into detached entity. */
  public mapDetachedObjectToEntity(object: T): E {
    return this.mapInternal(object, this.compiledMapping);
  }

  /** Maps object update into detached entity. */
  public mapUpdate(update: UpdateCriteria<T>): UpdateCriteria<E> {
    return this.mapInternal(update, this.compiledMapping);
  }

  /** Maps entity into attached object. */
  public mapEntityToAttachedObject(entity: E): A {
    return this.mapInternal(entity, this.compiledMapping, true);
  }

  /** Gets compiled mappings. */
  public getCompiledMapping(): CompiledMapping {
    return this.compiledMapping;
  }

  private mapInternal<I, O>(input: I, mapping: CompiledMapping, reversed?: boolean): O {
    const mappedOutput: { [k: string]: unknown } = {};

    const keyMap = reversed ? mapping.targetKeyToSourceKeyMap : mapping.sourceKeyToTargetKeyMap;

    for (const key in keyMap) {
      const targetKey = keyMap[key];
      const value = input[key as keyof I];

      //undefined properties cannot be mapped
      if (value === undefined) continue;

      //do not transform this condition or action
      if (value instanceof Exists || value instanceof DoesNotExist || value instanceof Clear) {
        mappedOutput[targetKey] = value;
        continue;
      }

      const transformedValue = this.getTransformedValue(key, value, mapping, reversed);

      if (typeof value !== 'object' || value === null) {
        //direct assignment
        mappedOutput[targetKey] = transformedValue;
        continue;
      }

      if (value instanceof ValueCondition || value instanceof ValueAction) {
        //transform full condition
        //we change the value inside class instance to preserve class type, it will be later useful for instanceof checks
        //we could work around this by: 1) replacing instanceof type checks with casting to ValueCondition and checking condition name, but this one is cleaner
        //we could also: 2) dynamically call constructor of class instance without new (there are possibly some tricks for that)
        value.value = transformedValue;
        mappedOutput[targetKey] = value;
      } else {
        //transform value
        mappedOutput[targetKey] = transformedValue;
      }
    }

    return mappedOutput as O;
  }

  private getTransformedValue(key: string, value: unknown, mapping: CompiledMapping, reversed?: boolean): unknown {
    //compute transformed value
    let transformedValue: unknown = value;
    if (transformedValue instanceof ValueCondition)
      transformedValue = (transformedValue as ValueCondition<unknown>).value;
    if (transformedValue instanceof ValueAction)
      transformedValue = (transformedValue as ValueAction<unknown>).value;

    const nestedMapping = reversed ? mapping.targetKeyToNestedMapping[key] : mapping.sourceKeyToNestedMapping[key];

    if (nestedMapping) {
      if (transformedValue === null) {
        //nested object is null (SQL)
        return null;
      } else if (Array.isArray(transformedValue)) {
        //array of objects
        transformedValue = transformedValue.map((v) => this.mapInternal(v, nestedMapping, reversed));
      } else {
        //nested object
        transformedValue = this.mapInternal(transformedValue, nestedMapping, reversed);
      }

      return transformedValue;
    }

    //array transformation
    const arrayElementTansform = reversed
      ? mapping.targetElementKeyToFuncMap[key]
      : mapping.sourceElementKeyToFuncMap[key];

    if (arrayElementTansform) {
      if (transformedValue === null) {
        //null array (SQL)
        return null;
      } else if (Array.isArray(transformedValue)) {
        transformedValue = transformedValue.map((v) => arrayElementTansform(v));
      } else {
        transformedValue = arrayElementTansform(transformedValue);
      }

      return transformedValue;
    }

    //primitive transformation
    const transform =
      (reversed ? mapping.targetKeyToFuncMap[key] : mapping.sourceKeyToFuncMap[key]) || //transform found?
      ((i: unknown) => i); //if not, fallback to no-transformation

    transformedValue = Array.isArray(transformedValue)
      ? transformedValue.map((v) => transform(v))
      : transform(transformedValue);

    return transformedValue;
  }
}
