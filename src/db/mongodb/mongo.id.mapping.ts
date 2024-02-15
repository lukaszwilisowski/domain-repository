import * as mongoose from 'mongoose';
import { MapTo, TransformProperty } from 'strict-type-mapper';

export const mapToMongoObjectId: TransformProperty<'_id', string, mongoose.Types.ObjectId> = MapTo.Property(
  '_id',
  (objectId: string): mongoose.Types.ObjectId => new mongoose.Types.ObjectId(objectId),
  (entityId: mongoose.Types.ObjectId): string => entityId.toString()
);
