import { MapTo } from 'object-entity-mapper/interfaces/map.to.interface';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { mapToSqlIntId } from '../../../../../src/db/typeorm-postgresql/sql.id.mapping';
import {
  ITestCharacter,
  ITestCharacterAttached,
  ITestStats,
  ITestStatsAttached
} from '../../../../_models/character/character.interface';
import { BaseSqlEntity } from '../../base.sql.entity';

@Entity('characters_stats')
export class TestSqlStatsEntity extends BaseSqlEntity implements ITestStats {
  @Column('text')
  grade!: string;

  @Column('int')
  damage!: number;

  @Column('int', { nullable: true })
  armor?: number;

  @ManyToOne(() => TestSqlCharacterEntity, (character) => character.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  character!: Relation<TestSqlCharacterEntity>;
}

@Entity('characters')
export class TestSqlCharacterEntity extends BaseSqlEntity implements ITestCharacter {
  @Column('text')
  name!: string;

  @Column('text', { nullable: true })
  surname?: string;

  @Column('int', { array: true, nullable: true })
  scorePoints?: number[];

  @Column('text', { array: true, nullable: true })
  equipment?: string[];

  @Column('int', { nullable: true })
  charLevel?: number;

  @Column('text')
  motto!: string;

  @OneToMany(() => TestSqlStatsEntity, (stats) => stats.character, { eager: true, cascade: true, nullable: true })
  stats?: Relation<TestSqlStatsEntity[]>;

  @Column('date', { nullable: true })
  born?: Date;
}

const statsMapping: Mapping<ITestStatsAttached, TestSqlStatsEntity> = {
  id: mapToSqlIntId,
  grade: 'grade',
  damage: 'damage',
  armor: 'armor'
};

export const characterMapping: Mapping<ITestCharacterAttached, TestSqlCharacterEntity> = {
  id: mapToSqlIntId,
  name: 'name',
  surname: 'surname',
  scorePoints: 'scorePoints',
  equipment: 'equipment',
  charLevel: 'charLevel',
  motto: 'motto',
  stats: MapTo.ArrayOfObjects('stats', statsMapping),
  born: 'born'
};
