"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const astro_service_1 = require("./astro.service");
const numerology_service_1 = require("./numerology.service");
const templates_service_1 = require("./templates.service");
let ReportService = ReportService_1 = class ReportService {
    constructor(prisma, astroService, numerologyService, templatesService) {
        this.prisma = prisma;
        this.astroService = astroService;
        this.numerologyService = numerologyService;
        this.templatesService = templatesService;
        this.logger = new common_1.Logger(ReportService_1.name);
    }
    async generateReport(data) {
        try {
            this.logger.log(`🔮 Generando informe para ${data.nombre}...`);
            const cartaNatal = await this.astroService.calculateNatalChart(data.fecha_nacimiento, data.hora_nacimiento || null, data.latitud, data.longitud);
            const perfilNumerologico = await this.numerologyService.getCompleteProfile(data.fecha_nacimiento, data.nombre);
            const signoSolar = cartaNatal.planets?.Sol?.sign?.toLowerCase() || 'desconocido';
            const numeroCaminoVida = perfilNumerologico.life_path?.life_path_number || 0;
            const interpretacionSigno = this.templatesService.getSignoSolarInterpretation(signoSolar);
            const interpretacionNumero = this.templatesService.getNumeroCaminoVidaInterpretation(numeroCaminoVida);
            const integracion = this.templatesService.getIntegracion();
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
                    informe_json: informeCompleto,
                },
            });
            this.logger.log(`✅ Informe generado exitosamente: ${informe.id}`);
            return {
                informe_id: informe.id,
                mensaje: 'Informe generado exitosamente',
            };
        }
        catch (error) {
            this.logger.error('❌ Error generando informe:', error);
            throw error;
        }
    }
    async getInforme(id) {
        try {
            const informe = await this.prisma.informe.findUnique({
                where: { id },
            });
            if (!informe) {
                throw new common_1.NotFoundException(`Informe con ID ${id} no encontrado`);
            }
            this.logger.log(`📖 Informe ${id} recuperado exitosamente`);
            const informeJson = informe.informe_json;
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error('❌ Error recuperando informe:', error);
            throw error;
        }
    }
    async getAllInformes() {
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
        }
        catch (error) {
            this.logger.error('❌ Error listando informes:', error);
            throw error;
        }
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        astro_service_1.AstroService,
        numerology_service_1.NumerologyService,
        templates_service_1.TemplatesService])
], ReportService);
//# sourceMappingURL=report.service.js.map