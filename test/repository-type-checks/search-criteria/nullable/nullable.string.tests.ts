import { describe, it, jest } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOne: jest.fn(),
  findAll: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable string criteria', () => {
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
    repository.findOne({ name: SearchBy.Exists() });
    repository.findOne({ name: SearchBy.DoesNotExist() });

    repository.findAll({ name: SearchBy.StartsWith('dog') }, { skip: 10, limit: 10 });
    repository.findAll({ name: SearchBy.StartsWith('dog') }, { sortBy: { name: 'asc' } });
    repository.findAll(
      { name: SearchBy.StartsWith('dog') },
      { sortBy: { name: 'asc', age: 'desc' }, skip: 10, limit: 10 }
    );

    // @ts-expect-error
    repository.findAll({ name: SearchBy.StartsWith('dog') }, { sortBy: { friends: 'asc' } });

    // @ts-expect-error
    repository.findOne({ name: null });

    // @ts-expect-error
    repository.findOne({ name: SearchBy.DoesNotEqual(null) });

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
