import { describe, it, jest } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable string array update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { friendIDs: ['1'] });

    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Push('name') });

    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Pull('name') });

    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.ClearArray() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friendIDs: '1' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { friendIDs: UpdateWith.Increment(1) });
  });
});
