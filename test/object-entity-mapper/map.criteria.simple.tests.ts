import { describe, expect, it } from '@jest/globals';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import { AnimalObject } from './_models/animal.models';

describe('Map criteria', () => {
  const simpleMapping: Mapping<AnimalObject, AnimalObject, false> = {
    name: 'name',
    age: 'age',
    ageNullable: 'ageNullable',
    friendIDs: 'friendIDs'
  };

  const simpleMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, AnimalObject>(simpleMapping);

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

    expect(mappedCriteria.ageNullable).toEqual(SearchBy.Exists());
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

  it('should map HasElement', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ friendIDs: SearchBy.HasElement(1) });

    expect(mappedCriteria.friendIDs).toEqual(SearchBy.HasElement(1));
  });

  it('should map HasAllElements', () => {
    const mappedCriteria = simpleMapper.mapSearchCriteria({ friendIDs: SearchBy.HasAllElements([1, 2, 3]) });

    expect(mappedCriteria.friendIDs).toEqual(SearchBy.HasAllElements([1, 2, 3]));
  });
});
