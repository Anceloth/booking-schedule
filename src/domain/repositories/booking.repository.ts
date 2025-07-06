import { Booking } from '../entities/booking.entity';

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByOrganizerId(organizerId: string): Promise<Booking[]>;
  findByParticipantId(participantId: string): Promise<Booking[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  update(id: string, booking: Partial<Booking>): Promise<Booking>;
  cancel(id: string): Promise<Booking>;
  findAll(): Promise<Booking[]>;
}
