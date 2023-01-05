import { ObjectLiteral, UpdateQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  ArrayExists,
  ObjectArrayDoesNotExist,
  ObjectArrayExists,
  ObjectDoesNotExist,
  ObjectExists,
  ValueCondition
} from '../../../interfaces/search/search.conditions';
import {
  Clear,
  ClearObject,
  ClearObjectArray,
  Increment,
  NestedUpdate,
  PullEach,
  ValueAction
} from '../../../interfaces/update/update.conditions';
import { addConditionToQueryBuilder } from './filter.helper';

export const isSimpleUpdate = (criteria: Record<string, unknown>, update: Record<string, unknown>): boolean => {
  let isSimpleUpdate = true;

  //is simple criteria?
  for (const key in criteria) {
    if (criteria[key] instanceof ObjectExists || criteria[key] instanceof ObjectArrayExists) {
      isSimpleUpdate = false;
      continue;
    }

    if (criteria[key] instanceof ObjectDoesNotExist || criteria[key] instanceof ObjectArrayDoesNotExist) {
      isSimpleUpdate = false;
      continue;
    }

    if (criteria[key] instanceof ValueCondition) {
      const vc = criteria[key] as ValueCondition<unknown>;
      if (Array.isArray(vc.value)) {
        if (typeof (vc.value as unknown[])[0] === 'object') isSimpleUpdate = false;
      } else if (typeof vc.value === 'object') isSimpleUpdate = false;
    }
  }

  //is simple update?
  for (const key in update) {
    if (update[key] instanceof ClearObject || update[key] instanceof ClearObjectArray) {
      isSimpleUpdate = false;
      continue;
    }

    if (!(update[key] instanceof Set || update[key] instanceof Increment)) {
      isSimpleUpdate = false;
      continue;
    }
  }

  return isSimpleUpdate;
};

export const formatSimpleUpdateQuery = <E extends ObjectLiteral>(
  queryBuilder: UpdateQueryBuilder<E>,
  criteria: Record<string, unknown>,
  update: Record<string, unknown>
): UpdateQueryBuilder<E> => {
  const formattedUpdate: Record<string, unknown> = {};

  for (const key in update) {
    if (update[key] === undefined) continue;
    if (update[key] instanceof NestedUpdate)
      throw new Error('Cannot use formatUpdateQuery with NestedUpdate or NestedArrayUpdate.');

    formattedUpdate[key] = getUpdateQueryValue(key, update[key]);

    //special case for SQL, PullEach can empty the null array, if not checked first
    if (update[key] instanceof PullEach && !(criteria[key] instanceof ArrayExists)) {
      criteria[key] = new ArrayExists();
    }
  }

  //update
  queryBuilder.set(formattedUpdate as QueryDeepPartialEntity<E>);

  //where
  for (const key in criteria) {
    if (criteria[key] === undefined) continue;
    addConditionToQueryBuilder(queryBuilder, key, criteria[key]);
  }

  return queryBuilder;
};

const getUpdateQueryValue = (key: string, action: unknown): unknown => {
  if (action === null) return action;
  if (action instanceof Date) return action;
  if (Array.isArray(action)) return action;
  if (typeof action !== 'object') return action;

  const c = action as Clear;

  switch (c.actionName) {
    case 'Clear':
      return null;
    case 'ClearArray':
      return '{}';
  }

  const a = action as ValueAction<unknown>;

  switch (a.actionName) {
    case 'Set':
      return a.value;
    ///////////////////////
    case 'Increment':
      const numericValue = parseInt(a.value as string);
      return () => `coalesce("${key}", 0) + ${numericValue}`;
    ///////////////////////
    //Push and pull methods have been moved to slow update strategy (because of lack of escaping and sanitizing) -> to be reverted in future.
    // case 'Push':
    //   return () => `"${key}" || '{${a.value}}'`;
    // case 'PushEach':
    //   const pushedValues = a.value as [];
    //   return () => `"${key}" || '{${pushedValues.join(', ')}}'`;
    // case 'Pull':
    //   return () => `array_remove("${key}", '${a.value}')`;
    // case 'PullEach':
    //   const pulledValues = a.value as unknown[];
    //   const v = pulledValues[0];
    //   const arrayTypeString = typeof v === 'string' ? 'text' : Number.isInteger(v) ? 'int' : 'float';
    //   const joinedValues = pulledValues.join(', ');
    //   return () =>
    //     `(select array(select unnest("${key}") except select unnest('{${joinedValues}}'::${arrayTypeString}[])))`;
    ///////////////////////
    default:
      throw new Error('Unknown update action: ' + a.actionName);
  }
};
