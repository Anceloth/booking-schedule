import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import {
  CalendarService,
  CalendarEvent,
  UserTokens,
} from '../../domain/services/calendar.service';

@Injectable()
export class GoogleCalendarService implements CalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private oauth2Client: any;

  constructor(private readonly configService: ConfigService) {
    this.initializeOAuth2Client();
  }

  private initializeOAuth2Client() {
    try {
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      const clientSecret = this.configService.get<string>(
        'GOOGLE_CLIENT_SECRET',
      );
      const redirectUri = this.configService.get<string>('GOOGLE_CALLBACK_URL');

      if (!clientId || !clientSecret || !redirectUri) {
        this.logger.warn('Google Calendar OAuth not configured properly');
        return;
      }

      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri,
      );
    } catch (error) {
      this.logger.error('Failed to initialize Google OAuth2 client', error);
      this.oauth2Client = null;
    }
  }

  /**
   * Genera URL de autorización para OAuth 2.0
   */
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'select_account',
      include_granted_scopes: true,
    }) as string;
  }

  /**
   * Verifica que la configuración OAuth sea válida
   */
  validateOAuthConfig(): {
    isValid: boolean;
    error?: string;
    authUrl?: string;
  } {
    try {
      if (!this.oauth2Client) {
        return {
          isValid: false,
          error: 'OAuth2 client not initialized. Check environment variables.',
        };
      }

      const authUrl = this.getAuthUrl();
      
      if (
        !authUrl ||
        !authUrl.startsWith('https://accounts.google.com/o/oauth2/')
      ) {
        return {
          isValid: false,
          error: 'Generated auth URL is invalid',
        };
      }

      return {
        isValid: true,
        authUrl: authUrl,
      };
    } catch (error) {
      return {
        isValid: false,
        error: `OAuth validation failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Intercambia el código de autorización por tokens
   */
  async getTokensFromCode(code: string): Promise<UserTokens> {
    if (!this.oauth2Client) {
      throw new Error('OAuth2 client not initialized');
    }

    const { tokens } = await this.oauth2Client.getTokens(code);
    return {
      accessToken: tokens.access_token as string,
      refreshToken: tokens.refresh_token as string,
    };
  }

  /**
   * Obtiene eventos del calendario con tokens de usuario
   */
  async getEventsWithTokens(
    participantEmail: string,
    startDate: Date,
    endDate: Date,
    userTokens: UserTokens,
  ): Promise<CalendarEvent[]> {
    try {
      if (!this.oauth2Client) {
        this.logger.warn('Google Calendar OAuth not configured');
        return [];
      }

      // Configurar tokens para esta petición
      this.oauth2Client.setCredentials({
        access_token: userTokens.accessToken,
        refresh_token: userTokens.refreshToken,
      });

      const calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client,
      });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      return events
        .filter((event) => event.start?.dateTime && event.end?.dateTime)
        .map((event) => ({
          title: event.summary || 'Sin título',
          start: new Date(event.start!.dateTime!),
          end: new Date(event.end!.dateTime!),
        }));
    } catch (error) {
      this.logger.error(`Failed to get events for ${participantEmail}`, error);
      return [];
    }
  }

  /**
   * Verifica conflictos de calendario con tokens de usuario
   */
  async checkConflictsWithTokens(
    participantEmail: string,
    startDate: Date,
    endDate: Date,
    userTokens: UserTokens,
  ): Promise<CalendarEvent[]> {
    try {
      const events = await this.getEventsWithTokens(
        participantEmail,
        startDate,
        endDate,
        userTokens,
      );

      // Filtrar eventos que se solapan con el tiempo propuesto
      return events.filter((event) =>
        this.isTimeOverlapping(startDate, endDate, event.start, event.end),
      );
    } catch (error) {
      this.logger.error(
        `Failed to check conflicts for ${participantEmail}`,
        error,
      );
      return [];
    }
  }

  // Métodos requeridos por la interfaz CalendarService (sin implementación OAuth)
  checkConflicts(): Promise<CalendarEvent[]> {
    this.logger.warn('Use checkConflictsWithTokens instead');
    return Promise.resolve([]);
  }

  getEvents(): Promise<CalendarEvent[]> {
    this.logger.warn('Use getEventsWithTokens instead');
    return Promise.resolve([]);
  }

  private isTimeOverlapping(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return start1 < end2 && start2 < end1;
  }
}
