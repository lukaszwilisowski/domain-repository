# Domain Repository

IDomainRepository is a DB-agnostic abstract repository layer over Node.JS ORM frameworks (Mongoose or TypeORM). You can think of it as simplified, but more strictly typed version of those.

Useful links:

- [Why use it? Benefits and FAQ](https://github.com/lukaszwilisowski/domain-repository/blob/main/DISCUSSION.md)
- [API (similar to TypeORM repository)](https://github.com/lukaszwilisowski/domain-repository/blob/main/API.md)
- [Code example](https://github.com/lukaszwilisowski/domain-repository-example)

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

This differentiation improves intellisense and debugging. You can call your models whatever you like, but please stick to your naming convention. Our recommendation is to add either _Db_ prefix or _Attached_ suffix to all of your attached models.

For example:

```typescript
export type Car = {
  name: string;
  best: boolean;
  readonly yearOfProduction: number;
  sold?: Date;
};

export type DbCar = Car & { id: string };
```

[Why id is of type string here?](https://github.com/lukaszwilisowski/domain-repository/blob/main/DISCUSSION.md#6-why-should-i-map-db-objects-to-domain-objects)

---

#3. Use `IDomainRepository` interface in your business services, in places, where you would previously use Mongoose collection or TypeORM repository.

```typescript
const carRepository: IDomainRepository<Car, DbCar>;
```

The first type here (Car) is not persisted (detached) type, the second one (DbCar) is persisted (attached) type. If you only need to read or write data you can also use more narrow interfaces: `IReadDomainRepository` or `IWriteDomainRepository`.

---

#4. Put your IDomainRepository dependency in the constuctor of your business service (or CQRS query / command), like here:

```typescript
export class CarService {
  constructor(private readonly carRepository: IReadDomainRepository<DbCar>) {}

  public async findBestCar(): Promise<DbCar | undefined> {
    return this.carRepository.findOne({ best: true });
  }
}
```

---

#5. Test your domain model and business service first (TDD), using MockedDbRepository implementation.

```typescript
describe('CarService', () => {
  const initialData: DbCar[] = [
    { id: '1', name: 'Volvo', best: false, yearOfProduction: 2000 },
    { id: '2', name: 'Toyota', best: true, yearOfProduction: 2010, sold: new Date() }
  ];

  const mockedRepository = new MockedDBRepository<Car, DbCar>(initialData);
  const carService = new CarService(mockedRepository);

  it('should find best car', async () => {
    const car = await carService.findBestCar();

    expect(car).toBeDefined();
    expect(car!.name).toEqual('Toyota');
  });
});
```

---

#6. Only now, focus on your DB implementation. Defined your DB model and mapping between domain and DB model.
