
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface Interpretations {
  signos_solares: Record<string, string>;
  numeros_camino_vida: Record<string, string>;
  aspectos_genericos: Record<string, string>;
  integracion: string;
}

@Injectable()
export class TemplatesService implements OnModuleInit {
  private readonly logger = new Logger(TemplatesService.name);
  private interpretations: Interpretations;

  async onModuleInit() {
    await this.loadTemplates();
  }

  private async loadTemplates() {
    try {
      const templatesPath = process.env.PYTHON_TEMPLATES_PATH 
        ? join(process.cwd(), process.env.PYTHON_TEMPLATES_PATH)
        : join(process.cwd(), 'python_templates');
      const filePath = join(templatesPath, 'interpretations.json');
      
      const content = await readFile(filePath, 'utf-8');
      this.interpretations = JSON.parse(content);
      
      this.logger.log('✅ Plantillas de interpretación cargadas exitosamente');
      this.logger.log(`📖 ${Object.keys(this.interpretations.signos_solares).length} signos solares`);
      this.logger.log(`🔢 ${Object.keys(this.interpretations.numeros_camino_vida).length} números de camino de vida`);
    } catch (error) {
      this.logger.error('❌ Error cargando plantillas:', error);
      throw error;
    }
  }

  getSignoSolarInterpretation(signo: string): string {
    const signoLower = signo.toLowerCase();
    return this.interpretations.signos_solares[signoLower] || 
           'Interpretación no disponible para este signo.';
  }

  getNumeroCaminoVidaInterpretation(numero: number): string {
    const numeroStr = numero.toString();
    return this.interpretations.numeros_camino_vida[numeroStr] || 
           'Interpretación no disponible para este número.';
  }

  getAspectoInterpretation(aspecto: string): string {
    const aspectoLower = aspecto.toLowerCase();
    return this.interpretations.aspectos_genericos[aspectoLower] || 
           'Interpretación no disponible para este aspecto.';
  }

  getIntegracion(): string {
    return this.interpretations.integracion;
  }
}
