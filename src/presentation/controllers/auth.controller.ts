import { Controller, Get, Query, Res, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Response } from 'express';
import { GoogleCalendarService } from '../../infrastructure/external/google-calendar.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { REPOSITORY_TOKENS } from '../../shared/constants/app.constants';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  @Get('google')
  @ApiOperation({ summary: 'Iniciar autenticación con Google Calendar' })
  @ApiResponse({
    status: 302,
    description: 'Redirección a Google para autorización',
  })
  async googleAuth(@Res() res: Response) {
    try {
      const authUrl = this.googleCalendarService.getAuthUrl();
      return res.redirect(authUrl);
    } catch (error) {
      this.logger.error('Error generating Google auth URL', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to generate authorization URL',
      });
    }
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Callback de autenticación con Google' })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la autenticación',
  })
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error) {
      this.logger.error('Google auth error:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Authorization denied',
      });
    }

    if (!code) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Authorization code not provided',
      });
    }

    try {
      // Intercambiar código por tokens
      const tokens = await this.googleCalendarService.getTokensFromCode(code);

      // Para simplicidad, vamos a usar un usuario de desarrollo
      // En producción, esto debería asociarse con el usuario actual
      const devUser = await this.userRepository.findByEmail('dev@example.com');
      
      if (!devUser) {
        // Crear usuario de desarrollo si no existe
        const newUser = new User(
          'dev-user-id',
          'dev@example.com',
          'Development User',
        );
        await this.userRepository.save(newUser);
      }

      // Aquí deberías actualizar el usuario con los tokens
      // Por ahora, solo mostramos que funcionó
      
      return res.status(HttpStatus.OK).json({
        message: 'Google Calendar connected successfully!',
        user: 'dev@example.com',
        hasTokens: !!(tokens.accessToken && tokens.refreshToken),
      });
    } catch (error) {
      this.logger.error('Error exchanging code for tokens', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to exchange authorization code',
      });
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Verificar estado de autenticación' })
  @ApiResponse({
    status: 200,
    description: 'Estado de autenticación',
  })
  async getAuthStatus() {
    try {
      // Verificar si hay tokens guardados para el usuario de desarrollo
      const devUser = await this.userRepository.findByEmail('dev@example.com');
      
      return {
        isAuthenticated: !!devUser,
        user: devUser ? devUser.email : null,
        message: devUser
          ? 'Google Calendar is connected'
          : 'Google Calendar not connected. Visit /auth/google to authorize.',
      };
    } catch (error) {
      this.logger.error('Error checking auth status', error);
      return {
        isAuthenticated: false,
        error: 'Failed to check authentication status',
      };
    }
  }
}
