import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';
import { ITestCharacter, ITestCharacterAttached } from '../../_models/character/character.interface';
import { runFindOneAndUpdateTests } from '../../_templates/find-one-and-update';

const findOneAndUpdateMockedTestSetup = async (): Promise<{
  characterRepository: IDomainRepository<ITestCharacter, ITestCharacterAttached>;
  cleanUp: () => Promise<void>;
}> => {
  const characterRepository = new MockedDBRepository<ITestCharacter, ITestCharacterAttached>();

  const cleanUp = (): Promise<void> => Promise.resolve();

  return { characterRepository, cleanUp };
};

runFindOneAndUpdateTests(findOneAndUpdateMockedTestSetup);
