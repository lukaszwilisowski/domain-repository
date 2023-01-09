import { describe, it, jest } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable date update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { whenBorn: new Date(2022, 10, 10) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { whenBorn: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { whenBorn: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { whenBorn: '22' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { whenBorn: UpdateWith.Push('name') });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { whenBorn: UpdateWith.Pull('name') });
  });
});
