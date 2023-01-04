import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable number update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { age: 22 });

    repository.findOneAndUpdate({}, { age: UpdateWith.Increment(1) });

    repository.findOneAndUpdate({}, { age: UpdateWith.Clear() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: '22' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: UpdateWith.Push('name') });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: UpdateWith.Pull('name') });
  });
});
