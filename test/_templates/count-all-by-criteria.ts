import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';

import { ITestCar, ITestCarAttached } from '../_models/car/car.interface';

export const runCountAllByCriteriaTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('countAll', () => {
    let carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    let cleanUp: () => Promise<void>;

    beforeAll(async () => {
      //initialize repository
      const repositoryResult = await repositoryHandler();

      carRepository = repositoryResult.carRepository;
      cleanUp = repositoryResult.cleanUp;
    });

    afterAll(async () => {
      await carRepository.findAllAndDelete({});
      await cleanUp();
    });

    it('should count objects by condition', async () => {
      const result = await carRepository.countAll({ leftGas: 55 });

      expect(result).toEqual(1);
    });

    it('should count objects by Equals condition', async () => {
      const result = await carRepository.countAll({ leftGas: SearchBy.Equals(55) });

      expect(result).toEqual(1);
    });

    it('should count objects by IsGreaterThan condition', async () => {
      const result = await carRepository.countAll({ leftGas: SearchBy.IsGreaterThan(20) });

      expect(result).toEqual(2);
    });

    it('should count objects by IsGreaterThanOrEqual condition', async () => {
      const result = await carRepository.countAll({ leftGas: SearchBy.IsGreaterThanOrEqual(20) });

      expect(result).toEqual(3);
    });

    it('should count objects by IsLesserThan condition', async () => {
      const result = await carRepository.countAll({ leftGas: SearchBy.IsLesserThan(20) });

      expect(result).toEqual(0);
    });

    it('should count objects by IsLesserThanOrEqual condition', async () => {
      const result = await carRepository.countAll({ leftGas: SearchBy.IsLesserThanOrEqual(20) });

      expect(result).toEqual(1);
    });
  });
