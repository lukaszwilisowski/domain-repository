import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAdvancedFeatures, NullableAnimal, NullableFeatures } from '../../_models//nullable.model';
import { AdvancedFeatures, Features } from '../../_models/non-nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Non-nullable multi nested object criteria', () => {
  it('should be searchable', () => {
    repository.findOneAndUpdate(
      {},
      {
        features: UpdateWith.NestedUpdate<NullableFeatures>({
          carnivore: UpdateWith.Clear(),
          advanced: UpdateWith.NestedUpdate<NullableAdvancedFeatures>({
            serialNumber: UpdateWith.Clear()
          })
        })
      }
    );

    repository.findOneAndUpdate({}, { features: UpdateWith.ClearObject() });

    //you can update by more specific, non-nullable criteria, because it has the subset of update options of nullable type
    repository.findOneAndUpdate(
      {},
      {
        features: UpdateWith.NestedUpdate<Features>({
          carnivore: true,
          advanced: UpdateWith.NestedUpdate<AdvancedFeatures>({
            serialNumber: 's-01'
          })
        })
      }
    );

    //you can update by more specific, non-nullable criteria, because it has the subset of update options of nullable type
    repository.findOneAndUpdate(
      {},
      {
        features: UpdateWith.NestedUpdate<NullableFeatures>({
          carnivore: true,
          advanced: UpdateWith.NestedUpdate<AdvancedFeatures>({
            serialNumber: 's-01'
          })
        })
      }
    );

    repository.findOneAndUpdate(
      {},
      {
        features: UpdateWith.NestedUpdate<Features>({
          carnivore: true,
          // @ts-expect-error
          advanced: UpdateWith.NestedUpdate<NullableAdvancedFeatures>({
            serialNumber: 's-01'
          })
        })
      }
    );

    repository.findOneAndUpdate(
      {},
      {
        // @ts-expect-error
        features: UpdateWith.NestedUpdate({
          advanced: {}
        })
      }
    );

    repository.findOneAndUpdate(
      {},
      {
        features: UpdateWith.NestedUpdate<Features>({
          carnivore: true,
          advanced: UpdateWith.NestedUpdate<AdvancedFeatures>({
            // @ts-expect-error
            serialNumber: 1
          })
        })
      }
    );

    repository.findOneAndUpdate(
      {},
      {
        // @ts-expect-error
        features: UpdateWith.NestedUpdate({
          carnivore: true,
          advanced: UpdateWith.NestedUpdate<AdvancedFeatures>({
            // @ts-expect-error
            serialNumber: 1
          })
        })
      }
    );

    repository.findOneAndUpdate(
      {},
      {
        // @ts-expect-error
        features: UpdateWith.NestedUpdate<Friend>({
          carnivore: true
        })
      }
    );
  });
});
