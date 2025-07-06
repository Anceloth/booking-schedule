import { IsString, IsDate, IsUUID, IsArray, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  startDate: Date;

  @IsDate()
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
  startDate?: Date;

  @IsDate()
  @IsOptional()
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
  createdAt: Date;
  updatedAt: Date;
}
