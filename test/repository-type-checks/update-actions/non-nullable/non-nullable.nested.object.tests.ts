import { describe, it, jest } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { Features, NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable nested object update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate(
      {},
      {
        features: {
          carnivore: true,
          color: 'white',
          advanced: {
            serialNumber: 's-01'
          }
        }
      }
    );

    repository.findOneAndUpdate({}, { features: UpdateWith.NestedUpdate<Features>({ carnivore: true }) });
    repository.findOneAndUpdate({}, { features: UpdateWith.NestedUpdate<Features>({ color: 'blue' }) });

    repository.findOneAndUpdate(
      {},
      { features: UpdateWith.Set({ carnivore: true, color: 'blue', advanced: { serialNumber: 's-01' } }) }
    );

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: { carnivore_error: true } });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.Push(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.ClearObject() });
  });
});
