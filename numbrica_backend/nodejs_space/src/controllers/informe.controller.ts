
import { Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReportService } from '../services/report.service';
import { Public } from '../auth/public.decorator';

@ApiTags('Informes')
@Public()
@Controller('api')
export class InformeController {
  private readonly logger = new Logger(InformeController.name);

  constructor(private readonly reportService: ReportService) {}

  @Get('informe/:id')
  @ApiOperation({
    summary: 'Obtener informe completo por ID',
    description: 'Recupera un informe previamente generado con todas sus interpretaciones astrológicas y numerológicas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del informe (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Informe encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Informe no encontrado',
  })
  async getInforme(@Param('id') id: string) {
    try {
      this.logger.log(`📖 Consultando informe: ${id}`);
      return await this.reportService.getInforme(id);
    } catch (error) {
      this.logger.error(`❌ Error obteniendo informe ${id}:`, error);
      throw error;
    }
  }

  @Get('informes')
  @ApiOperation({
    summary: 'Listar todos los informes',
    description: 'Obtiene un listado resumido de todos los informes generados (últimos 100).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de informes',
  })
  async getAllInformes() {
    try {
      this.logger.log('📚 Consultando lista de informes');
      return await this.reportService.getAllInformes();
    } catch (error) {
      this.logger.error('❌ Error listando informes:', error);
      throw error;
    }
  }
}
