import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { ITestAdvanced, ITestCar, ITestCarAttached, ITestFeatures, TestColor } from '../_models/car/car.interface';

export const runFindAllByNestedObjectCriteriaTests = (
  repositoryHandler: () => Promise<{
    carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findAll by nested object criteria', () => {
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

    it('should find nested object by condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          color: TestColor.Black
        })
      });

      expect(result.length).toEqual(1);
    });

    it('should find nested object by IsGreaterThanOrEqual condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          ranking: SearchBy.IsGreaterThanOrEqual(10),
          color: TestColor.Black
        })
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Toyota Avensis');
    });

    it('should find nested object by Exists condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.ObjectExists()
      });

      expect(result.length).toEqual(3);
    });

    it('should find nested object by DoesNotExist condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.ObjectDoesNotExist()
      });

      expect(result.length).toEqual(1);
    });

    it('should throw when using DoesNotEqual [] condiction', async () => {
      expect(
        async () =>
          await carRepository.findAll({
            features: SearchBy.NestedCriteria<ITestFeatures>({
              numbers: SearchBy.DoesNotEqual([])
            })
          })
      ).rejects.toThrow('DoesNotEqual([]) is not unsupported! To check if array exists, use Exists().');
    });

    it('should throw when using Equals [] condiction', async () => {
      expect(
        async () =>
          await carRepository.findAll({
            features: SearchBy.NestedCriteria<ITestFeatures>({
              numbers: SearchBy.Equals([])
            })
          })
      ).rejects.toThrow('Equals([]) is not unsupported! To check if array does not exist, use DoesNotExist().');
    });

    it('should find nested object by nested Exists condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.ArrayExists()
        })
      });

      expect(result.length).toEqual(2);
    });

    it('should find nested object by nested IsGreaterThanOrEqual condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          ranking: SearchBy.IsGreaterThanOrEqual(20)
        })
      });

      expect(result.length).toEqual(1);
    });

    it('should find nested object by nested DoesNotExist condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.ArrayDoesNotExist()
        })
      });

      expect(result.length).toEqual(1);
    });

    it('should find nested object by nested HasElement condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.HasElement(5)
        })
      });

      expect(result.length).toEqual(2);
    });

    it('should find nested object by nested DoesNotHaveElement condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.DoesNotHaveElement(3)
        })
      });

      expect(result.length).toEqual(2);
      expect(result[0].model).toEqual('Toyota Avensis');
      expect(result[1].model).toEqual('Mazda RX8');
    });

    it('should find nested object by nested HasAnyOfTheElements condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.HasAnyOfTheElements([3, 4])
        })
      });

      expect(result.length).toEqual(1);
    });

    it('should find nested object by nested HasNoneOfTheElements condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.HasNoneOfTheElements([7, 8, 9])
        })
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Toyota Avensis');
    });

    it('should find nested object by nested HasAllElements condiction', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          numbers: SearchBy.HasAllElements([3, 5])
        })
      });

      expect(result.length).toEqual(1);
    });

    it('should find multi-nested object by Exist', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          advanced: SearchBy.NestedCriteria<ITestAdvanced>({
            index: SearchBy.Exists()
          })
        })
      });

      expect(result.length).toEqual(1);
    });

    it('should find multi-nested object by DoesNotExist', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          advanced: SearchBy.ObjectDoesNotExist()
        })
      });

      expect(result.length).toEqual(1);
      expect(result[0].model).toEqual('Mazda CX5');
    });

    it('should find multi-nested object by StartsWith', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          advanced: SearchBy.NestedCriteria<ITestAdvanced>({
            serialNumber: SearchBy.StartsWith('s')
          })
        })
      });

      expect(result.length).toEqual(2);
    });

    it('should find multi-nested object by Exist', async () => {
      const result = await carRepository.findAll({
        features: SearchBy.NestedCriteria<ITestFeatures>({
          advanced: SearchBy.NestedCriteria<ITestAdvanced>({
            index: SearchBy.Exists()
          })
        })
      });

      expect(result.length).toEqual(1);
    });
  });
