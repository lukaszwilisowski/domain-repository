import { describe, it, jest } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NonNullableAnimal } from '../../_models/non-nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NonNullableAnimal, NonNullableAnimal>>;

describe('Non-nullable string criteria', () => {
  it('should be searchable by proper conditions', () => {
    repository.findOne({ name: 'name' });
    repository.findOne({ name: SearchBy.StartsWith('dog') });
    repository.findOne({ name: SearchBy.EndsWith('dog') });
    repository.findOne({ name: SearchBy.Contains('dog') });
    repository.findOne({ name: SearchBy.IsOneOfTheValues(['dog']) });
    repository.findOne({ name: SearchBy.DoesNotEqual('dog') });
    repository.findOne({ name: SearchBy.DoesNotStartWith('dog') });
    repository.findOne({ name: SearchBy.DoesNotEndWith('dog') });
    repository.findOne({ name: SearchBy.DoesNotContain('dog') });
    repository.findOne({ name: SearchBy.IsNoneOfTheValues(['dog']) });

    // @ts-expect-error
    repository.findOne({ name: null });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.Exists() });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.StartsWith(null) });

    // @ts-expect-error
    repository.findOne({ name: 2 });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.IsGreaterThan(2) });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.IsLesserThan(2) });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.IsGreaterThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.IsLesserThanOrEqual(2) });

    // @ts-expect-error
    repository.findOne({ name: new Date() });

    // @ts-expect-error
    repository.findOne({ name: true });

    // @ts-expect-error
    repository.findOne({ name: ['dog', 'cat'] });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.StartsWith(['dog', 'cat']) });
  });
});
