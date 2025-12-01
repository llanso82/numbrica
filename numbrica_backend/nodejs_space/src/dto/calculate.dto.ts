
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Matches } from 'class-validator';

export class CalculateDto {
  @ApiProperty({
    description: 'Nombre completo de la persona',
    example: 'María Guadalupe López',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '1990-05-15',
  })
  @IsString()
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe estar en formato YYYY-MM-DD',
  })
  fecha_nacimiento: string;

  @ApiPropertyOptional({
    description: 'Hora de nacimiento en formato HH:MM (opcional, se usa mediodía si no se proporciona)',
    example: '14:30',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'La hora debe estar en formato HH:MM',
  })
  hora_nacimiento?: string;

  @ApiProperty({
    description: 'Lugar de nacimiento',
    example: 'Ciudad de México, México',
  })
  @IsString()
  @IsNotEmpty({ message: 'El lugar es obligatorio' })
  lugar: string;

  @ApiProperty({
    description: 'Latitud del lugar de nacimiento',
    example: 19.4326,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'La latitud es obligatoria' })
  latitud: number;

  @ApiProperty({
    description: 'Longitud del lugar de nacimiento',
    example: -99.1332,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'La longitud es obligatoria' })
  longitud: number;
}

export class CalculateResponseDto {
  @ApiProperty({
    description: 'ID único del informe generado',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  informe_id: string;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Informe generado exitosamente',
  })
  mensaje: string;
}
