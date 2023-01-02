import { describe, expect, it } from '@jest/globals';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import { Features, Friend } from '../repository-types/_models/non-nullable.model';
import {
  AnimalObject
} from './_models/animal.models';
import { complexMapping } from './_models/example.mapping';

describe('Map entity', () => {
  const complexMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, AnimalObject>(complexMapping);

  it('should map entity', () => {
    const entity = complexMapper.mapEntityToAttachedObject({
      name: 'Dawson',
      name2: 'Jack',
      name3: 'Great',
      age: 21,
      friendIDs: [1, 2, 3],
      friendIDsNullable: [-1, -2, -3],
      friends: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond_changed',
        level: 100,
        additional: {
          serialNumber: 's-03_new'
        }
      }
    });

    expect(Object.keys(entity).length).toBe(6);
    expect(entity.name).toEqual('Jack');
    expect(entity.name2).toEqual('Great');
    expect(entity.age).toBe(20);
    expect(entity.friendIDs).toBeUndefined();
    expect(entity.friendIDsNullable).toEqual([1, 2, 3]);
    expect(entity.friends[0]).toEqual({ age: 9 });
    expect(entity.features.color).toEqual('blond');
    expect(entity.features.level).toEqual(97);
    expect(entity.features.additional?.serialNumber).toEqual('s-03');
  });

  it('should map object and reverse', () => {
    const object: AnimalObject = {
      name: 'Jack',
      name2: 'Dawson',
      name3: 'Great',
      age: 20,
      friendIDs: [1, 2, 3],
      friendIDsNullable: [1, 2, 3],
      friends: [{ name: 'Rose', age: 10 }],
      features: {
        color: 'blond',
        level: 100,
        additional: {
          serialNumber: 's-03'
        }
      }
    };

    const entity = complexMapper.mapDetachedObjectToEntity(object);
    const reversedObject = complexMapper.mapEntityToAttachedObject(entity);

    expect(reversedObject.name3).toBeUndefined(); //not mapped
    expect(reversedObject.friendIDs).toBeUndefined(); //not mapped
    expect(reversedObject.friends[0]).toEqual({ age: 10 });
    expect(object.name).toEqual(reversedObject.name);
    expect(object.name2).toEqual(reversedObject.name2);
    expect(object.age).toEqual(reversedObject.age);
    expect(object.friendIDsNullable).toEqual(reversedObject.friendIDsNullable);
    expect(object.features.color).toEqual(reversedObject.features.color);
    expect(object.features.level).toEqual(reversedObject.features.level);
    expect(object.features.additional?.serialNumber).toEqual(reversedObject.features.additional?.serialNumber);
  });

  it('should map entity with nulled properties (SQL)', () => {
    const entity = complexMapper.mapEntityToAttachedObject({
      name: 'Dawson',
      nameNullable: null as unknown as string,
      name2: 'Jack',
      name3: 'Great',
      age: 21,
      ageNullable: null,
      friendIDs: [1, 2, 3],
      friendIDsNullable: null as unknown as number[],
      friends: [{ name: 'Rose', age: 10 }],
      friendsNullable: null as unknown as Friend[],
      features: null as unknown as Features,
      featuresNullable: null as unknown as Features
    });

    expect(entity.nameNullable).toBe('default');
    expect(entity.ageNullable).toBe(0);
    expect(entity.friendIDsNullable).toBeNull();
    expect(entity.friendsNullable).toBeNull();
    expect(entity.features).toBeNull();
    expect(entity.featuresNullable).toBeNull();
  });

  it('should return entity keys', () => {
    const entityKeys = complexMapper.getCompiledMapping().entityKeys;

    expect(entityKeys).not.toContain('name');
    expect(entityKeys).toContain('nameNullable');
    expect(entityKeys).toContain('name2');
    expect(entityKeys).toContain('name3');
    expect(entityKeys).toContain('age');
    expect(entityKeys).toContain('ageNullable');
    expect(entityKeys).not.toContain('friendIDs');
    expect(entityKeys).toContain('friendIDsNullable');
    expect(entityKeys).toContain('friends');
    expect(entityKeys).toContain('friendsNullable');
    expect(entityKeys).toContain('features');
    expect(entityKeys).toContain('featuresNullable');
  });
});
