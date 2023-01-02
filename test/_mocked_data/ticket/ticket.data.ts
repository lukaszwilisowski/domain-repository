import { ITestTicket } from '../../_models/ticket/ticket.interface';

const testTicket1: ITestTicket = {
  name: 'Joe',
  price: 10,
  counter: 1,
  seats: [1, 2],
  level: 0,
  validUntil: new Date(2020, 1, 1)
};

const testTicket2: ITestTicket = {
  name: 'Mike',
  surname: 'Portnoy',
  price: 30,
  counter: 3,
  level: null
};

export const testTickets: ITestTicket[] = [testTicket1, testTicket2];
