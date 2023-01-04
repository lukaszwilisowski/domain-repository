import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable string array update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { friendIDs: ['1'] });
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Set(['1']) });
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Push('name') });
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Pull('name') });
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.PushEach(['name1', 'name2']) });
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.PullEach(['name1', 'name2']) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.ClearArray() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friendIDs: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friendIDs: '1' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Increment(1) });
  });
});
