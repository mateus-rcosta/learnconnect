import { AppDataSource } from '../config/ormconfig';
import app from '../index';
import { QueryRunner } from 'typeorm';

let queryRunner: QueryRunner;

beforeAll(async () => {
  await AppDataSource.initialize();
});

beforeEach(async () => {
  queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
});

afterEach(async () => {
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

export const testApp = app;