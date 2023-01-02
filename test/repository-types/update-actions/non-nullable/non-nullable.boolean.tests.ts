import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable date update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { free: true });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: '22' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: UpdateWith.Push('name') });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: UpdateWith.Pull('name') });
  });
});
