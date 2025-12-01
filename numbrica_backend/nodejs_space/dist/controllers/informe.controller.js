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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InformeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InformeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_service_1 = require("../services/report.service");
let InformeController = InformeController_1 = class InformeController {
    constructor(reportService) {
        this.reportService = reportService;
        this.logger = new common_1.Logger(InformeController_1.name);
    }
    async getInforme(id) {
        try {
            this.logger.log(`📖 Consultando informe: ${id}`);
            return await this.reportService.getInforme(id);
        }
        catch (error) {
            this.logger.error(`❌ Error obteniendo informe ${id}:`, error);
            throw error;
        }
    }
    async getAllInformes() {
        try {
            this.logger.log('📚 Consultando lista de informes');
            return await this.reportService.getAllInformes();
        }
        catch (error) {
            this.logger.error('❌ Error listando informes:', error);
            throw error;
        }
    }
};
exports.InformeController = InformeController;
__decorate([
    (0, common_1.Get)('informe/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener informe completo por ID',
        description: 'Recupera un informe previamente generado con todas sus interpretaciones astrológicas y numerológicas.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID único del informe (UUID)',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Informe encontrado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Informe no encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InformeController.prototype, "getInforme", null);
__decorate([
    (0, common_1.Get)('informes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos los informes',
        description: 'Obtiene un listado resumido de todos los informes generados (últimos 100).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de informes',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InformeController.prototype, "getAllInformes", null);
exports.InformeController = InformeController = InformeController_1 = __decorate([
    (0, swagger_1.ApiTags)('Informes'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], InformeController);
//# sourceMappingURL=informe.controller.js.map