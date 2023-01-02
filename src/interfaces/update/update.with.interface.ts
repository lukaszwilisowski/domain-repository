import { NoInfer } from '../helper.types';
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
import { UpdateCriteria } from './update.criteria.interface';

export const UpdateWith = {
  /**
   * Sets new value.
   *
   * NOTE! When setting an object or array of objects, you are stronly encouraged to provide an explicit type `Set<T>`.
   * This will help Typescript find type errors.
   */
  Set: <T>(value: T) => new Set(value),

  /** Deletes property (MongoDb, Mocked) or sets to null (SQL). */
  Clear: () => new Clear(),

  /** Sets empty array. */
  ClearArray: () => new ClearArray(),

  /** Deletes object property (MongoDb, Mocked) or sets to null (SQL). */
  ClearObject: () => new ClearObject(),

  /** Sets empty array. */
  ClearObjectArray: () => new ClearObjectArray(),
  //////////////////////////////////////////////////////////////////////

  /**
   * Increments by specified value. If property does not exist, it will not do anything.
   */
  Increment: (value: number) => new Increment(value),

  //////////////////////////////////////////////////////////////////////

  /**
   * Pushes element to array, or creates an array if does not exist.
   *
   * NOTE! When pusing an object, you are stronly encouraged to provide an explicit type `Push<T>`.
   * This will help Typescript find type errors.
   */
  Push: <T>(value: T) => new Push(value),

  /**
   * Pushes each element to array, or creates an array if does not exist.
   *
   * NOTE! When pushing an array of objects, you are stronly encouraged to provide an explicit type `PushEach<T>`.
   * This will help Typescript find type errors.
   */
  PushEach: <T>(value: T[]) => new PushEach(value),

  /**
   * Pulls element from array.
   *
   * NOTE! When pulling an array of objects, you are stronly encouraged to provide an explicit type `Pull<T>`.
   * This will help Typescript find type errors.
   */
  Pull: <T>(value: T) => new Pull(value),

  /**
   * Pulls each element from array.
   *
   * NOTE! When pulling an array of objects, you are stronly encouraged to provide an explicit type `PullEach<T>`.
   * This will help Typescript find type errors.
   */
  PullEach: <T>(value: T[]) => new PullEach(value),

  //////////////////////////////////////////////////////////////////////

  /**
   * Updates nested object using criteria. Requires explicit type `NestedUpdate<T>`.
   *
   * NOTE! When nested object does not exist, creates new nested object with ONLY updated properties!
   * This can lead to discrepancies in your domain model. To prevent that, search for nested objects using `Exist()` clause.
   */
  NestedUpdate: <T = never>(value: UpdateCriteria<NoInfer<T>>) => new NestedUpdate(value),

  /**
   * Updates nested array elements using criteria. Requires explicit type `NestedArrayUpdate<T>`.
   */
  NestedArrayUpdate: <T = never>(value: UpdateCriteria<NoInfer<T>>) => new NestedArrayUpdate(value)
};
