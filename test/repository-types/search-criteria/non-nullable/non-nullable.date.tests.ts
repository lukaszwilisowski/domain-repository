import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable date criteria', () => {
  it('should be searchable by proper conditions', () => {
    const date = new Date(2020, 10, 10);

    repository.findOne({ whenBorn: date });
    repository.findOne({ whenBorn: SearchBy.IsLesserThan(date) });
    repository.findOne({ whenBorn: SearchBy.IsGreaterThan(date) });
    repository.findOne({ whenBorn: SearchBy.IsLesserThanOrEqual(date) });
    repository.findOne({ whenBorn: SearchBy.IsGreaterThanOrEqual(date) });
    repository.findOne({ whenBorn: SearchBy.DoesNotEqual(date) });
    repository.findOne({ whenBorn: SearchBy.IsOneOfTheValues([date]) });
    repository.findOne({ whenBorn: SearchBy.IsNoneOfTheValues([date]) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.Exists() });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ whenBorn: null });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.DoesNotEqual(null) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.StartsWith(null) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.StartsWith(date) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.EndsWith(date) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.Contains(date) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.DoesNotStartWith(date) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.DoesNotEndWith(date) });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.DoesNotContain(date) });

    // @ts-expect-error
    repository.findOne({ whenBorn: true });

    // @ts-expect-error
    repository.findOne({ whenBorn: [date, date] });

    // @ts-expect-error
    repository.findOne({ whenBorn: SearchBy.IsLesserThan([date, date]) });
  });
});
