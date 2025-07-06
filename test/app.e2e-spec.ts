import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { BookingResponseDto } from '../src/application/dtos/booking.dto';

describe('BookingController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Add global validation pipe like in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  it('/bookings (GET)', () => {
    return request(app.getHttpServer())
      .get('/bookings')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/bookings (POST)', async () => {
    const createBookingDto = {
      title: 'Test Booking',
      description: 'Test Description',
      startDate: '2025-07-10T10:00:00.000Z',
      endDate: '2025-07-10T11:00:00.000Z',
      organizerId: 'f2b8894c-74bd-4052-a85a-5420e9688f2c',
      participants: ['54637498-f140-41a8-a412-32ca2e1231e5'],
    };

    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send(createBookingDto)
      .expect(201);

    const booking = response.body as BookingResponseDto;
    expect(booking).toHaveProperty('id');
    expect(booking.title).toBe(createBookingDto.title);
    expect(booking.status).toBe('ACTIVE');
  });

  it('/bookings/:id/cancel (PATCH)', async () => {
    // First create a booking
    const createBookingDto = {
      title: 'Test Booking for Cancellation',
      description: 'Test Description',
      startDate: '2025-07-10T12:00:00.000Z',
      endDate: '2025-07-10T13:00:00.000Z',
      organizerId: 'f2b8894c-74bd-4052-a85a-5420e9688f2c',
      participants: [],
    };

    const createResponse = await request(app.getHttpServer())
      .post('/bookings')
      .send(createBookingDto)
      .expect(201);

    const createdBooking = createResponse.body as BookingResponseDto;
    const bookingId: string = createdBooking.id;

    // Then cancel it
    const cancelResponse = await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/cancel`)
      .expect(200);

    const cancelledBooking = cancelResponse.body as BookingResponseDto;
    expect(cancelledBooking.status).toBe('CANCELLED');
    expect(cancelledBooking.id).toBe(bookingId);

    // Verify it's actually cancelled by getting it
    const getResponse = await request(app.getHttpServer())
      .get(`/bookings/${bookingId}`)
      .expect(200);

    const retrievedBooking = getResponse.body as BookingResponseDto;
    expect(retrievedBooking.status).toBe('CANCELLED');
  });

  it('/bookings/:id/cancel (PATCH) - should fail for already cancelled booking', async () => {
    // First create a booking
    const createBookingDto = {
      title: 'Test Booking for Double Cancellation',
      description: 'Test Description',
      startDate: '2025-07-10T14:00:00.000Z',
      endDate: '2025-07-10T15:00:00.000Z',
      organizerId: 'f2b8894c-74bd-4052-a85a-5420e9688f2c',
      participants: [],
    };

    const createResponse = await request(app.getHttpServer())
      .post('/bookings')
      .send(createBookingDto)
      .expect(201);

    const createdBooking = createResponse.body as BookingResponseDto;
    const bookingId: string = createdBooking.id;

    // Cancel it first time
    await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/cancel`)
      .expect(200);

    // Try to cancel again - should fail
    await request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/cancel`)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
