import { SearchCriteria } from './search.criteria.interface';

export abstract class Condition {
  constructor(public readonly conditionName: string) {}
}

export abstract class ValueCondition<T> extends Condition {
  constructor(public value: T, conditionName: string) {
    super(conditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class Equals<T> extends ValueCondition<T> {
  constructor(value: T, public readonly equalsConditionName = 'Equals') {
    if (Array.isArray(value) && (value as []).length === 0)
      throw new Error('Equals([]) is not unsupported! To check if array does not exist, use DoesNotExist().');

    super(value, equalsConditionName);
  }
}

export class DoesNotEqual<T> extends ValueCondition<T> {
  constructor(value: T, public readonly doesNotEqualConditionName = 'DoesNotEqual') {
    if (Array.isArray(value) && (value as []).length === 0)
      throw new Error('DoesNotEqual([]) is not unsupported! To check if array exists, use Exists().');

    super(value, doesNotEqualConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class Exists extends Condition {
  constructor(public readonly existsConditionName = 'Exists') {
    super(existsConditionName);
  }
}

export class ArrayExists extends Exists {
  constructor(public readonly arrayExistsConditionName = 'ArrayExists') {
    super(arrayExistsConditionName);
  }
}

export class ObjectExists extends Exists {
  constructor(public readonly objectExistsConditionName = 'ObjectExists') {
    super(objectExistsConditionName);
  }
}

export class ObjectArrayExists extends Exists {
  constructor(public readonly objectArrayExistsConditionName = 'ObjectArrayExists') {
    super(objectArrayExistsConditionName);
  }
}

export class DoesNotExist extends Condition {
  constructor(public readonly existsConditionName = 'DoesNotExist') {
    super(existsConditionName);
  }
}

export class ArrayDoesNotExist extends DoesNotExist {
  constructor(public readonly arrayDoesNotExistConditionName = 'ArrayDoesNotExist') {
    super(arrayDoesNotExistConditionName);
  }
}

export class ObjectDoesNotExist extends DoesNotExist {
  constructor(public readonly objectDoesNotExistConditionName = 'ObjectDoesNotExist') {
    super(objectDoesNotExistConditionName);
  }
}

export class ObjectArrayDoesNotExist extends DoesNotExist {
  constructor(public readonly objectArrayDoesNotExistConditionName = 'ObjectArrayDoesNotExist') {
    super(objectArrayDoesNotExistConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class StartsWith extends ValueCondition<string> {
  constructor(value: string, public readonly startsWithConditionName = 'StartsWith') {
    super(value, startsWithConditionName);
  }
}

export class DoesNotStartWith extends ValueCondition<string> {
  constructor(value: string, public readonly doesNotStartWithConditionName = 'DoesNotStartWith') {
    super(value, doesNotStartWithConditionName);
  }
}

export class EndsWith extends ValueCondition<string> {
  constructor(value: string, public readonly endsWithConditionName = 'EndsWith') {
    super(value, endsWithConditionName);
  }
}

export class DoesNotEndWith extends ValueCondition<string> {
  constructor(value: string, public readonly doesNotEndWithConditionName = 'DoesNotEndWith') {
    super(value, doesNotEndWithConditionName);
  }
}

export class Contains extends ValueCondition<string> {
  constructor(value: string, public readonly containsConditionName = 'Contains') {
    super(value, containsConditionName);
  }
}

export class DoesNotContain extends ValueCondition<string> {
  constructor(value: string, public readonly doesNotContainConditionName = 'DoesNotContain') {
    super(value, doesNotContainConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class IsGreaterThan<T extends number | Date> extends ValueCondition<T> {
  constructor(value: T, public readonly isGreaterThanConditionName = 'IsGreaterThan') {
    super(value, isGreaterThanConditionName);
  }
}

export class IsGreaterThanOrEqual<T extends number | Date> extends ValueCondition<T> {
  constructor(value: T, public readonly isGreaterThanOrEqualConditionName = 'IsGreaterThanOrEqual') {
    super(value, isGreaterThanOrEqualConditionName);
  }
}

export class IsLesserThan<T extends number | Date> extends ValueCondition<T> {
  constructor(value: T, public readonly isLesserThanConditionName = 'IsLesserThan') {
    super(value, isLesserThanConditionName);
  }
}

export class IsLesserThanOrEqual<T extends number | Date> extends ValueCondition<T> {
  constructor(value: T, public readonly isLesserThanOrEqualConditionName = 'IsLesserThanOrEqual') {
    super(value, isLesserThanOrEqualConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class IsOneOfTheValues<T> extends ValueCondition<T[]> {
  constructor(value: T[], public readonly isOneOfTheValuesConditionName = 'IsOneOfTheValues') {
    super(value, isOneOfTheValuesConditionName);
  }
}

export class IsNoneOfTheValues<T> extends ValueCondition<T[]> {
  constructor(value: T[], public readonly isNoneOfTheValuesConditionName = 'IsNoneOfTheValues') {
    super(value, isNoneOfTheValuesConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class HasElement<T> extends ValueCondition<T> {
  constructor(value: T, public readonly hasElementConditionName = 'HasElement') {
    super(value, hasElementConditionName);
  }
}

export class DoesNotHaveElement<T> extends ValueCondition<T> {
  constructor(value: T, public readonly doesNotHaveElementConditionName = 'DoesNotHaveElement') {
    super(value, doesNotHaveElementConditionName);
  }
}

export class HasAnyOfTheElements<T> extends ValueCondition<T[]> {
  constructor(value: T[], public readonly hasAnyOfTheElementsConditionName = 'HasAnyOfTheElements') {
    super(value, hasAnyOfTheElementsConditionName);
  }
}

export class HasNoneOfTheElements<T> extends ValueCondition<T[]> {
  constructor(value: T[], public readonly hasNoneOfTheElementsConditionName = 'HasNoneOfTheElements') {
    super(value, hasNoneOfTheElementsConditionName);
  }
}

export class HasAllElements<T> extends ValueCondition<T[]> {
  constructor(value: T[], public readonly hasAllElementsConditionName = 'HasAllElements') {
    super(value, hasAllElementsConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class NestedCriteria<T> extends ValueCondition<SearchCriteria<T>> {
  constructor(value: SearchCriteria<T>, public readonly nestedCriteriaConditionName = 'NestedCriteria') {
    super(value, nestedCriteriaConditionName);
  }
}

export class HasElementThatMatches<T> extends NestedCriteria<T> {
  constructor(
    value: SearchCriteria<T>,
    public readonly hasElementThatMatchesConditionName = 'HasElementThatMatches'
  ) {
    super(value, hasElementThatMatchesConditionName);
  }
}

/////////////////////////////////////////////////////////////////////////////
