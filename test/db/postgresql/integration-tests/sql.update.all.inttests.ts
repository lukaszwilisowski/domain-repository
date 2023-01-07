import { PostgreSQLDbRepository } from 'db/postgresql/sql.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import { DataSource } from 'typeorm';
import { ITestCar, ITestCarAttached } from '../../../_models/car/car.interface';
import { runFindAllAndUpdateTests } from '../../../_templates/find-all-and-update';
import { carMapping } from '../entities/car/car.entity';
import {
  TestSqlAdvancedFeaturesEntity3,
  TestSqlCarEntity3,
  TestSqlFeaturesEntity3,
  TestSqlPartEntity3
} from '../entities/car/car3.entity';

const findAllAndUpdateSqlTestSetup = async (): Promise<{
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
    entities: [TestSqlCarEntity3, TestSqlFeaturesEntity3, TestSqlAdvancedFeaturesEntity3, TestSqlPartEntity3]
  });

  await dataSource.initialize();

  const typeORMCarRepository = dataSource.getRepository(TestSqlCarEntity3);

  const carRepository = new PostgreSQLDbRepository<ITestCar, ITestCarAttached, TestSqlCarEntity3>(
    typeORMCarRepository,
    carMapping
  );

  const cleanUp = (): Promise<void> => dataSource.destroy();

  return { carRepository, cleanUp };
};

runFindAllAndUpdateTests(findAllAndUpdateSqlTestSetup);
