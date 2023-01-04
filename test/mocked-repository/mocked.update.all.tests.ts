import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { runFindAllAndUpdateTests } from '../generic-repository/find-all-and-update';
import { ITestCar, ITestCarAttached } from '../_models/car/car.interface';

const findAllAndUpdateMockedTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const carRepository = new MockedDBRepository<ITestCar, ITestCarAttached>();

  const cleanUp = (): Promise<void> => Promise.resolve();

  return { carRepository, cleanUp };
};

runFindAllAndUpdateTests(findAllAndUpdateMockedTestSetup);
