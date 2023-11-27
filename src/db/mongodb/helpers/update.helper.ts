import { Clear, NestedArrayUpdate, NestedUpdate, ValueAction } from '../../../interfaces/update/update.conditions';

export const getUpdate = (update: Record<string, unknown>): Record<string, unknown> => {
  const formattedUpdate: Record<string, unknown> = {};
  const actionDictionary: Record<string, Record<string, unknown>> = {};

  for (const key in update) {
    if (update[key] === undefined)
      //ignore undefined
      continue;

    if (update[key] instanceof NestedUpdate) {
      const nestedUpdate = update[key] as NestedUpdate<unknown>;
      const formattedNestedUpdate = getUpdate(nestedUpdate.value as Record<string, unknown>);
      const arrayPart = update[key] instanceof NestedArrayUpdate ? '.$[].' : '.';

      for (const nestedKey in formattedNestedUpdate) {
        if (['$unset', '$inc', '$push', '$pull', '$pullAll'].includes(nestedKey)) {
          const action = formattedNestedUpdate[nestedKey] as Record<string, unknown>;

          for (const nestedActionKey in action) {
            //grouping special mongo updates
            if (!actionDictionary[nestedKey]) actionDictionary[nestedKey] = {};
            actionDictionary[nestedKey][`${key}${arrayPart}${nestedActionKey}`] = action[nestedActionKey];
          }
        } else {
          //standard assignment
          formattedUpdate[`${key}${arrayPart}${nestedKey}`] = formattedNestedUpdate[nestedKey];
        }
      }
    } else {
      const [action, value] = getUpdateActionAndValue(update[key]);

      if (action) {
        //grouping special mongo updates
        if (!actionDictionary[action]) actionDictionary[action] = {};
        actionDictionary[action][key] = value;
      } else {
        //standard assignment
        formattedUpdate[key] = value;
      }
    }
  }

  for (const key in actionDictionary) {
    formattedUpdate[key] = actionDictionary[key];
  }

  return formattedUpdate;
};

export const getUpdateActionAndValue = (action: unknown): [string | undefined, unknown] => {
  if (action === null) return [undefined, action];
  if ((action as Record<string, unknown>)['_bsontype'] === 'ObjectID') return [undefined, action];
  if (action instanceof Date) return [undefined, action];
  if (Array.isArray(action)) return [undefined, action];
  if (typeof action !== 'object') return [undefined, action];

  const c = action as Clear;

  switch (c.actionName) {
    case 'Clear':
      return ['$unset', ''];
    case 'ClearArray':
      return ['$unset', ''];
    case 'ClearObject':
      return ['$unset', ''];
    case 'ClearObjectArray':
      return ['$unset', ''];
  }

  const a = action as ValueAction<unknown>;

  switch (a.actionName) {
    case undefined:
      return [undefined, a];
    case 'Set':
      return [undefined, a.value];
    ///////////////////////
    case 'Increment':
      return ['$inc', a.value];
    ///////////////////////
    case 'Push':
      return ['$push', a.value];
    case 'PushEach':
      return ['$push', { $each: a.value }];
    case 'Pull':
      return ['$pull', a.value];
    case 'PullEach':
      return ['$pullAll', a.value];
    ///////////////////////

    default:
      throw new Error('Unknown update action: ' + action);
  }
};
