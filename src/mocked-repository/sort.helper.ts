export type SortProp = {
  name: string;
  reverse?: boolean;
};

export const generateSortFn = (props: SortProp[]) => {
  return function (a: Record<string, unknown>, b: Record<string, unknown>) {
    for (let i = 0; i < props.length; i++) {
      const name = props[i].name;
      const reverse = props[i].reverse;
      if (!a[name] || (a[name] as number) < (b[name] as number)) return reverse ? 1 : -1;
      if (!b[name] || (a[name] as number) > (b[name] as number)) return reverse ? -1 : 1;
    }

    return 0;
  };
};
