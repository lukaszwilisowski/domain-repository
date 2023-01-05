import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { ITestCar, ITestCarAttached } from '../../_models/car/car.interface';
import { runFindAllAndUpdateTests } from '../../_templates/find-all-and-update';

const findAllAndUpdateMockedTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const carRepository = new MockedDBRepository<ITestCar, ITestCarAttached>();

  const cleanUp = (): Promise<void> => Promise.resolve();

  return { carRepository, cleanUp };
};

runFindAllAndUpdateTests(findAllAndUpdateMockedTestSetup);
