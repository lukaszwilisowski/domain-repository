import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { runCreateTests } from '../generic-repository/create';
import { ITestCar, ITestCarAttached } from '../_models/car/car.interface';

const createMockedTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const carRepository = new MockedDBRepository<ITestCar, ITestCarAttached>();

  const cleanUp = (): Promise<void> => Promise.resolve();

  return { carRepository, cleanUp };
};

runCreateTests(createMockedTestSetup);
