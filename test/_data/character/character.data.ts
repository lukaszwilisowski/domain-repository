import { ITestCharacter } from '../../_models/character/character.interface';

const testCharacter1: ITestCharacter = {
  name: 'Lukas',
  surname: 'Dawn',
  equipment: ['sword', 'shield', 'helmet'],
  charLevel: 15,
  motto: 'No one gonna save!'
};

const testCharacter2: ITestCharacter = {
  name: 'Artur',
  surname: 'King',
  scorePoints: [2],
  equipment: ['axe', 'plate', 'helmet'],
  charLevel: 12,
  motto: 'One for all, all for one!',
  stats: [
    {
      grade: 'Begineer',
      damage: 20
    }
  ],
  born: new Date(1990, 1, 1)
};

const testCharacter3: ITestCharacter = {
  name: 'Mark',
  surname: 'Dayne',
  scorePoints: [3],
  charLevel: 15,
  motto: 'Valar Morghulis!',
  stats: [
    {
      grade: 'Champion',
      damage: 70
    }
  ],
  born: new Date(2020, 1, 1)
};

const testCharacter4: ITestCharacter = {
  name: 'Nicholas',
  surname: 'Flammel',
  scorePoints: [1, 3, 5],
  equipment: ['staff', 'robe', 'amulet'],
  charLevel: 8,
  motto: 'Knowledge is power!',
  stats: [
    {
      grade: 'Begineer',
      damage: 20
    },
    {
      grade: 'Champion',
      damage: 70
    }
  ],
  born: new Date(2000, 1, 1)
};

export const testCharacters: ITestCharacter[] = [testCharacter1, testCharacter2, testCharacter3, testCharacter4];
