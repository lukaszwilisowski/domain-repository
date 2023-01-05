import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { IDomainRepository } from 'interfaces/repository.interface';
import { SearchBy } from 'interfaces/search/search.by.interface';
import { testTickets } from '../_data/ticket/ticket.data';
import { ITestTicket, ITestTicketAttached } from '../_models/ticket/ticket.interface';

export const runFindAndDeleteTests = (
  repositoryHandler: () => Promise<{
    ticketRepository: IDomainRepository<ITestTicket, ITestTicketAttached>;
    cleanUp: () => Promise<void>;
  }>
): void =>
  describe('findOneAndDelete', () => {
    let ticketRepository: IDomainRepository<ITestTicket, ITestTicketAttached>;
    let cleanUp: () => Promise<void>;

    beforeAll(async () => {
      //initialize repository
      const repositoryResult = await repositoryHandler();

      ticketRepository = repositoryResult.ticketRepository;
      cleanUp = repositoryResult.cleanUp;
    });

    beforeEach(async () => {
      await ticketRepository.createMany(testTickets);
    });

    afterEach(async () => {
      await ticketRepository.findAllAndDelete({});
    });

    afterAll(async () => {
      await cleanUp();
    });

    it('should delete object', async () => {
      await ticketRepository.findOneAndDelete({ price: 10 });
      const all = await ticketRepository.findAll();

      expect(all.length).toBe(1);
      expect(all[0].name).toBe('Mike');
    });

    it('should delete object by Id', async () => {
      const joe = await ticketRepository.findOne({ price: 10 });
      await ticketRepository.findAllAndDelete({ id: joe!.id });
      const all = await ticketRepository.findAll();

      expect(all.length).toBe(1);
      expect(all[0].name).toBe('Mike');
    });

    it('should delete object by IsGreaterThan', async () => {
      await ticketRepository.findOneAndDelete({ price: SearchBy.IsGreaterThan(5) });
      const all = await ticketRepository.findAll();

      expect(all.length).toBe(1);
    });

    it('should delete all objects by IsGreaterThan', async () => {
      const result = await ticketRepository.findAllAndDelete({ price: SearchBy.IsGreaterThan(5) });
      const all = await ticketRepository.findAll();

      expect(result.numberOfDeletedObjects).toBe(2);
      expect(all.length).toBe(0);
    });
  });
