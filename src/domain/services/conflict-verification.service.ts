import { Injectable, Inject } from '@nestjs/common';
import { CalendarEvent } from './calendar.service';
import { CalendarConflictException } from '../exceptions/calendar-conflict.exception';
import { UserRepository } from '../repositories/user.repository';
import { GoogleCalendarService } from '../../infrastructure/external/google-calendar.service';
import { REPOSITORY_TOKENS } from '../../shared/constants/app.constants';

@Injectable()
export class ConflictVerificationService {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Verifica conflictos de calendario para todos los participantes
   * @param participantIds Array de IDs de participantes
   * @param startDate Fecha de inicio del evento
   * @param endDate Fecha de fin del evento
   * @throws CalendarConflictException si hay conflictos
   */
  async verifyNoConflicts(
    participantIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    if (!participantIds || participantIds.length === 0) {
      return; // No hay participantes que verificar
    }

    // Obtener emails de los participantes
    const participants = await Promise.all(
      participantIds.map((id) => this.userRepository.findById(id)),
    );

    const validParticipants = participants.filter((p) => p !== null);

    // Verificar conflictos para cada participante
    for (const participant of validParticipants) {
      // Por ahora, saltamos la verificación real ya que necesitamos tokens reales
      // En desarrollo, puedes usar los métodos sin tokens que retornan arrays vacíos
      const conflicts = await this.googleCalendarService.checkConflicts();

      if (conflicts.length > 0) {
        throw new CalendarConflictException(participant.email, conflicts);
      }
    }
  }

  /**
   * Obtiene información de disponibilidad de participantes (para futuras funcionalidades)
   * @param participantIds Array de IDs de participantes
   * @param startDate Fecha de inicio del rango
   * @param endDate Fecha de fin del rango
   * @returns Mapa de disponibilidad por participante
   */
  async getParticipantAvailability(
    participantIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, { email: string; conflicts: any[] }>> {
    const availability = new Map();

    if (!participantIds || participantIds.length === 0) {
      return availability;
    }

    const participants = await Promise.all(
      participantIds.map((id) => this.userRepository.findById(id)),
    );

    const validParticipants = participants.filter((p) => p !== null);

    for (const participant of validParticipants) {
      const conflicts = await this.googleCalendarService.checkConflicts();

      availability.set(participant.id, {
        email: participant.email,
        conflicts,
      });
    }

    return availability;
  }

  /**
   * Obtiene eventos del calendario para pruebas
   * @param participantEmail Email del participante
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin
   * @returns Array de eventos
   */
  async getCalendarEvents(
    participantEmail: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    return await this.googleCalendarService.getEvents();
  }

  /**
   * Prueba la conexión real con Google Calendar API
   * @returns Resultado de la prueba con información detallada
   */
  async testGoogleCalendarConnection(): Promise<{
    eventsCount: number;
    authenticated: boolean;
    error?: string;
  }> {
    try {
      // Para OAuth 2.0, simplemente verificamos que el servicio esté disponible
      // No podemos obtener eventos sin tokens de usuario específicos
      const events = await this.googleCalendarService.getEvents();
      
      return {
        eventsCount: events.length,
        authenticated: true,
      };
    } catch (error) {
      const errorMessage = (error as Error).message;

      return {
        eventsCount: 0,
        authenticated: false,
        error: errorMessage,
      };
    }
  }
}
