import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GoogleCalendarService } from '../../infrastructure/external/google-calendar.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('diagnostics')
@Controller('diagnostics')
export class DiagnosticsController {
  private readonly logger = new Logger(DiagnosticsController.name);

  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Get('google-calendar')
  @ApiOperation({ summary: 'Verificar conexión con Google Calendar' })
  @ApiResponse({
    status: 200,
    description: 'Conexión exitosa con Google Calendar',
  })
  @ApiResponse({
    status: 500,
    description: 'Error de conexión con Google Calendar',
  })
  async testGoogleCalendarConnection(): Promise<{
    message: string;
    status: string;
  }> {
    try {
      // Hacer validación real con Google OAuth
      const validation = this.googleCalendarService.validateOAuthConfig();

      if (!validation.isValid) {
        return {
          message: `Error en la configuración OAuth: ${validation.error}`,
          status: 'configuration_error',
        };
      }

      return {
        message: 'Google Calendar está listo para usar.',
        status: 'ready',
      };
    } catch (error) {
      this.logger.error('Error in Google Calendar connection test:', error);
      throw new HttpException(
        `Error de verificación: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
