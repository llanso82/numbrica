
import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

@Injectable()
export class NumerologyService {
  private readonly logger = new Logger(NumerologyService.name);
  private readonly pythonEnginesPath = process.env.PYTHON_ENGINES_PATH 
    ? join(process.cwd(), process.env.PYTHON_ENGINES_PATH)
    : join(process.cwd(), 'python_engines');

  async calculateLifePath(fechaNacimiento: string): Promise<any> {
    try {
      const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from numerology_engine import calculate_life_path
import json

result = calculate_life_path('${fechaNacimiento}')
print(json.dumps(result, ensure_ascii=False))
`;

      const { stdout, stderr } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
      
      if (stderr) {
        this.logger.warn('Advertencia del motor numerológico:', stderr);
      }

      const result = JSON.parse(stdout);
      this.logger.log(`✅ Número de camino de vida calculado: ${result.life_path_number}`);
      
      return result;
    } catch (error) {
      this.logger.error('❌ Error calculando número de camino de vida:', error);
      throw new Error(`Error en cálculo numerológico: ${error.message}`);
    }
  }

  async calculateExpressionNumber(nombreCompleto: string): Promise<any> {
    try {
      const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from numerology_engine import calculate_expression_number
import json

result = calculate_expression_number('${nombreCompleto}')
print(json.dumps(result, ensure_ascii=False))
`;

      const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
      const result = JSON.parse(stdout);
      
      return result;
    } catch (error) {
      this.logger.error('❌ Error calculando número de expresión:', error);
      throw error;
    }
  }

  async getCompleteProfile(fechaNacimiento: string, nombreCompleto: string): Promise<any> {
    try {
      const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from numerology_engine import get_complete_numerology_profile
import json

result = get_complete_numerology_profile('${fechaNacimiento}', '${nombreCompleto}')
print(json.dumps(result, ensure_ascii=False))
`;

      const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
      const result = JSON.parse(stdout);
      
      this.logger.log(`✅ Perfil numerológico completo calculado para ${nombreCompleto}`);
      return result;
    } catch (error) {
      this.logger.error('❌ Error en perfil numerológico completo:', error);
      throw error;
    }
  }
}
