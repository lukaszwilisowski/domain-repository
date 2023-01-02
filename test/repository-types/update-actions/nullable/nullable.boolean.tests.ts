import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models//nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable date update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { free: true });

    repository.findOneAndUpdate({}, { free: UpdateWith.Clear() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: '22' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: UpdateWith.Push('name') });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { free: UpdateWith.Pull('name') });
  });
});
