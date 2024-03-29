import { PostgreSQLDbRepository } from 'db/postgresql/sql.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import { DataSource } from 'typeorm';
import { ITestTicket, ITestTicketAttached } from '../../../_models/ticket/ticket.interface';
import { runFindAndDeleteTests } from '../../../_templates/find-and-delete';
import { TestSqlTicketEntity, ticketMapping } from '../entities/ticket/ticket.entity';

const findAndDeleteSqlTestSetup = async (): Promise<{
  ticketRepository: IDomainRepository<ITestTicket, ITestTicketAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    database: 'testdb',
    username: 'postgres',
    password: 'admin',
    synchronize: true,
    entities: [TestSqlTicketEntity]
  });

  await dataSource.initialize();

  const typeORMCarRepository = dataSource.getRepository(TestSqlTicketEntity);

  const ticketRepository = new PostgreSQLDbRepository<ITestTicket, ITestTicketAttached, TestSqlTicketEntity>(
    typeORMCarRepository,
    ticketMapping
  );

  const cleanUp = (): Promise<void> => dataSource.destroy();

  return { ticketRepository, cleanUp };
};

runFindAndDeleteTests(findAndDeleteSqlTestSetup);
