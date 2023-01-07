import { describe, expect, it } from '@jest/globals';
import { MongoEntityFormatter } from 'db/mongodb/mongo.entity.formatter';
import { UpdateWith } from 'interfaces/update/update.with.interface';
import { ITestAdvanced, ITestCar, ITestFeatures, ITestPart, TestColor } from '../../../_models/car/car.interface';

const mongoEntityFormatter = new MongoEntityFormatter<ITestCar>();

describe('formatUpdate', () => {
  it('should map standard update', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ leftGas: 10 });
    expect(objectToUpdate).toEqual({ leftGas: 10 });
  });

  it('should remove undefined properties', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ leftGas: 10, mileage: undefined });
    expect(objectToUpdate).not.toHaveProperty('mileage');
  });

  it('should not remove null properties', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ leftGas: 10, mileage: null });
    expect(objectToUpdate).toEqual({ leftGas: 10, mileage: null });
  });

  it('should map Set', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ producedIn: UpdateWith.Set(['PL']) });
    expect(objectToUpdate).toEqual({ producedIn: ['PL'] });
  });

  it('should map Clear', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ leftGas: UpdateWith.Clear() });
    expect(objectToUpdate).toEqual({ $unset: { leftGas: '' } });
  });

  it('should map Increment', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ leftGas: UpdateWith.Increment(10) });
    expect(objectToUpdate).toEqual({
      $inc: { leftGas: 10 }
    });
  });

  it('should map 2 Increments', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      leftGas: UpdateWith.Increment(10),
      mileage: UpdateWith.Increment(2)
    });

    expect(objectToUpdate).toEqual({
      $inc: { leftGas: 10, mileage: 2 }
    });
  });

  it('should map standard update and Increment', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      leftGas: UpdateWith.Increment(10),
      mileage: 200
    });

    expect(objectToUpdate).toEqual({
      $inc: { leftGas: 10 },
      mileage: 200
    });
  });

  it('should map Push', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ producedIn: UpdateWith.Push('PL') });

    expect(objectToUpdate).toEqual({
      $push: { producedIn: 'PL' }
    });
  });

  it('should map PushEach', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ producedIn: UpdateWith.PushEach(['PL', 'EN']) });

    expect(objectToUpdate).toEqual({
      $push: { producedIn: { $each: ['PL', 'EN'] } }
    });
  });

  it('should map Pull', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ producedIn: UpdateWith.Pull('PL') });

    expect(objectToUpdate).toEqual({
      $pull: { producedIn: 'PL' }
    });
  });

  it('should map PullEach', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({ producedIn: UpdateWith.PullEach(['PL', 'EN']) });

    expect(objectToUpdate).toEqual({
      $pullAll: { producedIn: ['PL', 'EN'] }
    });
  });

  it('should map multiple Update actions', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      producedIn: UpdateWith.PullEach(['PL', 'EN']),
      leftGas: UpdateWith.Increment(3),
      mileage: UpdateWith.Increment(4)
    });

    expect(objectToUpdate).toEqual({
      $pullAll: { producedIn: ['PL', 'EN'] },
      $inc: { leftGas: 3, mileage: 4 }
    });
  });

  it('should map nested Set', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      features: UpdateWith.Set({
        ranking: 5,
        color: TestColor.Black
      })
    });

    expect(objectToUpdate).toEqual({
      features: {
        ranking: 5,
        color: TestColor.Black
      }
    });
  });

  it('should combine first-level and second-level update', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      leftGas: UpdateWith.Increment(1),
      features: UpdateWith.Set({
        ranking: 5,
        color: TestColor.Black
      })
    });

    expect(objectToUpdate).toEqual({
      $inc: { leftGas: 1 },
      features: {
        ranking: 5,
        color: TestColor.Black
      }
    });
  });

  it('should map NestedUpdate', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      leftGas: UpdateWith.Increment(1),
      features: UpdateWith.NestedUpdate<ITestFeatures>({
        ranking: UpdateWith.Increment(2),
        color: TestColor.Black
      })
    });

    expect(objectToUpdate).toEqual({
      $inc: { leftGas: 1, 'features.ranking': 2 },
      ['features.color']: TestColor.Black
    });
  });

  it('should map array NestedUpdate', () => {
    const objectToUpdate = mongoEntityFormatter.formatUpdate({
      parts: UpdateWith.NestedArrayUpdate<ITestPart>({
        name: 'changed'
      })
    });

    expect(objectToUpdate).toEqual({
      ['parts.$[].name']: 'changed'
    });
  });

  it('should map multi-nested update', async () => {
    const criteria = mongoEntityFormatter.formatUpdate({
      features: UpdateWith.NestedUpdate<ITestFeatures>({
        ranking: UpdateWith.Increment(1),
        color: TestColor.White,
        advanced: UpdateWith.NestedUpdate<ITestAdvanced>({
          serialNumber: 's-04',
          index: UpdateWith.Increment(2)
        })
      })
    });

    expect(criteria).toEqual({
      $inc: { 'features.ranking': 1, 'features.advanced.index': 2 },
      ['features.color']: TestColor.White,
      ['features.advanced.serialNumber']: 's-04'
    });
  });
});
