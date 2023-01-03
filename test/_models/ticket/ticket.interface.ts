import { IBaseModelAttached } from '../base.attached.model';

export interface ITestTicket {
  name: string;
  surname?: string;
  price: number;
  counter: number;
  seats?: number[];
  level: number | null;
  validUntil?: Date;
}

export type ITestTicketAttached = ITestTicket & IBaseModelAttached;
