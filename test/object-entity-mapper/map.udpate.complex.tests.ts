import { describe, expect, it } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { NestedUpdate } from 'interfaces/update/update.conditions';
import { ObjectEntityMapper } from 'object-entity-mapper/object.entity.mapper';
import {
  AdditionalObject,
  AnimalObject,
  FeaturesObject,
  FriendObject,
  MappedAnimalObject
} from './_models/animal.models';
import { complexMapping } from './_models/example.mapping';

describe('Map update', () => {
  const complexMapper = new ObjectEntityMapper<AnimalObject, AnimalObject, MappedAnimalObject>(complexMapping);

  it('should map name', () => {
    const mappedCriteria = complexMapper.mapUpdate({ name: 'Brian' });

    expect(mappedCriteria).toEqual({ name2: 'Brian' });
  });

  it('should map name with Set', () => {
    const mappedCriteria = complexMapper.mapUpdate({ name: UpdateWith.Set('Brian') });

    expect(mappedCriteria.name2).toEqual(UpdateWith.Set('Brian'));
  });

  it('should map name with Clear', () => {
    const mappedCriteria = complexMapper.mapUpdate({ nameNullable: UpdateWith.Clear() });

    expect(mappedCriteria).toEqual({ nameNullable: UpdateWith.Clear() });
  });

  it('should map Increment', () => {
    const mappedCriteria = complexMapper.mapUpdate({ age: UpdateWith.Increment(1) });

    expect(mappedCriteria).toEqual({ age: UpdateWith.Increment(2) });
  });

  it('should map friendIDsNullable', () => {
    const mappedCriteria = complexMapper.mapUpdate({ friendIDsNullable: [2, 3] });

    expect(mappedCriteria.friendIDsNullable).toEqual([-2, -3]);
  });

  it('should map friendIDsNullable with Push', () => {
    const mappedCriteria = complexMapper.mapUpdate({ friendIDsNullable: UpdateWith.Push(2) });

    expect(mappedCriteria.friendIDsNullable).toEqual(UpdateWith.Push(-2));
  });

  it('should map friendIDsNullable with Pull', () => {
    const mappedCriteria = complexMapper.mapUpdate({ friendIDsNullable: UpdateWith.Pull(3) });

    expect(mappedCriteria.friendIDsNullable).toEqual(UpdateWith.Pull(-3));
  });

  it('should map friendIDsNullable with PushEach', () => {
    const mappedCriteria = complexMapper.mapUpdate({ friendIDsNullable: UpdateWith.PushEach([4, 5]) });

    expect(mappedCriteria.friendIDsNullable).toEqual(UpdateWith.PushEach([-4, -5]));
  });

  it('should map friendIDsNullable with PullEach', () => {
    const mappedCriteria = complexMapper.mapUpdate({ friendIDsNullable: UpdateWith.PullEach([2, 3]) });

    expect(mappedCriteria.friendIDsNullable).toEqual(UpdateWith.PullEach([-2, -3]));
  });

  it('should map friends with Set', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      friends: UpdateWith.Set([{ age: 10, name: 'f1', level: 5 }])
    });

    expect(mappedCriteria.friends).toEqual(UpdateWith.Set([{ age: 11 }]));
  });

  it('should map friends with PullEach', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      friends: UpdateWith.Pull({ age: 10, name: 'f1', level: 5 })
    });

    expect(mappedCriteria.friends).toEqual(UpdateWith.Pull({ age: 11 }));
  });

  it('should map friendsNullable with PullEach', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      friendsNullable: UpdateWith.ClearObjectArray()
    });

    expect(mappedCriteria.friends_nullable).toEqual(UpdateWith.ClearObjectArray());
  });

  it('should map features', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      features: UpdateWith.NestedUpdate<FeaturesObject>({ color: 'blue', level: UpdateWith.Clear() })
    });

    expect(mappedCriteria.features?.value).toEqual({ color: 'blue_changed', level: UpdateWith.Clear() });
  });

  it('should map features with Set', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      features: UpdateWith.Set({ color: 'blue', level: 5 })
    });

    expect(mappedCriteria.features).toEqual(UpdateWith.Set({ color: 'blue_changed', level: 8 }));
  });

  it('should map featuresNullable with Clear()', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      featuresNullable: UpdateWith.ClearObject()
    });

    expect(mappedCriteria.features_nullable).toEqual(UpdateWith.ClearObject());
  });

  it('should map friends nested array update', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      friends: UpdateWith.NestedArrayUpdate<FriendObject>({ age: 10 })
    });

    expect(mappedCriteria.friends).toEqual(UpdateWith.NestedArrayUpdate<FriendObject>({ age: 11 }));
  });

  it('should map nested features update', () => {
    const mappedCriteria = complexMapper.mapUpdate({
      features: UpdateWith.NestedUpdate<FeaturesObject>({
        additional: UpdateWith.NestedUpdate<AdditionalObject>({
          serialNumber: 'newSN'
        })
      })
    });

    expect(mappedCriteria.features?.value.additional).toBeInstanceOf(NestedUpdate);

    const additionalCriteria = mappedCriteria.features?.value.additional as NestedUpdate<AdditionalObject>;
    expect(additionalCriteria.value.serialNumber).toEqual('newSN_new');
  });
});
