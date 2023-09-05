import { describe, it, jest } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { Friend, NumericFoodType, StringAnimalType } from '../../_models/non-nullable.model';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable object array criteria', () => {
  it('should be searchable by HasElementThatMatches and Exists', () => {
    repository.findOne({
      friends: SearchBy.HasElementThatMatches<Friend>({
        age: 5,
        foodType: NumericFoodType.Meat,
        friendIDs: SearchBy.HasElement('1')
      })
    });

    repository.findOne({ friends: SearchBy.ObjectArrayExists() });
    repository.findOne({ friends: SearchBy.ObjectArrayDoesNotExist() });

    repository.findOne({
      friends: SearchBy.HasNoElementThatMatches<Friend>({
        age: 5,
        foodType: 0,
        // @ts-expect-error
        free: true
      })
    });

    const friend: Friend = {
      name: 'Helen',
      age: 10,
      foodType: NumericFoodType.Meat,
      friendIDs: ['1'],
      readonlyName: 'helen',
      type: StringAnimalType.Tiger
    };

    // @ts-expect-error
    repository.findOne({ friends: [friend] });

    // @ts-expect-error
    repository.findOne({ friends: SearchBy.Equals([friend]) });

    // @ts-expect-error
    repository.findOne({ friends: SearchBy.DoesNotEqual([friend]) });

    // @ts-expect-error
    repository.findOne({ friends: [{ friendName: 'friend1' }] });

    // @ts-expect-error
    repository.findOne({ friends: SearchBy.IsOneOfTheValues([{ friendName: 'friend1' }]) });

    // @ts-expect-error
    repository.findOne({ friends: SearchBy.IsNoneOfTheValues([{ friendName: 'friend1' }]) });

    // @ts-expect-error
    repository.findOne({ friends: null });

    // @ts-expect-error
    repository.findOne({ friends: new Date() });

    // @ts-expect-error
    repository.findOne({ friends: true });

    // @ts-expect-error
    repository.findOne({ friends: SearchBy.IsOneOfTheValues({ friendName: 'friend1' }) });
  });
});
