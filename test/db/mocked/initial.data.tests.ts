import { describe, expect, it } from '@jest/globals';
import { IReadDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';

export type Car = {
  name: string;
  best: boolean;
  readonly yearOfProduction: number;
  sold?: Date;
};

export type DbCar = Car & { id: string };

export class CarService {
  constructor(private readonly carRepository: IReadDomainRepository<DbCar>) {}

  public async findBestCar(): Promise<DbCar | undefined> {
    return this.carRepository.findOne({ best: true });
  }
}

describe('CarService', () => {
  const initialData: DbCar[] = [
    { id: '1', name: 'Volvo', best: false, yearOfProduction: 2000 },
    { id: '2', name: 'Toyota', best: true, yearOfProduction: 2010, sold: new Date() }
  ];

  const mockedRepository = new MockedDBRepository<Car, DbCar>(initialData);
  const carService = new CarService(mockedRepository);

  it('should find best car', async () => {
    const car = await carService.findBestCar();

    expect(car).toBeDefined();
    expect(car!.name).toEqual('Toyota');
  });
});
