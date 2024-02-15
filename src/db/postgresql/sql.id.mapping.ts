import { MapTo, TransformProperty } from 'strict-type-mapper';

export const mapToSqlIntId: TransformProperty<'id', string, number> = MapTo.Property(
  'id',
  (objectId: string) => parseInt(objectId),
  (entityId: number) => entityId.toString()
);
