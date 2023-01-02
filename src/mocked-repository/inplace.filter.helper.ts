import { areDeepEqual } from '../helpers/deep.equality.helper';
import {
  DoesNotExist,
  Exists,
  HasElementThatMatches,
  NestedCriteria,
  ValueCondition
} from '../interfaces/search/search.conditions';
import { SearchCriteria } from '../interfaces/search/search.criteria.interface';

export class InPlaceFilterHelper {
  public getPredicate<A>(criteria?: SearchCriteria<A>): (arrayElement: A) => boolean {
    return (element) => this.matchesCriteria(element, criteria);
  }

  private matchesCriteria<A>(element: A, criteria?: SearchCriteria<A>): boolean {
    for (const key in criteria) {
      if (criteria[key] === undefined)
        //ignore undefined
        continue;

      if (criteria[key] instanceof HasElementThatMatches) {
        if (!element[key]) return false;
        const array = element[key] as unknown[];
        const nestedCriteria = (criteria[key] as NestedCriteria<unknown>).value;
        if (!array.some((e) => this.matchesCriteria(e, nestedCriteria))) return false;
        continue;
      }

      if (criteria[key] instanceof NestedCriteria) {
        if (!element[key]) return false;
        const nestedCriteria = (criteria[key] as NestedCriteria<unknown>).value;
        if (!this.matchesCriteria(element[key], nestedCriteria)) return false;
        continue;
      }

      if (criteria[key] instanceof Exists) {
        const condition = criteria[key] as Exists;
        if (!this.matchesExistCondition(element[key], condition)) return false;
        continue;
      }

      if (criteria[key] instanceof DoesNotExist) {
        const condition = criteria[key] as DoesNotExist;
        if (!this.matchesDoesNotExistCondition(element[key], condition)) return false;
        continue;
      }

      if (criteria[key] instanceof ValueCondition) {
        const condition = criteria[key] as ValueCondition<unknown>;
        if (!this.matchesValueCondition(element[key], condition)) return false;
        continue;
      }

      if (element[key] !== criteria[key]) return false;
    }

    return true;
  }

  private matchesExistCondition(value: unknown, c: Exists): boolean {
    const arrayValue = value as unknown[];

    switch (c.conditionName) {
      case 'Exists':
        return value !== undefined && value !== null;
      case 'ArrayExists':
        return value !== undefined && value !== null && arrayValue.length !== 0;
      case 'ObjectExists':
        return value !== undefined && value !== null;
      case 'ObjectArrayExists':
        return value !== undefined && value !== null && arrayValue.length !== 0;
      ///////////////////////

      default:
        throw new Error('Unknown Exist condition: ' + c.conditionName);
    }
  }

  private matchesDoesNotExistCondition(value: unknown, c: Exists): boolean {
    const arrayValue = value as unknown[];

    switch (c.conditionName) {
      case 'DoesNotExist':
        return value === undefined || value === null;
      case 'ArrayDoesNotExist':
        return value === undefined || value === null || arrayValue.length === 0;
      case 'ObjectDoesNotExist':
        return value === undefined || value === null;
      case 'ObjectArrayDoesNotExist':
        return value === undefined || value === null || arrayValue.length === 0;
      ///////////////////////

      default:
        throw new Error('Unknown DoesNotExist condition: ' + c.conditionName);
    }
  }

  private matchesValueCondition(value: unknown, c: ValueCondition<unknown>): boolean {
    const stringValue = value as string;
    const cString = c.value as string;
    const numericValue = value as number;
    const cNumber = c.value as number;
    const cArray = c.value as unknown[];
    const arrayValue = value as unknown[];

    switch (c.conditionName) {
      case 'Equals':
        return areDeepEqual(value, c.value);
      case 'DoesNotEqual':
        return value === undefined || !areDeepEqual(value, c.value);
      ///////////////////////
      case 'StartsWith':
        return stringValue.toLowerCase().startsWith(cString.toLowerCase());
      case 'DoesNotStartWith':
        return !stringValue.toLowerCase().startsWith(cString.toLowerCase());
      case 'EndsWith':
        return stringValue.toLowerCase().endsWith(cString.toLowerCase());
      case 'DoesNotEndWith':
        return !stringValue.toLowerCase().endsWith(cString.toLowerCase());
      case 'Contains':
        return stringValue.toLowerCase().includes(cString.toLowerCase());
      case 'DoesNotContain':
        return !stringValue.toLowerCase().includes(cString.toLowerCase());
      ///////////////////////
      case 'IsGreaterThan':
        return numericValue > cNumber;
      case 'IsGreaterThanOrEqual':
        return numericValue >= cNumber;
      case 'IsLesserThan':
        return numericValue < cNumber;
      case 'IsLesserThanOrEqual':
        return numericValue <= cNumber;
      ///////////////////////
      case 'IsOneOfTheValues':
        return cArray.includes(value);
      case 'IsNoneOfTheValues':
        return !cArray.includes(value);
      ///////////////////////
      case 'HasElement':
        return arrayValue && arrayValue.includes(c.value);
      case 'DoesNotHaveElement':
        return !arrayValue || !arrayValue.includes(c.value);
      case 'HasAnyOfTheElements':
        return arrayValue && cArray.some((v) => arrayValue.includes(v));
      case 'HasNoneOfTheElements':
        return !arrayValue || !cArray.some((v) => arrayValue.includes(v));
      case 'HasAllElements':
        return arrayValue && cArray.every((v) => arrayValue.includes(v));
      ///////////////////////

      default:
        throw new Error('Unknown value condition: ' + c.conditionName);
    }
  }
}
