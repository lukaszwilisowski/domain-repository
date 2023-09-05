export const getOppositeCondition = (condition: string): string => {
  switch (condition) {
    case 'Equals':
      return 'DoesNotEqual';
    case 'DoesNotEqual':
      return 'Equals';
    ///////////////////////
    case 'Exists':
      return 'DoesNotExist';
    case 'ArrayExists':
      return 'ArrayDoesNotExist';
    ///////////////////////
    case 'DoesNotExist':
      return 'Exists';
    case 'ArrayDoesNotExist':
      return 'ArrayExists';
    ///////////////////////
    case 'StartsWith':
      return 'DoesNotStartWith';
    case 'DoesNotStartWith':
      return 'StartsWith';
    case 'EndsWith':
      return 'DoesNotEndWith';
    case 'DoesNotEndWith':
      return 'EndsWith';
    case 'Contains':
      return 'DoesNotContain';
    case 'DoesNotContain':
      return 'Contains';
    ///////////////////////
    case 'IsGreaterThan':
      return 'IsLesserThanOrEqual';
    case 'IsGreaterThanOrEqual':
      return 'IsLesserThan';
    case 'IsLesserThan':
      return 'IsGreaterThanOrEqual';
    case 'IsLesserThanOrEqual':
      return 'IsGreaterThan';
    ///////////////////////
    case 'IsOneOfTheValues':
      return 'IsNoneOfTheValues';
    case 'IsNoneOfTheValues':
      return 'IsOneOfTheValues';
    ///////////////////////
    case 'HasElement':
      return 'DoesNotHaveElement';
    case 'DoesNotHaveElement':
      return 'HasElement';
    case 'HasAnyOfTheElements':
      return 'HasNoneOfTheElements';
    case 'HasNoneOfTheElements':
      return 'HasAnyOfTheElements';
    case 'HasAllElements':
      return 'HasAllElements';
    ///////////////////////

    default:
      throw new Error('Unknown search condition: ' + condition);
  }
};
