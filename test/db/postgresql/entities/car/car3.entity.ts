import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm';
import { ITestAdvanced, ITestCar, ITestFeatures, ITestPart } from '../../../../_models/car/car.interface';
import {
  TestSqlAdvancedFeaturesEntity,
  TestSqlCarEntity,
  TestSqlFeaturesEntity,
  TestSqlPartEntity
} from './car.entity';

@Entity('cars_3')
export class TestSqlCarEntity3 extends TestSqlCarEntity implements ITestCar {
  @OneToMany(() => TestSqlPartEntity3, (parts) => parts.car, { eager: true, cascade: true, nullable: true })
  parts?: Relation<TestSqlPartEntity3[]>;

  @OneToOne(() => TestSqlFeaturesEntity3, (features) => features.car, { eager: true, cascade: true })
  features?: Relation<TestSqlFeaturesEntity3>;
}

@Entity('cars_features_3')
export class TestSqlFeaturesEntity3 extends TestSqlFeaturesEntity implements ITestFeatures {
  @OneToOne(() => TestSqlAdvancedFeaturesEntity3, (advanced) => advanced.features, { eager: true, cascade: true })
  advanced?: Relation<TestSqlAdvancedFeaturesEntity3>;

  @OneToOne(() => TestSqlCarEntity3, (car) => car.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  car!: Relation<TestSqlCarEntity3>;
}

@Entity('cars_features_advanced_3')
export class TestSqlAdvancedFeaturesEntity3 extends TestSqlAdvancedFeaturesEntity implements ITestAdvanced {
  @OneToOne(() => TestSqlFeaturesEntity3, (features) => features.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  features!: Relation<TestSqlFeaturesEntity3>;
}

@Entity('cars_parts_3')
export class TestSqlPartEntity3 extends TestSqlPartEntity implements ITestPart {
  @ManyToOne(() => TestSqlCarEntity3, (car) => car.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  car!: Relation<TestSqlCarEntity3>;
}
