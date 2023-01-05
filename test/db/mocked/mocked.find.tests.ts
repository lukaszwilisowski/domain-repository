import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { testCars } from '../../_data/car/car.data';
import { ITestCar, ITestCarAttached } from '../../_models/car/car.interface';
import { runCountAllByCriteriaTests } from '../../_templates/count-all-by-criteria';
import { runFindAllByArrayCriteriaTests } from '../../_templates/find-all-by-array-criteria';
import { runFindAllByNestedObjectCriteriaTests } from '../../_templates/find-all-by-nested-object-criteria';
import { runFindAllBySimpleCriteriaTests } from '../../_templates/find-all-by-simple-criteria';
import { runFindOneByCriteriaTests } from '../../_templates/find-one-by-criteria';

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
