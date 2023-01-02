import { PrimitiveTypes } from '../../interfaces/property.types.interface';
import {
  TransformArray,
  TransformArrayOfObjects,
  TransformNestedObject,
  TransformProperty
} from './mapping.transforms';

/**
 * Maps all properties from `I` type into properties in `O` type.
 * @type `MapAll` When set to `false`, allows to map only selected properties.
 *
 * 1. Optional properties can be only mapped to optional properties.
 * 2. When types are not compatible, you must use `MapTo` function.
 * 3. When you want to use transformation, you must use `MapTo` function.
 * 2. When you want to map a nested object, you must use `MapTo.NestedObject`, with nested mapping.
 * 2. When you want to map an array of objects, you must use `MapTo.ArrayOfObjects`, with nested mapping.
 */
export type Mapping<I, O, MapAll = true> = MapAll extends true
  ? { [P in keyof I]: MappedType<I, O, P, MapAll> }
  : { [P in keyof I]?: MappedType<I, O, P, MapAll> };

type MappedType<I, O, P extends keyof I, MapAll> = keyof O extends infer R
  ? R extends keyof O //this is required so that we can later check for E[R]
    ? I[P] extends PrimitiveTypes | undefined
      ? PrimitiveCompatibleTypes<I, O, P, R>
      : I[P] extends PrimitiveTypes[] | undefined
      ? PrimitiveArrayCompatibleTypes<I, O, P, R>
      : I[P] extends Array<infer X> | undefined
      ? ObjectArrayCompatibleTypes<I, O, P, R, X, MapAll>
      : I[P] extends object | undefined
      ? NestedObjectCompatibletypes<I, O, P, R, MapAll>
      : never
    : never
  : never;

type PrimitiveCompatibleTypes<I, O, P extends keyof I, R extends keyof O> = I[P] extends PrimitiveTypes | undefined
  ? I[P] extends PrimitiveTypes
    ? O[R] extends PrimitiveTypes
      ? PropertyCompatibleTypes<I, O, P, R, I[P], O[R]>
      : never
    : O[R] extends PrimitiveTypes | undefined
    ? //each optional type can be set to NULL in SQL, we must consider that during custom transformation
      PropertyCompatibleTypes<I, O, P, R, NonNullable<I[P]>, NonNullable<O[R]> | null>
    : never
  : //fallback
    never;

type PrimitiveArrayCompatibleTypes<I, O, P extends keyof I, R extends keyof O> = O[R] extends
  | PrimitiveTypes[]
  | undefined
  ? O[R] extends PrimitiveTypes[]
    ? I[P] extends Array<infer X>
      ? O[R] extends Array<infer Y>
        ? ArrayCompatibleTypes<I, O, P, R, X, Y>
        : never
      : never
    : I[P] extends Array<infer X> | undefined
    ? O[R] extends Array<infer Y> | undefined
      ? ArrayCompatibleTypes<I, O, P, R, X, Y>
      : never
    : never
  : //fallback
    never;

//Maybe it can be simplified somehow
type ObjectArrayCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, MapAll> = O[R] extends
  | PrimitiveTypes[]
  | undefined
  ? never
  : I[P] extends Array<infer X>
  ? O[R] extends Array<infer Y>
    ? ArrayOfObjectsCompatibleTypes<I, O, P, R, X, Y, MapAll>
    : never
  : O[R] extends Array<infer Y> | undefined
  ? O[R] extends Array<infer Y>
    ? never
    : ArrayOfObjectsCompatibleTypes<I, O, P, R, X, Y, MapAll>
  : never;

//Maybe it can be simplified somehow
type NestedObjectCompatibletypes<I, O, P extends keyof I, R extends keyof O, MapAll> = O[R] extends
  | PrimitiveTypes
  | PrimitiveTypes[]
  | Array<infer X>
  | undefined
  ? never
  : I[P] extends object
  ? O[R] extends object
    ? NestedObjectCompatibleTypes<I, O, P, R, I[P], O[R], MapAll>
    : never
  : O[R] extends object | undefined
  ? O[R] extends object
    ? never
    : NestedObjectCompatibleTypes<I, O, P, R, I[P], O[R], MapAll>
  : never;

/** Property helper type. */
type PropertyCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y> = I[P] extends O[R]
  ? //property can be mapped directly to another property with the same type
    R | TransformProperty<R, X, Y>
  : //or transformed to another property
    TransformProperty<R, X, Y>;

/** Array helper type. */
type ArrayCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y> = I[P] extends O[R]
  ? //array of primitives can be mapped directly to another array of primitives with the same type
    R | TransformArray<R, X, Y>
  : //or transformed to another array of primitives
    TransformArray<R, X, Y>;

/** Object array helper type. */
type ArrayOfObjectsCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y, MapAll> = I[P] extends O[R]
  ? //array of primitives can be mapped directly to another array of primitives with the same type
    R | TransformArrayOfObjects<R, Mapping<X, Y, MapAll>>
  : //or transformed to another array of primitives
    TransformArrayOfObjects<R, Mapping<X, Y, MapAll>>;

/** Object array helper type. */
type NestedObjectCompatibleTypes<I, O, P extends keyof I, R extends keyof O, X, Y, MapAll> = I[P] extends O[R]
  ? //array of primitives can be mapped directly to another array of primitives with the same type
    R | TransformNestedObject<R, Mapping<NonNullable<X>, NonNullable<Y>, MapAll>>
  : //or transformed to another array of primitives
    TransformNestedObject<R, Mapping<NonNullable<X>, NonNullable<Y>, MapAll>>;
