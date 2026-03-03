import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Work Order Service (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/work-order-service/work-order (WorkOrder endpoints)', () => {
    it('GET /work-order-service/work-order - should return work orders in { value: [...] } format', () => {
      return request(app.getHttpServer())
        .get('/work-order-service/work-order')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('value');
          expect(Array.isArray(res.body.value)).toBe(true);
        });
    });
  });

  describe('/work-order-service/work-products (WorkProduct endpoints)', () => {
    it('GET /work-order-service/work-products - should return work products in { value: [...] } format', () => {
      return request(app.getHttpServer())
        .get('/work-order-service/work-products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('value');
          expect(Array.isArray(res.body.value)).toBe(true);
        });
    });
  });

  describe('/work-order-service/schedule-lines (ScheduleLine endpoints)', () => {
    it('GET /work-order-service/schedule-lines - should return schedule lines in { value: [...] } format', () => {
      return request(app.getHttpServer())
        .get('/work-order-service/schedule-lines')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('value');
          expect(Array.isArray(res.body.value)).toBe(true);
        });
    });
  });
});
