import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';

export class BookingDomainService {
  static validateBookingSchedule(booking: Booking): void {
    if (booking.startDate >= booking.endDate) {
      throw new Error('Start date must be before end date');
    }

    if (booking.startDate < new Date()) {
      throw new Error('Cannot schedule bookings in the past');
    }

    if (booking.getDuration() < 15 * 60 * 1000) {
      // 15 minutos
      throw new Error('Booking must be at least 15 minutes long');
    }

    if (booking.getDuration() > 8 * 60 * 60 * 1000) {
      // 8 horas
      throw new Error('Booking cannot be longer than 8 hours');
    }
  }

  static validateParticipants(participants: User[]): void {
    if (participants.length === 0) {
      throw new Error('Booking must have at least one participant');
    }

    if (participants.length > 100) {
      throw new Error('Booking cannot have more than 100 participants');
    }

    // Validar que todos los participantes tengan emails válidos
    participants.forEach((participant) => {
      if (!participant.isValidEmail()) {
        throw new Error(`Invalid email for participant: ${participant.email}`);
      }
    });
  }

  static checkTimeConflict(booking1: Booking, booking2: Booking): boolean {
    return (
      booking1.startDate < booking2.endDate &&
      booking2.startDate < booking1.endDate
    );
  }

  static canUserJoinBooking(user: User, booking: Booking): boolean {
    // Lógica de negocio para determinar si un usuario puede unirse a una reserva
    return (
      user.isValidEmail() &&
      !booking.hasParticipant(user.id) &&
      booking.startDate > new Date()
    );
  }
}
