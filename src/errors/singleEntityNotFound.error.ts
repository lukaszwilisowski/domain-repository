export class SingleEntityNotFoundError extends Error {
  public readonly entityName: string;
  public readonly criteria: object;

  public constructor(entityName: string, foundEntities: number, criteria: object) {
    const stringifiedCriteria = JSON.stringify(criteria);

    super(
      `Found ${foundEntities} entities of type: ${entityName} by the following criteria: ${stringifiedCriteria}`
    );

    this.entityName = entityName;
    this.criteria = criteria;
  }
}
