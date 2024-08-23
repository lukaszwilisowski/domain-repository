import { describe, expect, it } from '@jest/globals';
import { UpdateWith } from 'helpers/update.with.helper';
import { IDomainRepository } from 'interfaces/repository.interface';
import { MockedDBRepository } from 'mocked-repository/mocked.repository';

export type Part = {
  name: string;
  created: Date;
};

export type Car = {
  name: string;
  best: boolean;
  readonly yearOfProduction: number;
  sold?: Date;
  parts?: Part[];
};

export type DbCar = Car & { id: string };

export class CarService {
  constructor(private readonly carRepository: IDomainRepository<DbCar, DbCar>) {}

  public async createCar(car: DbCar): Promise<DbCar> {
    return this.carRepository.create(car);
  }

  public async findBestCar(): Promise<DbCar | undefined> {
    return this.carRepository.findOne({ best: true });
  }

  public async updateBestCar(): Promise<DbCar> {
    const updated = await this.carRepository.findOneAndUpdate(
      { best: true },
      {
        parts: UpdateWith.Push<Part>({ name: 'wheel', created: new Date() })
      }
    );

    return updated!;
  }

  public async updateNamedCar(name: string): Promise<DbCar> {
    const updated = await this.carRepository.findOneAndUpdate(
      { name },
      {
        parts: UpdateWith.Push<Part>({ name: 'wheel', created: new Date() })
      }
    );

    return updated!;
  }
}

describe('CarService', () => {
  const initialData: DbCar[] = [
    { id: '1', name: 'Volvo', best: false, yearOfProduction: 2000 },
    {
      id: '2',
      name: 'Toyota',
      best: true,
      yearOfProduction: 2010,
      sold: new Date(),
      parts: [
        {
          name: 'wheel',
          created: new Date('2022-01-01')
        }
      ]
    }
  ];

  const mockedRepository = new MockedDBRepository<Car, DbCar>(initialData);
  const carService = new CarService(mockedRepository);

  it('should find best car', async () => {
    const car = await carService.findBestCar();

    expect(car).toBeDefined();
    expect(car!.name).toEqual('Toyota');
    expect(car!.sold).toBeInstanceOf(Date);
    expect(car!.sold?.getTime()).toBeGreaterThan(0);
    expect(car!.parts![0].created).toBeInstanceOf(Date);
    expect(car!.parts![0].created.getTime()).toBeGreaterThan(0);
  });

  it('should create and update car', async () => {
    const car = await carService.createCar({
      id: '3',
      name: 'BMW',
      best: false,
      yearOfProduction: 2020,
      sold: new Date()
    });

    const updatedCar = await carService.updateNamedCar('BMW');

    expect(updatedCar).toBeDefined();
    expect(updatedCar!.name).toEqual('BMW');
    expect(updatedCar!.sold).toBeInstanceOf(Date);
    expect(updatedCar!.sold?.getTime()).toBeGreaterThan(0);
    expect(updatedCar!.parts![0].created).toBeInstanceOf(Date);
    expect(updatedCar!.parts![0].created.getTime()).toBeGreaterThan(0);
  });

  it('should update best car', async () => {
    await carService.updateBestCar();
    const car = await carService.findBestCar();

    expect(car).toBeDefined();
    expect(car!.name).toEqual('Toyota');
    expect(car!.sold).toBeInstanceOf(Date);
    expect(car!.sold?.getTime()).toBeGreaterThan(0);
    expect(car!.parts![0].created).toBeInstanceOf(Date);
    expect(car!.parts![0].created.getTime()).toBeGreaterThan(0);
    expect(car!.parts![1].created).toBeInstanceOf(Date);
    expect(car!.parts![1].created.getTime()).toBeGreaterThan(0);
  });
});
