import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm';
import { ITestAdvanced, ITestCar, ITestFeatures, ITestPart } from '../../../../_models/car/car.interface';
import {
  TestSqlAdvancedFeaturesEntity,
  TestSqlCarEntity,
  TestSqlFeaturesEntity,
  TestSqlPartEntity
} from './car.entity';

@Entity('cars_2')
export class TestSqlCarEntity2 extends TestSqlCarEntity implements ITestCar {
  @OneToMany(() => TestSqlPartEntity2, (parts) => parts.car, { eager: true, cascade: true, nullable: true })
  parts?: Relation<TestSqlPartEntity2[]>;

  @OneToOne(() => TestSqlFeaturesEntity2, (features) => features.car, { eager: true, cascade: true })
  features?: Relation<TestSqlFeaturesEntity2>;
}

@Entity('cars_features_2')
export class TestSqlFeaturesEntity2 extends TestSqlFeaturesEntity implements ITestFeatures {
  @OneToOne(() => TestSqlAdvancedFeaturesEntity2, (advanced) => advanced.features, { eager: true, cascade: true })
  advanced?: Relation<TestSqlAdvancedFeaturesEntity2>;

  @OneToOne(() => TestSqlCarEntity2, (car) => car.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  car!: Relation<TestSqlCarEntity2>;
}

@Entity('cars_features_advanced_2')
export class TestSqlAdvancedFeaturesEntity2 extends TestSqlAdvancedFeaturesEntity implements ITestAdvanced {
  @OneToOne(() => TestSqlFeaturesEntity2, (features) => features.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  features!: Relation<TestSqlFeaturesEntity2>;
}

@Entity('cars_parts_2')
export class TestSqlPartEntity2 extends TestSqlPartEntity implements ITestPart {
  @ManyToOne(() => TestSqlCarEntity2, (car) => car.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  car!: Relation<TestSqlCarEntity2>;
}
