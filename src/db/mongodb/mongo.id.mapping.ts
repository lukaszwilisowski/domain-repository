import * as mongoose from 'mongoose';
import { MapTo } from 'strict-type-mapper';

export const mapToMongoObjectId = MapTo.Property(
  '_id',
  (objectId: string): mongoose.Types.ObjectId => new mongoose.Types.ObjectId(objectId),
  (entityId: mongoose.Types.ObjectId): string => entityId.toString()
);
