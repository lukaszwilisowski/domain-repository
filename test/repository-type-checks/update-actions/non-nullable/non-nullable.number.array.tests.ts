import { describe, it, jest } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable number array update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { favoriteNumbers: [1] });

    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.Push(1) });

    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.Pull(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { favoriteNumbers: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { favoriteNumbers: '1' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.Increment(1) });
  });
});
