export const areDeepEqual = (o1: unknown, o2: unknown): boolean => {
  if (o1 === o2) return true;
  if (typeof o1 !== typeof o2) return false;

  if (Array.isArray(o1) && Array.isArray(o2)) {
    const a1 = o1 as unknown[];
    const a2 = o2 as unknown[];
    if (a1.length !== a2.length) return false;
    else return a1.every((v, index) => areDeepEqual(a2[index], v));
  }

  if (typeof o1 === 'object' && typeof o2 === 'object') {
    const obj1 = o1 as Record<string, unknown>;
    const obj2 = o2 as Record<string, unknown>;

    for (const key in obj1) {
      if (!(key in obj2)) return false;
      if (!areDeepEqual(obj1[key], obj2[key])) return false;
    }

    for (const key in obj2) {
      if (!(key in obj1)) return false;
    }

    return true;
  }

  return o1 === o2;
};
