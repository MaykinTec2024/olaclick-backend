import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { OrderStatus } from './../src/orders/entities/order.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let createdOrderId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /orders - crear una nueva orden', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send({
        clientName: 'Maykin Iparraguirre',
        items: [
          { description: 'Ceviche', quantity: 2, unitPrice: 50 },
          { description: 'Chicha morada', quantity: 1, unitPrice: 10 },
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.clientName).toBe('Maykin Iparraguirre');
    expect(response.body.status).toBe(OrderStatus.INITIATED);
    expect(response.body.items.length).toBe(2);

    createdOrderId = response.body.id;
    console.log('createdOrderId:', createdOrderId);
  });

  it('GET /orders - listar órdenes', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(order => {
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('clientName');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('items');
    });
  });

  it('GET /orders/:id - ver detalle de una orden', async () => {
    const response = await request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .expect(200);

    expect(response.body.id).toBe(createdOrderId);
    expect(response.body).toHaveProperty('items');
    response.body.items.forEach(item => {
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('unitPrice');
    });
  });

  it('POST /orders/:id/advance - avanzar estado de la orden', async () => {
    const response = await request(app.getHttpServer())
      .post(`/orders/${createdOrderId}/advance`)
      .expect(201);

    expect(response.body.message).toMatch(/status updated/i);
  });
});
