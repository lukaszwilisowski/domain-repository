import mongoose from 'mongoose';
import { SingleEntityNotFoundError } from '../../errors/singleEntityNotFound.error';
import { IDomainRepository } from '../../interfaces/repository.interface';
import { SearchCriteria } from '../../interfaces/search/search.criteria.interface';
import { SearchOptions } from '../../interfaces/search/search.options.interface';
import { UpdateCriteria } from '../../interfaces/update/update.criteria.interface';
import { Mapping } from '../../object-entity-mapper/interfaces/mapping.interface';
import { ObjectEntityMapper } from '../../object-entity-mapper/object.entity.mapper';
import { MongoEntityFormatter } from './mongo.entity.formatter';

/**
 * A generic implementation of entity repository.
 * @typeparam `T` invariant object type.
 * @typeparam `A` invariant attached domain object type.
 * @typeparam `E` invariant DB entity type.
 */
export class MongoDbRepository<T, A extends T, E> implements IDomainRepository<T, A> {
  private readonly objectEntityMapper: ObjectEntityMapper<T, A, E>;
  private readonly mongoEntityFormatter: MongoEntityFormatter<E>;

  constructor(private readonly mongooseCollection: mongoose.Model<E>, mapping: Mapping<A, E>) {
    this.objectEntityMapper = new ObjectEntityMapper(mapping);
    this.mongoEntityFormatter = new MongoEntityFormatter();
  }

  private getCriteria(criteria?: SearchCriteria<A>): object {
    const mappedCriteria = this.objectEntityMapper.mapSearchCriteria(criteria);
    return this.mongoEntityFormatter.formatCriteria(mappedCriteria);
  }

  private getUpdate(update: UpdateCriteria<T>): object {
    const mappedUpdate = this.objectEntityMapper.mapUpdate(update);
    return this.mongoEntityFormatter.formatUpdate(mappedUpdate);
  }

  public async findOne(criteria: SearchCriteria<A>): Promise<A | undefined> {
    const searchCriteria = this.getCriteria(criteria);
    const foundEntity = await this.mongooseCollection.findOne(searchCriteria);
    return foundEntity ? this.objectEntityMapper.mapEntityToAttachedObject(foundEntity) : undefined;
  }

  public async findOneOrFail(criteria: SearchCriteria<A>): Promise<A> {
    const searchCriteria = this.getCriteria(criteria);
    const foundEntities = await this.mongooseCollection.find(searchCriteria);

    if (foundEntities.length !== 1)
      throw new SingleEntityNotFoundError(
        this.mongooseCollection.collection.name,
        foundEntities.length,
        searchCriteria
      );

    return this.objectEntityMapper.mapEntityToAttachedObject(foundEntities[0]);
  }

  public async findAll(criteria?: SearchCriteria<A>, options?: SearchOptions<A>): Promise<Array<A>> {
    const searchCriteria = this.getCriteria(criteria);
    const searchOptions = this.objectEntityMapper.mapSearchOptions(options);
    const formattedOptions = { ...searchOptions, sort: searchOptions.sortBy };

    const foundEntities = await this.mongooseCollection.find(searchCriteria, undefined, formattedOptions);
    return foundEntities.map((e) => this.objectEntityMapper.mapEntityToAttachedObject(e));
  }

  public async countAll(criteria: SearchCriteria<A>): Promise<number> {
    const searchCriteria = this.getCriteria(criteria);
    return this.mongooseCollection.count(searchCriteria);
  }

  public async create(object: T): Promise<A> {
    const mappedEntity = this.objectEntityMapper.mapDetachedObjectToEntity(object);
    const result = await this.mongooseCollection.create(mappedEntity);
    return this.objectEntityMapper.mapEntityToAttachedObject(result);
  }

  public async createMany(arrayOfObjects: T[]): Promise<A[]> {
    const mappedEntities = arrayOfObjects.map((object: T) =>
      this.objectEntityMapper.mapDetachedObjectToEntity(object)
    );

    const results = await this.mongooseCollection.insertMany(mappedEntities);
    return results.map((result) => this.objectEntityMapper.mapEntityToAttachedObject(result));
  }

  public async findOneAndUpdate(criteria: SearchCriteria<A>, update: UpdateCriteria<T>): Promise<A | undefined> {
    const searchCriteria = this.getCriteria(criteria);
    const updateObject = this.getUpdate(update);

    const updateResult = await this.mongooseCollection.findOneAndUpdate(searchCriteria, updateObject, {
      new: true
    });

    return updateResult ? this.objectEntityMapper.mapEntityToAttachedObject(updateResult) : undefined;
  }

  public async findAllAndUpdate(
    criteria: SearchCriteria<A>,
    update: UpdateCriteria<T>
  ): Promise<{ numberOfUpdatedObjects: number }> {
    const searchCriteria = this.getCriteria(criteria);
    const updateObject = this.getUpdate(update);

    const updateResult = await this.mongooseCollection.updateMany(searchCriteria, updateObject);
    return { numberOfUpdatedObjects: updateResult.modifiedCount };
  }

  public async findOneAndDelete(criteria: SearchCriteria<A>): Promise<A | undefined> {
    const searchCriteria = this.getCriteria(criteria);
    const result = await this.mongooseCollection.findOneAndDelete(searchCriteria);
    return result ? this.objectEntityMapper.mapEntityToAttachedObject(result) : undefined;
  }

  public async findAllAndDelete(criteria: SearchCriteria<A>): Promise<{ numberOfDeletedObjects: number }> {
    const searchCriteria = this.getCriteria(criteria);
    const deleteResult = await this.mongooseCollection.deleteMany(searchCriteria);
    return { numberOfDeletedObjects: deleteResult.deletedCount || 0 };
  }
}
