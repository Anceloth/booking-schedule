import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  @IsString()
  name: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'John Doe Updated',
  })
  @IsString()
  @IsOptional()
  name?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'f2b8894c-74bd-4052-a85a-5420e9688f2c',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  name: string;

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
