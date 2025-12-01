
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { CalculateDto, CalculateResponseDto } from '../dto/calculate.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Cálculos')
@Public()
@Controller('api')
export class CalculateController {
  private readonly logger = new Logger(CalculateController.name);

  constructor(private readonly reportService: ReportService) {}

  @Post('calculate')
  @ApiOperation({
    summary: 'Generar informe astrológico y numerológico completo',
    description: 'Recibe datos de nacimiento, calcula carta natal y numerología, y genera un informe personalizado que se guarda en la base de datos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Informe generado exitosamente',
    type: CalculateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async calculate(@Body() calculateDto: CalculateDto): Promise<CalculateResponseDto> {
    try {
      this.logger.log(`🔮 Solicitud de cálculo para: ${calculateDto.nombre}`);
      
      const result = await this.reportService.generateReport({
        nombre: calculateDto.nombre,
        fecha_nacimiento: calculateDto.fecha_nacimiento,
        hora_nacimiento: calculateDto.hora_nacimiento,
        lugar: calculateDto.lugar,
        latitud: calculateDto.latitud,
        longitud: calculateDto.longitud,
      });

      this.logger.log(`✅ Informe generado: ${result.informe_id}`);
      return result;
    } catch (error) {
      this.logger.error('❌ Error en calculate:', error);
      throw error;
    }
  }
}
