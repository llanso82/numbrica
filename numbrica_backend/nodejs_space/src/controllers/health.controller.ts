
import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@ApiTags('Utilidades')
@Public()
@Controller('api')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifica que la API está operativa y lista para recibir solicitudes.',
  })
  @ApiResponse({
    status: 200,
    description: 'API operativa',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-11-18T19:30:00.000Z',
        service: 'Numbrica Backend',
        version: '1.0.0',
      },
    },
  })
  getHealth() {
    this.logger.log('💚 Health check realizado');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Numbrica Backend',
      version: '1.0.0',
      mensaje: '🔮 API de Astrología y Numerología operativa',
    };
  }
}
