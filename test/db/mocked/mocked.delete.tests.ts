import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { ITestTicket, ITestTicketAttached } from '../../_models/ticket/ticket.interface';
import { runFindAndDeleteTests } from '../../_templates/find-and-delete';

const findAndDeleteMockedTestSetup = async (): Promise<{
  ticketRepository: IDomainRepository<ITestTicket, ITestTicketAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const ticketRepository = new MockedDBRepository<ITestTicket, ITestTicketAttached>();

  const cleanUp = (): Promise<void> => Promise.resolve();

  return { ticketRepository, cleanUp };
};

runFindAndDeleteTests(findAndDeleteMockedTestSetup);
