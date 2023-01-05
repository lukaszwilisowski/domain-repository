import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { Column, Entity } from 'typeorm';
import { ITestTicket, ITestTicketAttached } from '../../../../_models/ticket/ticket.interface';
import { BaseSqlEntity } from '../../base.sql.entity';
import { sqlMapToId } from '../../sql.id.mapping';

@Entity('tickets')
export class TestSqlTicketEntity extends BaseSqlEntity implements ITestTicket {
  @Column('text')
  name!: string;

  @Column('text', { nullable: true })
  surname?: string;

  @Column('int')
  price!: number;

  @Column('int')
  counter!: number;

  @Column('int', { array: true, nullable: true })
  seats?: number[];

  @Column('int', { nullable: true })
  level!: number | null;

  @Column('date', { nullable: true })
  validUntil?: Date;
}

export const ticketMapping: Mapping<ITestTicketAttached, TestSqlTicketEntity> = {
  id: sqlMapToId,
  price: 'price',
  counter: 'counter',
  seats: 'seats',
  name: 'name',
  surname: 'surname',
  level: 'level',
  validUntil: 'validUntil'
};
