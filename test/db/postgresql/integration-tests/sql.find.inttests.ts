import { PostgreSQLDbRepository } from 'db/postgresql/sql.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import { DataSource } from 'typeorm';
import { testCars } from '../../../_data/car/car.data';
import { ITestCar, ITestCarAttached } from '../../../_models/car/car.interface';
import { runCountAllByCriteriaTests } from '../../../_templates/count-all-by-criteria';
import { runFindAllByArrayCriteriaTests } from '../../../_templates/find-all-by-array-criteria';
import { runFindAllByNestedObjectCriteriaTests } from '../../../_templates/find-all-by-nested-object-criteria';
import { runFindAllBySimpleCriteriaTests } from '../../../_templates/find-all-by-simple-criteria';
import { runFindOneByCriteriaTests } from '../../../_templates/find-one-by-criteria';
import { carMapping } from '../entities/car/car.entity';
import {
  TestSqlAdvancedFeaturesEntity2,
  TestSqlCarEntity2,
  TestSqlFeaturesEntity2,
  TestSqlPartEntity2
} from '../entities/car/car2.entity';

const findSqlTestSetup = async (): Promise<{
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
    entities: [TestSqlCarEntity2, TestSqlFeaturesEntity2, TestSqlAdvancedFeaturesEntity2, TestSqlPartEntity2]
  });

  await dataSource.initialize();

  const typeORMCarRepository = dataSource.getRepository(TestSqlCarEntity2);

  const carRepository = new PostgreSQLDbRepository<ITestCar, ITestCarAttached, TestSqlCarEntity2>(
    typeORMCarRepository,
    carMapping
  );

  //initialize data for all tests
  await carRepository.createMany(testCars);

  const cleanUp = (): Promise<void> => dataSource.destroy();

  return { carRepository, cleanUp };
};

runCountAllByCriteriaTests(findSqlTestSetup);
runFindOneByCriteriaTests(findSqlTestSetup);
runFindAllBySimpleCriteriaTests(findSqlTestSetup);
runFindAllByArrayCriteriaTests(findSqlTestSetup);
runFindAllByNestedObjectCriteriaTests(findSqlTestSetup);
