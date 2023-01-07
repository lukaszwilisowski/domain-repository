import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseSqlEntity {
  /** An SQL Id of the object. */
  @PrimaryGeneratedColumn()
  readonly id!: number;
}
