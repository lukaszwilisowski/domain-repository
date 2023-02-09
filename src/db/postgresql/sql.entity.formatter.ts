import { ObjectLiteral, SelectQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { SearchCriteria } from '../../interfaces/search/search.criteria.interface';
import { SearchOptions } from '../../interfaces/search/search.options.interface';
import { UpdateCriteria } from '../../interfaces/update/update.criteria.interface';
import { CompiledMapping } from '../../object-entity-mapper/models/compiled.mapping';
import { formatSelectQuery } from './helpers/filter.helper';
import { formatSimpleUpdateQuery, isSimpleUpdate } from './helpers/update.helper';

export class SqlEntityFormatter<E extends ObjectLiteral> {
  public formatSelectQuery(
    entityName: string,
    queryBuilder: SelectQueryBuilder<E>,
    criteria: SearchCriteria<E>,
    options: SearchOptions<E>,
    compiledMapping: CompiledMapping,
    loadRelations?: boolean
  ): SelectQueryBuilder<E> {
    if (!criteria) return queryBuilder;
    else return formatSelectQuery(entityName, queryBuilder, criteria, options, compiledMapping, loadRelations);
  }

  public isSimpleUpdate(criteria: Record<string, unknown>, update: Record<string, unknown>): boolean {
    return isSimpleUpdate(criteria, update);
  }

  public formatSimpleUpdateQuery(
    queryBuilder: UpdateQueryBuilder<E>,
    criteria: SearchCriteria<E>,
    update: UpdateCriteria<E>
  ): UpdateQueryBuilder<E> {
    if (!criteria || !update) return queryBuilder;
    else return formatSimpleUpdateQuery(queryBuilder, criteria, update);
  }
}
