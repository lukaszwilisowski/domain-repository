import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models//nullable.model';
import { Friend, NumericFoodType, StringAnimalType } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable object array update', () => {
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
    repository.findOneAndUpdate({}, { friends: UpdateWith.Set([friend]) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.Push(friend) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.Pull(friend) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.NestedArrayUpdate<Friend>({ age: 10 }) });
    repository.findOneAndUpdate({}, { friends: UpdateWith.ClearObjectArray() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.ClearArray() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: [{ friendName_error: 'f1' }] });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.Pull(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: '1' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friends: UpdateWith.Increment(1) });
  });
});
