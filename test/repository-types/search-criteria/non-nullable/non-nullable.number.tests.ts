import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable number criteria', () => {
  it('should be searchable by proper conditions', () => {
    repository.findOne({ age: 10 });
    repository.findOne({ age: SearchBy.DoesNotEqual(10) });
    repository.findOne({ age: SearchBy.IsLesserThan(10) });
    repository.findOne({ age: SearchBy.IsGreaterThan(10) });
    repository.findOne({ age: SearchBy.IsLesserThanOrEqual(10) });
    repository.findOne({ age: SearchBy.IsGreaterThanOrEqual(10) });
    repository.findOne({ age: SearchBy.IsOneOfTheValues([10]) });
    repository.findOne({ age: SearchBy.IsNoneOfTheValues([10]) });

    // @ts-expect-error
    repository.findOne({ age: null });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.Exists() });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.DoesNotEqual(null) });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.StartsWith(null) });

    // @ts-expect-error
    repository.findOne({ age: 'string' });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.StartsWith(2) });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.EndsWith(2) });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.Contains(2) });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.DoesNotStartWith(2) });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.DoesNotEndWith(2) });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.DoesNotContain(2) });

    // @ts-expect-error
    repository.findOne({ age: new Date() });

    // @ts-expect-error
    repository.findOne({ age: true });

    // @ts-expect-error
    repository.findOne({ age: [10, 20] });

    // @ts-expect-error
    repository.findOne({ age: SearchBy.IsLesserThan([10, 20]) });
  });
});
