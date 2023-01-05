# Domain Repository

IDomainRepository is a DB-agnostic abstract repository layer over Node.JS ORM frameworks (Mongoose or TypeORM). You can think of it as simplified, but more strictly typed version of those.

Useful links:

- [Why use it? Benefits and FAQ](https://github.com/lukaszwilisowski/domain-repository/blob/main/DISCUSSION.md)
- [API (similar to TypeORM repository)](https://github.com/lukaszwilisowski/domain-repository/blob/main/DISCUSSION.md)
- [Example](https://github.com/lukaszwilisowski/domain-repository-example)

## Installation

1. Make sure you have the latest Mongoose or TypeORM package version (depending on which you are using).
2. Install domain-repository

```bash
npm install domain-repository
```

---

## How to use it

#1. Install the library (see above).

#2. Make sure you have domain models defined. Each model should be exported in two versions:

- detached (without id), for objects not yet persisted in the database
- attached (with id), for already persisted objects

This differentiation improves intellisense and debugging. You can call your models whatever you like, but please stick to your naming convention. Our recommendation is to add prefix such as _Attached_ or _Db_ to all your attached models.

For example:

```typescript
export type Car = {
  name: string;
  readonly yearOfProduction: number;
  sold?: Date;
};

export type DbCar = Car & { id: string };
```

#3. Use IDomainRepository in your business services.

In any place, where you would previously use Mongoose collection or TypeORM repository, now use abstract repository:

```typescript
const carRepository: IDomainRepository<Car, DbCar>;
```

The first type here is non-persisted (detached = Car) type, the second one is persisted (attached = DbCar) type.

If you only need to read or write data, you should always narrow down your interfaces.

```typescript
//read-only
const carRepository: IReadDomainRepository<Car, DbCar>;

//write-only
const carRepository: IWriteDomainRepository<Car, DbCar>;
```

Always put your dependencies in the constuctor of the business service (or CQRS query / command), like here:

```typescript
//read-only
const carRepository: IReadDomainRepository<Car, DbCar>;

//write-only
const carRepository: IWriteDomainRepository<Car, DbCar>;
```

#4. Add `IDomainRepository<T>` as a depenedency to your business services (it is important to supply interface, not concrete implementation yet). DI framework is greatly recommended here.

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
