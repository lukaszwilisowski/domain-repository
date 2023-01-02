import { UpdateCriteria } from './update.criteria.interface';

export abstract class Action {
  constructor(public readonly actionName: string) {}
}

export abstract class ValueAction<T> extends Action {
  constructor(public value: T, actionName: string) {
    super(actionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class Set<T> extends ValueAction<T> {
  constructor(value: T, public readonly setActionName = 'Set') {
    super(value, setActionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class Clear extends Action {
  constructor(public readonly clearActionName = 'Clear') {
    super(clearActionName);
  }
}

export class ClearArray extends Clear {
  constructor(public readonly clearArrayActionName = 'ClearArray') {
    super(clearArrayActionName);
  }
}

export class ClearObject extends Clear {
  constructor(public readonly clearObjectActionName = 'ClearObject') {
    super(clearObjectActionName);
  }
}

export class ClearObjectArray extends Clear {
  constructor(public readonly clearObjectArrayActionName = 'ClearObjectArray') {
    super(clearObjectArrayActionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class Increment extends ValueAction<number> {
  constructor(value: number, public readonly incrementActionName = 'Increment') {
    super(value, incrementActionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class Push<T> extends ValueAction<T> {
  constructor(value: T, public readonly pushActionName = 'Push') {
    super(value, pushActionName);
  }
}

export class PushEach<T> extends ValueAction<T[]> {
  constructor(value: T[], public readonly pushEachActionName = 'PushEach') {
    super(value, pushEachActionName);
  }
}

export class Pull<T> extends ValueAction<T> {
  constructor(value: T, public readonly pullActionName = 'Pull') {
    super(value, pullActionName);
  }
}

export class PullEach<T> extends ValueAction<T[]> {
  constructor(value: T[], public readonly pullEachActionName = 'PullEach') {
    super(value, pullEachActionName);
  }
}

/////////////////////////////////////////////////////////////////////////////

export class NestedUpdate<T> extends ValueAction<UpdateCriteria<T>> {
  constructor(value: UpdateCriteria<T>, public readonly nestedUpdateActionName = 'NestedUpdate') {
    super(value, nestedUpdateActionName);
  }
}

export class NestedArrayUpdate<T> extends NestedUpdate<T> {
  constructor(value: UpdateCriteria<T>) {
    super(value, 'NestedArrayUpdate');
  }
}
