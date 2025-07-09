import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking.use-case';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking.use-case';
import { CalendarConflictException } from '../../domain/exceptions/calendar-conflict.exception';
import { ConflictVerificationService } from '../../domain/services/conflict-verification.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingResponseDto,
} from '../../application/dtos/booking.dto';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { REPOSITORY_TOKENS } from '../../shared/constants/app.constants';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly conflictVerificationService: ConflictVerificationService,
    @Inject(REPOSITORY_TOKENS.BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de calendario detectado',
  })
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    try {
      const booking = await this.createBookingUseCase.execute(createBookingDto);
      return this.toResponseDto(booking);
    } catch (error) {
      if (error instanceof CalendarConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        (error as Error).message ?? 'Failed to create booking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las reservas',
    type: [BookingResponseDto],
  })
  async getAllBookings(): Promise<BookingResponseDto[]> {
    try {
      const bookings = await this.bookingRepository.findAll();
      return bookings.map((booking) => this.toResponseDto(booking));
    } catch (error) {
      throw new HttpException(
        (error as Error).message ?? 'Failed to retrieve bookings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reserva',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  async getBookingById(@Param('id') id: string): Promise<BookingResponseDto> {
    try {
      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
      }
      return this.toResponseDto(booking);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una reserva' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reserva',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada exitosamente',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    try {
      const booking = await this.bookingRepository.update(id, updateBookingDto);
      return this.toResponseDto(booking);
    } catch (error) {
      throw new HttpException(
        (error as Error).message ?? 'Failed to update booking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una reserva' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reserva a cancelar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada exitosamente',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'La reserva ya está cancelada o no se puede cancelar',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  async cancelBooking(@Param('id') id: string): Promise<BookingResponseDto> {
    try {
      const booking = await this.cancelBookingUseCase.execute(id);
      return this.toResponseDto(booking);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        (error as Error).message ?? 'Failed to cancel booking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('availability')
  @ApiOperation({ summary: 'Verificar disponibilidad de participantes' })
  @ApiQuery({
    name: 'participantIds',
    description: 'IDs de participantes separados por comas',
    example: 'participant1,participant2,participant3',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Fecha de inicio en formato ISO',
    example: '2025-07-10T10:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Fecha de fin en formato ISO',
    example: '2025-07-10T11:00:00.000Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de disponibilidad de participantes',
    schema: {
      type: 'object',
      properties: {
        available: {
          type: 'boolean',
          description: 'Si todos los participantes están disponibles',
        },
        conflicts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              participantId: { type: 'string' },
              email: { type: 'string' },
              conflictingEvents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    start: { type: 'string', format: 'date-time' },
                    end: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de consulta inválidos',
  })
  async checkAvailability(
    @Query('participantIds') participantIds: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      if (!participantIds || !startDate || !endDate) {
        throw new HttpException(
          'participantIds, startDate, and endDate are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const participants = participantIds.split(',').map((id) => id.trim());
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new HttpException(
          'Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          HttpStatus.BAD_REQUEST,
        );
      }

      const availability =
        await this.conflictVerificationService.getParticipantAvailability(
          participants,
          start,
          end,
        );

      const conflicts: Array<{
        participantId: string;
        email: string;
        conflictingEvents: any[];
      }> = [];
      let allAvailable = true;

      for (const [participantId, info] of availability.entries()) {
        if (info.conflicts.length > 0) {
          allAvailable = false;
          conflicts.push({
            participantId,
            email: info.email,
            conflictingEvents: info.conflicts,
          });
        }
      }

      return {
        available: allAvailable,
        conflicts,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to check availability',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private toResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      title: booking.title,
      description: booking.description,
      startDate: booking.startDate,
      endDate: booking.endDate,
      organizerId: booking.organizerId,
      participants: booking.participants,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
