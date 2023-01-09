/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it } from '@jest/globals';
import { MapTo } from 'object-entity-mapper/helpers/map.to.helper';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { AdditionalObject, AnimalObject, FeaturesObject, FriendObject } from './_models/animal.models';

describe('Mapping', () => {
  it('should work for standard properties', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      name: 'name',
      age: 'age'
    };
  });

  it('should not work when mapping standard property to nullable property', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      // @ts-expect-error
      name: 'nameNullable'
    };
  });

  it('should work with transformed property', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      name: 'name',
      age: MapTo.Property(
        'age',
        (objectAge: number) => objectAge,
        (entityAge: number) => entityAge
      )
    };
  });

  it('should work with property transformed to different property', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      name: 'name',
      age: MapTo.Property(
        'name',
        (objectAge: number) => objectAge?.toString() || 'default',
        (entityName: string) => parseInt(entityName)
      )
    };
  });

  it('should work with nullable property', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      ageNullable: 'ageNullable'
    };
  });

  it('should work with nullable transformed property', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      ageNullable: MapTo.Property(
        'ageNullable',
        (objectPoints: number) => objectPoints,
        (entityPoints: number | null) => entityPoints || 0
      )
    };
  });

  it('should work with nullable property transformed to different property', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      ageNullable: MapTo.Property(
        'nameNullable',
        (objectPoints: number) => objectPoints?.toString() || '5',
        (entityName: string | null) => parseInt(entityName || '1')
      )
    };
  });

  it('should work with simple array', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friendIDs: 'friendIDs'
    };
  });

  it('should work with transformed array', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friendIDs: MapTo.Array(
        'friendIDs',
        (objectId: number) => objectId,
        (entityId: number) => entityId
      )
    };
  });

  it('should not work with badly transformed array', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      // @ts-expect-error
      friendIDs: MapTo.Array(
        'friendIDs',
        (objectId: string) => objectId,
        (entityId: string) => entityId
      )
    };
  });

  it('should work with nullable array', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friendIDsNullable: 'friendIDsNullable'
    };
  });

  it('should work with transformed nullable array', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friendIDsNullable: MapTo.Array(
        'friendIDsNullable',
        (objectId: number) => objectId,
        (entityId: number) => entityId
      )
    };
  });

  it('should work with object array', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friends: 'friends'
    };
  });

  it('should work with object array, with transformation', () => {
    const elementMapping: Mapping<FriendObject, FriendObject> = {
      name: 'name',
      age: 'age',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friends: MapTo.ObjectArray('friends', elementMapping)
    };
  });

  it('should work with nullable object array', () => {
    const elementMapping: Mapping<FriendObject, FriendObject> = {
      name: 'name',
      age: 'age',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      friendsNullable: MapTo.ObjectArray('friendsNullable', elementMapping)
    };
  });

  it('should not work with nullable object array, incompatible types', () => {
    const elementMapping: Mapping<FriendObject, FriendObject> = {
      name: 'name',
      age: 'age',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      // @ts-expect-error
      friendsNullable: MapTo.ObjectArray('friends', elementMapping)
    };
  });

  it('should work with nested object', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      features: 'features'
    };
  });

  it('should work with nested object, with tranformation', () => {
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      features: MapTo.NestedObject('features', featuresMapping)
    };
  });

  it('should work with nested nullable object', () => {
    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      featuresNullable: 'featuresNullable'
    };
  });

  it('should work with nested nullable object, with transformation', () => {
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      featuresNullable: MapTo.NestedObject('featuresNullable', featuresMapping)
    };
  });

  it('should not work with nested nullable object, incompatible types', () => {
    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level'
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      // @ts-expect-error
      featuresNullable: MapTo.NestedObject('features', featuresMapping)
    };
  });

  it('should not work with nested nullable object, incompatible types', () => {
    const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
      serialNumber: 'serialNumber'
    };

    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level',
      additional: MapTo.NestedObject('additional', additionalMapping)
    };
  });

  it('should work with multi-nested object', () => {
    const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
      serialNumber: 'serialNumber'
    };

    const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
      color: 'color',
      level: 'level',
      additional: MapTo.NestedObject('additional', additionalMapping)
    };

    const mapping: Mapping<AnimalObject, AnimalObject, false> = {
      features: MapTo.NestedObject('features', featuresMapping)
    };
  });
});
