import { PostgreSQLDbRepository } from 'db/postgresql/sql.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import { DataSource } from 'typeorm';
import { ITestCar, ITestCarAttached } from '../../../_models/car/car.interface';
import { runCreateTests } from '../../../_templates/create';
import {
  carMapping,
  TestSqlAdvancedFeaturesEntity,
  TestSqlCarEntity,
  TestSqlFeaturesEntity,
  TestSqlPartEntity
} from '../entities/car/car.entity';

const createSqlTestSetup = async (): Promise<{
  carRepository: IDomainRepository<ITestCar, ITestCarAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'testdb',
    username: 'postgres',
    password: 'admin',
    synchronize: true,
    entities: [TestSqlCarEntity, TestSqlFeaturesEntity, TestSqlAdvancedFeaturesEntity, TestSqlPartEntity]
  });

  await dataSource.initialize();

  const typeORMCarRepository = dataSource.getRepository(TestSqlCarEntity);

  const carRepository = new PostgreSQLDbRepository<ITestCar, ITestCarAttached, TestSqlCarEntity>(
    typeORMCarRepository,
    carMapping
  );

  const cleanUp = (): Promise<void> => dataSource.destroy();

  return { carRepository, cleanUp };
};

runCreateTests(createSqlTestSetup);
