import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable string array criteria', () => {
  it('should be searchable by proper conditions', () => {
    repository.findOne({ friendIDs: ['dog', 'cat'] });
    repository.findOne({ friendIDs: SearchBy.DoesNotEqual(['dog', 'cat']) });
    repository.findOne({ friendIDs: SearchBy.HasElement('dog') });
    repository.findOne({ friendIDs: SearchBy.DoesNotHaveElement('dog') });
    repository.findOne({ friendIDs: SearchBy.HasAnyOfTheElements(['dog', 'cat']) });
    repository.findOne({ friendIDs: SearchBy.HasNoneOfTheElements(['dog', 'cat']) });
    repository.findOne({ friendIDs: SearchBy.HasAllElements(['dog', 'cat']) });

    // @ts-expect-error
    repository.findOne({ friendIDs: 'friendIDs' });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.Exists() });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ friendIDs: null });

    // @ts-expect-error
    repository.findOne({ friendIDs: 2 });

    // @ts-expect-error
    repository.findOne({ friendIDs: new Date() });

    // @ts-expect-error
    repository.findOne({ friendIDs: true });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.StartsWith('dog') });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.EndsWith('dog') });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.Contains('dog') });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.IsGreaterThan(2) });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.IsLesserThan(2) });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.IsGreaterThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.IsLesserThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.DoesNotStartWith('dog') });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.DoesNotEndWith('dog') });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.DoesNotContain('dog') });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsOneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsNoneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ friendIDs: SearchBy.StartsWith(['dog', 'cat']) });
  });
});
