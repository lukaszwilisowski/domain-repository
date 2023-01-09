import { describe, it, jest } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { AdvancedFeatures, Features, NonNullableAnimal } from '../../_models/non-nullable.model';
import { NullableAdvancedFeatures, NullableFeatures } from '../../_models/nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable multi nested object criteria', () => {
  it('should be searchable', () => {
    repository.findOne({
      features: SearchBy.NestedCriteria<Features>({
        carnivore: true,
        advanced: SearchBy.NestedCriteria<AdvancedFeatures>({
          serialNumber: 's-01'
        })
      })
    });

    repository.findOne({
      // @ts-expect-error
      features: SearchBy.NestedCriteria<NullableFeatures>({
        carnivore: SearchBy.Exists(),
        advanced: SearchBy.NestedCriteria<AdvancedFeatures>({
          serialNumber: 's-01'
        })
      })
    });

    repository.findOne({
      features: SearchBy.NestedCriteria<Features>({
        carnivore: true,
        // @ts-expect-error
        advanced: SearchBy.NestedCriteria<NullableAdvancedFeatures>({
          serialNumber: 's-01'
        })
      })
    });

    repository.findOne({
      // @ts-expect-error
      features: SearchBy.NestedCriteria({
        advanced: {}
      })
    });

    repository.findOne({
      features: SearchBy.NestedCriteria<Features>({
        carnivore: true,
        advanced: SearchBy.NestedCriteria<AdvancedFeatures>({
          // @ts-expect-error
          serialNumber: 1
        })
      })
    });

    repository.findOne({
      // @ts-expect-error
      features: SearchBy.NestedCriteria({
        advanced: SearchBy.NestedCriteria<AdvancedFeatures>({
          // @ts-expect-error
          serialNumber: SearchBy.Exists()
        })
      })
    });

    repository.findOne({
      // @ts-expect-error
      features: SearchBy.NestedCriteria<Friend>({
        age: 10
      })
    });
  });
});
