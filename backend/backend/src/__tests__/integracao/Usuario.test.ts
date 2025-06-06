import request from 'supertest';
import { AppDataSource } from '../../config/ormconfig';
import { Role, Usuario } from '../../entity/Usuario';
import app from '../../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('User Controller Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let testUser: Usuario;
  let queryRunner: any;

  beforeAll(async () => {
    await AppDataSource.initialize();
    queryRunner = AppDataSource.createQueryRunner();
    
    // Criar usuário admin
    const admin = await AppDataSource.getRepository(Usuario).save({
      nome: 'Admin',
      apelido: 'adminTeste',
      email: 'admin@test.com',
      senha: bcrypt.hashSync('admin123', 10),
      role: Role.ADMIN
    });

    // Criar usuário normal
    testUser = await AppDataSource.getRepository(Usuario).save({
      nome: 'Test User',
      apelido: 'testuser',
      email: 'user@test.com',
      senha: bcrypt.hashSync('user123', 10),
    });

    // Gerar tokens
    adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET!);
    userToken = jwt.sign({ id: testUser.id, role: testUser.role }, process.env.JWT_SECRET!);
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  afterAll(async () => {
    await queryRunner.release();
    await AppDataSource.destroy();
  });

  describe('GET /api/users/search', () => {
    it('Deve retornar usuários paginados', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ q: 'test', page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        users: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        limit: 10
      });
    });

    it('Deve lidar com erros na busca', async () => {
      jest.spyOn(AppDataSource.getRepository(Usuario), 'findAndCount').mockRejectedValueOnce(new Error('DB Error'));
      
      const response = await request(app)
        .get('/api/users/search')
        .query({ q: 'test' });

      expect(response.status).toBe(500);
      expect(response.body.code).toBe('user_search_failed');
    });
  });

  describe('GET /api/users/:apelido', () => {
    it('Deve retornar dados públicos do usuário', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser.apelido}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        nome: testUser.nome,
        apelido: testUser.apelido,
        bio: testUser.bio,
        avatar_url: testUser.avatar_url,
        banner_url: testUser.banner_url
      });
    });

    it('Deve retornar erro 404 para usuário não encontrado', async () => {
      const response = await request(app)
        .get('/api/users/invalid_user');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('user_not_found');
    });
  });

  describe('GET /api/users/admin/:apelido', () => {
    it('Deve retornar dados completos para admin', async () => {
      const response = await request(app)
        .get(`/api/users/admin/${testUser.apelido}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: testUser.id,
        email: testUser.email,
        role: 'user'
      });
    });

    it('Deve bloquear acesso não autorizado', async () => {
      const response = await request(app)
        .get(`/api/users/admin/${testUser.apelido}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('Deve atualizar dados do usuário', async () => {
      const response = await request(app)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ nome: 'Novo Nome', bio: 'Nova bio' });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Novo Nome');
    });

    it('Deve atualizar a senha com hash', async () => {
      const response = await request(app)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ senha: 'novaSenha123' });

      const updatedUser = await AppDataSource.getRepository(Usuario).findOneBy({ id: testUser.id });
      expect(bcrypt.compareSync('novaSenha123', updatedUser!.senha)).toBeTruthy();
    });

    it('Deve bloquear atualização de outro usuário', async () => {
      const response = await request(app)
        .put(`/api/users/other-user-id`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ nome: 'Hacker' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('Deve fazer soft delete do usuário', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const deletedUser = await AppDataSource.getRepository(Usuario).findOne({
        where: { id: testUser.id },
        withDeleted: true
      });
      
      expect(deletedUser?.data_deletado).not.toBeNull();
    });

    it('Deve bloquear exclusão não autorizada', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});