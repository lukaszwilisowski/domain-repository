import { HasElementThatMatches, NestedCriteria, ValueCondition } from 'interfaces/search/search.conditions';
import { ObjectId } from 'mongodb';

export const getCriteria = (criteria: Record<string, unknown>): Record<string, unknown> => {
  const formattedCriteria: Record<string, unknown> = {};

  for (const key in criteria) {
    if (criteria[key] === undefined)
      //ignore undefined
      continue;

    if (criteria[key] instanceof NestedCriteria) {
      const nestedCriteria = criteria[key] as NestedCriteria<unknown>;
      const formattedNestedCriteria = getCriteria(nestedCriteria.value as Record<string, unknown>);

      //higher level object must exist
      formattedCriteria[key] = { $exists: true };

      for (const nestedKey in formattedNestedCriteria) {
        //nested object key condition
        formattedCriteria[`${key}.${nestedKey}`] = formattedNestedCriteria[nestedKey];
      }
    } else if (criteria[key] instanceof HasElementThatMatches) {
      const elementCriteria = criteria[key] as HasElementThatMatches<unknown>;
      const formattedElementCriteria = getCriteria(elementCriteria.value as Record<string, unknown>);
      formattedCriteria[key] = { $elemMatch: formattedElementCriteria };
    } else {
      //standard condition
      const condition = changeValueToMongoCriteria(criteria[key]);
      formattedCriteria[key] = condition;
    }
  }

  return formattedCriteria;
};

const changeValueToMongoCriteria = (condition: unknown): unknown => {
  if (
    condition === null ||
    condition instanceof ObjectId ||
    Array.isArray(condition) ||
    typeof condition !== 'object'
  ) {
    return condition;
  }

  const c = condition as ValueCondition<unknown>;

  switch (c.conditionName) {
    case 'Equals':
      return c.value;
    case 'DoesNotEqual':
      return { $ne: c.value };
    ///////////////////////
    case 'Exists':
      return { $exists: true };
    case 'ArrayExists':
      return { $exists: true, $ne: [] };
    case 'ObjectExists':
      return { $exists: true };
    case 'ObjectArrayExists':
      return { $exists: true, $ne: [] };
    ///////////////////////
    case 'DoesNotExist':
      return { $exists: false };
    case 'ArrayDoesNotExist':
      return { $not: { $exists: true, $ne: [] } };
    case 'ObjectDoesNotExist':
      return { $exists: false };
    case 'ObjectArrayDoesNotExist':
      return { $not: { $exists: true, $ne: [] } };
    ///////////////////////
    case 'StartsWith':
      return { $regex: `^${c.value}.*$`, $options: 'i' };
    case 'DoesNotStartWith':
      return { $not: { $regex: `^${c.value}.*$`, $options: 'i' } };
    case 'EndsWith':
      return { $regex: `^.*${c.value}$`, $options: 'i' };
    case 'DoesNotEndWith':
      return { $not: { $regex: `^.*${c.value}$`, $options: 'i' } };
    case 'Contains':
      return { $regex: `^.*${c.value}.*$`, $options: 'i' };
    case 'DoesNotContain':
      return { $not: { $regex: `^.*${c.value}.*$`, $options: 'i' } };
    ///////////////////////
    case 'IsGreaterThan':
      return { $gt: c.value };
    case 'IsGreaterThanOrEqual':
      return { $gte: c.value };
    case 'IsLesserThan':
      return { $lt: c.value };
    case 'IsLesserThanOrEqual':
      return { $lte: c.value };
    ///////////////////////
    case 'IsOneOfTheValues':
      return { $in: c.value };
    case 'IsNoneOfTheValues':
      return { $nin: c.value };
    ///////////////////////
    case 'HasElement':
      return c.value;
    case 'DoesNotHaveElement':
      return { $exists: true, $nin: [c.value] };
    case 'HasAnyOfTheElements':
      return { $in: c.value };
    case 'HasNoneOfTheElements':
      return { $exists: true, $nin: c.value };
    case 'HasAllElements':
      return { $all: c.value };
    ///////////////////////

    default:
      throw new Error('Unknown search condition: ' + condition);
  }
};
