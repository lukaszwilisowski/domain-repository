import { Clear, ValueAction } from '../interfaces/update/update.conditions';
import { areDeepEqual } from './deep.equality.helper';

export class InPlaceUpdateHelper {
  public updateInPlace(entities: unknown[], update: Record<string, unknown>): number {
    const updatedArray: boolean[] = [];

    for (const entity of entities as Record<string, unknown>[]) {
      let updated = false;

      for (const key in update) {
        if (update[key] === undefined)
          //ignore undefined
          continue;

        const updatedValue = this.getUpdatedValue(entity[key], update[key]);

        if (updatedValue !== undefined) {
          entity[key] = updatedValue;
          updated = true;
        }
      }

      updatedArray.push(updated);
    }

    return updatedArray.filter((o) => o).length;
  }

  private getUpdatedValue(currentValue: unknown, action: unknown): unknown {
    if (action === null) return action;
    if (action instanceof Date) return action;
    if (Array.isArray(action)) return action;
    if (typeof action !== 'object') return action;

    const c = action as Clear;

    switch (c.actionName) {
      case 'Clear':
        return currentValue !== null ? null : undefined;
      case 'ClearArray':
        return !currentValue ? [] : (currentValue as []).length !== 0 ? [] : undefined;
      case 'ClearObject':
        return currentValue !== null ? null : undefined;
      case 'ClearObjectArray':
        return !currentValue ? [] : (currentValue as []).length !== 0 ? [] : undefined;
    }

    const a = action as ValueAction<unknown>;

    const currentArray = (currentValue as unknown[]) || [];
    const actionArray = (a.value as unknown[]) || [];
    const currentNumber = (currentValue as number) || 0;
    const actionNumber = a.value as number;

    switch (a.actionName) {
      case undefined:
        if (typeof a === 'object') {
          const sv = (currentValue || {}) as Record<string, unknown>;
          const updatedCount = this.updateInPlace([sv], a as unknown as Record<string, unknown>);
          return !currentValue || updatedCount !== 0 ? sv : undefined;
        }

        return currentValue !== a ? a : undefined;

      case 'Set':
        if (!Array.isArray(a.value) && typeof a.value === 'object') {
          const sv = (currentValue || {}) as Record<string, unknown>;
          const updatedCount = this.updateInPlace([sv], a.value as Record<string, unknown>);
          return !currentValue || updatedCount !== 0 ? sv : undefined;
        }

        return currentValue !== a.value ? a.value : undefined;
      ///////////////////////
      case 'Increment':
        return actionNumber !== 0 ? currentNumber + actionNumber : undefined;
      ///////////////////////
      case 'Push':
        return [...currentArray, a.value];
      case 'PushEach':
        return [...currentArray, ...actionArray];
      case 'Pull':
        const updatedArray1 = currentArray.filter((v) => !areDeepEqual(v, a.value));
        return currentArray.length !== updatedArray1.length ? updatedArray1 : undefined;
      case 'PullEach':
        const updatedArray2 = currentArray.filter((v) => !actionArray.find((pv) => areDeepEqual(v, pv)));
        return currentArray.length !== updatedArray2.length ? updatedArray2 : undefined;
      ///////////////////////
      case 'NestedUpdate':
        const nucv = (currentValue || {}) as Record<string, unknown>;
        const nuCount = this.updateInPlace([nucv], a.value as Record<string, unknown>);
        return !currentValue || nuCount !== 0 ? nucv : undefined;
      case 'NestedArrayUpdate':
        const naucv = (currentValue || []) as Record<string, unknown>[];
        const uauCount = this.updateInPlace(naucv, a.value as Record<string, unknown>);
        return !currentValue || uauCount !== 0 ? naucv : undefined;
      ///////////////////////
      default:
        throw new Error('Unknown update action: ' + a.actionName);
    }
  }
}
