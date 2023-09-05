# IDomainRepository API

Domain repository has a similar API to Mongoose collection or TypeORM repository, with some important caveats. It is more limited (for inter-supportability pusposes) but also more strictly typed. It allows to perform CRUD operations on domain objects, including **any type of properties, arrays and nested objects**.

The interface has currently 3 implementations:

- MockedDBRepository, for simulated, in-memory database
- MongoDbRepository, a Mongoose implementation for MongoDB database
- PostgreSQLDbRepository, a TypeORM implementation for PostgreSQL database

More implementaitons will be added in future. It is crutial to understand that **any repository function works in any database**. There are no abstraction leaks that we know of at the moment, that is features that work in one repository but do not work in others.

For more information see: [Discussion](https://github.com/lukaszwilisowski/domain-repository/blob/main/DISCUSSION.md), API examples can be found [here](https://github.com/lukaszwilisowski/domain-repository/tree/main/test/_templates).

---

## IDomainReadRepository

`IDomainReadRepository<Attached>` is a invariant, read-only part of full `IDomainRepository<Detached, Attached>` interface. It allows to search for objects in given database, using the following methods:

- findOne()
- findOneOrFail()
- findAll()
- countAll()

```typescript
/**
 * Finds a single object by specified criteria.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @returns An attached object or undefined if object was not found.
 */
findOne(criteria: SearchCriteria<Attached>): Promise<Attached | undefined>;
```

```typescript
/**
 * Finds a single object by specified criteria.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @throws `SingleEntityNotFound` error if not a single entity was found.
 * @returns An attached object.
 */
findOneOrFail(criteria: SearchCriteria<Attached>): Promise<Attached>;
```

```typescript
/**
 * Finds all objects by specified criteria.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @param options specifies additional result options (skip, limit, sort).
 *
 * @returns A list of attached objects.
 */
findAll(criteria?: SearchCriteria<Attached>, options?: SearchOptions<Attached>): Promise<Attached[]>;
```

```typescript
/**
 * Counts the number of objects by specified criteria.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @returns A number of found objects.
 */
countAll(criteria: SearchCriteria<Attached>): Promise<number>;
```

Each of those methods uses `SearchCriteria<Attached>`:

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

---

The advanced search functions are available through `SearchBy` helper that can be imported from:

```typescript
import { SearchBy } from 'domain-repository';
```

Please note, that **Typescript will show error if you try to call unsupported** action.

Search functions applicable to all property types:

- `SearchBy.Equals()`: takes an argument of compatible type, matches value
- `SearchBy.DoesNotEqual()`: takes as as argument of compatible type, does not match value

Search functions applicable to all primitives:

- `SearchBy.IsOneOfTheValues()`: takes as array of compatible values, matches any
- `SearchBy.IsNoneOfTheValues()`: takes as array of compatible values, matches none
- `SearchBy.Exists()`: applies to optional primitives only, takes no arguments:
  - matches existing property value in MongoDb (including NULL)
  - matches non-NULL value in SQL databases
- `SearchBy.DoesNotExists()`: applies to optional primitives only, takes no arguments:
  - matches missing property value in MongoDb (does not check for null value which is possible in MongoDb and can be useful in some scenarios)
  - matches NULL value in SQL databases

Search functions applicable to strings:

- `SearchBy.StartsWith()`: takes a string, matches a string which starts with a value
- `SearchBy.DoesNotStartWith()`: takes a string, matches a string which does not start with a value
- `SearchBy.EndsWith()`: takes a string, matches a string which ends with a value
- `SearchBy.DoesNotStartWith()`: takes a string, matches a string which does not end with a value
- `SearchBy.Contains()`: takes a string, matches a string which contains a value
- `SearchBy.DoesNotContain()`: takes a string, matches a string which does not contain a value

Search functions applicable to numbers and Dates:

- `SearchBy.IsGreaterThan()`: takes a date or number, matches a date or number which is greater than value
- `SearchBy.IsGreaterThanOrEqual()`: takes a date or number, matches a date or number which is greater than or equal value
- `SearchBy.IsLesserThan()`: takes a date or number, matches a date or number which is lesser than value
- `SearchBy.IsLesserThanOrEqual()`: takes a date or number, matches a date or number which is lesser than or equal value

Search functions applicable to arrays of primitives:

- `SearchBy.HasElement()`: takes a compatible array element, matches an array which has value
- `SearchBy.DoesNotHaveElement()`: takes a compatible array element, matches an array which does not have value
- `SearchBy.HasAnyOfTheElements()`: takes an array of compatible elements, matches an array which has any of the values
- `SearchBy.HasNoneOfTheElements()`: takes an array of compatible elements, matches an array which has none of the values
- `SearchBy.HasAllElements()`: takes an array of compatible elements, matches an array which has all of the values
- `SearchBy.ArrayExists()`: applies to optional arrays only, takes no arguments:
  - matches existing and **non-empty (!)** array in MongoDb (assuming the higher level object exists)
  - matches non-empty array in SQL databases
- `SearchBy.DoesNotExists()`: applies to optional arrays only, takes no arguments:
  - matches non-existing or **empty (!)** array in MongoDb (assuming the higher level object exists)
  - matches empty array in SQL databases

Search functions applicable to nested object arrays:

- `SearchBy.HasElementThatMatches()`: takes a nested criteria, matches an array which has at least one element that matches the nested criteria
- `SearchBy.HasNoElementThatMatches()`: takes a nested criteria, matches an array which have no elements that match the nested criteria
- `SearchBy.ObjectArrayExists()`: applies to optional object arrays only, takes no arguments:
  - matches existing and **non-empty (!)** object array in MongoDb (assuming the higher level object exists)
  - matches non-empty related collection in SQL databases
- `SearchBy.ObjectDoesNotExists()`: applies to optional object arrays only, takes no arguments:
  - matches non-existing or **empty (!)** object array in MongoDb (assuming the higher level object exists)
  - matches empty related collection in SQL databases

Search functions applicable to nested objects:

- `SearchBy.NestedCriteria()`: takes a nested criteria, matches nested criteria
- `SearchBy.ObjectExists()`: applies to optional objects only, takes no arguments:
  - matches existing object in MongoDb (assuming the higher level object exists)
  - matches non-empty related collection in SQL databases
- `SearchBy.ObjectDoesNotExists()`: applies to optional objects only, takes no arguments:
  - matches non-existing object in MongoDb (assuming the higher level object exists)
  - matches empty related collection in SQL databases

---

## IDomainWriteRepository

`IDomainWriteRepository<Detached, Attached>` is a invariant, write-only part of full `IDomainRepository<Detached, Attached>` interface. It allows to insert, update and delete objects in given database, using the following methods:

- create()
- createMany()
- findOneAndUpdate()
- findAllAndUpdate()
- findOneAndDelete()
- findAllAndDelete()

```typescript
/**
 * Creates a new object based on detached entity.
 *
 * @param object Detached object.
 * @returns Attached object.
 */
create(object: Detached): Promise<Attached>;
```

```typescript
/**
 * Creates a new objects based on array of detached entity.
 *
 * @param objects Array of detached objects.
 * @returns Attached object.
 */
createMany(objects: Detached[]): Promise<Attached[]>;
```

```typescript
/**
 * Finds a single object by specified criteria and updates it.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @param update Contains the list of properties to update.
 * To run complex updates, use `UpdateWith` options.
 *
 * @returns Attached object or undefined if object was not found.
 */
findOneAndUpdate(
  criteria: SearchCriteria<Attached>,
  update: UpdateCriteria<Detached>
): Promise<Attached | undefined>;
```

```typescript
/**
 * Finds all objects that meet specified criteria and updates them.
 *
 * @param update Contains the list of properties to update.
 * To run complex updates, use `UpdateWith` options.
 *
 * @returns Object with a number of updated entities.
 */
findAllAndUpdate(
  criteria: SearchCriteria<Attached>,
  update: UpdateCriteria<Detached>
): Promise<{ numberOfUpdatedObjects: number }>;
```

```typescript
/**
 * Finds a single object by specified criteria and deletes it.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @returns Attached object or undefined if object was not found.
 */
findOneAndDelete(criteria: SearchCriteria<Attached>): Promise<Attached | undefined>;
```

```typescript
/**
 * Finds all objects that meet specified criteria and deletes them. Returns an object with a number of deleted entities.
 *
 * @param criteria Contains the list of optional properties to search by.
 * To run complex searches, use `SearchBy` conditions.
 * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
 *
 * @returns Object with a number of deleted entities.
 */
findAllAndDelete(criteria: SearchCriteria<Attached>): Promise<{ numberOfDeletedObjects: number }>;
```

The update and delete methods use `SearchCriteria<Attached>` described before. The updates methods use `UpdateCriteria<Detached>`:

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

---

The advanced update functions are available through `UpdateWith` helper that can be imported from:

```typescript
import { UpdateWith } from 'domain-repository';
```

Please note, that **Typescript will show error if you try to call unsupported** action.

Update functions applicable to all property types:

- `UpdateWith.Set()`: takes an argument of compatible type, sets value
- `UpdateWith.Clear()`: applies to optional primitives only, takes no arguments:
  - deletes property in MongoDB
  - sets propety to NULL in SQL databases

Update functions applicable to number types:

- `UpdateWith.Increment()`: takes a number, increments property by value

Update functions applicable to array types (both primitive arrays and object arrays):

- `UpdateWith.Push()`: takes an array element of compatible type, pushes it to the array
- `UpdateWith.PushEach()`: takes an array of compatibles elements, pushes them to the array
- `UpdateWith.Pull()`: takes an array element of compatible type, pulls them from the array
- `UpdateWith.PullEach()`: takes an array of compatibles elements, pulls them from the array
- `UpdateWith.ClearArray()`: applicable to primitive arrays, takes no arguments, sets an **empty (!)** array
- `UpdateWith.ClearObjectArray()`: applicable to object arrays, takes no arguments, sets an **empty (!)** array

Update functions applicable only to nested object arrays:

- `UpdateWith.NestedArrayUpdate()`: takes a partial object of array element type, updates all array elements

Update functions applicable to nested objects:

- `UpdateWith.NestedUpdate()`: takes a partial update of compatible type, updates the nested object
  - it is highly recommended to **check if nested object exists before calling nested update**, because if object does not exist, an udpate will create a new object with only updated properties (this breaks the domain model contract and can result in difficult to trace bugs)
- `UpdateWith.ClearObject()`: takes no arguments:
  - deletes a nested object property in MongoDB
  - sets relation to NULL in SQL databases
