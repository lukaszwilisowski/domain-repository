## Benefits

Properly implemented abstract repository layer solves 3 major development problems:

1. By hiding DB details, allows to easily switch between different databases. This pattern is called **DB as an implementation detail**.
2. Thanks to advanced Typescript checks, takes into consideration additional constraints such as optional and readonly, providing developers with **better intellisense and type-checking**.
3. Offers a mocked repository implementation, which simplifies unit testing and **removes the need to mock any DB dependencies**.

---

## Comparison with standard approach

Classic back-end layered architecture consists of:

- controllers
- business services operating on database models
- database models and repositories (collections)

The main drawback of this approach is leaking database details (you often have to pollute your domain code and business functions with DB implementation details). This code is harder to design (DDD), harder to maintain and harder to test. The simplicity comes at the cost of violating some of the SOLID principles.

The TypeORM framework already improves this landscape, by decoupling models from database settings using Typescript decorators. Still, the business services must operate on TypeORM models and the person creating the business logic must know the exact database design (unless the custom mapper is used).

![](wiki/Classic_repository.png)

Abstract repository layer approach pushes TypeORM improvements even further, by introducing additional abstraction layer over specific DB implementation. The full architecture now consists of:

- constrollers
- domain objects with optional and readonly properties
- business services operating on domain models, using **abtract repository interface**
- specific repository implementation for selected DBs\*
- db models and **custom object-entity mappings**

\*Mongoose MongoDb and TypeORM PostgreSQL are supported right now, more implementations will be added in future.

![](wiki/Domain_repository.png)

---

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

## Discussion

### 1. _What are benefits of DB as an implementation detail pattern?_

The main benefit of this approach comes from SOLID's Liskov substitution principle. You should program to interfaces wherever possible (especially when you can benefit from alternative implementation, for example during testing). You should treat DB technology as detail of your implementation and not your foundational architectural assumption. This obviously raises few doubts and questions:

- _I like my current database. Why would I ever change it?_ Because of market change, new company policy, new features needed, possible savings, scalability factors, team knowledge, etc. There are plenty of reasons, especially in later phases of development.

- _My current database technology matters._ The real question is: _when_ it matters? The success of the your project will mostly depend on your architecture, code quality, ability to change, complexity of your data model and design patterns used. The DB technology can only be a deciding factor in huge ecosystems and real edge cases. But even then it is better to have abstracted data layer.

- _I am using advanced database features._ Offloading too much work to DB engine is a dangerous practice, which can lead to huge maintenance problems. Remember that custom procedures and triggers are costly, maintainance and performance wise. Complex DB designs can be often simplified and most use-cases handled in code.

- _What if I never change my DB?_ Then you still can benefit from domain driven design and simplified testing.

### 2. _Which DB features does IDomainRepository support?_

IDomainRepository supports:

- basic CRUD functions, similarly to Mongoose and TypeORM
- all DB features that are transparent to repository layer (indexes, constraints, triggers, etc.)

IDomainRepository does not support:

- creating and running functions, procedures, views
- creating triggers
- executing custom queries

If you need any of those use-cases, create an additional service with direct dependency to Mongoose or TypeORM repository.

### 3. _Does IDomainRepository support nested objects and nested arrays?_

Yes, IDomainRepository supports nested objects and nested arrays.
If you wonder how those are implemented in concrete databases:

- nested primitive arrays:
  - MongoDb: supported out-of-the-box
  - SQL: as special array column type
- nested objects:
  - MongoDb: supported out-of-the-box
  - SQL: as additional table with one-to-one relationship
- nested object arrays:
  - MongoDb: supported out-of-the-box
  - SQL: as additional table with one-to-many relationship

### 4. _Which functions does IDomainRepository support?_

IDomainRepository supports basic functions that are replicable to all possible DBs and cover vast majority of DB use-cases.

Supported functions have been grouped by type of interface (according to SOLID's Interface segregation principle):

- `IReadDomainRepository<invariant T>`

  - findOne()
  - findOneOrFail()
  - findAll()
  - countAll()

- `IWriteDomainRepository<invariant T>`

  - create()
  - createMany()
  - findOneAndUpdate()
  - findAllAndUpdate()
  - findOneAndDelete()
  - findAllAndDelete()

- `IDomainRepository<invariant T>`:
  - all of above

To be added:

- transactions
- find options: skip(), take(), sort()

Out of scope:

- findById() - not replicable (some SQL tables have no id), instead use findOne({ id }) when necessary
- DB-specific update and search methods: not replicable to other DBs. If you need any of those use-cases, create an additional service with direct dependency to Mongoose or TypeORM repository.

### 5. _Is IDomainRepository performant?_

Yes, with small exceptions.

The performance of MongoDb searches and queries is equal to the performance of native Mongoose methods.

The performance of SQL searches and direct updates is equal to the performance of native TypeORM methods.

Note! When updating nested arrays and objects in SQL database, we cannot use direct queries (mapping to additional tables is too complicated). Instead we are using save() method which can be slow in some circumstances (for example when updating a large number or nested elements). In most use-cases this performance drop is negligible for updates (from user's UX perspective). In case, where it is not, please use additional service with direct dependency to Mongoose or TypeORM repository.

### 6. _Why should I map DB objects to domain objects?_

Because of SOLID's Single-responsibility principle. You should not operate on objects, whose functions you do not need (for example heavy Mongoose documents). You should never pass more data than you need (for simplicity and security purposes). Also, the mapping gives you additional flexibility, decouples DB implementation from domain model, and allows to change both domain and DB models asynchronously, without breaking the contract.

For example, we recommend that your **attached models have string id** (id is usually read, persisted or compared, but not numerically processed). This way, domain ID can be mapped to both MongoDB ObjectId and SQL numeric id. Without mappings, it would be impossible to have the same id mapped to different data types in different databases.

### 7. _Why should I care for optional and readonly properties?_

The same reason we care for typing variables: to get most of Typescript compile-time checks. The better designed is your domain model, the better for everyone. Our repository checks that you do not run forbidden actions:

- check if property exists, if that property is _not_ optional
- clear property (delete or set to NULL depending on DB), if that property is _not_ optional
- update property, if that property is readonly

### 8. _I already use specific businesss repositories. Can I switch to IDomainRepository?_

Yes. The two main approaches to implementing repositories are:

- using generic repositories (Mongoose collection, TypeORM repository) in more specific business functions (or CQRS queries / commands)

```typescript
class OrderService {
  public findOrder(orderName: string): IOrderAttached {
    return this.genericRepository.findOne({ name: orderName });
  }
}
```

- using specific repositories for each type of db entity, in business functions (or CQRS queries / commands)

```typescript
class OrderService {
  public findOrder(orderName: string): IOrderAttached {
    return this.orderRepository.findOrderByName(orderName);
  }
}
```

The latter approach has important advantages over the former one, especially when each repository has a dedicated interface which can be implemented (mocked) for testing purposes. But, it is also more verbose.

IDomainRepository can be also used with specific repository. In this case, leave your repository interface untouched, but change its implementation by using our IDomainRepository as its sub-dependency.

### 9. _Are you planning to add fluent API?_

Maybe. Fluent API works best for automated purposes. This repository is created mostly
for best developer's experience, so there are different end goals. But there are common use-cases to be considered in future.

### 10. _Can IDomainRepository be used with DI framework?_

Of course. Please see our documentation for concrete implementations:
