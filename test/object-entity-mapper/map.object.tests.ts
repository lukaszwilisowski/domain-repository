import { describe, expect, it } from '@jest/globals';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import { AnimalObject } from './_models/animal.models';
import { complexMapping } from './_models/example.mapping';

describe('Map object', () => {
  it('should map object', () => {
    const complexMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, AnimalObject>(complexMapping);

    const entity = complexMapper.mapDetachedObjectToEntity({
      name: 'Jack',
      name2: 'Dawson',
      name3: 'Great',
      age: 20,
      friendIDsNullable: [1, 2, 3],
      friendIDs: [1, 2, 3],
      friends: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond',
        level: 100
      }
    });

    expect(Object.keys(entity).length).toBe(6);
    expect(entity.name).toBeUndefined();
    expect(entity.name2).toEqual('Jack');
    expect(entity.name3).toEqual('Dawson');
    expect(entity.age).toBe(21);
    expect(entity.friendIDs).toBeUndefined();
    expect(entity.friendIDsNullable).toEqual([-1, -2, -3]);
    expect(entity.friends[0]).toEqual({ age: 11 });
    expect(entity.features.color).toEqual('blond_changed');
    expect(entity.features.level).toEqual(103);
  });

  it('should map object with custom mapping', () => {
    const customMapping: Mapping<AnimalObject, AnimalObject, false> = {
      name: 'name',
      friendIDs: 'friendIDs',
      friendIDsNullable: 'friendIDsNullable',
      friends: 'friends',
      friendsNullable: 'friendsNullable',
      features: 'features',
      featuresNullable: 'featuresNullable'
    };

    const customMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, AnimalObject>(customMapping);

    const entity = customMapper.mapDetachedObjectToEntity({
      name: 'Jack',
      name2: 'Dawson',
      name3: 'Great',
      age: 20,
      friendIDs: [1, 2, 3],
      friendIDsNullable: [1, 2, 3],
      friends: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond',
        level: 100
      }
    });

    expect(entity.name).toEqual('Jack');
    expect(entity.name2).toBeUndefined();
    expect(entity.name3).toBeUndefined();
    expect(entity.age).toBeUndefined();
    expect(entity.friendIDs).toEqual([1, 2, 3]);
    expect(entity.friendIDsNullable).toEqual([1, 2, 3]);
    expect(entity.friends[0]).toEqual({ name: 'Rose', age: 10 });
    expect(entity.friendsNullable).toBeUndefined();
    expect(entity.features).toEqual({ color: 'blond', level: 100 });
    expect(entity.featuresNullable).toBeUndefined();
  });
});


