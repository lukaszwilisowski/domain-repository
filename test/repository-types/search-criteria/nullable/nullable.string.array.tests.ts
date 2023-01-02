import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models//nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable string array criteria', () => {
  it('should be searchable by proper conditions', () => {
    repository.findOne({ friendIDs: ['dog', 'cat'] });
    repository.findOne({ friendIDs: SearchBy.DoesNotEqual(['dog', 'cat']) });
    repository.findOne({ friendIDs: SearchBy.HasElement('dog') });
    repository.findOne({ friendIDs: SearchBy.DoesNotHaveElement('dog') });
    repository.findOne({ friendIDs: SearchBy.ArrayExists() });
    repository.findOne({ friendIDs: SearchBy.ArrayDoesNotExist() });

    // @ts-expect-error
    repository.findOne({ friendIDs: null });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.DoesNotEqual(null) });

    // @ts-expect-error
    repository.findOne({ friendIDs: 'friendIDs' });

    // @ts-expect-error
    repository.findOne({ friendIDs: 2 });

    // @ts-expect-error
    repository.findOne({ friendIDs: new Date() });

    // @ts-expect-error
    repository.findOne({ friendIDs: true });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.StartsWith('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.EndsWith('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.Contains('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsGreaterThan(2) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsLesserThan(2) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsGreaterThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsLesserThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotStartWith('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotEndWith('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotContain('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsOneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsNoneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.StartsWith(['dog', 'cat']) });
  });
});
