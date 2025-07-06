import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../../domain/repositories/booking.repository';
import {
  Booking,
  BookingStatus,
} from '../../../domain/entities/booking.entity';
import { PrismaService } from '../prisma.service';
import { Booking as PrismaBooking } from '@prisma/client';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    return booking ? this.toDomain(booking) : null;
  }

  async findByOrganizerId(organizerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { organizerId },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async findByParticipantId(participantId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        participants: {
          has: participantId,
        },
      },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        AND: [{ startDate: { gte: startDate } }, { endDate: { lte: endDate } }],
      },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async save(booking: Booking): Promise<Booking> {
    const savedBooking = await this.prisma.booking.create({
      data: {
        id: booking.id,
        title: booking.title,
        description: booking.description,
        startDate: booking.startDate,
        endDate: booking.endDate,
        organizerId: booking.organizerId,
        participants: booking.participants,
        status: booking.status,
      },
    });
    return this.toDomain(savedBooking);
  }

  async update(id: string, booking: Partial<Booking>): Promise<Booking> {
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        title: booking.title,
        description: booking.description,
        startDate: booking.startDate,
        endDate: booking.endDate,
        participants: booking.participants,
      },
    });
    return this.toDomain(updatedBooking);
  }

  async cancel(id: string): Promise<Booking> {
    const cancelledBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
    return this.toDomain(cancelledBooking);
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      include: {
        organizer: true,
      },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  private toDomain(prismaBooking: PrismaBooking): Booking {
    return new Booking(
      prismaBooking.id,
      prismaBooking.title,
      prismaBooking.description,
      prismaBooking.startDate,
      prismaBooking.endDate,
      prismaBooking.organizerId,
      prismaBooking.participants,
      prismaBooking.status as BookingStatus,
      prismaBooking.createdAt,
      prismaBooking.updatedAt,
    );
  }
}
