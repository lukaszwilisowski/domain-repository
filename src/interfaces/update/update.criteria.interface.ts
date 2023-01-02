import { MutablePropsOf } from '../helper.types';
import { PrimitiveTypes } from '../property.types.interface';
import {
  Clear,
  ClearArray,
  ClearObject,
  ClearObjectArray,
  Increment,
  NestedArrayUpdate,
  NestedUpdate,
  Pull,
  PullEach,
  Push,
  PushEach,
  Set
} from './update.conditions';

/**
 * Makes `T` non-readonly (!) properties updateable:
 * 1. `Primitives` by: Set.
 * 2. `Optionals` additionally by: Clear.
 * 3. `Numbers` additionally by: Increment.
 * 4. `Arrays` additionally by: Push, PushEach, Pull, PullEach.
 * 5. `Nested objects`: by UpdateCriteria<T>.
 */
export type UpdateCriteria<T> = {
  [P in keyof T]?: P extends MutablePropsOf<T>
    ? T[P] extends PrimitiveTypes | undefined
      ? //is primitive type or optional primitive type
        PrimitiveCompatibleTypes<T[P]>
      : //is array type type or optional array type
      T[P] extends Array<infer X> | undefined
      ? ArrayCompatibletypes<T[P], X>
      : //is nested object type type or optional nested object type
      T[P] extends object | undefined
      ? ObjectCompatibletypes<T[P]>
      : never
    : //readonly properties cannot be updated
      never;
};

type PrimitiveCompatibleTypes<T> = T extends PrimitiveTypes
  ? //non-nullable types
    T extends number
    ? //number
      number | Set<number> | Increment
    : //other types
      T | Set<T>
  : T extends PrimitiveTypes | undefined
  ? Clear
  : //fallback
    never;

type ArrayCompatibletypes<T, X> = T extends Array<infer X>
  ? //non-nullable array
    X extends PrimitiveTypes
    ? X[] | Set<X[]> | Push<X> | PushEach<X> | Pull<X> | PullEach<X>
    : X[] | Set<X[]> | Push<X> | PushEach<X> | Pull<X> | PullEach<X> | NestedArrayUpdate<X>
  : T extends undefined
  ? //nullable array
    X extends PrimitiveTypes
    ? ClearArray
    : ClearObjectArray
  : //fallback
    never;

type ObjectCompatibletypes<T> = T extends object
  ? //non-nullable object
    Set<T> | NestedUpdate<T>
  : T extends object | undefined
  ? //nullable object
    ClearObject
  : //fallback
    never;
