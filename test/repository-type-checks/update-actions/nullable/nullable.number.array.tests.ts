import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable number array update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { favoriteNumbers: [1] });

    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.Push(1) });

    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.Pull(1) });

    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.ClearArray() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.ClearObjectArray() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { favoriteNumbers: '1' });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { favoriteNumbers: UpdateWith.Increment(1) });
  });
});
