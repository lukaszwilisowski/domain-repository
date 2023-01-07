import { describe, expect, it } from '@jest/globals';
import { MongoEntityFormatter } from 'db/mongodb/mongo.entity.formatter';
import { SearchBy } from 'interfaces/search/search.by.interface';
import * as mongoose from 'mongoose';
import { SearchCriteria } from '../../../..';
import { ITestAdvanced, ITestFeatures, ITestPart, TestColor } from '../../../_models/car/car.interface';

import { TestMongoCarEntity } from '../entities/car/car.entity';

const mongoEntityFormatter = new MongoEntityFormatter<TestMongoCarEntity>();

describe('formatCriteria', () => {
  it('should remove undefined properties', () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      model: 'testname',
      horsePower: undefined
    });

    expect(criteria).toEqual({
      model: 'testname'
    });

    expect(criteria).not.toHaveProperty('horsePower');
  });

  it('should not remove null properties', () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      model: 'testname',
      horsePower: null,
      engineModel: 'em'
    });

    expect(criteria).toEqual({
      model: 'testname',
      horsePower: null,
      engineModel: 'em'
    });
  });

  it('should map id', async () => {
    const objectId = new mongoose.Types.ObjectId();

    const criteria = mongoEntityFormatter.formatCriteria({ _id: objectId } as SearchCriteria<unknown>);

    expect(criteria).toEqual({
      _id: objectId
    });
  });

  it('should map Equals condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.Equals('Mazda CX5') });

    expect(criteria).toEqual({
      model: 'Mazda CX5'
    });
  });

  it('should map DoesNotEqual condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.DoesNotEqual('Mazda CX5') });

    expect(criteria).toEqual({
      model: { $ne: 'Mazda CX5' }
    });
  });

  it('should map Exists condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ leftGas: SearchBy.Exists() });

    expect(criteria).toEqual({
      leftGas: { $exists: true }
    });
  });

  it('should map DoesNotExist condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ leftGas: SearchBy.DoesNotExist() });

    expect(criteria).toEqual({
      leftGas: { $exists: false }
    });
  });

  it('should map array with Equals', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      producedIn: ['A', 'B']
    });

    expect(criteria).toEqual({
      producedIn: ['A', 'B']
    });
  });

  it('should map array HasElement', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ producedIn: SearchBy.HasElement('A') });

    expect(criteria).toEqual({
      producedIn: 'A'
    });
  });

  it('should map array with DoesNotHaveElement', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ producedIn: SearchBy.DoesNotHaveElement('A') });

    expect(criteria).toEqual({
      producedIn: { $exists: true, $nin: ['A'] }
    });
  });

  it('should map array with HasAnyOfTheElements', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      producedIn: SearchBy.HasAnyOfTheElements(['A', 'B', 'C'])
    });

    expect(criteria).toEqual({
      producedIn: { $in: ['A', 'B', 'C'] }
    });
  });

  it('should map array with HasNoneOfTheElements', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      producedIn: SearchBy.HasNoneOfTheElements(['A', 'B', 'C'])
    });

    expect(criteria).toEqual({
      producedIn: { $exists: true, $nin: ['A', 'B', 'C'] }
    });
  });

  it('should map array with HasAllElements', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      producedIn: SearchBy.HasAllElements(['A', 'B', 'C'])
    });

    expect(criteria).toEqual({
      producedIn: { $all: ['A', 'B', 'C'] }
    });
  });

  it('should map string property with IsOneOfTheValues', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.IsOneOfTheValues(['a', 'b', 'c']) });

    expect(criteria).toEqual({
      model: { $in: ['a', 'b', 'c'] }
    });
  });

  it('should map string property with IsNoneOfTheValues', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.IsNoneOfTheValues(['a', 'b', 'c']) });

    expect(criteria).toEqual({
      model: { $nin: ['a', 'b', 'c'] }
    });
  });

  it('should map Contains string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.Contains('azd') });

    expect(criteria).toEqual({
      model: { $regex: '^.*azd.*$', $options: 'i' }
    });
  });

  it('should map DoesNotContain string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.DoesNotContain('azd') });

    expect(criteria).toEqual({
      model: { $not: { $regex: '^.*azd.*$', $options: 'i' } }
    });
  });

  it('should map StartsWith string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.StartsWith('Mazd') });

    expect(criteria).toEqual({
      model: { $regex: '^Mazd.*$', $options: 'i' }
    });
  });

  it('should map DoesNotStartWith string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.DoesNotStartWith('Mazd') });

    expect(criteria).toEqual({
      model: { $not: { $regex: '^Mazd.*$', $options: 'i' } }
    });
  });

  it('should map EndsWith string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.EndsWith('da') });

    expect(criteria).toEqual({
      model: { $regex: '^.*da$', $options: 'i' }
    });
  });

  it('should map DoesNotEndWith string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ model: SearchBy.DoesNotEndWith('da') });

    expect(criteria).toEqual({
      model: { $not: { $regex: '^.*da$', $options: 'i' } }
    });
  });

  it('should map IsGreaterThan string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ fullTankCapacity: SearchBy.IsGreaterThan(100) });

    expect(criteria).toEqual({
      fullTankCapacity: { $gt: 100 }
    });
  });

  it('should map IsGreaterThanOrEqual string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ fullTankCapacity: SearchBy.IsGreaterThanOrEqual(100) });

    expect(criteria).toEqual({
      fullTankCapacity: { $gte: 100 }
    });
  });

  it('should map IsLesserThan string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ fullTankCapacity: SearchBy.IsLesserThan(100) });

    expect(criteria).toEqual({
      fullTankCapacity: { $lt: 100 }
    });
  });

  it('should map IsLesserThanOrEqual string condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({ fullTankCapacity: SearchBy.IsLesserThanOrEqual(100) });

    expect(criteria).toEqual({
      fullTankCapacity: { $lte: 100 }
    });
  });

  it('should map array of objects condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      parts: SearchBy.HasElementThatMatches<ITestPart>({
        name: SearchBy.StartsWith('n'),
        year: 1999
      })
    });

    expect(criteria).toEqual({
      parts: { $elemMatch: { name: { $regex: '^n.*$', $options: 'i' }, year: 1999 } }
    });
  });

  it('should map nested object condition', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      features: SearchBy.NestedCriteria<ITestFeatures>({
        ranking: 5,
        color: TestColor.Black
      })
    });

    expect(criteria).toEqual({
      features: { $exists: true },
      ['features.ranking']: 5,
      ['features.color']: TestColor.Black
    });
  });

  it('should map nested object condition with IsGreaterThan', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      features: SearchBy.NestedCriteria<ITestFeatures>({
        ranking: SearchBy.IsGreaterThan(5),
        color: TestColor.White
      })
    });

    expect(criteria).toEqual({
      features: { $exists: true },
      ['features.ranking']: { $gt: 5 },
      ['features.color']: TestColor.White
    });
  });

  it('should map multi-nested object', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      features: SearchBy.NestedCriteria<ITestFeatures>({
        ranking: SearchBy.IsGreaterThan(5),
        color: TestColor.White,
        advanced: SearchBy.NestedCriteria<ITestAdvanced>({
          serialNumber: SearchBy.StartsWith('s')
        })
      })
    });

    expect(criteria).toEqual({
      features: { $exists: true },
      ['features.ranking']: { $gt: 5 },
      ['features.color']: TestColor.White,
      ['features.advanced']: { $exists: true },
      ['features.advanced.serialNumber']: { $regex: '^s.*$', $options: 'i' }
    });
  });

  it('should map multi-nested object by Exist', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      features: SearchBy.NestedCriteria<ITestFeatures>({
        advanced: SearchBy.ObjectExists()
      })
    });

    expect(criteria).toEqual({
      features: { $exists: true },
      ['features.advanced']: { $exists: true }
    });
  });

  it('should map multi-nested object by Exist -> Exist', async () => {
    const criteria = mongoEntityFormatter.formatCriteria({
      features: SearchBy.NestedCriteria<ITestFeatures>({
        advanced: SearchBy.NestedCriteria<ITestAdvanced>({
          index: SearchBy.Exists()
        })
      })
    });

    expect(criteria).toEqual({
      features: { $exists: true },
      ['features.advanced']: { $exists: true },
      ['features.advanced.index']: { $exists: true }
    });
  });
});
