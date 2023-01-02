import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models//nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable number array criteria', () => {
  it('should be searchable by proper conditions', () => {
    repository.findOne({ favoriteNumbers: [1, 2] });
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotEqual([1, 2]) });
    repository.findOne({ favoriteNumbers: SearchBy.HasElement(1) });
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotHaveElement(1) });
    repository.findOne({ favoriteNumbers: SearchBy.ArrayExists() });
    repository.findOne({ favoriteNumbers: SearchBy.ArrayDoesNotExist() });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: null });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotEqual(null) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: 2 });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotEqual(2) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: new Date() });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: true });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.StartsWith('dog') });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.EndsWith('dog') });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.Contains('dog') });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsGreaterThan(2) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsLesserThan(2) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsGreaterThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsLesserThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotStartWith('dog') });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotEndWith('dog') });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.DoesNotContain('dog') });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsOneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsNoneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ favoriteNumbers: SearchBy.IsOneOfTheValues(1) });
  });
});
