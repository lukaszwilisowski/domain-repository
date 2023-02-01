import mongoose from 'mongoose';

export type DeskObject = {
  id: string;
};

export type DeskMongoObject = {
  _id: mongoose.Types.ObjectId;
};
