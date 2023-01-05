import * as mongoose from 'mongoose';

export type BaseMongoEntity = {
  /** A MongoDB Id of the object. */
  _id: mongoose.Types.ObjectId;
};
