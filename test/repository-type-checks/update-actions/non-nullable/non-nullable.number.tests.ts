import { describe, it, jest } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable number update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { age: 22 });

    repository.findOneAndUpdate({}, { age: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: '22' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: UpdateWith.Push('name') });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { age: UpdateWith.Pull('name') });
  });
});
