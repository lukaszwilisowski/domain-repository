## API

Create:

```typescript
const testCar: ITestCar = {
  model: 'Toyota Avensis',
  engineType: TestFuelType.Gasoline,
  horsePower: 140,
  mileage: null,
  producedIn: ['Poland', 'Germany'],
  failed: true,
  features: {
    ranking: 5,
    numbers: [1, 2, 3],
    advanced: {
      serialNumber: 'test'
    }
  },
  parts: [
    { name: 'part1', year: 1999 },
    { name: 'part2', year: 2000 }
  ]
};

const createdCar = await carRepository.create(testCar);
const createdCars = await carRepository.createMany([testCar]);
```

Find criteria:

```typescript
/**
 * Makes `T` properties searchable.
 * 1. `Primitives` by: value, Equals, DoesNotEqual, IsOneOfTheValues, IsNoneOfTheValues.
 * 2. `Optional` properties additionally by: Exists, DoesNotExists.
 * 3. `Strings` additionally by: StartsWith, EndsWith, Contains, DoesNotStartWith, DoesNotEndWith, DoesNotContain.
 * 4. `Numbers` and `Dates` additionally by: IsGreaterThan, IsLesserThan, IsLesserThanOrEqual, IsGreaterThanOrEqual.
 * 5. `Arrays of primitives` by: value, Equals, DoesNotEqual, HasElement, DoesNotHaveElement, HasAnyOfTheElements, HasNoneOfTheElements, HasAllElements.
 * 6. `Arrays of objects` by: HasElementThatMatches, ObjectArrayExists, ObjectArrayDoesNotExist.
 * 7. `Nested objects` by: NestedCriteria, ObjectExists, ObjectDoesNotExist.
 */
export type SearchCriteria<T> = {...}
```

Find by primitive property:

```typescript
//findOne
const foundCar = await carRepository.findOne({ model: 'Peugeot 508' });
const foundCar = await carRepository.findOneOrFail({ fullTankCapacity: 55, leftGas: 55 });

//findAll
const foundCars = await carRepository.findAll();

//equals
const foundCars = await carRepository.findAll({ model: 'Toyota Avensis', mileage: 0});
const foundCars = await carRepository.findAll({ model: SearchBy.Equals(('Mazda CX5') });
const foundCars = await carRepository.findAll({ model: SearchBy.DoesNotEqual('Mazda CX5') });

//exists
const foundCars = await carRepository.findAll({ failed: SearchBy.Exists() });
const foundCars = await carRepository.findAll({ failed: SearchBy.DoesNotExist() });

//string
const foundCars = await carRepository.findAll({ model: SearchBy.Contains('o') });
const foundCars = await carRepository.findAll({ model: SearchBy.DoesNotContain('o') });
const foundCars = await carRepository.findAll({ model: SearchBy.StartsWith('Toy') });
const foundCars = await carRepository.findAll({ model: SearchBy.DoesNotStartWith('Toy') });
const foundCars = await carRepository.findAll({ model: SearchBy.EndsWith('508') });
const foundCars = await carRepository.findAll({ model: SearchBy.DoesNotEndWith('508') });

//number and Date
const foundCars = await carRepository.findAll({ fullTankCapacity: SearchBy.IsGreaterThan(50) });
const foundCars = await carRepository.findAll({ fullTankCapacity: SearchBy.IsGreaterThanOrEqual(50) });
const foundCars = await carRepository.findAll({ fullTankCapacity: SearchBy.IsLesserThan(50) });
const foundCars = await carRepository.findAll({ fullTankCapacity: SearchBy.IsLesserThanOrEqual(50) })

//isOneOfTheValues and isNoneOfTheValues
const foundCars = await carRepository.findAll({ model: SearchBy.IsOneOfTheValues(['Mazda CX5', 'Peugeot 508']) });
const foundCars = await carRepository.findAll({ model: SearchBy.IsNoneOfTheValues(['Mazda CX5', 'Peugeot 508']) });

//complex
const foundCars = await carRepository.findAll({
   avgFuelConsumption: SearchBy.IsGreaterThanOrEqual(0),
   manufacturingLineId: SearchBy.DoesNotEqual(null)
});
```

Find by array property:

```typescript
//array
const foundCars = await carRepository.findAll({ producedIn: SearchBy.HasElement('Poland') });
const foundCars = await carRepository.findAll({ producedIn: SearchBy.DoesNotHaveElement('Poland') });
const foundCars = await carRepository.findAll({ producedIn: SearchBy.HasAnyOfTheElements(['Poland', 'Germany']) });
const foundCars = await carRepository.findAll({ producedIn: SearchBy.HasNoneOfTheElements(['France', 'Spain']) });
const foundCars = await carRepository.findAll({ producedIn: SearchBy.HasAllElements(['Spain', 'France']) });

//exists
const foundCars = await carRepository.findAll({ producedIn: SearchBy.ArrayExists() });
const foundCars = await carRepository.findAll({ producedIn: SearchBy.ArrayDoesNotExist() });
```

Find by object array property:

```typescript
//object array
const foundCars = await carRepository.findAll({
  parts: SearchBy.HasElementThatMatches<ITestPart>({
    name: SearchBy.StartsWith('w'),
    year: SearchBy.IsGreaterThan(1999)
  })
});

//object array exists
const foundCars = await carRepository.findAll({ parts: SearchBy.ObjectArrayExists() });
const foundCars = await carRepository.findAll({ parts: SearchBy.ObjectArrayDoesNotExist() });
```

Find by nested object property:

```typescript
//nested object
const foundCars = await carRepository.findAll({
  features: SearchBy.NestedCriteria<ITestFeatures>({
    advanced: SearchBy.NestedCriteria<ITestAdvanced>({
      index: SearchBy.Exists()
    })
  })
});

//nested object exists
const foundCars = await carRepository.findAll({ features: SearchBy.ObjectExists() });
const foundCars = await carRepository.findAll({ features: SearchBy.ObjectDoesNotExist() });
```

---

Update criteria:

```typescript
/**
 * Makes `T` non-readonly (!) properties updateable:
 * 1. `Primitives` by: Set.
 * 2. `Optional` properties by: Set, Clear.
 * 3. `Numbers` properties by: Set, Increment.
 * 4. `Arrays` by: Push, Set, PushEach, Pull, PullEach, ClearArray.
 * 5. `Arrays of objects` by: Set, Push, PushEach, Pull, PullEach, ClearObjectArray.
 * 5. `Nested objects`: by Set, UpdateCriteria, ClearObject.
 */
export type UpdateCriteria<T> = {...}
```

Update primitive property:

```typescript
//update one
const result = await carRepository.findOneAndUpdate({ model: 'Toyota' }, { model: 'Toyota_updated' });

//update all
const result = await carRepository.findAllAndUpdate({}, { leftGas: UpdateWith.Increment(10) });

//clear
const result = await carRepository.findAllAndUpdate({ horsePower: 180 }, { leftGas: UpdateWith.Clear() });
```

Update array property:

```typescript
//set
const result = await carRepository.findOneAndUpdate({}, { parts: [{ name: 'part1' }] });
const result = await carRepository.findOneAndUpdate({}, { parts: UpdateWith.Set([{ name: 'part1' }]) });

//push and pull
const result = await carRepository.findAllAndUpdate({}, { producedIn: UpdateWith.Push('3') });
const result = await carRepository.findAllAndUpdate({}, { producedIn: UpdateWith.PushEach(['4', '5']) });
const result = await carRepository.findAllAndUpdate({}, { producedIn: UpdateWith.Pull('2') });
const result = await carRepository.findAllAndUpdate({}, { producedIn: UpdateWith.PullEach(['2', '3']) });
const result = await carRepository.findAllAndUpdate(
  { features: SearchBy.Exists() },
  { features: UpdateWith.Push({ ranking: 1 }) }
);

//clear array
const result = await carRepository.findAllAndUpdate({ horsePower: 180 }, { producedIn: UpdateWith.ClearArray() });
const result = await carRepository.findAllAndUpdate({ horsePower: 140 }, { parts: UpdateWith.ClearObjectArray() });
```

Update nested object property:

```typescript
//set
const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
  { features: SearchBy.NestedCriteria<ITestFeatures>({ ranking: SearchBy.IsGreaterThanOrEqual(20) }) },
  { features: UpdateWith.Set({ ranking: 100, color: TestColor.Black, numbers: [1, 2, 3] }) }
);

//clear object
const result = await carRepository.findAllAndUpdate({ horsePower: 180 }, { features: UpdateWith.ClearObject() });

//complex update
const { numberOfUpdatedObjects } = await carRepository.findAllAndUpdate(
  { model: SearchBy.Contains('ta') },
  {
    producedIn: UpdateWith.PushEach(['11', '12']),
    parts: UpdateWith.Set([{ name: 'wheel"% select', year: 2020 }]),
    leftGas: UpdateWith.Clear(),
    mileage: UpdateWith.Set(100),
    features: UpdateWith.NestedUpdate<ITestFeatures>({
      ranking: UpdateWith.Increment(1),
      numbers: UpdateWith.ClearArray(),
      color: TestColor.White,
      advanced: UpdateWith.NestedUpdate<ITestAdvanced>({
        serialNumber: 'new_sn'
      })
    })
  }
);
```

Please note that:

- all input data is properly escaped by TypeORM implementation (preventing SQL injection)
- typescript will throw error if you try to perform a forbidden action (updating property which is readonly, clearing property which is not optional, incrementing non-numeric property etc.).

Delete functions:

```typescript
const result = await ticketRepository.findOneAndDelete({ price: SearchBy.IsGreaterThan(5) });
const result = await ticketRepository.findAllAndDelete({ price: SearchBy.IsGreaterThan(5) });
```
