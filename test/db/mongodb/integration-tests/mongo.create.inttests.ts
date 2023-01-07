import { MongoDbRepository } from 'db/mongodb/mongo.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import mongoose from 'mongoose';
import { ITestCar, ITestCarAttached } from '../../../_models/car/car.interface';
import { runCreateTests } from '../../../_templates/create';
import { carMapping, getCarCollection, TestMongoCarEntity } from '../entities/car/car.entity';

const createMongoTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  mongoose.set('strictQuery', false);

  await new Promise<void>((resolve) => {
    mongoose.connect('mongodb://localhost:27017/unittestdb', {});
    mongoose.connection.on('open', () => resolve());
  });

  const carRepository = new MongoDbRepository<ITestCar, ITestCarAttached, TestMongoCarEntity>(
    getCarCollection('cars'),
    carMapping
  );

  const cleanUp = (): Promise<void> => mongoose.connection.close();

  return { carRepository, cleanUp };
};

runCreateTests(createMongoTestSetup);
