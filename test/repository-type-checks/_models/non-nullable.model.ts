export enum StringAnimalType {
  Lion = 'Lion',
  Tiger = 'Tiger'
}

export enum NumericFoodType {
  Meat = 0,
  Vegetables = 1
}

export enum SexType {
  Male,
  Female
}

export interface Friend {
  name: string;
  readonly readonlyName: string;
  type: StringAnimalType;
  foodType: NumericFoodType;
  age: number;
  friendIDs: string[];
}

export type AdvancedFeatures = {
  serialNumber: string;
};

export interface Features {
  carnivore: boolean;
  color: string;
  advanced: AdvancedFeatures;
}

export interface NonNullableAnimal {
  name: string;
  readonly readonlyName: string;
  type: StringAnimalType;
  foodType: NumericFoodType;
  sex: SexType;
  age: number;
  whenBorn: Date;
  free: boolean;
  friendIDs: string[];
  favoriteNumbers: number[];
  friends: Friend[];
  features: Features;
}
