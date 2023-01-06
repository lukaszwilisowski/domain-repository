import * as mongoose from 'mongoose';
import { MapTo } from 'object-entity-mapper/interfaces/map.to.interface';
import { TransformProperty } from 'object-entity-mapper/interfaces/mapping.transforms';

export const mapToMongoObjectId: TransformProperty<'_id', string, mongoose.Types.ObjectId> = MapTo.Property(
  '_id',
  (objectId: string) => new mongoose.Types.ObjectId(objectId),
  (entityId: mongoose.Types.ObjectId) => entityId.toString()
);
