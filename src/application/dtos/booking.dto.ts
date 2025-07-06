import { IsString, IsDate, IsUUID, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { BookingStatus } from '../../domain/entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  startDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  endDate: Date;

  @IsUUID()
  organizerId: string;

  @IsArray()
  @IsOptional()
  participants?: string[];
}

export class UpdateBookingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  endDate?: Date;

  @IsArray()
  @IsOptional()
  participants?: string[];
}

export class BookingResponseDto {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  organizerId: string;
  participants: string[];
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
