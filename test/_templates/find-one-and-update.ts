import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { testCharacters } from '../_data/character/character.data';
import { ITestCharacter, ITestCharacterAttached, ITestStats } from '../_models/character/character.interface';

export const runFindOneAndUpdateTests = (
  repositoryHandler: () => Promise<{
    characterRepository: IDomainRepository<ITestCharacter, ITestCharacterAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findOneAndUpdate', () => {
    let characterRepository: IDomainRepository<ITestCharacter, ITestCharacterAttached>;
    let cleanUp: () => Promise<void>;

    beforeAll(async () => {
      //initialize repository
      const repositoryResult = await repositoryHandler();

      characterRepository = repositoryResult.characterRepository;
      cleanUp = repositoryResult.cleanUp;
    });

    beforeEach(async () => {
      await characterRepository.createMany(testCharacters);
    });

    afterEach(async () => {
      await characterRepository.findAllAndDelete({});
    });

    afterAll(async () => {
      await cleanUp();
    });

    it('should update single property', async () => {
      const result = await characterRepository.findOneAndUpdate({ name: 'Lukas' }, { name: 'Mario' });

      expect(result?.name).toEqual('Mario');
    });

    it('should update numeric property with Increment option', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: 12 },
        { charLevel: UpdateWith.Increment(10) }
      );

      expect(result?.charLevel).toEqual(22);
    });

    it('should update Date', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { born: SearchBy.DoesNotExist() },
        { born: new Date() }
      );

      expect(result?.name).toEqual('Lukas');
      expect(result!.born!.getTime() - new Date().getTime()).toBeLessThan(5000);
    });

    it('should not update Date if not found', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { born: SearchBy.IsLesserThan(new Date(1990, 1, 1)) },
        { born: new Date() }
      );

      expect(result).toBeUndefined();
    });

    it('should update Date if found', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { born: SearchBy.IsLesserThanOrEqual(new Date(1990, 1, 1)) },
        { born: new Date() }
      );

      expect(result?.name).toEqual('Artur');
      expect(result!.born!.getTime() - new Date().getTime()).toBeLessThan(5000);
    });

    it('should update Date if found', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { born: SearchBy.IsLesserThanOrEqual(new Date(1990, 1, 1)) },
        { born: new Date() }
      );

      expect(result?.name).toEqual('Artur');
      expect(result!.born!.getTime() - new Date().getTime()).toBeLessThan(5000);
    });

    it('should update property with IsOneOfTheValues', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: SearchBy.IsOneOfTheValues([8, 10]) },
        { charLevel: 9 }
      );

      expect(result?.charLevel).toEqual(9);
    });

    it('should update property with IsNoneOfTheValues', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: SearchBy.IsNoneOfTheValues([12, 15]) },
        { charLevel: 10 }
      );

      expect(result?.charLevel).toEqual(10);
    });

    it('should update array property with Push', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { scorePoints: SearchBy.ArrayDoesNotExist() },
        { scorePoints: UpdateWith.Push(3) }
      );

      expect(result?.scorePoints).toEqual([3]);
    });

    it('should update array property with PushEach', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: 12 },
        { scorePoints: UpdateWith.PushEach([3, 4]) }
      );

      expect(result?.scorePoints).toEqual([2, 3, 4]);
    });

    it('should update array property with Pull', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: 12 },
        { scorePoints: UpdateWith.Pull(2) }
      );

      expect(result?.scorePoints).toEqual([]);
    });

    it('should update array property with PullEach', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: 8 },
        { scorePoints: UpdateWith.PullEach([1, 3]) }
      );

      expect(result?.scorePoints).toEqual([5]);
    });

    it('should update multiple properties with multiple update options', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: 8 },
        {
          surname: UpdateWith.Set('Flammel_aa'),
          scorePoints: UpdateWith.Push(7),
          charLevel: UpdateWith.Increment(2)
        }
      );

      expect(result?.surname).toEqual('Flammel_aa');
      expect(result?.scorePoints).toEqual([1, 3, 5, 7]);
      expect(result?.charLevel).toEqual(10);
    });

    it('should remove property', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { surname: 'Dawn' },
        {
          surname: UpdateWith.Clear()
        }
      );

      expect(result?.name).toEqual('Lukas');
      expect(result?.surname === undefined || result?.surname === null).toBe(true);
    });

    it('should update array', async () => {
      await characterRepository.findAllAndUpdate(
        { scorePoints: SearchBy.ArrayDoesNotExist() },
        { scorePoints: UpdateWith.Push(2) }
      );

      const allChars = await characterRepository.findAll();
      expect(allChars.find((char) => char.name === 'Lukas')?.scorePoints).toEqual([2]);
    });

    it('should update property with IsLesserThanOrEqual', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: SearchBy.IsLesserThanOrEqual(8) },
        { charLevel: 9 }
      );

      expect(result?.charLevel).toEqual(9);

      const allChars = await characterRepository.findAll();

      expect(allChars.find((char) => char.charLevel === 8)).toBeUndefined();
      expect(allChars.find((char) => char.name === 'Nicholas')?.charLevel).toEqual(9);
    });

    it('should update property when using IsLesserThan', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { charLevel: SearchBy.IsLesserThan(8) },
        { charLevel: 9 }
      );

      expect(result).toBe(undefined);
    });

    it('should Pull element from nested array', async () => {
      const element = await characterRepository.findOne({ name: 'Nicholas' });
      expect(element).toBeDefined();

      const result = await characterRepository.findOneAndUpdate(
        { name: 'Nicholas' },
        { stats: UpdateWith.Pull(element!.stats![0]) }
      );

      expect(result!.stats!.length).toBe(1);
      expect(result!.stats![0].grade).toEqual('Champion');
    });

    it('should update nested array elements', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { name: 'Nicholas' },
        { stats: UpdateWith.NestedArrayUpdate<ITestStats>({ damage: 100 }) }
      );

      expect(result!.stats!.length).toBe(2);
      expect(result!.stats![0].damage).toBe(100);
      expect(result!.stats![1].damage).toBe(100);
    });

    it('should set non-existing array to empty when updating', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { name: 'Lukas' },
        { stats: UpdateWith.NestedArrayUpdate<ITestStats>({ damage: 100 }) }
      );

      expect(result!.stats).toEqual([]);
    });

    it('should not update non-existing nested array, if we check if it exists first', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { name: 'Lukas', stats: SearchBy.ObjectArrayExists() },
        { stats: UpdateWith.NestedArrayUpdate<ITestStats>({ damage: 100 }) }
      );

      expect(result).toBeUndefined();
    });

    it('should update non-existing nested array by Push', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { name: 'Lukas' },
        { stats: UpdateWith.Push({ damage: 100, grade: 'TestGrade' }) }
      );

      expect(result!.stats?.length).toBe(1);
      expect(result!.stats![0].damage).toBe(100);
      expect(result!.stats![0].grade).toEqual('TestGrade');
    });

    it('should update non-existing nested array by PushEach', async () => {
      const result = await characterRepository.findOneAndUpdate(
        { name: 'Lukas' },
        { stats: UpdateWith.PushEach([{ damage: 100, grade: 'TestGrade' }]) }
      );

      expect(result!.stats?.length).toBe(1);
      expect(result!.stats![0].damage).toBe(100);
      expect(result!.stats![0].grade).toEqual('TestGrade');
    });
  });
