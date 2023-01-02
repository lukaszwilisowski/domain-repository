import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable boolean criteria', () => {
  it('should be searchable by proper conditions', () => {
    repository.findOne({ free: true });
    repository.findOne({ free: SearchBy.DoesNotEqual(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.Exists() });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ free: null });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotEqual(null) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.StartsWith(null) });

    // @ts-expect-error
    repository.findOne({ free: 'string' });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.StartsWith(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.EndsWith(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.Contains(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsGreaterThan(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsLesserThan(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsGreaterThanOrEqual(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsLesserThanOrEqual(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsOneOfTheValues([true]) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotStartWith(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotEndWith(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotContain(true) });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.IsNoneOfTheValues([true]) });

    // @ts-expect-error
    repository.findOne({ free: new Date() });

    // @ts-expect-error
    repository.findOne({ free: 2 });

    // @ts-expect-error
    repository.findOne({ free: [false, true] });

    // @ts-expect-error
    repository.findOne({ free: SearchBy.DoesNotEqual([true, false]) });
  });
});
