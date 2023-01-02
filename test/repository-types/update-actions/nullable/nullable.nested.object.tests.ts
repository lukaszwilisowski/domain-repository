import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { Mocked } from 'jest-mock';
import { NullableAnimal, NullableFeatures } from '../../_models//nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable nested object update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { features: UpdateWith.NestedUpdate<NullableFeatures>({ carnivore: true }) });
    repository.findOneAndUpdate({}, { features: UpdateWith.NestedUpdate<NullableFeatures>({ color: 'blue' }) });

    repository.findOneAndUpdate({}, { features: UpdateWith.Set({ carnivore: true, color: 'blue' }) });
    repository.findOneAndUpdate({}, { features: UpdateWith.ClearObject() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.Clear() });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.NestedUpdate({ carnivore: 5 }) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: { carnivore_error: true } });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: null });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.Increment(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.Push(1) });

    // @ts-expect-error
    repository.findOneAndUpdate({}, { features: UpdateWith.Pull(1) });
  });
});
