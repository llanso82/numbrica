
import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

@Injectable()
export class AstroService {
  private readonly logger = new Logger(AstroService.name);
  private readonly pythonEnginesPath = process.env.PYTHON_ENGINES_PATH 
    ? join(process.cwd(), process.env.PYTHON_ENGINES_PATH)
    : join(process.cwd(), 'python_engines');

  async calculateNatalChart(
    fechaNacimiento: string,
    horaNacimiento: string | null,
    latitud: number,
    longitud: number,
  ): Promise<any> {
    try {
      const hora = horaNacimiento || '12:00';
      
      // Crear script Python temporal para ejecutar el cálculo
      const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from astro_engine import calculate_natal_chart
import json

result = calculate_natal_chart(
    birth_date='${fechaNacimiento}',
    birth_time='${hora}',
    latitude=${latitud},
    longitude=${longitud}
)

print(json.dumps(result, ensure_ascii=False))
`;

      const { stdout, stderr } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
      
      if (stderr) {
        this.logger.warn('Advertencia del motor astrológico:', stderr);
      }

      const result = JSON.parse(stdout);
      this.logger.log(`✅ Carta natal calculada para ${fechaNacimiento}`);
      
      return result;
    } catch (error) {
      this.logger.error('❌ Error calculando carta natal:', error);
      throw new Error(`Error en cálculo astrológico: ${error.message}`);
    }
  }

  async getSimpleChart(fechaNacimiento: string, horaNacimiento?: string): Promise<any> {
    try {
      const hora = horaNacimiento || '12:00';
      
      const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from astro_engine import get_simple_chart
import json

result = get_simple_chart(
    birth_date='${fechaNacimiento}',
    birth_time='${hora}'
)

print(json.dumps(result, ensure_ascii=False))
`;

      const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
      const result = JSON.parse(stdout);
      
      return result;
    } catch (error) {
      this.logger.error('❌ Error en getSimpleChart:', error);
      throw error;
    }
  }
}
