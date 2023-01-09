import { describe, it, jest } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { Friend, NonNullableAnimal, NumericFoodType, StringAnimalType } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable object array update', () => {
  it('should work with proper actions', () => {
    const friend: Friend = {
      name: 'fname',
      age: 10,
      foodType: NumericFoodType.Meat,
      friendIDs: [],
      readonlyName: 'rname',
      type: StringAnimalType.Lion
    };

    repository.findOneAndUpdate({}, { friends: [friend] });
    repository.findOneAndUpdate({}, { friends: UpdateWith.Set<Friend[]>([friend]) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.Push(friend) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.Pull(friend) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.NestedArrayUpdate<Friend>({ age: 10 }) });

    repository.findOneAndUpdate(
      {},
      {
        friends: UpdateWith.Set<Friend[]>([
          {
            name: 'a',
            age: 1,
            foodType: 1,
            friendIDs: [],
            readonlyName: 'r',
            type: StringAnimalType.Lion,
            // @ts-expect-error
            additional: 'lala'
          }
        ])
      }
    );

    repository.findOneAndUpdate(
      {},
      {
        friends: UpdateWith.Set<Friend[]>([
          {
            name: 'a',
            age: 1,
            foodType: 1,
            friendIDs: [],
            readonlyName: 'r',
            type: StringAnimalType.Lion,
            // @ts-expect-error
            additional: 'lala'
          }
        ])
      }
    );

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.NestedUpdate({ age: 10 }) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.Pull({ friendName_error: 'f1' }) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: [{ friendName_error: 'f1' }] });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: { friendName: 'f1' } });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.ClearObject() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: '1' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.Push(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.Pull(1) });
  });
});
