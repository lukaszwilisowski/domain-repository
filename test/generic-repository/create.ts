import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { ITestCar, ITestCarAttached, TestFuelType } from '../_models/car/car.interface';

export const runCreateTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('create', () => {
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

    it('should create car', async () => {
      const testCar: ITestCar = {
        model: 'Toyota Avensis',
        engineModel: '1.6 Turbo',
        engineType: TestFuelType.Gasoline,
        horsePower: 140,
        avgFuelConsumption: 8 / 100,
        fullTankCapacity: 55,
        mileage: null,
        producedIn: ['aa', 'bb', 'cc'],
        manufacturingLineId: null,
        failed: true,
        features: {
          ranking: 5,
          numbers: [1, 2, 3],
          advanced: {
            serialNumber: 'test'
          }
        },
        parts: [
          { name: 'part1', year: 1999 },
          { name: 'part2', year: 2000 }
        ]
      };

      const result = await carRepository.create(testCar);

      expect(result.id).toBeDefined();
      expect(result.model).toEqual('Toyota Avensis');
      expect(result.engineModel).toEqual('1.6 Turbo');
      expect(result.engineType).toEqual(TestFuelType.Gasoline);
      expect(result.horsePower).toBe(140);
      expect(result.avgFuelConsumption).toBe(8 / 100);
      expect(result.fullTankCapacity).toBe(55);
      expect(result.mileage).toBeNull();
      expect(result.leftGas === null || result.leftGas === undefined).toBe(true);
      expect(result.producedIn).toEqual(['aa', 'bb', 'cc']);
      expect(result.manufacturingLineId).toBe(null);
      expect(result.failed).toBe(true);
      expect(result.features?.id).toBeDefined();
      expect(result.features?.ranking).toBe(5);
      expect(result.features?.numbers).toEqual([1, 2, 3]);
      expect(result.features?.color === null || result.leftGas === undefined).toBe(true);
      expect(result.features?.advanced?.id).toBeDefined();
      expect(result.features?.advanced?.serialNumber).toEqual('test');
      expect(result.parts![0].id).toBeDefined();
      expect(result.parts![0].name).toEqual('part1');
      expect(result.parts![0].year).toBe(1999);
      expect(result.parts![1].id).toBeDefined();
      expect(result.parts![1].name).toEqual('part2');
      expect(result.parts![1].year).toBe(2000);
    });
  });
