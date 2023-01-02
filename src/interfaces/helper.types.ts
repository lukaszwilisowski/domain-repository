/** Checks if two types are equal, not only mutually assignable. */
export type IfEquals<X, Y, P> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? P : never;

/** Returns only mutable (non-readonly) properties of type. */
export type MutablePropsOf<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>;
}[keyof T];

export type NoInfer<T> = [T][T extends unknown ? 0 : never];
