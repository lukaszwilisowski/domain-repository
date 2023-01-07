import mongoose, { Schema } from 'mongoose';
import { MapTo } from 'object-entity-mapper/interfaces/map.to.interface';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';

import { mapToMongoObjectId } from 'db/mongodb/mongo.id.mapping';
import {
  ITestCharacter,
  ITestCharacterAttached,
  ITestStats,
  ITestStatsAttached
} from '../../../../_models/character/character.interface';
import { BaseMongoEntity } from '../../base.mongo.entity';

const StatsSchema = new Schema<ITestStats>({
  grade: {
    type: String,
    required: true
  },
  damage: {
    type: Number,
    required: false
  },
  armor: {
    type: Number,
    required: false
  }
});

const CharacterSchema = new Schema<ITestCharacter>({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: false
  },
  scorePoints: {
    type: [Number],
    required: true
  },
  equipment: {
    type: [String],
    required: false
  },
  charLevel: {
    type: Number,
    required: false
  },
  motto: {
    type: String,
    required: true
  },
  stats: {
    type: [StatsSchema],
    required: false
  },
  born: {
    type: Date,
    required: false
  }
});

export type TestMongoStatsEntity = ITestStats & BaseMongoEntity;
export type TestMongoCharacterEntity = ITestCharacter &
  BaseMongoEntity & {
    stats?: TestMongoStatsEntity[];
  };

export const getCharacterCollection = (collectionName: string) =>
  mongoose.model<TestMongoCharacterEntity>(collectionName, CharacterSchema);

const statsMapping: Mapping<ITestStatsAttached, TestMongoStatsEntity> = {
  id: mapToMongoObjectId,
  grade: 'grade',
  damage: 'damage',
  armor: 'armor'
};

export const characterMapping: Mapping<ITestCharacterAttached, TestMongoCharacterEntity> = {
  id: mapToMongoObjectId,
  name: 'name',
  surname: 'surname',
  scorePoints: 'scorePoints',
  equipment: 'equipment',
  charLevel: 'charLevel',
  motto: 'motto',
  stats: MapTo.ObjectArray('stats', statsMapping),
  born: 'born'
};
