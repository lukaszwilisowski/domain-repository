/**
 * Represents primitive property or nested object transformation.
 * @param transformName allows to differentiate between diffrent transformations
 * @type `K` output property name
 * @type `X` input property type
 * @type `Y` output property type
 */
export class TransformProperty<K, X, Y> {
  constructor(
    public readonly transformName: string,
    public readonly targetKey: K,
    public readonly transformer: (objectValue: X) => Y,
    public readonly reverseTransformer: (entityValue: Y) => X
  ) {}
}

/**
 * Represents array element transformation.
 * @param transformArrayName allows to differentiate between diffrent transformations
 * @type `K` output array name
 * @type `X` input array type
 * @type `Y` output array type
 */
export class TransformArray<K, X, Y> {
  constructor(
    public readonly transformArrayName: string,
    public readonly targetKey: K,
    public readonly elementTransformer: (objectValue: X) => Y,
    public readonly reverseElementTransformer: (entityValue: Y) => X
  ) {}
}

/**
 * Represents nested object transformation.
 * @param transformNestedObjectName allows to differentiate between diffrent transformations
 * @type `K` output nested object property name
 * @type `M` nested mapping type
 */
export class TransformNestedObject<K, M> {
  constructor(
    public readonly transformNestedObjectName: string,
    public readonly targetKey: K,
    public readonly nestedMapping: M
  ) {}
}

/**
 * Represents array's of objects element transformation.
 * @param transformArrayOfObjectsName allows to differentiate between diffrent transformations
 * @type `K` output array property name
 * @type `M` nested mapping type
 */
export class TransformArrayOfObjects<K, M> {
  constructor(
    public readonly transformArrayOfObjectsName: string,
    public readonly targetKey: K,
    public readonly nestedMapping: M
  ) {}
}
