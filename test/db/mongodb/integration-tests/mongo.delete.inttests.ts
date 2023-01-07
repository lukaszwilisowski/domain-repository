import { MongoDbRepository } from 'db/mongodb/mongo.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import mongoose from 'mongoose';
import { ITestTicket, ITestTicketAttached } from '../../../_models/ticket/ticket.interface';
import { runFindAndDeleteTests } from '../../../_templates/find-and-delete';
import { getTicketCollection, TestMongoTicketEntity, ticketMapping } from '../entities/ticket/ticket.entity';

const findAndDeleteMongoTestSetup = async (): Promise<{
  ticketRepository: IDomainRepository<ITestTicket, ITestTicketAttached>;
  cleanUp: () => Promise<void>;
}> => {
  mongoose.set('strictQuery', false);

  await new Promise<void>((resolve) => {
    mongoose.connect('mongodb://localhost:27017/unittestdb', {});
    mongoose.connection.on('open', () => resolve());
  });

  const ticketRepository = new MongoDbRepository<ITestTicket, ITestTicketAttached, TestMongoTicketEntity>(
    getTicketCollection('tickets'),
    ticketMapping
  );

  const cleanUp = (): Promise<void> => mongoose.connection.close();

  return { ticketRepository, cleanUp };
};

runFindAndDeleteTests(findAndDeleteMongoTestSetup);
