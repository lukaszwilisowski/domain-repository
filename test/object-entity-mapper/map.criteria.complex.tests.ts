import { describe, expect, it } from '@jest/globals';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { IsGreaterThan, NestedCriteria } from 'interfaces/search/search.conditions';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import {
  AdditionalObject,
  AnimalObject,
  FeaturesObject,
  FriendObject
} from './_models/animal.models';
import { complexMapping } from './_models/example.mapping';

describe('Map criteria', () => {
  const complexMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, AnimalObject>(complexMapping);

  it('should map name', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: 'Brian' });

    expect(mappedCriteria).toEqual({ name2: 'Brian' });
  });

  it('should map name with IsOneOfValues', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: SearchBy.IsOneOfTheValues(['John', 'David']) });

    expect(mappedCriteria.name2).toEqual(SearchBy.IsOneOfTheValues(['John', 'David']));
  });

  it('should map name2 with Contains', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name2: SearchBy.Contains('aaa') });

    expect(mappedCriteria.name3).toEqual(SearchBy.Contains('aaa'));
  });

  it('should map nameNullable', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ nameNullable: SearchBy.EndsWith('on') });

    expect(mappedCriteria).toEqual({ nameNullable: SearchBy.EndsWith('ON') });
  });

  it('should map age', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ age: SearchBy.IsGreaterThan(4) });

    expect(mappedCriteria).toEqual({ age: SearchBy.IsGreaterThan(5) });
  });

  it('should map friendIDsNullable', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ friendIDsNullable: [2, 3] });

    expect(mappedCriteria.friendIDsNullable).toEqual([-2, -3]);
  });

  it('should map friends', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      friends: SearchBy.HasElementThatMatches<FriendObject>({
        name: '5',
        age: SearchBy.IsGreaterThan(7)
      })
    });

    expect(mappedCriteria.friends?.value.name).toBeUndefined();
    expect((mappedCriteria.friends?.value.age as IsGreaterThan<number>).value).toBe(8);
  });

  it('should map features', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      features: SearchBy.NestedCriteria<FeaturesObject>({
        color: 'black',
        level: 5
      })
    });

    expect(mappedCriteria.features?.value.color).toEqual('black_changed');
    expect(mappedCriteria.features?.value.level).toEqual(8);
  });

  it('should map nested features', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      features: SearchBy.NestedCriteria<FeaturesObject>({
        color: 'black',
        level: 5,
        additional: SearchBy.NestedCriteria<AdditionalObject>({
          serialNumber: 's-02'
        })
      })
    });

    expect(mappedCriteria.features?.value.color).toEqual('black_changed');
    expect(mappedCriteria.features?.value.level).toEqual(8);
    expect(mappedCriteria.features?.value.additional).toBeInstanceOf(NestedCriteria);

    const additionalCriteria = mappedCriteria.features?.value.additional as NestedCriteria<AdditionalObject>;
    expect(additionalCriteria.value.serialNumber).toEqual('s-02_new');
  });

  it('should map nested Exist -> Exist', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      features: SearchBy.NestedCriteria<FeaturesObject>({
        additional: SearchBy.NestedCriteria<AdditionalObject>({
          index: SearchBy.Exists()
        })
      })
    });

    expect(mappedCriteria.features?.value.additional).toBeInstanceOf(NestedCriteria);

    const additionalCriteria = mappedCriteria.features?.value.additional as NestedCriteria<AdditionalObject>;
    expect(additionalCriteria.value.index).toEqual(SearchBy.Exists());
  });

  it('should map ArrayExists', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      friendIDsNullable: SearchBy.ArrayExists()
    });

    expect(mappedCriteria.friendIDsNullable).toEqual(SearchBy.ArrayExists());
  });

  it('should map ObjectArrayExists', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      friendsNullable: SearchBy.ObjectArrayDoesNotExist()
    });

    expect(mappedCriteria.friendsNullable).toEqual(SearchBy.ObjectArrayDoesNotExist());
  });

  it('should map nested Exist -> Exist', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      featuresNullable: SearchBy.ObjectExists()
    });

    expect(mappedCriteria.featuresNullable).toEqual(SearchBy.ObjectExists());
  });
});
