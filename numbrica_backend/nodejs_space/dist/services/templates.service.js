"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TemplatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let TemplatesService = TemplatesService_1 = class TemplatesService {
    constructor() {
        this.logger = new common_1.Logger(TemplatesService_1.name);
    }
    async onModuleInit() {
        await this.loadTemplates();
    }
    async loadTemplates() {
        try {
            const templatesPath = process.env.PYTHON_TEMPLATES_PATH
                ? (0, path_1.join)(process.cwd(), process.env.PYTHON_TEMPLATES_PATH)
                : (0, path_1.join)(process.cwd(), 'python_templates');
            const filePath = (0, path_1.join)(templatesPath, 'interpretations.json');
            const content = await (0, promises_1.readFile)(filePath, 'utf-8');
            this.interpretations = JSON.parse(content);
            this.logger.log('✅ Plantillas de interpretación cargadas exitosamente');
            this.logger.log(`📖 ${Object.keys(this.interpretations.signos_solares).length} signos solares`);
            this.logger.log(`🔢 ${Object.keys(this.interpretations.numeros_camino_vida).length} números de camino de vida`);
        }
        catch (error) {
            this.logger.error('❌ Error cargando plantillas:', error);
            throw error;
        }
    }
    getSignoSolarInterpretation(signo) {
        const signoLower = signo.toLowerCase();
        return this.interpretations.signos_solares[signoLower] ||
            'Interpretación no disponible para este signo.';
    }
    getNumeroCaminoVidaInterpretation(numero) {
        const numeroStr = numero.toString();
        return this.interpretations.numeros_camino_vida[numeroStr] ||
            'Interpretación no disponible para este número.';
    }
    getAspectoInterpretation(aspecto) {
        const aspectoLower = aspecto.toLowerCase();
        return this.interpretations.aspectos_genericos[aspectoLower] ||
            'Interpretación no disponible para este aspecto.';
    }
    getIntegracion() {
        return this.interpretations.integracion;
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = TemplatesService_1 = __decorate([
    (0, common_1.Injectable)()
], TemplatesService);
//# sourceMappingURL=templates.service.js.map