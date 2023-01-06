import { MapTo } from 'object-entity-mapper/interfaces/map.to.interface';
import { Mapping } from 'object-entity-mapper/interfaces/mapping.interface';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm';
import { mapToSqlIntId } from '../../../../../src/db/typeorm-postgresql/sql.id.mapping';
import {
  ITestAdvanced,
  ITestAdvancedAttached,
  ITestCar,
  ITestCarAttached,
  ITestFeatures,
  ITestFeaturesAttached,
  ITestPart,
  ITestPartAttached,
  TestColor,
  TestFuelType
} from '../../../../_models/car/car.interface';
import { BaseSqlEntity } from '../../base.sql.entity';

@Entity('cars')
export class TestSqlCarEntity extends BaseSqlEntity implements ITestCar {
  @Column('text', { nullable: true })
  manufacturingLineId?: string | null;

  @Column('text')
  model!: string;

  @Column('text')
  engineModel!: string;

  @Column({ type: 'enum', enum: TestFuelType })
  engineType!: TestFuelType;

  @Column('int', { nullable: true })
  horsePower!: number | null;

  @Column('float')
  avgFuelConsumption!: number;

  @Column('int')
  fullTankCapacity!: number;

  @Column('bool', { nullable: true })
  failed?: boolean;

  @Column('text', { array: true, nullable: true })
  producedIn?: string[];

  @OneToMany(() => TestSqlPartEntity, (parts) => parts.car, { eager: true, cascade: true, nullable: true })
  parts?: Relation<TestSqlPartEntity[]>;

  @Column('int', { nullable: true })
  leftGas?: number;

  @Column('int', { nullable: true })
  mileage!: number | null;

  @OneToOne(() => TestSqlFeaturesEntity, (features) => features.car, { eager: true, cascade: true })
  features?: Relation<TestSqlFeaturesEntity>;
}

@Entity('cars_features')
export class TestSqlFeaturesEntity extends BaseSqlEntity implements ITestFeatures {
  @Column('int')
  ranking!: number;

  @Column({ type: 'enum', enum: TestColor, nullable: true })
  color?: TestColor;

  @Column('int', { array: true, nullable: true })
  numbers?: number[];

  @OneToOne(() => TestSqlAdvancedFeaturesEntity, (advanced) => advanced.features, { eager: true, cascade: true })
  advanced?: Relation<TestSqlAdvancedFeaturesEntity>;

  @OneToOne(() => TestSqlCarEntity, (car) => car.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  car!: Relation<TestSqlCarEntity>;
}

@Entity('cars_features_advanced')
export class TestSqlAdvancedFeaturesEntity extends BaseSqlEntity implements ITestAdvanced {
  @Column('text')
  serialNumber!: string;

  @Column('int', { nullable: true })
  index?: number;

  @OneToOne(() => TestSqlFeaturesEntity, (features) => features.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  features!: Relation<TestSqlFeaturesEntity>;
}

@Entity('cars_parts')
export class TestSqlPartEntity extends BaseSqlEntity implements ITestPart {
  @Column('text')
  name!: string;

  @Column('int', { nullable: true })
  year?: number;

  @ManyToOne(() => TestSqlCarEntity, (car) => car.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  car!: Relation<TestSqlCarEntity>;
}

const partsMapping: Mapping<ITestPartAttached, TestSqlPartEntity> = {
  id: mapToSqlIntId,
  name: 'name',
  year: 'year'
};

const advancedMapping: Mapping<ITestAdvancedAttached, TestSqlAdvancedFeaturesEntity> = {
  id: mapToSqlIntId,
  serialNumber: 'serialNumber',
  index: 'index'
};

const featuresMapping: Mapping<ITestFeaturesAttached, TestSqlFeaturesEntity> = {
  id: mapToSqlIntId,
  ranking: 'ranking',
  color: 'color',
  numbers: 'numbers',
  advanced: MapTo.NestedObject('advanced', advancedMapping)
};

export const carMapping: Mapping<ITestCarAttached, TestSqlCarEntity> = {
  id: mapToSqlIntId,
  manufacturingLineId: 'manufacturingLineId',
  model: 'model',
  engineModel: 'engineModel',
  engineType: 'engineType',
  horsePower: 'horsePower',
  avgFuelConsumption: 'avgFuelConsumption',
  fullTankCapacity: 'fullTankCapacity',
  failed: 'failed',
  producedIn: 'producedIn',
  leftGas: 'leftGas',
  mileage: 'mileage',
  parts: MapTo.ArrayOfObjects('parts', partsMapping),
  features: MapTo.NestedObject('features', featuresMapping)
};
