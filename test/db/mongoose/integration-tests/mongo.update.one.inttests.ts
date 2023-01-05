import { MongoDbRepository } from 'db/mongoose/mongo.repository';
import { IDomainRepository } from 'interfaces/repository.interface';
import mongoose from 'mongoose';
import { ITestCharacter, ITestCharacterAttached } from '../../../_models/character/character.interface';
import { runFindOneAndUpdateTests } from '../../../_templates/find-one-and-update';
import {
  characterMapping,
  getCharacterCollection,
  TestMongoCharacterEntity
} from '../entities/character/character.entity';

const findOneAndUpdateMongoTestSetup = async (): Promise<{
  characterRepository: IDomainRepository<ITestCharacter, ITestCharacterAttached>;
  cleanUp: () => Promise<void>;
}> => {
  mongoose.set('strictQuery', false);

  await new Promise<void>((resolve) => {
    mongoose.connect('mongodb://localhost:27017/unittestdb', {});
    mongoose.connection.on('open', () => resolve());
  });

  const characterRepository = new MongoDbRepository<
    ITestCharacter,
    ITestCharacterAttached,
    TestMongoCharacterEntity
  >(getCharacterCollection('characters'), characterMapping);

  const cleanUp = (): Promise<void> => mongoose.connection.close();

  return { characterRepository, cleanUp };
};

runFindOneAndUpdateTests(findOneAndUpdateMongoTestSetup);
