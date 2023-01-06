import { SearchCriteria } from './search/search.criteria.interface';
import { UpdateCriteria } from './update/update.criteria.interface';

/**
 * A read-write invariant repository type for domain objects.
 *
 * @typeparam `Detached` is an invariant type of domain object that was not yet persisted. This type contains only manually assignable properties.
 * @typeparam `Attached` is an invariant type of already persisted domain object. This type contains all properties including those set by DB engine.
 */
export interface IDomainRepository<Detached, Attached extends Detached>
  extends IReadDomainRepository<Attached>,
    IWriteDomainRepository<Detached, Attached> {}

/**
 * A read-only invariant repository type for domain objects.
 * @typeparam `Attached` is an invariant type of already persisted domain object. This type contains all properties including those set by DB engine.
 */
export interface IReadDomainRepository<Attached> {
  /**
   * Finds a single object by specified criteria.

   * @param criteria Contains the list of optional properties to search by.
   * To run complex searches, use `SearchBy` conditions. 
   * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
   *
   * @returns An attached object or undefined if object was not found.
   */
  findOne(criteria: SearchCriteria<Attached>): Promise<Attached | undefined>;

  /** 
   * Finds a single object by specified criteria.  

   * @param criteria Contains the list of optional properties to search by.
   * To run complex searches, use `SearchBy` conditions. 
   * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
   * 
   * @throws `SingleEntityNotFound` error if not a single entity was found. 
   * @returns An attached object.
   */
  findOneOrFail(criteria: SearchCriteria<Attached>): Promise<Attached>;

  /**
   * Finds all objects by specified criteria.
   *
   * @param criteria Contains the list of optional properties to search by.
   * To run complex searches, use `SearchBy` conditions.
   * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
   *
   * @returns A list of attached objects.
   */
  findAll(criteria?: SearchCriteria<Attached>): Promise<Array<Attached>>;

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
}

/**
 * A write-only repository for domain objects.
 * @typeparam `Detached` is an invariant type of domain object that was not yet persisted. This type contains only manually assignable properties.
 * @typeparam `Attached` is an invariant type of already persisted domain object. This type contains all properties including those set by DB engine.
 */
export interface IWriteDomainRepository<Detached, Attached extends Detached> {
  /**
   * Creates a new object based on detached entity.
   *
   * @param object Detached object.
   * @returns Attached object.
   */
  create(object: Detached): Promise<Attached>;

  /**
   * Creates a new objects based on array of detached entity.
   *
   * @param objects Array of detached objects.
   * @returns Attached object.
   */
  createMany(objects: Detached[]): Promise<Attached[]>;

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

  /**
   * Finds a single object by specified criteria and deletes it.
   *
   * @param criteria Contains the list of optional properties to search by.
   * To run complex searches, use `SearchBy` conditions.
   * All conditions are `AND`ed. To use (OR) logic, run multiple searches.
   */
  findOneAndDelete(criteria: SearchCriteria<Attached>): Promise<void>;

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
}
