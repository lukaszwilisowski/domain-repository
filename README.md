# Domain Repository

IDomainRepository is a DB-agnostic abstract repository layer over Node.JS ORM frameworks (Mongoose or TypeORM). You can think of it as an extension of Mongoose or TypeORM functionalities.

## Benefits

Properly implemented abstract repository layer solves 3 major development problems:

1. By hiding DB details, allows to easily switch between different databases. This pattern is called **DB as an implementation detail**.
2. Thanks to advanced Typescript checks, takes into consideration additional constraints such as optional and readonly, providing developers with **better intellisense and type-checking**.
3. Offers a mocked repository implementation, which simplifies unit testing and **removes the need to mock any DB dependencies**.

---

## How to use it

IDomainRepository is very similar in use to Mongoose collection or TypeORM repository. You can think of it as simplified, but more strictly typed version of those.

#1. Make sure you have separate domain types and db models.

```typescript
const carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
```

`IDomainRepository<Detached, Attached>` can be typed with a single domain type T, but we strongly recommend to differentiate between Detached and Attached domain types:

- `Detached` is a type of domain object that was not yet persisted. This type contains only manually assignable properties (without id).
- `Attached` is a type of already persisted domain object. This type contains all properties including those set by DB engine (id property and possibly more, depending on your setup).

For example:

```typescript
export type ITestCar = {...};
export type ITestCarAttached = ITestCar & { id: string };
```

#2. Add `IDomainRepository<T>` as a depenedency to your business services (it is important to supply interface, not concrete implementation yet). DI framework is greatly recommended here.

---

## Unit testing

With IDomainRepository, testing and test-driven-development has never been simpler.
Here lies the true power of this library: mocked, in-memory implementation of abstract repository (you can think of it as mocked database).

To test any business service, you have to mock all of its dependencies.
Now, you don't have to worry about mocking Mongoose or TypeORM functions. Just create an automatic mock of IDomainRepository using the following syntax, passing **initial db data** in MockedDBRepository contructor:

### Example using Jest

```typescript
describe('carService', () => {
  const initialData: ITestCarAttached[] = [
    { name: 'Volvo', best: false },
    { name: 'Toyota', best: true }
  ];

  const mockedRepository = new MockedDBRepository<ITestCar, ITestCarAttached>(initialData);

  const carService = new CarService(mockedRepository);

  it('should find best car', async () => {
    const car = await carService.findBestCar();
    expect(car.name).toEqual('Toyota');
  });
});
```

No more complex mocking of functions or DB state. **Now all your business services
are easily testable!**

Caveats:

- MockedDBRepository creates string IDs for each added object (simulating ID creation in Mongo and SQL databases). This ID has custom format and should not be tested for proper formatting (in case anybody has such an idea).
- MockedDBRepository does not simulate other auto-generated properties, as those depend on target DB technology and DB models settings (decorators). Anyway, it should not be a problem, because in principle you should never test your database when testing your business services. You assume that database works (correctly creates proper IDs) and only test the code that is within the business service itself.

---
