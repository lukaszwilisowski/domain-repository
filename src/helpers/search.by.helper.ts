import { NoInfer } from '../interfaces/helper.types';
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
} from '../interfaces/search/search.conditions';
import { SearchCriteria } from '../interfaces/search/search.criteria.interface';

export const SearchBy = {
  /** Checks if property equals value. */
  Equals: <T>(value: T) => new Equals(value),

  /** Checks if property does not equal value, assuming the parent object exists. */
  DoesNotEqual: <T>(value: T) => new DoesNotEqual(value),

  //////////////////////////////////////////////////////////////////////

  /** Checks if property exists, assuming the higher level object exists. */
  Exists: () => new Exists(),

  /** Checks if array exists and is not empty, assuming the higher level object exists. */
  ArrayExists: () => new ArrayExists(),

  /** Checks if object exists, assuming the higher level object exists. */
  ObjectExists: () => new ObjectExists(),

  /** Checks if object array exists and is not empty, assuming the higher level object exists. */
  ObjectArrayExists: () => new ObjectArrayExists(),

  //////////////////////////////////////////////////////////////////////

  /** Checks if property does not exist, assuming the higher level object exists. */
  DoesNotExist: () => new DoesNotExist(),

  /** Checks if array does not exist or is empty, assuming the higher level object exists. */
  ArrayDoesNotExist: () => new ArrayDoesNotExist(),

  /** Checks if object does not exist, assuming the higher level object exists. */
  ObjectDoesNotExist: () => new ObjectDoesNotExist(),

  /** Checks if object array does not exist or is empty, assuming the higher level object exists. */
  ObjectArrayDoesNotExist: () => new ObjectArrayDoesNotExist(),

  //////////////////////////////////////////////////////////////////////

  /** Checks if string starts with a specified prefix. */
  StartsWith: (prefix: string) => new StartsWith(prefix),

  /** Checks if string does not start with specified prefix. */
  DoesNotStartWith: (prefix: string) => new DoesNotStartWith(prefix),

  /** Checks if string ends with a specified suffix. */
  EndsWith: (suffix: string) => new EndsWith(suffix),

  /** Checks if string does not ends with specified prefix. */
  DoesNotEndWith: (suffix: string) => new DoesNotEndWith(suffix),

  /** Checks if string constains substring. */
  Contains: (substring: string) => new Contains(substring),

  /** Checks if string does not contain specified substring. */
  DoesNotContain: (substring: string) => new DoesNotContain(substring),

  //////////////////////////////////////////////////////////////////////

  /** Checks if number or date is greater than specified value. */
  IsGreaterThan: <T extends number | Date>(value: T) => new IsGreaterThan(value),

  /** Checks if number or date is greater than or equal specified value. */
  IsGreaterThanOrEqual: <T extends number | Date>(value: T) => new IsGreaterThanOrEqual(value),

  /** Checks if number or date is lesser than specified value. */
  IsLesserThan: <T extends number | Date>(value: T) => new IsLesserThan(value),

  /** Checks if number or date is lesser than or equal specified value. */
  IsLesserThanOrEqual: <T extends number | Date>(value: T) => new IsLesserThanOrEqual(value),

  //////////////////////////////////////////////////////////////////////

  /** Checks if property is one of the values. */
  IsOneOfTheValues: <T>(value: T[]) => new IsOneOfTheValues(value),

  /** Checks if property is none of the values. */
  IsNoneOfTheValues: <T>(value: T[]) => new IsNoneOfTheValues(value),

  ///////////////////////////////////////////////////////////
  // Arrays /////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  /** Checks if array contains element. */
  HasElement: <T>(value: T) => new HasElement(value),

  /** Checks if array does not contain element. Matches undefined and null arrays (if parent object exists). */
  DoesNotHaveElement: <T>(value: T) => new DoesNotHaveElement(value),

  /** Checks if array has any of the elements. */
  HasAnyOfTheElements: <T>(value: T[]) => new HasAnyOfTheElements(value),

  /** Checks if array has none of the elements. Matches undefined and null arrays (if parent object exists). */
  HasNoneOfTheElements: <T>(value: T[]) => new HasNoneOfTheElements(value),

  /** Checks if array contains all elements. */
  HasAllElements: <T>(value: T[]) => new HasAllElements(value),

  ///////////////////////////////////////////////////////////
  // Array of objects ///////////////////////////////////////
  ///////////////////////////////////////////////////////////

  /** Checks if nested array contains element that matches criteria. Requires explicit type `HasElementThatMatches<T>`. */
  HasElementThatMatches: <T = never>(value: SearchCriteria<NoInfer<T>>) => new HasElementThatMatches(value),

  ///////////////////////////////////////////////////////////
  // Nested object //////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  /** Checks if nested object matches criteria. Requires explicit type `NestedCriteria<T>`. */
  NestedCriteria: <T = never>(value: SearchCriteria<NoInfer<T>>) => new NestedCriteria(value)
};
