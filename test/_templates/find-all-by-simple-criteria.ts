import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { ITestCar, ITestCarAttached, TestFuelType } from '../_models/car/car.interface';

export const runFindAllBySimpleCriteriaTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findAll by simple criteria', () => {
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

    it('should find all objects', async () => {
      const result = await carRepository.findAll({});

      expect(result.length).toEqual(4);
      expect(result[0].model).toEqual('Toyota Avensis');
      expect(result[0].avgFuelConsumption).toEqual(8 / 100);
    });

    it('should find objects by single property', async () => {
      const foundCars1 = await carRepository.findAll({ model: 'Toyota Avensis' });
      expect(foundCars1.length).toBe(1);
      expect(foundCars1[0].model).toEqual('Toyota Avensis');

      const foundCars2 = await carRepository.findAll({ avgFuelConsumption: 8 / 100 });

      expect(foundCars2.length).toBe(1);
      expect(foundCars2[0].model).toEqual('Toyota Avensis');

      const foundCars3 = await carRepository.findAll({
        fullTankCapacity: 55
      });

      expect(foundCars3.length).toBe(1);
      expect(foundCars3[0].model).toEqual('Toyota Avensis');

      const foundCars4 = await carRepository.findAll({ mileage: 0 });
      expect(foundCars4.length).toBe(1);
      expect(foundCars4[0].model).toEqual('Toyota Avensis');

      const foundCars5 = await carRepository.findAll({ leftGas: 55 });
      expect(foundCars5.length).toBe(1);
      expect(foundCars5[0].model).toEqual('Toyota Avensis');
    });

    it('should find objects by computed property', async () => {
      const foundCars = await carRepository.findAll({ horsePower: 115 });

      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Peugeot 508');
    });

    it('should find objects by null property', async () => {
      const foundCars = await carRepository.findAll({ manufacturingLineId: null });
      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Toyota Avensis');
    });

    it('should NOT find objects by undefined property, but rather return all cars', async () => {
      const foundCars = await carRepository.findAll({ manufacturingLineId: undefined });
      expect(foundCars.length).toBe(4);
    });

    it('should find all objects by Exists', async () => {
      const result = await carRepository.findAll({ failed: SearchBy.Exists() });

      expect(result.length).toEqual(2);
      expect(result.find((m) => m.model === 'Peugeot 508')).toBeDefined();
      expect(result.find((m) => m.model === 'Mazda CX5')).toBeDefined();
    });

    it('should find all objects by DoesNotExist', async () => {
      const result2 = await carRepository.findAll({ failed: SearchBy.DoesNotExist() });

      expect(result2.length).toEqual(2);
      expect(result2.find((m) => m.model === 'Peugeot 508')).toBeUndefined();
      expect(result2.find((m) => m.model === 'Mazda CX5')).toBeUndefined();
    });

    it('should find objects by two properties', async () => {
      const foundCars1 = await carRepository.findAll({
        model: 'Toyota Avensis',
        mileage: 0
      });

      expect(foundCars1.length).toBe(1);
      expect(foundCars1[0].model).toEqual('Toyota Avensis');

      const foundCars2 = await carRepository.findAll({
        model: 'Toyota Avensis' + '_xyz',
        mileage: 0
      });

      expect(foundCars2.length).toBe(0);

      const foundCars3 = await carRepository.findAll({
        model: 'Toyota Avensis',
        manufacturingLineId: null
      });

      expect(foundCars3.length).toBe(1);
      expect(foundCars3[0].model).toEqual('Toyota Avensis');
    });

    it('should find objects by DoesNotEqual condition', async () => {
      const foundCars = await carRepository.findAll({ model: SearchBy.DoesNotEqual('Mazda CX5') });

      expect(foundCars.length).toBe(3);
      expect(foundCars.find((c) => c.model === 'Toyota Avensis')).toBeDefined();
      expect(foundCars.find((c) => c.model === 'Peugeot 508')).toBeDefined();

      const foundCars2 = await carRepository.findAll({ engineType: SearchBy.DoesNotEqual(TestFuelType.Diesel) });
      expect(foundCars2.length).toBe(3);
      expect(foundCars2.find((c) => c.model === 'Toyota Avensis')).toBeDefined();
    });

    it('should find objects by Contains and DoesNotContain condiction', async () => {
      const foundCars = await carRepository.findAll({ model: SearchBy.Contains('o') });
      expect(foundCars.length).toBe(2);
      expect(foundCars.find((c) => c.model === 'Toyota Avensis')).toBeDefined();
      expect(foundCars.find((c) => c.model === 'Peugeot 508')).toBeDefined();

      const foundCars2 = await carRepository.findAll({ model: SearchBy.DoesNotContain('o') });
      expect(foundCars2.length).toBe(2);
      expect(foundCars2.find((c) => c.model === 'Mazda CX5')).toBeDefined();
    });

    it('should find objects by StartsWith and DoesNotStartWith condiction', async () => {
      const foundCars = await carRepository.findAll({ model: SearchBy.StartsWith('Toy') });
      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Toyota Avensis');

      const foundCars2 = await carRepository.findAll({ model: SearchBy.DoesNotStartWith('Toy') });
      expect(foundCars2.length).toBe(3);
      expect(foundCars2.find((c) => c.model === 'Peugeot 508')).toBeDefined();
      expect(foundCars2.find((c) => c.model === 'Mazda CX5')).toBeDefined();
    });

    it('should find objects by EndsWith and DoesNotEndWith condiction', async () => {
      const foundCars = await carRepository.findAll({ model: SearchBy.EndsWith('508') });
      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Peugeot 508');

      const foundCars2 = await carRepository.findAll({ model: SearchBy.DoesNotEndWith('508') });
      expect(foundCars2.length).toBe(3);
      expect(foundCars2.find((c) => c.model === 'Toyota Avensis')).toBeDefined();
      expect(foundCars2.find((c) => c.model === 'Mazda CX5')).toBeDefined();
    });

    it('should find objects by IsGreaterThan and IsGreaterThanOrEqual condiction', async () => {
      const foundCars = await carRepository.findAll({ fullTankCapacity: SearchBy.IsGreaterThan(50) });
      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Toyota Avensis');

      const foundCars2 = await carRepository.findAll({ fullTankCapacity: SearchBy.IsGreaterThanOrEqual(50) });

      expect(foundCars2.length).toBe(2);
      expect(foundCars2.find((c) => c.model === 'Toyota Avensis')).toBeDefined();
      expect(foundCars2.find((c) => c.model === 'Peugeot 508')).toBeDefined();
    });

    it('should find objects by isLesserThan and IsLesserThanOrEqual condiction', async () => {
      const foundCars = await carRepository.findAll({ fullTankCapacity: SearchBy.IsLesserThan(50) });
      expect(foundCars.length).toBe(2);
      expect(foundCars.find((c) => c.model === 'Mazda CX5')).toBeDefined();

      const foundCars2 = await carRepository.findAll({ fullTankCapacity: SearchBy.IsLesserThanOrEqual(50) });
      expect(foundCars2.length).toBe(3);
      expect(foundCars2.find((c) => c.model === 'Peugeot 508')).toBeDefined();
      expect(foundCars2.find((c) => c.model === 'Mazda CX5')).toBeDefined();
    });

    it('should find objects by IsOneOfTheValues condiction', async () => {
      const foundCars = await carRepository.findAll({
        model: SearchBy.IsOneOfTheValues(['Mazda CX5', 'Peugeot 508'])
      });

      expect(foundCars.length).toBe(2);
      expect(foundCars.find((c) => c.model === 'Peugeot 508')).toBeDefined();
      expect(foundCars.find((c) => c.model === 'Mazda CX5')).toBeDefined();
    });

    it('should find objects by IsNoneOfTheValues condiction', async () => {
      const foundCars = await carRepository.findAll({
        model: SearchBy.IsNoneOfTheValues(['Mazda CX5', 'Peugeot 508'])
      });

      expect(foundCars.length).toBe(2);
      expect(foundCars[0].model).toEqual('Toyota Avensis');
    });

    it('should find objects by combined criteria', async () => {
      const foundCars = await carRepository.findAll({
        mileage: SearchBy.IsLesserThan(250),
        manufacturingLineId: null
      });

      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Toyota Avensis');

      const foundCars2 = await carRepository.findAll({
        mileage: SearchBy.Equals(100),
        engineModel: SearchBy.Equals('1.4')
      });
      expect(foundCars2.length).toBe(1);
      expect(foundCars2[0].model).toEqual('Peugeot 508');

      const foundCars3 = await carRepository.findAll({
        avgFuelConsumption: SearchBy.IsGreaterThanOrEqual(0),
        manufacturingLineId: SearchBy.DoesNotEqual(null)
      });

      expect(foundCars3.length).toBe(3);
      expect(foundCars3.find((c) => c.model === 'Peugeot 508')).toBeDefined();
      expect(foundCars3.find((c) => c.model === 'Mazda CX5')).toBeDefined();

      const foundCars4 = await carRepository.findAll({ model: SearchBy.StartsWith('not_existing') });
      expect(foundCars4.length).toBe(0);
    });

    it('should sort', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { model: 'asc' } });

      expect(foundCars.length).toBe(4);
      expect(foundCars[0].model).toEqual('Mazda CX5');
      expect(foundCars[1].model).toEqual('Mazda RX8');
      expect(foundCars[2].model).toEqual('Peugeot 508');
      expect(foundCars[3].model).toEqual('Toyota Avensis');
    });

    it('should sort and skip', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { model: 'asc' }, skip: 1 });

      expect(foundCars.length).toBe(3);
      expect(foundCars[0].model).toEqual('Mazda RX8');
      expect(foundCars[1].model).toEqual('Peugeot 508');
      expect(foundCars[2].model).toEqual('Toyota Avensis');
    });

    it('should sort and limit', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { model: 'asc' }, limit: 2 });

      expect(foundCars.length).toBe(2);
      expect(foundCars[0].model).toEqual('Mazda CX5');
      expect(foundCars[1].model).toEqual('Mazda RX8');
    });

    it('should sort, skip and limit', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { model: 'asc' }, skip: 1, limit: 2 });

      expect(foundCars.length).toBe(2);
      expect(foundCars[0].model).toEqual('Mazda RX8');
      expect(foundCars[1].model).toEqual('Peugeot 508');
    });

    it('should sort asc', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { leftGas: 'asc' } });

      expect(foundCars.length).toBe(4);
      expect(foundCars[0].model).toEqual('Peugeot 508');
      expect(foundCars[1].model).toEqual('Mazda CX5');
      expect(foundCars[2].model).toEqual('Mazda RX8');
      expect(foundCars[3].model).toEqual('Toyota Avensis');
    });

    it('should sort desc', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { leftGas: 'desc' } });

      expect(foundCars.length).toBe(4);
      expect(foundCars[0].model).toEqual('Toyota Avensis');
      expect(foundCars[1].model).toEqual('Mazda RX8');
      expect(foundCars[2].model).toEqual('Mazda CX5');
      expect(foundCars[3].model).toEqual('Peugeot 508');
    });

    it('should sort by multiple properties', async () => {
      const foundCars = await carRepository.findAll({}, { sortBy: { engineType: 'asc', leftGas: 'desc' } });

      expect(foundCars.length).toBe(4);
      expect(foundCars[0].model).toEqual('Peugeot 508');
      expect(foundCars[1].model).toEqual('Toyota Avensis');
      expect(foundCars[2].model).toEqual('Mazda RX8');
      expect(foundCars[3].model).toEqual('Mazda CX5');
    });

    it('should run complex skip, limit and sort', async () => {
      const foundCars = await carRepository.findAll(
        {
          parts: SearchBy.ObjectArrayDoesNotExist()
        },
        { sortBy: { engineType: 'asc', leftGas: 'desc' }, skip: 1, limit: 1 }
      );

      expect(foundCars.length).toBe(1);
      expect(foundCars[0].model).toEqual('Mazda RX8');
    });
  });
