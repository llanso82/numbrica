
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GeocodeDto {
  @ApiProperty({
    description: 'Nombre del lugar a geocodificar',
    example: 'Guadalajara, México',
  })
  @IsString()
  @IsNotEmpty({ message: 'El lugar es obligatorio' })
  lugar: string;
}

export class GeocodeResponseDto {
  @ApiProperty({
    description: 'Nombre completo del lugar encontrado',
    example: 'Guadalajara, Jalisco, México',
  })
  lugar: string;

  @ApiProperty({
    description: 'Latitud',
    example: 20.6597,
  })
  latitud: number;

  @ApiProperty({
    description: 'Longitud',
    example: -103.3496,
  })
  longitud: number;
}
