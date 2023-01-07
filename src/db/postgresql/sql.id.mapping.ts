import { MapTo } from '../../object-entity-mapper/interfaces/map.to.interface';
import { TransformProperty } from '../../object-entity-mapper/interfaces/mapping.transforms';

export const mapToSqlIntId: TransformProperty<'id', string, number> = MapTo.Property(
  'id',
  (objectId: string) => parseInt(objectId),
  (entityId: number) => entityId.toString()
);
