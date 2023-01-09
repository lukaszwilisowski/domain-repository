import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { ITestCar, ITestCarAttached, ITestPart } from '../_models/car/car.interface';

export const runFindAllByArrayCriteriaTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findAll by array criteria', () => {
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

    it('should find array by condiction', async () => {
      const result = await carRepository.findAll({ producedIn: ['3', '4'] });
      expect(result.length).toEqual(0);
    });

    it('should find array by Equals condiction', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.Equals(['1', '2'])
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Peugeot 508');
    });

    it('should find array by DoesNotEqual condiction', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.DoesNotEqual(['1', '2'])
      });

      expect(result.length).toEqual(3);
    });

    it('should throw when using Equals [] condiction', async () => {
      expect(async () => await carRepository.findAll({ producedIn: SearchBy.Equals([]) })).rejects.toThrow(
        'Equals([]) is not unsupported! To check if array does not exist, use DoesNotExist().'
      );
    });

    it('should throw when using DoesNotEqual [] condiction', async () => {
      expect(async () => await carRepository.findAll({ producedIn: SearchBy.DoesNotEqual([]) })).rejects.toThrow(
        'DoesNotEqual([]) is not unsupported! To check if array exists, use Exists().'
      );
    });

    it('should find array by ArrayExists', async () => {
      const result = await carRepository.findAll({ producedIn: SearchBy.ArrayExists() });

      expect(result.length).toEqual(2);
    });

    it('should find array by ArrayDoesNotExist', async () => {
      const result = await carRepository.findAll({ producedIn: SearchBy.ArrayDoesNotExist() });
      expect(result.length).toEqual(2);
    });

    it('should find array by HasElement', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.HasElement('3')
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Mazda RX8');
    });

    it('should find array by DoesNotHaveElement', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.DoesNotHaveElement('3')
      });

      expect(result.length).toEqual(3);
    });

    it('should find array by DoesNotHaveElement, empty array', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.DoesNotHaveElement('2')
      });

      expect(result.length).toEqual(2);
    });

    it('should find array by HasAnyOfTheElements', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.HasAnyOfTheElements(['1', '2'])
      });

      expect(result.length).toEqual(2);
    });

    it('should find array by HasNoneOfTheElements condiction', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.HasNoneOfTheElements(['2', '3'])
      });

      expect(result.length).toEqual(2);
    });

    it('should find array by HasAllElements condiction', async () => {
      const result = await carRepository.findAll({
        producedIn: SearchBy.HasAllElements(['2', '3'])
      });

      expect(result.length).toEqual(1);
    });

    it('should find nested array by ObjectArrayExists', async () => {
      const result = await carRepository.findAll({
        parts: SearchBy.ObjectArrayExists()
      });

      expect(result.length).toEqual(1);
    });

    it('should find nested array by ObjectArrayDoesNotExist', async () => {
      const result = await carRepository.findAll({
        parts: SearchBy.ObjectArrayDoesNotExist()
      });

      expect(result.length).toEqual(3);
    });

    it('should find nested array by HasElementThatMatches', async () => {
      const result = await carRepository.findAll({
        parts: SearchBy.HasElementThatMatches<ITestPart>({
          name: 'window'
        })
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Toyota Avensis');
    });

    it('should find nested array by HasElementThatMatches (multi condition)', async () => {
      const result = await carRepository.findAll({
        parts: SearchBy.HasElementThatMatches<ITestPart>({
          name: SearchBy.StartsWith('w'),
          year: SearchBy.IsGreaterThan(1999)
        })
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Toyota Avensis');
    });
  });
