import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { testCars } from '../_data/car/car.data';
import {
  ITestAdvanced,
  ITestCar,
  ITestCarAttached,
  ITestFeatures,
  ITestPart,
  TestColor
} from '../_models/car/car.interface';

export const runFindAllAndUpdateTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findAllAndUpdate', () => {
    let carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    let cleanUp: () => Promise<void>;

    beforeAll(async () => {
      //initialize repository
      const repositoryResult = await repositoryHandler();

      carRepository = repositoryResult.carRepository;
      cleanUp = repositoryResult.cleanUp;
    });

    beforeEach(async () => {
      await carRepository.createMany(testCars);
    });

    afterEach(async () => {
      await carRepository.findAllAndDelete({});
    });

    afterAll(async () => {
      await cleanUp();
    });

    it('should update property', async () => {
      const result = await carRepository.findAllAndUpdate({ model: 'Toyota Avensis' }, { leftGas: 100 });
      const foundCars = await carRepository.findAll({ model: 'Toyota Avensis' });

      expect(result.numberOfUpdatedObjects).toBe(1);
      expect(foundCars[0].leftGas).toBe(100);
    });

    it('should update all properties with Increment', async () => {
      const result = await carRepository.findAllAndUpdate({}, { leftGas: UpdateWith.Increment(10) });
      const allCars = await carRepository.findAll();

      expect(result.numberOfUpdatedObjects).toBe(4);
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.leftGas).toBe(65);
      expect(allCars.find((car) => car.model === 'Peugeot 508')?.leftGas).toBe(10);
      expect(allCars.find((car) => car.model === 'Mazda CX5')?.leftGas).toBe(30);
      expect(allCars.find((car) => car.model === 'Mazda RX8')?.leftGas).toBe(50);
    });

    it('should not update numeric property with Increment, if it does not exist', async () => {
      const result = await carRepository.findAllAndUpdate(
        { leftGas: SearchBy.DoesNotExist() },
        { leftGas: UpdateWith.Increment(10) }
      );

      const allCars = await carRepository.findAll();

      expect(result?.numberOfUpdatedObjects).toBe(1);
      expect(allCars.find((car) => car.model === 'Peugeot 508')?.leftGas).toBe(10);
    });

    it('should update property for two entities', async () => {
      const result = await carRepository.findAllAndUpdate({ horsePower: 180 }, { leftGas: 100 });
      const foundCars = await carRepository.findAll({ horsePower: 180 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars[0].leftGas).toBe(100);
      expect(foundCars[1].leftGas).toBe(100);
    });

    it('should update by multiple criteria', async () => {
      const result = await carRepository.findAllAndUpdate(
        {
          horsePower: 180,
          mileage: 200
        },
        { leftGas: 8000 }
      );

      const foundCars = await carRepository.findAll({ horsePower: 180 });
      const updatedCar = foundCars.find((el) => el.mileage === 200);
      const notUpdatedCar = foundCars.find((el) => el.mileage !== 200);

      expect(foundCars.length).toBe(2);
      expect(result.numberOfUpdatedObjects).toBe(1);
      expect(updatedCar?.leftGas).toBe(8000);
      expect(notUpdatedCar?.leftGas).toBe(40);
    });

    it('should update only one by IsOneOfTheValues', async () => {
      await carRepository.findOneAndUpdate(
        {
          model: SearchBy.IsOneOfTheValues(['Mazda CX5', 'Toyota Avensis', 'Peugeot 508']),
          mileage: SearchBy.IsGreaterThanOrEqual(1)
        },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({
        model: SearchBy.IsOneOfTheValues(['Mazda CX5', 'Toyota Avensis', 'Peugeot 508']),
        mileage: SearchBy.IsGreaterThanOrEqual(1)
      });

      const updatedOnes = foundCars.filter((el) => el.leftGas === 100);

      expect(foundCars.length).toBe(2);
      expect(updatedOnes.length).toBe(1);
    });

    it('should update all by IsNoneOfTheValues', async () => {
      const result = await carRepository.findAllAndUpdate(
        { model: SearchBy.IsNoneOfTheValues(['Toyota Avensis', 'Peugeot 508']) },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({ leftGas: 100 });
      const updatedOnes = foundCars.filter((el) => el.leftGas === 100);

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.length).toBe(2);
      expect(updatedOnes.length).toBe(2);
    });

    it('should update all by HasElement', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.HasElement('2') },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({ leftGas: 100 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.length).toBe(2);
    });

    it('should update all by DoesNotHaveElement', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.DoesNotHaveElement('2') },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({ leftGas: 100 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.find((car) => car.model === 'Toyota Avensis')?.leftGas).toBe(100);
      expect(foundCars.find((car) => car.model === 'Mazda CX5')?.leftGas).toBe(100);
    });

    it('should update all by HasAnyOfTheElements', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.HasAnyOfTheElements(['1', '3']) },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({ leftGas: 100 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.find((car) => car.model === 'Peugeot 508')?.leftGas).toBe(100);
      expect(foundCars.find((car) => car.model === 'Mazda RX8')?.leftGas).toBe(100);
    });

    it('should update all by HasNoneOfTheElements', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.HasNoneOfTheElements(['1', '3']) },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({ leftGas: 100 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.find((car) => car.model === 'Toyota Avensis')?.leftGas).toBe(100);
      expect(foundCars.find((car) => car.model === 'Mazda CX5')?.leftGas).toBe(100);
    });

    it('should update all by HasAllElements', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.HasAllElements(['1', '2']) },
        { leftGas: 100 }
      );

      const foundCars = await carRepository.findAll({ leftGas: 100 });

      expect(result.numberOfUpdatedObjects).toBe(1);
      expect(foundCars.find((car) => car.model === 'Peugeot 508')?.leftGas).toBe(100);
    });

    it('should update with Clear', async () => {
      const result = await carRepository.findAllAndUpdate({ horsePower: 180 }, { leftGas: UpdateWith.Clear() });
      const foundCars = await carRepository.findAll({ horsePower: 180 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(!foundCars[0].leftGas).toBe(true);
      expect(!foundCars[1].leftGas).toBe(true);
    });

    it('should update with ClearArray', async () => {
      const result = await carRepository.findAllAndUpdate(
        { horsePower: 180 },
        { producedIn: UpdateWith.ClearArray() }
      );
      const foundCars = await carRepository.findAll({ horsePower: 180 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars[0].producedIn).toEqual([]);
      expect(foundCars[1].producedIn).toEqual([]);
    });

    it('should update with ClearObject', async () => {
      const result = await carRepository.findAllAndUpdate(
        { horsePower: 180 },
        { features: UpdateWith.ClearObject() }
      );
      const foundCars = await carRepository.findAll({ horsePower: 180 });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(!foundCars[0].features).toBe(true);
      expect(!foundCars[1].features).toBe(true);
    });

    it('should update with ClearObjectArray', async () => {
      const result = await carRepository.findAllAndUpdate(
        { horsePower: 140 },
        { parts: UpdateWith.ClearObjectArray() }
      );

      const foundCars = await carRepository.findAll({ horsePower: 140 });

      expect(result.numberOfUpdatedObjects).toBe(1);
      expect(foundCars[0].parts).toEqual([]);
    });

    it('should update with Push', async () => {
      const result = await carRepository.findAllAndUpdate(
        {
          producedIn: SearchBy.HasAnyOfTheElements(['2']),
          leftGas: SearchBy.IsLesserThanOrEqual(40)
        },
        { producedIn: UpdateWith.Push('select%"') }
      );

      const foundCars = await carRepository.findAll({ producedIn: SearchBy.HasElement('select%"') });

      expect(result.numberOfUpdatedObjects).toBe(1);
      expect(foundCars.length).toBe(1);
      expect(foundCars[0].producedIn).toEqual(['2', '3', 'select%"']);
    });

    it('should update with PushEach', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.HasElement('2') },
        { producedIn: UpdateWith.PushEach(['4', '5']) }
      );

      const foundCars = await carRepository.findAll({ producedIn: SearchBy.HasElement('4') });

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.length).toBe(2);
      expect(foundCars.find((car) => car.model === 'Peugeot 508')?.producedIn).toEqual(['1', '2', '4', '5']);
      expect(foundCars.find((car) => car.model === 'Mazda RX8')?.producedIn).toEqual(['2', '3', '4', '5']);
    });

    it('should update with Pull', async () => {
      const result = await carRepository.findAllAndUpdate(
        { producedIn: SearchBy.HasElement('2') },
        { producedIn: UpdateWith.Pull('2') }
      );

      const foundCars = await carRepository.findAll();

      expect(result.numberOfUpdatedObjects).toBe(2);
      expect(foundCars.find((car) => car.model === 'Peugeot 508')?.producedIn).toEqual(['1']);
      expect(foundCars.find((car) => car.model === 'Mazda RX8')?.producedIn).toEqual(['3']);
    });

    it('should update with PullEach', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        { leftGas: SearchBy.IsLesserThanOrEqual(50) },
        { producedIn: UpdateWith.PullEach(['2', '3']) }
      );

      expect(numberOfUpdatedObjects).toBe(1);

      const allCars = await carRepository.findAll();
      expect(allCars.find((car) => car.model === 'Mazda RX8')?.producedIn).toEqual([]);
    });

    it('should perform complex update', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        { model: SearchBy.Contains('ta') },
        {
          //model: 'updated_name', cannot update
          producedIn: UpdateWith.PushEach(['11', '12']),
          parts: UpdateWith.Set([{ name: 'wheel"% select', year: 2020 }]),
          leftGas: UpdateWith.Clear(),
          mileage: UpdateWith.Set(100),
          features: UpdateWith.NestedUpdate<ITestFeatures>({
            ranking: UpdateWith.Increment(1),
            numbers: UpdateWith.ClearArray(),
            color: TestColor.White,
            advanced: UpdateWith.NestedUpdate<ITestAdvanced>({
              serialNumber: 'new_sn'
            })
          })
        }
      );

      expect(numberOfUpdatedObjects).toBe(1);

      const allCars = await carRepository.findAll({ model: SearchBy.Contains('ta') });

      expect(allCars[0].producedIn).toEqual(['11', '12']);
      expect(allCars[0].parts!.length).toBe(1);
      expect(allCars[0].parts![0].id).toBeDefined();
      expect(allCars[0].parts![0].name).toEqual('wheel"% select');
      expect(allCars[0].parts![0].year).toEqual(2020);
      expect(!allCars[0].leftGas).toBe(true);
      expect(allCars[0].mileage).toBe(100);
      expect(allCars[0].features?.ranking).toBe(11);
      expect(allCars[0].features?.numbers).toEqual([]);
      expect(allCars[0].features?.color).toEqual(TestColor.White);
      expect(allCars[0].features?.advanced?.serialNumber).toEqual('new_sn');
    });

    it('should update nested object', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        { features: SearchBy.NestedCriteria<ITestFeatures>({ ranking: SearchBy.IsGreaterThanOrEqual(20) }) },
        { features: UpdateWith.Set({ ranking: 100, color: TestColor.Black, numbers: [1, 2, 3] }) }
      );

      expect(numberOfUpdatedObjects).toBe(1);

      const allCars = await carRepository.findAll();
      expect(allCars.find((car) => car.model === 'Mazda CX5')?.features?.ranking).toEqual(100);
      expect(allCars.find((car) => car.model === 'Mazda CX5')?.features?.color).toEqual(TestColor.Black);
      expect(allCars.find((car) => car.model === 'Mazda CX5')?.features?.numbers).toEqual([1, 2, 3]);
    });

    it('should update nested object array', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        { model: 'Toyota Avensis' },
        { parts: UpdateWith.NestedArrayUpdate<ITestPart>({ name: 'new_part', year: UpdateWith.Increment(1) }) }
      );

      expect(numberOfUpdatedObjects).toBe(1);

      const allCars = await carRepository.findAll();
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.parts![0].name).toEqual('new_part');
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.parts![0].year).toEqual(2001);
    });

    it('should update nested object with additional options', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        { features: SearchBy.NestedCriteria<ITestFeatures>({ ranking: SearchBy.IsGreaterThanOrEqual(10) }) },
        {
          features: UpdateWith.NestedUpdate<ITestFeatures>({
            ranking: UpdateWith.Increment(1),
            numbers: UpdateWith.ClearArray()
          })
        }
      );

      expect(numberOfUpdatedObjects).toBe(2);

      const allCars = await carRepository.findAll();
      expect(allCars.find((car) => car.model === 'Mazda CX5')?.features?.ranking).toBe(21);
      expect(allCars.find((car) => car.model === 'Mazda CX5')?.features?.numbers).toEqual([]);
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.features?.ranking).toBe(11);
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.features?.numbers).toEqual([]);
    });

    it('should update multi-nested object', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        { model: 'Toyota Avensis' },
        {
          features: UpdateWith.NestedUpdate<ITestFeatures>({
            advanced: UpdateWith.NestedUpdate<ITestAdvanced>({
              serialNumber: 's-100'
            })
          })
        }
      );

      expect(numberOfUpdatedObjects).toBe(1);

      const allCars = await carRepository.findAll();
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.features?.advanced?.serialNumber).toEqual(
        's-100'
      );
    });

    it('should update multi-nested Increment', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        {},
        {
          features: UpdateWith.NestedUpdate<ITestFeatures>({
            ranking: UpdateWith.Increment(10),
            advanced: UpdateWith.NestedUpdate<ITestAdvanced>({
              index: UpdateWith.Increment(10),
              serialNumber: 'sn_required'
            })
          })
        }
      );

      expect(numberOfUpdatedObjects).toBe(4);

      const allCars = await carRepository.findAll();
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.features?.ranking).toBe(20);
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.features?.advanced?.index).toBe(10);
      expect(allCars.find((car) => car.model === 'Toyota Avensis')?.features?.advanced?.serialNumber).toEqual(
        'sn_required'
      );
      expect(allCars.find((car) => car.model === 'Peugeot 508')?.features?.advanced?.index).toBe(10);
      expect(allCars.find((car) => car.model === 'Peugeot 508')?.features?.advanced?.serialNumber).toEqual(
        'sn_required'
      );
    });

    it('should update multi-nested Increment with Exist check', async () => {
      const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
        {
          features: SearchBy.NestedCriteria<ITestFeatures>({
            advanced: SearchBy.NestedCriteria<ITestAdvanced>({
              index: SearchBy.Exists()
            })
          })
        },
        {
          features: UpdateWith.NestedUpdate<ITestFeatures>({
            advanced: UpdateWith.NestedUpdate<ITestAdvanced>({
              index: UpdateWith.Increment(10)
            })
          })
        }
      );

      expect(numberOfUpdatedObjects).toBe(1);

      const allCars = await carRepository.findAll();
      expect(allCars.find((c) => c.model === 'Mazda RX8')?.features?.advanced?.index).toBe(15);
    });
  });
