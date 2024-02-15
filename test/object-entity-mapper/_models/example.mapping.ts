import { Mapping, MapTo } from 'strict-type-mapper';
import { AdditionalObject, AnimalObject, FeaturesObject, FriendObject, MappedAnimalObject } from './animal.models';

export const additionalMapping: Mapping<AdditionalObject, AdditionalObject> = {
  serialNumber: MapTo.Property(
    'serialNumber',
    (sourceSN: string) => sourceSN + '_new',
    (targetSN: string) => targetSN.replace('_new', '')
  ),
  index: 'index'
};

export const friendMapping: Mapping<FriendObject, FriendObject> = {
  age: MapTo.Property(
    'age',
    (sourceAge: number) => sourceAge + 1,
    (targetAge: number) => targetAge - 1
  ),
  name: 'name',
  level: 'level'
};

export const featuresMapping: Mapping<FeaturesObject, FeaturesObject> = {
  color: MapTo.Property(
    'color',
    (sourceColor: string) => sourceColor + '_changed',
    (targetColor: string) => targetColor.replace('_changed', '')
  ),
  level: MapTo.Property(
    'level',
    (sourceLevel: number) => sourceLevel + 3,
    (targetLevel: number) => targetLevel - 3
  ),
  additional: MapTo.NestedObject('additional', additionalMapping)
};

export const complexMapping: Mapping<AnimalObject, MappedAnimalObject> = {
  name: 'name2',
  name2: 'name3',
  name3: 'name',
  nameNullable: MapTo.Property(
    'nameNullable',
    (sourceName: string) => sourceName.toUpperCase(),
    (targetName: string) => targetName.toLowerCase()
  ),
  age: MapTo.Property(
    'age',
    (sourceAge: number) => sourceAge + 1,
    (targetAge: number) => targetAge - 1
  ),
  ageNullable: MapTo.Property(
    'age_nullable',
    (sourceAge: number | null): number | null => sourceAge || 0,
    (targetAge: number | null): number | null => targetAge || 0
  ),
  friendIDsNullable: MapTo.Array(
    'friendIDsNullable',
    (sourceFriendId: number) => -sourceFriendId,
    (targetFriendId: number) => -targetFriendId
  ),
  friends: MapTo.ObjectArray('friends', friendMapping),
  friendsNullable: MapTo.ObjectArray('friends_nullable', friendMapping),
  friendIDs: 'friendIDs',
  features: MapTo.NestedObject('features', featuresMapping),
  featuresNullable: MapTo.NestedObject('features_nullable', featuresMapping)
};
