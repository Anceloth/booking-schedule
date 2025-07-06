import { IsString, IsDate, IsUUID, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../../domain/entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Título de la reserva',
    example: 'Reunión de Equipo',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la reserva',
    example: 'Reunión semanal del equipo de desarrollo',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la reserva',
    example: '2025-07-10T09:00:00.000Z',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  startDate: Date;

  @ApiProperty({
    description: 'Fecha y hora de fin de la reserva',
    example: '2025-07-10T10:00:00.000Z',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  endDate: Date;

  @ApiProperty({
    description: 'UUID del organizador de la reserva',
    example: 'f2b8894c-74bd-4052-a85a-5420e9688f2c',
  })
  @IsUUID()
  organizerId: string;

  @ApiPropertyOptional({
    description: 'Array de UUIDs de los participantes',
    example: ['54637498-f140-41a8-a412-32ca2e1231e5'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  participants?: string[];
}

export class UpdateBookingDto {
  @ApiPropertyOptional({
    description: 'Título de la reserva',
    example: 'Reunión de Equipo - Actualizada',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada de la reserva',
    example: 'Reunión semanal del equipo de desarrollo con agenda actualizada',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de inicio de la reserva',
    example: '2025-07-10T09:30:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha y hora de fin de la reserva',
    example: '2025-07-10T10:30:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Array de UUIDs de los participantes',
    example: ['54637498-f140-41a8-a412-32ca2e1231e5'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  participants?: string[];
}

export class BookingResponseDto {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la reserva',
    example: 'Reunión de Equipo',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción de la reserva',
    example: 'Reunión semanal del equipo de desarrollo',
  })
  description: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio',
    example: '2025-07-10T09:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Fecha y hora de fin',
    example: '2025-07-10T10:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'UUID del organizador',
    example: 'f2b8894c-74bd-4052-a85a-5420e9688f2c',
  })
  organizerId: string;

  @ApiProperty({
    description: 'Array de UUIDs de participantes',
    example: ['54637498-f140-41a8-a412-32ca2e1231e5'],
    type: [String],
  })
  participants: string[];

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'ACTIVE',
    enum: BookingStatus,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-07-06T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-07-06T12:00:00.000Z',
  })
  updatedAt: Date;
}
