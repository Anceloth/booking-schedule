import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaBookingRepository } from './infrastructure/database/repositories/booking.repository';
import { PrismaUserRepository } from './infrastructure/database/repositories/user.repository';
import { CreateBookingUseCase } from './application/use-cases/create-booking.use-case';
import { CancelBookingUseCase } from './application/use-cases/cancel-booking.use-case';
import { ConflictVerificationService } from './domain/services/conflict-verification.service';
import { GoogleCalendarService } from './infrastructure/external/google-calendar.service';
import { BookingController } from './presentation/controllers/booking.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { DiagnosticsController } from './presentation/controllers/diagnostics.controller';
import {
  REPOSITORY_TOKENS,
  SERVICE_TOKENS,
} from './shared/constants/app.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [BookingController, AuthController, DiagnosticsController],
  providers: [
    // Database
    PrismaService,
    // Use Cases
    CreateBookingUseCase,
    CancelBookingUseCase,
    // Domain Services
    ConflictVerificationService,
    // External Services
    GoogleCalendarService,
    {
      provide: SERVICE_TOKENS.CALENDAR_SERVICE,
      useClass: GoogleCalendarService,
    },
    // Repositories
    {
      provide: REPOSITORY_TOKENS.BOOKING_REPOSITORY,
      useClass: PrismaBookingRepository,
    },
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    REPOSITORY_TOKENS.BOOKING_REPOSITORY,
    REPOSITORY_TOKENS.USER_REPOSITORY,
  ],
})
export class BookingScheduleModule {}
