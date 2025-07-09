import { Injectable, Inject } from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { CreateBookingDto } from '../dtos/booking.dto';
import { BookingDomainService } from '../../domain/services/booking-domain.service';
import { ConflictVerificationService } from '../../domain/services/conflict-verification.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { REPOSITORY_TOKENS } from '../../shared/constants/app.constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly conflictVerificationService: ConflictVerificationService,
  ) {}

  async execute(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validar que el organizador existe
    const organizer = await this.userRepository.findById(
      createBookingDto.organizerId,
    );
    if (!organizer) {
      throw new Error('Organizer not found');
    }

    // Crear la entidad de Booking
    const booking = new Booking(
      uuidv4(),
      createBookingDto.title,
      createBookingDto.description,
      createBookingDto.startDate,
      createBookingDto.endDate,
      createBookingDto.organizerId,
      createBookingDto.participants || [],
    );

    // Aplicar validaciones de dominio
    BookingDomainService.validateBookingSchedule(booking);

    // Validar participantes si existen
    if (
      createBookingDto.participants &&
      createBookingDto.participants.length > 0
    ) {
      const participants = await Promise.all(
        createBookingDto.participants.map((participantId) =>
          this.userRepository.findById(participantId),
        ),
      );

      const validParticipants = participants.filter((p) => p !== null);
      if (validParticipants.length !== createBookingDto.participants.length) {
        throw new Error('One or more participants not found');
      }

      BookingDomainService.validateParticipants(validParticipants);

      // Verificar conflictos de calendario para los participantes
      await this.conflictVerificationService.verifyNoConflicts(
        createBookingDto.participants,
        createBookingDto.startDate,
        createBookingDto.endDate,
      );
    }

    // Guardar la reserva
    return await this.bookingRepository.save(booking);
  }
}
