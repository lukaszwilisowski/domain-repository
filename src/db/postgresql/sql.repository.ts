import { Mapping } from 'strict-type-mapper';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { SingleEntityNotFoundError } from '../../errors/singleEntityNotFound.error';
import { InPlaceUpdateHelper } from '../../helpers/inplace.update.helper';
import { IDomainRepository } from '../../interfaces/repository.interface';
import { SearchCriteria } from '../../interfaces/search/search.criteria.interface';
import { SearchOptions } from '../../interfaces/search/search.options.interface';
import { UpdateCriteria } from '../../interfaces/update/update.criteria.interface';
import { ObjectEntityMapper } from '../../object-entity-mapper/object.entity.mapper';
import { SqlEntityFormatter } from './sql.entity.formatter';

/**
 * A generic implementation of entity repository.
 * @typeparam `T` invariant object type.
 * @typeparam `A` invariant attached domain object type.
 * @typeparam `E` invariant DB entity type.
 */
export class PostgreSQLDbRepository<T, A extends T, E extends ObjectLiteral> implements IDomainRepository<T, A> {
  private readonly objectEntityMapper: ObjectEntityMapper<T, A, E>;
  private readonly sqlEntityFormatter: SqlEntityFormatter<E>;
  private readonly inPlaceUpdateHelper: InPlaceUpdateHelper;

  constructor(private readonly typeOrmRepository: Repository<E>, mapping: Mapping<A, E>) {
    this.objectEntityMapper = new ObjectEntityMapper(mapping);
    this.sqlEntityFormatter = new SqlEntityFormatter<E>();
    this.inPlaceUpdateHelper = new InPlaceUpdateHelper();
  }

  private getSelectQuery(
    criteria?: SearchCriteria<A>,
    options?: SearchOptions<A>,
    loadRelations?: boolean
  ): SelectQueryBuilder<E> {
    const entityName = this.typeOrmRepository.metadata.name;
    const compiledMapping = this.objectEntityMapper.getCompiledMapping();
    const queryBuilder = this.typeOrmRepository.createQueryBuilder().select();
    const mappedCriteria = this.objectEntityMapper.mapSearchCriteria(criteria);
    const mappedOptions = this.objectEntityMapper.mapSearchOptions(options);

    return this.sqlEntityFormatter.formatSelectQuery(
      entityName,
      queryBuilder,
      mappedCriteria,
      mappedOptions,
      compiledMapping,
      loadRelations
    );
  }

  public async findOne(criteria: SearchCriteria<A>): Promise<A | undefined> {
    const foundEntity = await this.getSelectQuery(criteria, undefined, true).getOne();
    return foundEntity ? this.objectEntityMapper.mapEntityToAttachedObject(foundEntity) : undefined;
  }

  public async findOneOrFail(criteria: SearchCriteria<A>): Promise<A> {
    const foundEntities = await this.getSelectQuery(criteria, undefined, true).getMany();

    if (foundEntities.length !== 1)
      throw new SingleEntityNotFoundError(
        this.typeOrmRepository.metadata.tableName,
        foundEntities.length,
        criteria
      );

    return this.objectEntityMapper.mapEntityToAttachedObject(foundEntities[0]);
  }

  public async findAll(criteria?: SearchCriteria<A>, options?: SearchOptions<A>): Promise<Array<A>> {
    const foundEntities = await this.getSelectQuery(criteria, options, true).getMany();
    return foundEntities.map((e) => this.objectEntityMapper.mapEntityToAttachedObject(e));
  }

  public async countAll(criteria: SearchCriteria<A>): Promise<number> {
    return await this.getSelectQuery(criteria).getCount();
  }

  public async create(object: T): Promise<A> {
    const mappedEntity = this.objectEntityMapper.mapDetachedObjectToEntity(object);
    const result = await this.typeOrmRepository.save(mappedEntity);
    return this.objectEntityMapper.mapEntityToAttachedObject(result);
  }

  public async createMany(arrayOfObjects: T[]): Promise<A[]> {
    const mappedEntities = arrayOfObjects.map((object: T) =>
      this.objectEntityMapper.mapDetachedObjectToEntity(object)
    );

    const results = await this.typeOrmRepository.save(mappedEntities);
    return results.map((result) => this.objectEntityMapper.mapEntityToAttachedObject(result as E));
  }

  //Postgres does not support updating single entity in an easy way
  //That is why we are using getOne() + save() here
  public async findOneAndUpdate(criteria: SearchCriteria<A>, update: UpdateCriteria<T>): Promise<A | undefined> {
    const entity = await this.getSelectQuery(criteria, undefined, true).getOne();

    if (entity) {
      const mappedUpdate = this.objectEntityMapper.mapUpdate(update);
      this.inPlaceUpdateHelper.updateInPlace([entity], mappedUpdate);
      const savedEntity = await this.typeOrmRepository.save(entity);
      return this.objectEntityMapper.mapEntityToAttachedObject(savedEntity);
    }

    return undefined;
  }

  //This works in two modes: 1) performant update query or 2) slower getMany() + save() fallback for more complex updates
  public async findAllAndUpdate(
    criteria: SearchCriteria<A>,
    update: UpdateCriteria<T>
  ): Promise<{ numberOfUpdatedObjects: number }> {
    const mappedCriteria = this.objectEntityMapper.mapSearchCriteria(criteria);
    const mappedUpdate = this.objectEntityMapper.mapUpdate(update);

    if (this.sqlEntityFormatter.isSimpleUpdate(criteria, update)) {
      const queryBuilder = this.typeOrmRepository.createQueryBuilder().update();
      const query = this.sqlEntityFormatter.formatSimpleUpdateQuery(queryBuilder, mappedCriteria, mappedUpdate);
      const updateResult = await query.execute();

      return { numberOfUpdatedObjects: updateResult.affected || 0 };
    }

    const entities = await this.getSelectQuery(criteria, undefined, true).getMany();
    const numberOfUpdatedObjects = this.inPlaceUpdateHelper.updateInPlace(entities, mappedUpdate);
    await this.typeOrmRepository.save(entities);

    return { numberOfUpdatedObjects };
  }

  //Postgres does not support deleting a single entity in an easy way
  //That is why we are using getOne() + remove() here
  public async findOneAndDelete(criteria: SearchCriteria<A>): Promise<A | undefined> {
    const entity = await this.getSelectQuery(criteria).getOne();
    if (!entity) return undefined;

    await this.typeOrmRepository.remove(entity);
    return this.objectEntityMapper.mapEntityToAttachedObject(entity);
  }

  public async findAllAndDelete(criteria: SearchCriteria<A>): Promise<{ numberOfDeletedObjects: number }> {
    const entities = await this.getSelectQuery(criteria).getMany();
    await this.typeOrmRepository.remove(entities);

    return { numberOfDeletedObjects: entities.length };
  }
}
