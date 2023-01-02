
import { SingleEntityNotFoundError } from 'errors/singleEntityNotFound.error';
import { IDomainRepository } from 'interfaces/repository.interface';
import { InPlaceUpdateHelper } from '../helpers/inplace.update.helper';
import { SearchCriteria } from '../interfaces/search/search.criteria.interface';
import { UpdateCriteria } from '../interfaces/update/update.criteria.interface';
import { InPlaceCreateHelper } from './inplace.create.helper';
import { InPlaceFilterHelper } from './inplace.filter.helper';

/** A mocked repository that stores data in private array of type `A[]`. */
export class MockedDBRepository<T, A extends T> implements IDomainRepository<T, A> {
  private readonly inPlaceFilterHelper: InPlaceFilterHelper;
  private readonly inPlaceUpdateHelper: InPlaceUpdateHelper;
  private readonly inPlaceCreateHelper: InPlaceCreateHelper<A>;

  public constructor(private readonly collection: A[] = []) {
    this.inPlaceFilterHelper = new InPlaceFilterHelper();
    this.inPlaceUpdateHelper = new InPlaceUpdateHelper();
    this.inPlaceCreateHelper = new InPlaceCreateHelper<A>();
  }

  public async findOne(criteria: SearchCriteria<A>): Promise<A | undefined> {
    const predicate = this.inPlaceFilterHelper.getPredicate(criteria);
    return this.collection.find(predicate);
  }

  public async findOneOrFail(criteria: SearchCriteria<A>): Promise<A> {
    const foundObjects = await this.findAll(criteria);

    if (foundObjects.length !== 1)
      throw new SingleEntityNotFoundError('[MockedEntity]', foundObjects.length, criteria);
    else return foundObjects[0];
  }

  public async findAll(criteria?: SearchCriteria<A>): Promise<Array<A>> {
    const predicate = this.inPlaceFilterHelper.getPredicate(criteria);
    return this.collection.filter(predicate);
  }

  public async countAll(criteria: SearchCriteria<A>): Promise<number> {
    const predicate = this.inPlaceFilterHelper.getPredicate(criteria);
    return this.collection.filter(predicate).length;
  }

  public async create(object: T): Promise<A> {
    const attachedObject = this.inPlaceCreateHelper.generateIDsForObject(object as Record<string, unknown>);
    this.collection.push({ ...attachedObject }); //copy of object
    return attachedObject;
  }

  public async createMany(objects: T[]): Promise<A[]> {
    const attachedObjects = [];

    for (const object of objects) {
      const attachedObject = this.inPlaceCreateHelper.generateIDsForObject(object as Record<string, unknown>);
      attachedObjects.push({ ...attachedObject }); //copy of object
    }

    this.collection.push(...attachedObjects);
    return attachedObjects;
  }

  public async findOneAndUpdate(criteria: SearchCriteria<A>, update: UpdateCriteria<T>): Promise<A | undefined> {
    const object = await this.findOne(criteria);

    if (object) {
      const index = this.collection.findIndex((o) => o === object);
      const copy = this.inPlaceCreateHelper.deepCopy(object); //deep copy
      this.inPlaceUpdateHelper.updateInPlace([copy], update);
      const updatedObject = this.inPlaceCreateHelper.generateIDsForObject(copy as Record<string, unknown>);
      this.collection[index] = updatedObject;
      return updatedObject;
    }

    return undefined;
  }

  public async findAllAndUpdate(
    criteria: SearchCriteria<A>,
    update: UpdateCriteria<T>
  ): Promise<{ numberOfUpdatedObjects: number }> {
    const objects = await this.findAll(criteria);

    const indexes = [];
    const copies = [];

    for (const object of objects) {
      indexes.push(this.collection.findIndex((o) => o === object));
      copies.push(this.inPlaceCreateHelper.deepCopy(object));
    }

    const numberOfUpdatedObjects = this.inPlaceUpdateHelper.updateInPlace(copies, update);

    for (let i = 0; i < copies.length; i++) {
      const attachedObject = this.inPlaceCreateHelper.generateIDsForObject(copies[i] as Record<string, unknown>);
      this.collection[indexes[i]] = attachedObject;
    }

    return { numberOfUpdatedObjects };
  }

  public async findOneAndDelete(criteria: SearchCriteria<A>): Promise<void> {
    const object = await this.findOne(criteria);

    const index = this.collection.findIndex((o) => o === object);
    this.collection.splice(index, 1);
  }

  public async findAllAndDelete(criteria: SearchCriteria<A>): Promise<{ numberOfDeletedObjects: number }> {
    const objects = await this.findAll(criteria);
    objects.forEach((obj) => {
      const index = this.collection.findIndex((o) => o === obj);
      this.collection.splice(index, 1);
    });

    return { numberOfDeletedObjects: objects.length };
  }
}
