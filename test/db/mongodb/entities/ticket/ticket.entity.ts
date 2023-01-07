import { mapToMongoObjectId } from 'db/mongodb/mongo.id.mapping';
import mongoose, { Schema } from 'mongoose';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { ITestTicket, ITestTicketAttached } from '../../../../_models/ticket/ticket.interface';
import { BaseMongoEntity } from '../../base.mongo.entity';

const TicketSchema = new Schema<ITestTicket>({
  price: {
    type: Number,
    required: true
  },
  counter: {
    type: Number,
    required: true
  },
  seats: {
    type: [Number],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: false
  },
  level: {
    type: Number,
    required: false
  },
  validUntil: {
    type: Date,
    required: false
  }
});

export type TestMongoTicketEntity = ITestTicket & BaseMongoEntity;

export const getTicketCollection = (collectionName: string) =>
  mongoose.model<TestMongoTicketEntity>(collectionName, TicketSchema);

export const ticketMapping: Mapping<ITestTicketAttached, TestMongoTicketEntity> = {
  id: mapToMongoObjectId,
  price: 'price',
  counter: 'counter',
  seats: 'seats',
  name: 'name',
  surname: 'surname',
  level: 'level',
  validUntil: 'validUntil'
};
