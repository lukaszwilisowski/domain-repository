import { NumericFoodType, SexType, StringAnimalType } from './non-nullable.model';

export interface NullableFriend {
  name?: string;
  readonly readonlyName?: string;
  type?: StringAnimalType;
  foodType?: NumericFoodType;
  age?: number;
  friendIDs?: string[];
}

export type NullableAdvancedFeatures = {
  serialNumber?: string;
};

export interface NullableFeatures {
  carnivore?: boolean;
  color?: string;
  advanced?: NullableAdvancedFeatures;
}

export interface NullableAnimal {
  name?: string;
  type?: StringAnimalType;
  foodType?: NumericFoodType;
  sex?: SexType;
  age?: number;
  whenBorn?: Date;
  free?: boolean;
  friendIDs?: string[];
  favoriteNumbers?: number[];
  friends?: NullableFriend[];
  features?: NullableFeatures;
}
