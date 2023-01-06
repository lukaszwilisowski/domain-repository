import { NoInfer } from '../../interfaces/helper.types';
import {
  TransformArray,
  TransformArrayOfObjects,
  TransformNestedObject,
  TransformProperty
} from './mapping.transforms';

export const MapTo = {
  /**
   * Transforms object's property into entity property, using value transformers.
   */
  Property: <K, X, Y>(
    targetKey: K,
    transformer: (objectValue: X) => NoInfer<Y>,
    reverseTransformer: (entityValue: Y) => X
  ) => new TransformProperty('TransformProperty', targetKey, transformer, reverseTransformer),

  /**
   * Transforms object's array into entity array, using array element transformers.
   */
  Array: <K, X, Y>(
    targetKey: K,
    elementTransformer: (objectValue: X) => Y,
    reverseElementTransformer: (entityValue: Y) => X
  ) => new TransformArray('TransformArray', targetKey, elementTransformer, reverseElementTransformer),

  /**
   * Transforms object's array of objects into entity's array of objects, using nested mapping.
   */
  ObjectArray: <K, M>(targetKey: K, nestedMapping: M) =>
    new TransformArrayOfObjects('ObjectArray', targetKey, nestedMapping),

  /**
   * Transforms object's nested object into entity object, using nested mapping.
   */
  NestedObject: <K, M>(targetKey: K, nestedMapping: M) =>
    new TransformNestedObject('NestedObject', targetKey, nestedMapping)
};
