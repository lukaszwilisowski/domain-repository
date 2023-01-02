import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { Features } from '../../_models/non-nullable.model';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable nested object criteria', () => {
  it('should be searchable', () => {
    repository.findOne({
      features: SearchBy.NestedCriteria<Features>({
        carnivore: true,
        color: 'blue'
      })
    });

    repository.findOne({
      features: SearchBy.NestedCriteria<Features>({
        color: SearchBy.StartsWith('b')
      })
    });

    repository.findOne({ features: SearchBy.ObjectExists() });
    repository.findOne({ features: SearchBy.ObjectDoesNotExist() });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.Exists() });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ features: { friendName: 'friend1' } });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.DoesNotEqual({ friendName: 'friend1' }) });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.IsOneOfTheValues({ friendName: 'friend1' }) });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.IsNoneOfTheValues({ friendName: 'friend1' }) });

    // @ts-expect-error
    repository.findOne({ features: null });

    // @ts-expect-error
    repository.findOne({ features: new Date() });

    // @ts-expect-error
    repository.findOne({ features: true });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.StartsWith({ friendName: 'friend1' }) });
  });
});
