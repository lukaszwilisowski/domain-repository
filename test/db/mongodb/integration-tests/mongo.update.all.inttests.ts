import { MongoDbRepository } from 'db/mongodb/mongo.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import mongoose from 'mongoose';
import { ITestCar, ITestCarAttached } from '../../../_models/car/car.interface';
import { runFindAllAndUpdateTests } from '../../../_templates/find-all-and-update';
import { TestMongoCarEntity, carMapping, getCarCollection } from '../entities/car/car.entity';

const findAllAndUpdateMongoTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  mongoose.set('strictQuery', false);

  await new Promise<void>((resolve) => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://127.0.0.1:27017/unittestdb');
    mongoose.connection.on('open', () => resolve());
  });

  const carRepository = new MongoDbRepository<ITestCar, ITestCarAttached, TestMongoCarEntity>(
    getCarCollection('cars3'),
    carMapping
  );

  const cleanUp = (): Promise<void> => mongoose.connection.close();

  return { carRepository, cleanUp };
};

runFindAllAndUpdateTests(findAllAndUpdateMongoTestSetup);
