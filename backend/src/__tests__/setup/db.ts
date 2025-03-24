import { AppDataSource } from '../../config/ormconfig';
import { QueryRunner } from 'typeorm';

let queryRunner: QueryRunner;

export default async () => {
  // Sobrescreve configurações para testes
  process.env.NODE_ENV = 'test';
  
  await AppDataSource.initialize();
  queryRunner = AppDataSource.createQueryRunner();
};

export const getQueryRunner = () => queryRunner;