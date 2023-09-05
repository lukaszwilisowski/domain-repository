import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { ITestCar, ITestCarAttached } from '../_models/car/car.interface';

export const runFindOneByCriteriaTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findOne', () => {
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

    it('should find single element by id', async () => {
      const peugeot = await carRepository.findOne({ model: 'Peugeot 508' });
      const result = await carRepository.findOne({ id: peugeot?.id });

      expect(result?.model).toEqual('Peugeot 508');
    });

    it('should find single element by one of the IDs', async () => {
      const peugeot = await carRepository.findOne({ model: 'Peugeot 508' });
      const peugeot2 = await carRepository.findOne({ id: SearchBy.IsOneOfTheValues([peugeot!.id]) });

      expect(peugeot).toEqual(peugeot2);
    });

    it('should not find anything', async () => {
      const result = await carRepository.findOne({ engineModel: '12345678' });

      expect(result).toBeUndefined();
    });

    it('should find single element without failing', async () => {
      const result = await carRepository.findOneOrFail({ engineModel: '1.4' });

      expect(result.model).toEqual('Peugeot 508');
    });

    it('should find single element by two properties', async () => {
      const result = await carRepository.findOneOrFail({ fullTankCapacity: 55, leftGas: 55 });

      expect(result.model).toEqual('Toyota Avensis');
    });

    it('should fail if two elements were found', async () => {
      expect(async () => await carRepository.findOneOrFail({ engineModel: '2.0' })).rejects.toThrow(
        `Found ${2} entities of type`
      );
    });

    it('should fail if no element was found', async () => {
      try {
        await carRepository.findOneOrFail({ fullTankCapacity: 1234 });
      } catch (er) {
        expect((er as Error).message).toBe(
          `Found 0 entities of type: cars2 by the following criteria: {\"fullTankCapacity\":1234}`
        );
      }
    });

    it('should find single element with nested properties', async () => {
      const result = await carRepository.findOne({ model: 'Mazda RX8' });

      expect(result?.features).toBeDefined();
      expect(result?.features?.advanced).toBeDefined();
      expect(result?.features?.advanced?.serialNumber).toEqual('s-02');
    });
  });
