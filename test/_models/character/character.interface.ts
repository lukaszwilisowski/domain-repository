import { IBaseModelAttached } from '../base.attached.model';

export interface ITestStats {
  grade: string;
  damage: number;
  armor?: number;
}

export interface ITestCharacter {
  name: string;
  surname?: string;
  scorePoints?: number[];
  equipment?: string[];
  charLevel?: number;
  motto: string;
  stats?: ITestStats[];
  born?: Date;
}

export type ITestStatsAttached = ITestStats & IBaseModelAttached;
export type ITestCharacterAttached = ITestCharacter &
  IBaseModelAttached & {
    stats?: ITestStatsAttached[];
  };
