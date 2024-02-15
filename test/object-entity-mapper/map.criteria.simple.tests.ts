import { describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IsOneOfTheValues } from 'interfaces/search/search.conditions';
import mongoose from 'mongoose';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import { Mapping } from 'strict-type-mapper';
import { mapToMongoObjectId } from '../../db/mongodb';
import { AnimalObject, MappedAnimalObject } from './_models/animal.models';
import { DeskMongoObject, DeskObject } from './_models/desk.model';
import { complexMapping } from './_models/example.mapping';

describe('Map criteria', () => {
  const complexMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, MappedAnimalObject>(complexMapping);

  const deskMapping: Mapping<DeskObject, DeskMongoObject> = {
    id: mapToMongoObjectId
  };

  const deskMapper = new ObjectEntityMapper<DeskObject, DeskObject, DeskMongoObject>(deskMapping);

  it('should map undefined', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria();

    expect(mappedCriteria).toEqual({});
  });

  it('should map single property', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: 'Brian' });

    expect(mappedCriteria).toEqual({ name2: 'Brian' });
  });

  it('should map number 0', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ age: 0 });

    expect(mappedCriteria).toEqual({ age: 1 });
  });

  it('should map single array', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ friendIDs: [1, 2] });

    expect(mappedCriteria).toEqual({ friendIDs: [1, 2] });
  });

  it('should not map unmapped properties', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: 'Brian', age: 10, friendIDsNullable: [4, 5] });

    expect(mappedCriteria.name2).toEqual('Brian');
    expect(mappedCriteria.age).toEqual(11);
    expect(mappedCriteria.friendIDsNullable).toEqual([-4, -5]);
  });

  it('should map Equals', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: SearchBy.Equals('Brian') });

    expect(mappedCriteria.name2).toEqual(SearchBy.Equals('Brian'));
  });

  it('should map Exists', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({
      ageNullable: SearchBy.Exists()
    });

    expect(mappedCriteria.age_nullable).toEqual(SearchBy.Exists());
  });

  it('should map Contains', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: SearchBy.Contains('aaa') });

    expect(mappedCriteria.name2).toEqual(SearchBy.Contains('aaa'));
  });

  it('should map IsGreaterThan', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ age: SearchBy.IsGreaterThan(5) });

    expect(mappedCriteria.age).toEqual(SearchBy.IsGreaterThan(6));
  });

  it('should map IsOneOfTheValues', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ name: SearchBy.IsOneOfTheValues(['Brian', 'John']) });

    expect(mappedCriteria.name2).toEqual(SearchBy.IsOneOfTheValues(['Brian', 'John']));
  });

  it('should map IsOneOfTheValues with ID', () => {
    const mappedCriteria = deskMapper.mapSearchCriteria({
      id: SearchBy.IsOneOfTheValues(['63b8091cdd1f0c4927ca4725', '63b8094815787ea434bd798a'])
    });

    const searchCondition = mappedCriteria._id as unknown as IsOneOfTheValues<mongoose.Types.ObjectId>;
    const objectIdArray = searchCondition.value;

    expect(mongoose.Types.ObjectId.isValid(objectIdArray[0])).toBe(true);
    expect(mongoose.Types.ObjectId.isValid(objectIdArray[1])).toBe(true);
  });

  it('should map HasElement', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ friendIDs: SearchBy.HasElement(1) });

    expect(mappedCriteria.friendIDs).toEqual(SearchBy.HasElement(1));
  });

  it('should map HasAllElements', () => {
    const mappedCriteria = complexMapper.mapSearchCriteria({ friendIDs: SearchBy.HasAllElements([1, 2, 3]) });

    expect(mappedCriteria.friendIDs).toEqual(SearchBy.HasAllElements([1, 2, 3]));
  });

  it('should map SortOptions', () => {
    const mappedSortOptions = complexMapper.mapSearchOptions({
      skip: 5,
      limit: 10,
      sortBy: { name: 'asc', age: 'desc' }
    });

    expect(mappedSortOptions.skip).toBe(5);
    expect(mappedSortOptions.limit).toBe(10);
    expect(mappedSortOptions.sortBy?.name2).toEqual('asc');
    expect(mappedSortOptions.sortBy?.age).toEqual('desc');
  });
});
