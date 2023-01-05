import { SearchCriteria } from 'interfaces/search/search.criteria.interface';
import { UpdateCriteria } from 'interfaces/update/update.criteria.interface';
import { getCriteria } from './helpers/filter.helper';
import { getUpdate } from './helpers/update.helper';

export class MongoEntityFormatter<E> {
  public formatCriteria(criteria: SearchCriteria<E>): Record<string, unknown> {
    if (!criteria) return {};
    else return getCriteria(criteria);
  }

  public formatUpdate(update: UpdateCriteria<E>): Record<string, unknown> {
    if (!update) return {};
    else return getUpdate(update);
  }
}
