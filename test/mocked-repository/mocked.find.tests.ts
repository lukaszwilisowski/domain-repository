import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { runCountAllByCriteriaTests } from '../generic-repository/count-all-by-criteria';
import { runFindAllByArrayCriteriaTests } from '../generic-repository/find-all-by-array-criteria';
import { runFindAllByNestedObjectCriteriaTests } from '../generic-repository/find-all-by-nested-object-criteria';
import { runFindAllBySimpleCriteriaTests } from '../generic-repository/find-all-by-simple-criteria';
import { runFindOneByCriteriaTests } from '../generic-repository/find-one-by-criteria';
import { testCars } from '../_mocked_data/car/car.data';
import { ITestCar, ITestCarAttached } from '../_models/car/car.interface';

const findMockedTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const carRepository = new MockedDBRepository<ITestCar, ITestCarAttached>();

  //initialize data for all tests
  await carRepository.createMany(testCars);

  const cleanUp = (): Promise<void> => Promise.resolve();

  return { carRepository, cleanUp };
};

runCountAllByCriteriaTests(findMockedTestSetup);
runFindOneByCriteriaTests(findMockedTestSetup);
runFindAllBySimpleCriteriaTests(findMockedTestSetup);
runFindAllByArrayCriteriaTests(findMockedTestSetup);
runFindAllByNestedObjectCriteriaTests(findMockedTestSetup);
