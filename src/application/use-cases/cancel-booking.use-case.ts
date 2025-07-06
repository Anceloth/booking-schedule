import { Injectable, Inject } from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { REPOSITORY_TOKENS } from '../../shared/constants/app.constants';

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async execute(id: string): Promise<Booking> {
    // Buscar la reserva
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verificar que se puede cancelar
    if (!booking.canBeCancelled()) {
      throw new Error('Booking cannot be cancelled');
    }

    // Cancelar la reserva
    return await this.bookingRepository.cancel(id);
  }
}
