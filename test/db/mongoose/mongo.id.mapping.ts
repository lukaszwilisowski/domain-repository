import { ObjectId } from 'mongodb';
import { MapTo } from 'object-entity-mapper/interfaces/map.to.interface';
import { TransformProperty } from 'object-entity-mapper/interfaces/mapping.transforms';

export const mongoMapTo_id: TransformProperty<'_id', string, ObjectId> = MapTo.Property(
  '_id',
  (objectId: string) => new ObjectId(objectId),
  (entityId: ObjectId) => entityId.toString()
);
