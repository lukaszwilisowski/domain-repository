import { MongoDbRepository } from 'db/mongoose/mongo.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import mongoose from 'mongoose';
import { testCars } from '../../../_data/car/car.data';
import { ITestCar, ITestCarAttached } from '../../../_models/car/car.interface';
import { runCountAllByCriteriaTests } from '../../../_templates/count-all-by-criteria';
import { runFindAllByArrayCriteriaTests } from '../../../_templates/find-all-by-array-criteria';
import { runFindAllByNestedObjectCriteriaTests } from '../../../_templates/find-all-by-nested-object-criteria';
import { runFindAllBySimpleCriteriaTests } from '../../../_templates/find-all-by-simple-criteria';
import { runFindOneByCriteriaTests } from '../../../_templates/find-one-by-criteria';
import { carMapping, getCarCollection, TestMongoCarEntity } from '../entities/car/car.entity';

const findMongoTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  mongoose.set('strictQuery', false);

  await new Promise<void>((resolve) => {
    mongoose.connect('mongodb://localhost:27017/unittestdb', {});
    mongoose.connection.on('open', () => resolve());
  });

  const carRepository = new MongoDbRepository<ITestCar, ITestCarAttached, TestMongoCarEntity>(
    getCarCollection('cars2'),
    carMapping
  );

  //initialize data for all tests
  await carRepository.createMany(testCars);

  const cleanUp = (): Promise<void> => mongoose.connection.close();

  return { carRepository, cleanUp };
};

runCountAllByCriteriaTests(findMongoTestSetup);
runFindOneByCriteriaTests(findMongoTestSetup);
runFindAllBySimpleCriteriaTests(findMongoTestSetup);
runFindAllByNestedObjectCriteriaTests(findMongoTestSetup);
runFindAllByArrayCriteriaTests(findMongoTestSetup);
