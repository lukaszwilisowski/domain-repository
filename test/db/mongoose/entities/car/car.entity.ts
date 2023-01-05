import mongoose, { Schema } from 'mongoose';
import { MapTo } from 'object-entity-mapper/interfaces/map.to.interface';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import {
  ITestAdvanced,
  ITestAdvancedAttached,
  ITestCar,
  ITestCarAttached,
  ITestFeatures,
  ITestFeaturesAttached,
  ITestPart,
  ITestPartAttached,
  TestColor,
  TestFuelType
} from '../../../../_models/car/car.interface';
import { BaseMongoEntity } from '../../base.mongo.entity';
import { mongoMapTo_id } from '../../mongo.id.mapping';

const PartSchema = new Schema<ITestPart>({
  name: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: false
  }
});

const AdvancedSchema = new Schema<ITestAdvanced>({
  serialNumber: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: false
  }
});

const FeaturesSchema = new Schema<ITestFeatures>({
  ranking: {
    type: Number,
    required: true
  },
  color: {
    type: Number,
    enum: TestColor,
    required: false
  },
  numbers: {
    type: [Number],
    required: false
  },
  advanced: {
    type: AdvancedSchema,
    required: false
  }
});

const CarSchema = new Schema<ITestCar>({
  manufacturingLineId: {
    type: String,
    required: false
  },
  model: {
    type: String,
    required: true
  },
  engineModel: {
    type: String,
    required: true
  },
  engineType: {
    type: String,
    enum: TestFuelType,
    required: true
  },
  horsePower: {
    type: Number,
    required: false
  },
  fullTankCapacity: {
    type: Number,
    required: true
  },
  avgFuelConsumption: {
    type: Number,
    required: true
  },
  failed: {
    type: Boolean,
    required: false
  },
  parts: {
    type: [PartSchema],
    required: true
  },
  producedIn: {
    type: [String],
    required: false
  },
  leftGas: {
    type: Number,
    required: false
  },
  mileage: {
    type: Number,
    required: false
  },
  features: {
    type: FeaturesSchema,
    required: false
  }
});

export type TestMongoPartEntity = ITestPart & BaseMongoEntity;
export type TestAdvancedEntity = ITestAdvanced & BaseMongoEntity;
export type TestFeaturesEntity = ITestFeatures &
  BaseMongoEntity & {
    advanced?: TestAdvancedEntity;
  };

export type TestMongoCarEntity = ITestCar &
  BaseMongoEntity & {
    parts?: TestMongoPartEntity[];
    features?: TestFeaturesEntity;
  };

export const getCarCollection = (collectionName: string) =>
  mongoose.model<TestMongoCarEntity>(collectionName, CarSchema);

const partsMapping: Mapping<ITestPartAttached, TestMongoPartEntity> = {
  id: mongoMapTo_id,
  name: 'name',
  year: 'year'
};

const advancedMapping: Mapping<ITestAdvancedAttached, TestAdvancedEntity> = {
  id: mongoMapTo_id,
  serialNumber: 'serialNumber',
  index: 'index'
};

const featuresMapping: Mapping<ITestFeaturesAttached, TestFeaturesEntity> = {
  id: mongoMapTo_id,
  ranking: 'ranking',
  color: 'color',
  numbers: 'numbers',
  advanced: MapTo.NestedObject('advanced', advancedMapping)
};

export const carMapping: Mapping<ITestCarAttached, TestMongoCarEntity> = {
  id: mongoMapTo_id,
  manufacturingLineId: 'manufacturingLineId',
  model: 'model',
  engineModel: 'engineModel',
  engineType: 'engineType',
  horsePower: 'horsePower',
  avgFuelConsumption: 'avgFuelConsumption',
  fullTankCapacity: 'fullTankCapacity',
  failed: 'failed',
  producedIn: 'producedIn',
  leftGas: 'leftGas',
  mileage: 'mileage',
  parts: MapTo.ArrayOfObjects('parts', partsMapping),
  features: MapTo.NestedObject('features', featuresMapping)
};
