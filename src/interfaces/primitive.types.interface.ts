import * as mongoose from 'mongoose';

/** Alias type containing all supported primitive types. */
export type PrimitiveTypes = string | number | Date | boolean | null | mongoose.Types.ObjectId;
