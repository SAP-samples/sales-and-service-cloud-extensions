/**
 * End-to-end tests for the Work Order Service.
 *
 * PREREQUISITE: These tests require a live SAP HANA database connection.
 * Set the following environment variables before running:
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_SCHEMA, SSC_DESTINATION
 *
 * Run with: npm run test:e2e
 * Unit tests (no DB required): npm test
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';

const dbConfigured =
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_SCHEMA &&
  process.env.SSC_DESTINATION;

const describeIfDb = dbConfigured ? describe : describe.skip;

describeIfDb('Work Order Service (e2e)', () => {
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

  describe('/work-order-service/workOrders (WorkOrder endpoints)', () => {
    it('GET /work-order-service/workOrders - should return work orders in { value: [...] } format', () => {
      return request(app.getHttpServer())
        .get('/work-order-service/workOrders')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('value');
          expect(Array.isArray(res.body.value)).toBe(true);
        });
    });
  });

  describe('/work-order-service/workOrders/:workOrderId/workProducts (WorkProduct endpoints)', () => {
    it('GET /work-order-service/workOrders/:workOrderId/workProducts - should return work products in { value: [...] } format', () => {
      return request(app.getHttpServer())
        .get('/work-order-service/workOrders/00000000-0000-0000-0000-000000000000/workProducts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('value');
          expect(Array.isArray(res.body.value)).toBe(true);
        });
    });
  });

  describe('/work-order-service/workOrders/:workOrderId/workProducts/:workProductId/scheduleLines (ScheduleLine endpoints)', () => {
    it('GET .../scheduleLines - should return schedule lines in { value: [...] } format', () => {
      return request(app.getHttpServer())
        .get('/work-order-service/workOrders/00000000-0000-0000-0000-000000000000/workProducts/00000000-0000-0000-0000-000000000000/scheduleLines')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('value');
          expect(Array.isArray(res.body.value)).toBe(true);
        });
    });
  });
});
