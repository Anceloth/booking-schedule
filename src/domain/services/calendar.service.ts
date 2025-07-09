export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

export interface UserTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface CalendarService {
  /**
   * Verifica si hay conflictos de horario para un participante (métodos legacy - no usar en OAuth)
   * @deprecated Use checkConflictsWithTokens instead
   */
  checkConflicts(): Promise<CalendarEvent[]>;

  /**
   * Obtiene los eventos de un participante (métodos legacy - no usar en OAuth)
   * @deprecated Use getEventsWithTokens instead
   */
  getEvents(): Promise<CalendarEvent[]>;

  /**
   * Verifica conflictos de calendario con tokens de usuario OAuth
   * @param participantEmail Email del participante
   * @param startDate Fecha de inicio del evento propuesto
   * @param endDate Fecha de fin del evento propuesto
   * @param userTokens Tokens OAuth del usuario
   * @returns Array de eventos conflictivos (vacío si no hay conflictos)
   */
  checkConflictsWithTokens(
    participantEmail: string,
    startDate: Date,
    endDate: Date,
    userTokens: UserTokens,
  ): Promise<CalendarEvent[]>;

  /**
   * Obtiene los eventos de un participante con tokens OAuth
   * @param participantEmail Email del participante
   * @param startDate Fecha de inicio del rango
   * @param endDate Fecha de fin del rango
   * @param userTokens Tokens OAuth del usuario
   * @returns Array de eventos en el rango especificado
   */
  getEventsWithTokens(
    participantEmail: string,
    startDate: Date,
    endDate: Date,
    userTokens: UserTokens,
  ): Promise<CalendarEvent[]>;
}
