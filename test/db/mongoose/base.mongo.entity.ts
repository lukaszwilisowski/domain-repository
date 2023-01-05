import { ObjectId } from 'mongodb';

export type BaseMongoEntity = {
  /** A MongoDB Id of the object. */
  _id: ObjectId;
};
