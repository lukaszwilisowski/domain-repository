import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { Features, NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable nested object criteria', () => {
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

    // @ts-expect-error
    repository.findOne({ features: { friendName: 'friend1' } });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.ObjectExists() });

    // @ts-expect-error
    repository.findOne({ features: SearchBy.ObjectDoesNotExist() });

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
