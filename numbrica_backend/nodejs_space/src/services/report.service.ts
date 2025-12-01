
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AstroService } from './astro.service';
import { NumerologyService } from './numerology.service';
import { TemplatesService } from './templates.service';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private prisma: PrismaService,
    private astroService: AstroService,
    private numerologyService: NumerologyService,
    private templatesService: TemplatesService,
  ) {}

  async generateReport(data: {
    nombre: string;
    fecha_nacimiento: string;
    hora_nacimiento?: string;
    lugar: string;
    latitud: number;
    longitud: number;
  }): Promise<{ informe_id: string; mensaje: string }> {
    try {
      this.logger.log(`🔮 Generando informe para ${data.nombre}...`);

      // Calcular carta natal
      const cartaNatal = await this.astroService.calculateNatalChart(
        data.fecha_nacimiento,
        data.hora_nacimiento || null,
        data.latitud,
        data.longitud,
      );

      // Calcular numerología
      const perfilNumerologico = await this.numerologyService.getCompleteProfile(
        data.fecha_nacimiento,
        data.nombre,
      );

      // Extraer signo solar (normalizar nombre)
      const signoSolar = cartaNatal.planets?.Sol?.sign?.toLowerCase() || 'desconocido';
      const numeroCaminoVida = perfilNumerologico.life_path?.life_path_number || 0;

      // Obtener interpretaciones de plantillas
      const interpretacionSigno = this.templatesService.getSignoSolarInterpretation(signoSolar);
      const interpretacionNumero = this.templatesService.getNumeroCaminoVidaInterpretation(numeroCaminoVida);
      const integracion = this.templatesService.getIntegracion();

      // Construir informe completo
      const informeCompleto = {
        datos_personales: {
          nombre: data.nombre,
          fecha_nacimiento: data.fecha_nacimiento,
          hora_nacimiento: data.hora_nacimiento || 'No especificada (mediodía por defecto)',
          lugar: data.lugar,
          coordenadas: {
            latitud: data.latitud,
            longitud: data.longitud,
          },
        },
        astrologia: {
          signo_solar: signoSolar,
          interpretacion_signo: interpretacionSigno,
          planetas: cartaNatal.planets || {},
          ascendente: cartaNatal.ascendant || null,
          aspectos: (cartaNatal.aspects || []).map((aspecto) => ({
            ...aspecto,
            interpretacion: this.templatesService.getAspectoInterpretation(aspecto.aspect),
          })),
          carta_completa: cartaNatal,
        },
        numerologia: {
          numero_camino_vida: numeroCaminoVida,
          interpretacion_numero: interpretacionNumero,
          perfil_completo: perfilNumerologico,
        },
        integracion,
        generado_en: new Date().toISOString(),
      };

      // Guardar en base de datos
      const informe = await this.prisma.informe.create({
        data: {
          nombre: data.nombre,
          fecha_nacimiento: new Date(data.fecha_nacimiento),
          hora_nacimiento: data.hora_nacimiento || null,
          lugar: data.lugar,
          latitud: data.latitud,
          longitud: data.longitud,
          signo_solar: signoSolar,
          numero_camino_vida: numeroCaminoVida,
          informe_json: informeCompleto as any,
        },
      });

      this.logger.log(`✅ Informe generado exitosamente: ${informe.id}`);

      return {
        informe_id: informe.id,
        mensaje: 'Informe generado exitosamente',
      };
    } catch (error) {
      this.logger.error('❌ Error generando informe:', error);
      throw error;
    }
  }

  async getInforme(id: string): Promise<any> {
    try {
      const informe = await this.prisma.informe.findUnique({
        where: { id },
      });

      if (!informe) {
        throw new NotFoundException(`Informe con ID ${id} no encontrado`);
      }

      this.logger.log(`📖 Informe ${id} recuperado exitosamente`);

      const informeJson = informe.informe_json as any;
      
      return {
        id: informe.id,
        nombre: informe.nombre,
        fecha_nacimiento: informe.fecha_nacimiento,
        hora_nacimiento: informe.hora_nacimiento,
        lugar: informe.lugar,
        signo_solar: informe.signo_solar,
        numero_camino_vida: informe.numero_camino_vida,
        created_at: informe.created_at,
        ...(typeof informeJson === 'object' ? informeJson : {}),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('❌ Error recuperando informe:', error);
      throw error;
    }
  }

  async getAllInformes(): Promise<any[]> {
    try {
      const informes = await this.prisma.informe.findMany({
        orderBy: { created_at: 'desc' },
        take: 100,
      });

      return informes.map((informe) => ({
        id: informe.id,
        nombre: informe.nombre,
        fecha_nacimiento: informe.fecha_nacimiento,
        lugar: informe.lugar,
        signo_solar: informe.signo_solar,
        numero_camino_vida: informe.numero_camino_vida,
        created_at: informe.created_at,
      }));
    } catch (error) {
      this.logger.error('❌ Error listando informes:', error);
      throw error;
    }
  }
}
