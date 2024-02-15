import { describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IsOneOfTheValues } from 'interfaces/search/search.conditions';
import mongoose from 'mongoose';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import { Mapping } from 'strict-type-mapper';
import { mapToMongoObjectId } from '../../db/mongodb';
import { AnimalObject, MappedAnimalObject } from './_models/animal.models';
import { DeskMongoObject, DeskObject } from './_models/desk.model';

describe('Map criteria', () => {
  const simpleMapping: Mapping<AnimalObject, MappedAnimalObject, false> = {
    name: 'name',
    age: 'age',
    ageNullable: 'age_nullable',
    friendIDs: 'friendIDs'
  };

  const deskMapping: Mapping<DeskObject, DeskMongoObject> = {
    id: mapToMongoObjectId
  };

  const simpleMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, MappedAnimalObject>(simpleMapping);
  const deskMapper = new ObjectEntityMapper<DeskObject, DeskObject, DeskMongoObject>(deskMapping);

  it('should map undefined', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria();

    expect(mappedCriteria).toEqual({});
  });

  it('should map single property', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ name: 'Brian' });

    expect(mappedCriteria).toEqual({ name: 'Brian' });
  });

  it('should map number 0', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ age: 0 });

    expect(mappedCriteria).toEqual({ age: 0 });
  });

  it('should map single array', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ friendIDs: [1, 2] });

    expect(mappedCriteria).toEqual({ friendIDs: [1, 2] });
  });

  it('should not map unmapped properties', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ name: 'Brian', age: 10, friendIDsNullable: [4, 5] });

    expect(mappedCriteria.name).toEqual('Brian');
    expect(mappedCriteria.age).toEqual(10);
    expect(mappedCriteria.friendIDsNullable).toBeUndefined();
  });

  it('should map Equals', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ name: SearchBy.Equals('Brian') });

    expect(mappedCriteria.name).toEqual(SearchBy.Equals('Brian'));
  });

  it('should map Exists', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({
      ageNullable: SearchBy.Exists()
    });

    expect(mappedCriteria.age_nullable).toEqual(SearchBy.Exists());
  });

  it('should map Contains', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ name: SearchBy.Contains('aaa') });

    expect(mappedCriteria.name).toEqual(SearchBy.Contains('aaa'));
  });

  it('should map IsGreaterThan', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ age: SearchBy.IsGreaterThan(5) });

    expect(mappedCriteria.age).toEqual(SearchBy.IsGreaterThan(5));
  });

  it('should map IsOneOfTheValues', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ name: SearchBy.IsOneOfTheValues(['Brian', 'John']) });

    expect(mappedCriteria.name).toEqual(SearchBy.IsOneOfTheValues(['Brian', 'John']));
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
    const mappedCriteria = simpleMapper.mapSearchCriteria({ friendIDs: SearchBy.HasElement(1) });

    expect(mappedCriteria.friendIDs).toEqual(SearchBy.HasElement(1));
  });

  it('should map HasAllElements', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ friendIDs: SearchBy.HasAllElements([1, 2, 3]) });

    expect(mappedCriteria.friendIDs).toEqual(SearchBy.HasAllElements([1, 2, 3]));
  });

  it('should map SortOptions', () => {
    const mappedSortOptions = simpleMapper.mapSearchOptions({
      skip: 5,
      limit: 10,
      sortBy: { name: 'asc', age: 'desc' }
    });

    expect(mappedSortOptions.skip).toBe(5);
    expect(mappedSortOptions.limit).toBe(10);
    expect(mappedSortOptions.sortBy?.name).toEqual('asc');
    expect(mappedSortOptions.sortBy?.age).toEqual('desc');
  });
});
