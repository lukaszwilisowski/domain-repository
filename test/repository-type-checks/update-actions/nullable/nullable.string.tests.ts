import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable string update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { name: 'name' });

    repository.findOneAndUpdate({}, { name: UpdateWith.Clear() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { name: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { name: 2 });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { name: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { name: UpdateWith.Push('name') });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { name: UpdateWith.Pull('name') });
  });
});
