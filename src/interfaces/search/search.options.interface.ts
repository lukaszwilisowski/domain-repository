type Temp<T> = {
  [P in keyof T]: T[P] extends string | number | Date | undefined ? P : never;
};

type SortableKeys<T> = Temp<T>[keyof T];

export type SortOptions<T> = {
  [P in SortableKeys<T>]?: 'asc' | 'desc';
};

/**
 * Additional search options:
 *
 * @param skip ignores first N results.
 * @param limit returns first N results (it is recommended to use skip() and limit() together).
 * @param sortBy Sorts the results by specified properties of type: String, Number or Date.
 * NULLS are returned first and considered on the first query only.
 */
export type SearchOptions<T> = {
  /** Ignores first N results. */
  skip?: number;

  /** Returns first N results (it is recommended to use skip() and limit() together). */
  limit?: number;

  /**
   * Sorts the results by specified properties of type: String, Number or Date.
   * NULLS are returned first and considered on the first query only.
   */
  sortBy?: SortOptions<T>;
};
