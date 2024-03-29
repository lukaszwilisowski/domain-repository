import { describe, it, jest } from '@jest/globals';
import { SearchBy } from 'helpers/search.by.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { Mocked } from 'jest-mock';
import { NumericFoodType, SexType, StringAnimalType } from '../../_models/non-nullable.model';
import { NullableAnimal } from '../../_models/nullable.model';

const repository = {
  findOne: jest.fn()
} as unknown as Mocked<IDomainRepository<NullableAnimal, NullableAnimal>>;

describe('Nullable', () => {
  it('string enum should be searchable by standard conditions', () => {
    repository.findOne({ type: StringAnimalType.Lion });
    repository.findOne({ type: SearchBy.DoesNotEqual(StringAnimalType.Lion) });
    repository.findOne({ type: SearchBy.IsOneOfTheValues([StringAnimalType.Lion, StringAnimalType.Tiger]) });
    repository.findOne({ type: SearchBy.IsNoneOfTheValues([StringAnimalType.Lion, StringAnimalType.Tiger]) });

    repository.findOne({ type: SearchBy.Exists() });
    repository.findOne({ type: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ type: SearchBy.StartsWith('lion') });
  });

  it('number enum should be searchable by standard conditions', () => {
    repository.findOne({ foodType: NumericFoodType.Meat });
    repository.findOne({ foodType: SearchBy.DoesNotEqual(NumericFoodType.Meat) });

    repository.findOne({
      foodType: SearchBy.IsOneOfTheValues([NumericFoodType.Meat, NumericFoodType.Vegetables])
    });

    repository.findOne({
      foodType: SearchBy.IsNoneOfTheValues([NumericFoodType.Meat, NumericFoodType.Vegetables])
    });

    // @ts-expect-error
    repository.findOne({ foodType: 10 });

    // @ts-expect-error
    repository.findOne({ foodType: SearchBy.DoesNotEqual(11) });

    repository.findOne({ foodType: SearchBy.IsNoneOfTheValues([10, 11]) });

    repository.findOne({ type: SearchBy.Exists() });
    repository.findOne({ type: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ type: SearchBy.StartsWith('lion') });
  });

  it('no-value enum should be searchable by standard conditions', () => {
    repository.findOne({ sex: SexType.Male });
    repository.findOne({ sex: SearchBy.DoesNotEqual(SexType.Male) });

    repository.findOne({
      sex: SearchBy.IsOneOfTheValues([SexType.Male, SexType.Female])
    });

    repository.findOne({
      sex: SearchBy.IsNoneOfTheValues([SexType.Male, SexType.Female])
    });

    // @ts-expect-error
    repository.findOne({ sex: 10 });

    // @ts-expect-error
    repository.findOne({ sex: SearchBy.DoesNotEqual(11) });

    //This special case is allowed!
    repository.findOne({ sex: SearchBy.IsNoneOfTheValues([10, 11]) });

    repository.findOne({ sex: SearchBy.Exists() });
    repository.findOne({ sex: SearchBy.DoesNotExist() });

    // @ts-expect-error
    repository.findOne({ sex: SearchBy.StartsWith('lion') });
  });
});
