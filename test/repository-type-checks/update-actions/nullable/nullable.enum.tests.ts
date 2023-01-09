import { describe, it, jest } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { UpdateWith } from '../../../..';
import { NumericFoodType, SexType, StringAnimalType } from '../../_models/non-nullable.model';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOneAndUpdate: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable enum update', () => {
  it('should work with proper actions', () => {
    repository.findOneAndUpdate({}, { type: StringAnimalType.Lion });
    repository.findOneAndUpdate({}, { type: StringAnimalType.Tiger });
    repository.findOneAndUpdate({}, { foodType: NumericFoodType.Meat });
    repository.findOneAndUpdate({}, { foodType: NumericFoodType.Vegetables });
    repository.findOneAndUpdate({}, { sex: SexType.Female });
    repository.findOneAndUpdate({}, { sex: SexType.Male });

    repository.findOneAndUpdate({}, { types: [StringAnimalType.Lion] });
    repository.findOneAndUpdate({}, { types: [StringAnimalType.Lion, StringAnimalType.Tiger, 'asd'] });
    repository.findOneAndUpdate(
      {},
      // @ts-expect-error
      { types: UpdateWith.Set<StringAnimalType[]>([StringAnimalType.Lion, StringAnimalType.Tiger, 'asd']) }
    );

    repository.findOneAndUpdate({}, { type: UpdateWith.Clear() });

    repository.findOneAndUpdate({}, { types: UpdateWith.ClearArray() });
  });
});
