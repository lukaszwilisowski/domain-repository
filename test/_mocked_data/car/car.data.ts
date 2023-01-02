import { ITestCar, TestColor, TestFuelType } from '../../_models/car/car.interface';

const testCar: ITestCar = {
  model: 'Toyota Avensis',
  engineModel: '1.6 Turbo',
  engineType: TestFuelType.Gasoline,
  horsePower: 140,
  avgFuelConsumption: 8 / 100,
  fullTankCapacity: 55,
  leftGas: 55,
  mileage: 0,
  producedIn: [],
  manufacturingLineId: null,
  features: {
    ranking: 10,
    color: TestColor.Black,
    advanced: {
      serialNumber: 's-01'
    }
  },
  parts: [
    {
      name: 'window',
      year: 2000
    }
  ]
};

const testCar2: ITestCar = {
  model: 'Peugeot 508',
  engineModel: '1.4',
  engineType: TestFuelType.Diesel,
  horsePower: 115,
  avgFuelConsumption: 6 / 100,
  fullTankCapacity: 50,
  mileage: 100,
  producedIn: ['1', '2'],
  manufacturingLineId: '-1',
  failed: true
};

const testCar3: ITestCar = {
  model: 'Mazda CX5',
  engineModel: '2.0',
  engineType: TestFuelType.Gasoline,
  horsePower: 180,
  avgFuelConsumption: 9 / 100,
  fullTankCapacity: 45,
  leftGas: 20,
  mileage: 200,
  manufacturingLineId: '1234',
  failed: false,
  features: {
    ranking: 20,
    color: TestColor.White,
    numbers: [1, 3, 5, 7]
  }
};

const testCar4: ITestCar = {
  model: 'Mazda RX8',
  engineModel: '2.0',
  engineType: TestFuelType.Gasoline,
  horsePower: 180,
  avgFuelConsumption: 9 / 100,
  fullTankCapacity: 45,
  leftGas: 40,
  mileage: null,
  producedIn: ['2', '3'],
  manufacturingLineId: '1234',
  features: {
    ranking: 5,
    color: TestColor.White,
    numbers: [5, 7],
    advanced: {
      serialNumber: 's-02',
      index: 5
    }
  }
};

export const testCars: ITestCar[] = [testCar, testCar2, testCar3, testCar4];
