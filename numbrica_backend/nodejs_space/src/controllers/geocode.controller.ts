
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GeoccodingService } from '../services/geocoding.service';
import { GeocodeDto, GeocodeResponseDto } from '../dto/geocode.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Utilidades')
@Public()
@Controller('api')
export class GeocodeController {
  private readonly logger = new Logger(GeocodeController.name);

  constructor(private readonly geocodingService: GeoccodingService) {}

  @Post('geocode')
  @ApiOperation({
    summary: 'Convertir lugar a coordenadas',
    description: 'Servicio auxiliar que convierte el nombre de un lugar a coordenadas geográficas (latitud y longitud) usando OpenStreetMap.',
  })
  @ApiResponse({
    status: 200,
    description: 'Coordenadas encontradas',
    type: GeocodeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Lugar no encontrado',
  })
  async geocode(@Body() geocodeDto: GeocodeDto): Promise<GeocodeResponseDto> {
    try {
      this.logger.log(`🌍 Geocodificando: ${geocodeDto.lugar}`);
      const result = await this.geocodingService.geocode(geocodeDto.lugar);
      this.logger.log(`✅ Coordenadas: ${result.latitud}, ${result.longitud}`);
      return result;
    } catch (error) {
      this.logger.error('❌ Error en geocode:', error);
      throw error;
    }
  }
}
