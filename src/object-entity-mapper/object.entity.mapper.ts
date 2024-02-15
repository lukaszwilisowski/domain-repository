import { Mapping, StrictTypeMapper } from 'strict-type-mapper';
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
  private readonly typeMapper: StrictTypeMapper<T, E>;

  public constructor(mapping: Mapping<A, E, unknown>) {
    this.typeMapper = new StrictTypeMapper(mapping);
  }

  /** Maps object criteria into entity criteria. */
  public mapSearchCriteria(criteria?: SearchCriteria<A>): SearchCriteria<E> {
    //treat empty criteria as find_all
    if (!criteria) return {};

    return this.mapInternal(criteria);
  }

  /** Maps search options into entity search options. */
  public mapSearchOptions(options?: SearchOptions<A>): SearchOptions<E> {
    if (!options) return {};
    const mappedSortOptions = this.mapInternal(options.sortBy) as SortOptions<E>;
    return { ...options, sortBy: mappedSortOptions };
  }

  /** Maps new detached object into detached entity. */
  public mapDetachedObjectToEntity(object: T): E {
    return this.mapInternal(object);
  }

  /** Maps object update into detached entity. */
  public mapUpdate(update: UpdateCriteria<T>): UpdateCriteria<E> {
    return this.mapInternal(update);
  }

  /** Maps entity into attached object. */
  public mapEntityToAttachedObject(entity: E): A {
    return this.mapInternal(entity, true);
  }

  private mapInternal<I, O>(input: I, reversed?: boolean): O {
    const mappedOutput: { [k: string]: unknown } = {};

    const mapping = this.typeMapper.getCompiledMapping();

    const keyMap = reversed ? mapping.sourceKeyToTargetKeyMap : mapping.targetKeyToSourceKeyMap;

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

      const transformedValue = this.getTransformedValue(key, value, reversed);

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

  private getTransformedValue(key: string, value: unknown, reversed?: boolean): unknown {
    //compute transformed value
    let transformedValue: unknown = value;
    if (transformedValue instanceof ValueCondition)
      transformedValue = (transformedValue as ValueCondition<unknown>).value;
    if (transformedValue instanceof ValueAction)
      transformedValue = (transformedValue as ValueAction<unknown>).value;

    const mapping = this.typeMapper.getCompiledMapping();

    const nestedMapping = reversed ? mapping.sourceKeyToNestedMapping[key] : mapping.targetKeyToNestedMapping[key];

    if (nestedMapping) {
      if (transformedValue === null) {
        //nested object is null (SQL)
        return null;
      } else if (Array.isArray(transformedValue)) {
        //array of objects
        transformedValue = transformedValue.map((v) => this.mapInternal(v, reversed));
      } else {
        //nested object
        transformedValue = this.mapInternal(transformedValue, reversed);
      }

      return transformedValue;
    }

    //array transformation
    const arrayElementTansform = reversed
      ? mapping.sourceElementKeyToFuncMap[key]
      : mapping.targetElementKeyToFuncMap[key];

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
      (reversed ? mapping.sourceKeyToFuncMap[key] : mapping.targetKeyToFuncMap[key]) || //transform found?
      ((i: unknown) => i); //if not, fallback to no-transformation

    transformedValue = Array.isArray(transformedValue)
      ? transformedValue.map((v) => transform(v))
      : transform(transformedValue);

    return transformedValue;
  }
}
