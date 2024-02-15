import { MapTo } from 'strict-type-mapper';

export const mapToSqlIntId = MapTo.Property(
  'id',
  (objectId: string) => parseInt(objectId),
  (entityId: number) => entityId.toString()
);
