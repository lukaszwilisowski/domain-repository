import { IfEquals } from '../helper.types';
import { PrimitiveTypes } from '../primitive.types.interface';
import {
  ArrayDoesNotExist,
  ArrayExists,
  Contains,
  DoesNotContain,
  DoesNotEndWith,
  DoesNotEqual,
  DoesNotExist,
  DoesNotHaveElement,
  DoesNotStartWith,
  EndsWith,
  Equals,
  Exists,
  HasAllElements,
  HasAnyOfTheElements,
  HasElement,
  HasElementThatMatches,
  HasNoneOfTheElements,
  IsGreaterThan,
  IsGreaterThanOrEqual,
  IsLesserThan,
  IsLesserThanOrEqual,
  IsNoneOfTheValues,
  IsOneOfTheValues,
  NestedCriteria,
  ObjectArrayDoesNotExist,
  ObjectArrayExists,
  ObjectDoesNotExist,
  ObjectExists,
  StartsWith
} from './search.conditions';

/**
 * Makes `T` properties searchable.
 * 1. `Primitives` by: value, Equals, DoesNotEqual, IsOneOfTheValues, IsNoneOfTheValues.
 * 2. `Optional` properties additionally by: Exists, DoesNotExists.
 * 3. `Strings` additionally by: StartsWith, EndsWith, Contains, DoesNotStartWith, DoesNotEndWith, DoesNotContain.
 * 4. `Numbers` and `Dates` additionally by: IsGreaterThan, IsLesserThan, IsLesserThanOrEqual, IsGreaterThanOrEqual.
 * 5. `Arrays of primitives` by: value, Equals, DoesNotEqual, HasElement, DoesNotHaveElement, HasAnyOfTheElements, HasNoneOfTheElements, HasAllElements.
 * 6. `Arrays of objects` by: HasElementThatMatches, ObjectArrayExists, ObjectArrayDoesNotExist.
 * 7. `Nested objects` by: NestedCriteria, ObjectExists, ObjectDoesNotExist.
 */
export type SearchCriteria<T> = {
  [P in keyof T]?: T[P] extends PrimitiveTypes | undefined
    ? //primitive type or optional primitive type
      PrimitiveCompatibleTypes<T[P]>
    : T[P] extends Array<infer X> | undefined
    ? X extends PrimitiveTypes
      ? //array of primitives
        ArrayCompatibletypes<T[P]>
      : //array of objects
        ObjectArrayCompatibletypes<T[P]>
    : //nested object
      ObjectCompatibletypes<T[P]>;
};

export type PrimitiveCompatibleTypes<T> = T extends PrimitiveTypes
  ? //non-nullable types
    T extends string
    ? StringCompatibleTypes<T>
    : T extends number
    ? NumberCompatibleTypes<T>
    : T extends Date
    ? DateCompatibleTypes<T>
    : T extends boolean
    ? BooleanCompatibleTypes<T>
    : //other types
      T | Equals<T> | DoesNotEqual<T>
  : T extends PrimitiveTypes | undefined
  ? //nullable types
    Exists | DoesNotExist
  : //fallback
    never;

//////////////////////////////////////////////////////////////

type StringCompatibleTypes<T> = IfEquals<T, string, string> extends never
  ? //enum
    T | Equals<T> | DoesNotEqual<T> | IsOneOfTheValues<T> | IsNoneOfTheValues<T>
  : //string
    | string
      | Equals<string>
      | DoesNotEqual<string>
      | StartsWith
      | DoesNotStartWith
      | EndsWith
      | DoesNotEndWith
      | Contains
      | DoesNotContain
      | IsOneOfTheValues<string>
      | IsNoneOfTheValues<string>;

type NumberCompatibleTypes<T> = IfEquals<T, number, number> extends never
  ? //enum
    T | Equals<T> | DoesNotEqual<T> | IsOneOfTheValues<number> | IsNoneOfTheValues<number>
  : //number
    | number
      | Equals<number>
      | DoesNotEqual<number>
      | IsGreaterThan<number>
      | IsGreaterThanOrEqual<number>
      | IsLesserThan<number>
      | IsLesserThanOrEqual<number>
      | IsOneOfTheValues<number>
      | IsNoneOfTheValues<number>;

type DateCompatibleTypes<T> = T extends Date
  ?
      | Date
      | Equals<Date>
      | DoesNotEqual<Date>
      | IsGreaterThan<Date>
      | IsGreaterThanOrEqual<Date>
      | IsLesserThan<Date>
      | IsLesserThanOrEqual<Date>
      | IsOneOfTheValues<Date>
      | IsNoneOfTheValues<Date>
  : never;

type BooleanCompatibleTypes<T> = T extends boolean ? boolean | Equals<boolean> | DoesNotEqual<boolean> : never;

//////////////////////////////////////////////////////////////

type ArrayCompatibletypes<T> = T extends Array<infer X>
  ? //non-nullable array
    | X[]
      | Equals<X[]>
      | DoesNotEqual<X[]>
      | HasElement<X>
      | DoesNotHaveElement<X>
      | HasAnyOfTheElements<X>
      | HasNoneOfTheElements<X>
      | HasAllElements<X>
  : T extends Array<unknown> | undefined
  ? ArrayExists | ArrayDoesNotExist
  : //fallback
    never;

type ObjectArrayCompatibletypes<T> = T extends Array<infer X>
  ? //non-nullable array
    HasElementThatMatches<X>
  : T extends Array<unknown> | undefined
  ? ObjectArrayExists | ObjectArrayDoesNotExist
  : //fallback
    never;

//////////////////////////////////////////////////////////////

type ObjectCompatibletypes<T> = T extends object
  ? //non-nullable object
    NestedCriteria<T>
  : T extends object | undefined
  ? ObjectExists | ObjectDoesNotExist
  : //fallback
    never;

//////////////////////////////////////////////////////////////
