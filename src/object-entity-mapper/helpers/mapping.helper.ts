import { Mapping } from '../interfaces/mapping.interface';
import {
  TransformArray,
  TransformArrayOfObjects,
  TransformNestedObject,
  TransformProperty
} from '../interfaces/mapping.transforms';
import { CompiledMapping } from '../models/compiled.mapping';

export const compileMappings = <A, E, MapAll>(mapping: Mapping<A, E, MapAll>): CompiledMapping => {
  const cm = new CompiledMapping();

  for (const key in mapping) {
    const keyMapping = mapping[key];

    if (keyMapping instanceof TransformProperty) {
      //transform property
      const transformProperty = keyMapping as TransformProperty<string, unknown, unknown>;
      cm.objectKeyToEntityKeyMap[key] = transformProperty.targetKey;
      cm.objectKeyToFuncMap[key] = transformProperty.transformer;
      //reversed keys
      cm.entityKeyToObjectKeyMap[transformProperty.targetKey] = key;
      cm.entityKeyToFuncMap[transformProperty.targetKey] = transformProperty.reverseTransformer;
      //entity key
      cm.entityKeys.push(transformProperty.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArray) {
      //transform array
      const transformArray = keyMapping as TransformArray<string, unknown, unknown>;
      cm.objectKeyToEntityKeyMap[key] = transformArray.targetKey;
      cm.objectElementKeyToFuncMap[key] = transformArray.elementTransformer;
      //reversed keys
      cm.entityKeyToObjectKeyMap[transformArray.targetKey] = key;
      cm.entityElementKeyToFuncMap[transformArray.targetKey] = transformArray.reverseElementTransformer;
      //entity key
      cm.entityKeys.push(transformArray.targetKey);
      continue;
    }

    if (keyMapping instanceof TransformArrayOfObjects) {
      //transform array of objects
      const transformObjectArray = keyMapping as TransformArrayOfObjects<string, unknown>;
      //map nested object key to entity's counterpart
      cm.objectKeyToEntityKeyMap[key] = transformObjectArray.targetKey;
      cm.entityKeyToObjectKeyMap[transformObjectArray.targetKey] = key;
      //entity key
      cm.entityKeys.push(transformObjectArray.targetKey);
      cm.nestedEntityKeys.push(transformObjectArray.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformObjectArray.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.objectKeyToNestedMapping[key] = compiledNestedMapping;
      cm.entityKeyToNestedMapping[transformObjectArray.targetKey] = compiledNestedMapping;
      continue;
    }

    if (keyMapping instanceof TransformNestedObject) {
      //transform nested object
      const transformNestedObject = keyMapping as TransformNestedObject<string, unknown>;
      //map nested object key to entity's counterpart
      cm.objectKeyToEntityKeyMap[key] = transformNestedObject.targetKey;
      cm.entityKeyToObjectKeyMap[transformNestedObject.targetKey] = key;
      //entity keys
      cm.entityKeys.push(transformNestedObject.targetKey);
      cm.nestedEntityKeys.push(transformNestedObject.targetKey);

      //compile nested mapping
      const compiledNestedMapping = compileMappings(
        transformNestedObject.nestedMapping as Mapping<unknown, unknown, MapAll>
      );

      cm.objectKeyToNestedMapping[key] = compiledNestedMapping;
      cm.entityKeyToNestedMapping[transformNestedObject.targetKey] = compiledNestedMapping;

      continue;
    }

    //default, no transformation function
    cm.objectKeyToEntityKeyMap[key] = keyMapping as string;
    cm.entityKeyToObjectKeyMap[keyMapping as string] = key;
    //entity key
    cm.entityKeys.push(keyMapping as string);
  }

  return cm;
};
