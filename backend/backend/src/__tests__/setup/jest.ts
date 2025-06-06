import { AppDataSource } from '../../config/ormconfig';
import { getQueryRunner } from './db';
import { jest } from '@jest/globals';

jest.mock('bcrypt', () => ({
  hashSync: (password: string) => `hashed_${password}`,
  compareSync: (plain: string, hashed: string) => `hashed_${plain}` === hashed
}));

beforeEach(async () => {
  await getQueryRunner().startTransaction();
});

afterEach(async () => {
  await getQueryRunner().rollbackTransaction();
});

afterAll(async () => {
  await getQueryRunner().release();
  await AppDataSource.destroy();
});