import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking.use-case';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking.use-case';
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingResponseDto,
} from '../../application/dtos/booking.dto';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { REPOSITORY_TOKENS } from '../../shared/constants/app.constants';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    @Inject(REPOSITORY_TOKENS.BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    try {
      const booking = await this.createBookingUseCase.execute(createBookingDto);
      return this.toResponseDto(booking);
    } catch (error) {
      throw new HttpException(
        (error as Error).message ?? 'Failed to create booking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
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
