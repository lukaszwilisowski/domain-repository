import { SqlDbRepository } from 'db/typeorm-postgresql/sql.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import { DataSource } from 'typeorm';
import { ITestCharacter, ITestCharacterAttached } from '../../../_models/character/character.interface';
import { runFindOneAndUpdateTests } from '../../../_templates/find-one-and-update';
import {
  characterMapping,
  TestSqlCharacterEntity,
  TestSqlStatsEntity
} from '../entities/character/character.entity';

const findOneAndUpdateSqlTestSetup = async (): Promise<{
  characterRepository: IDomainRepository<ITestCharacter, ITestCharacterAttached>;
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
    entities: [TestSqlCharacterEntity, TestSqlStatsEntity]
  });

  await dataSource.initialize();

  const typeORMCarRepository = dataSource.getRepository(TestSqlCharacterEntity);

  const characterRepository = new SqlDbRepository<ITestCharacter, ITestCharacterAttached, TestSqlCharacterEntity>(
    typeORMCarRepository,
    characterMapping
  );

  const cleanUp = (): Promise<void> => dataSource.destroy();

  return { characterRepository, cleanUp };
};

runFindOneAndUpdateTests(findOneAndUpdateSqlTestSetup);
