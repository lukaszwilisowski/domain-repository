import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NullableAdvancedFeatures, NullableAnimal, NullableFeatures } from '../../_models//nullable.model';
import { AdvancedFeatures, Features } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Non-nullable multi nested object criteria', () => {
  it('should be searchable', () => {
    repository.findOne({
      features: SearchBy.NestedCriteria<NullableFeatures>({
        carnivore: SearchBy.Exists(),
        advanced: SearchBy.NestedCriteria<NullableAdvancedFeatures>({
          serialNumber: SearchBy.Exists()
        })
      })
    });

    repository.findOne({ features: SearchBy.ObjectExists() });
    repository.findOne({ features: SearchBy.ObjectDoesNotExist() });

    repository.findOne({
      features: SearchBy.NestedCriteria<NullableFeatures>({
        carnivore: true,
        //you can search by more specific, non-nullable type, because it has the subset of search options of nullable type
        advanced: SearchBy.NestedCriteria<AdvancedFeatures>({
          serialNumber: 's-01'
        })
      })
    });

    repository.findOne({
      //you can search by more specific, non-nullable type, because it has the subset of search options of nullable type
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
