import { IBaseModelAttached } from '../base.attached.model';

export enum TestFuelType {
  Gasoline = 'Gasoline',
  Diesel = 'Diesel'
}

export interface ITestPart {
  name: string;
  year?: number;
}

export enum TestColor {
  White,
  Black
}

export interface ITestAdvanced {
  serialNumber: string;
  index?: number;
}

export interface ITestFeatures {
  ranking: number;
  color?: TestColor;
  numbers?: number[];
  advanced?: ITestAdvanced;
}

export interface ITestCar {
  readonly manufacturingLineId?: string | null;
  readonly model: string;
  readonly engineModel: string;
  readonly engineType: TestFuelType;
  readonly horsePower: number | null;
  readonly avgFuelConsumption: number;
  readonly fullTankCapacity: number;
  readonly failed?: boolean;
  producedIn?: string[];
  parts?: ITestPart[];
  leftGas?: number;
  mileage: number | null;
  features?: ITestFeatures;
}

export type ITestPartAttached = ITestPart & IBaseModelAttached;
export type ITestAdvancedAttached = ITestAdvanced & IBaseModelAttached;
export type ITestFeaturesAttached = ITestFeatures &
  IBaseModelAttached & {
    advanced?: ITestAdvancedAttached;
  };

export type ITestCarAttached = ITestCar &
  IBaseModelAttached & {
    parts?: ITestPartAttached[];
    features?: ITestFeaturesAttached;
  };
