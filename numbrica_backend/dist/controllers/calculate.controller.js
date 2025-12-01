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
var CalculateController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_service_1 = require("../services/report.service");
const calculate_dto_1 = require("../dto/calculate.dto");
const public_decorator_1 = require("../auth/public.decorator");
let CalculateController = CalculateController_1 = class CalculateController {
    constructor(reportService) {
        this.reportService = reportService;
        this.logger = new common_1.Logger(CalculateController_1.name);
    }
    async calculate(calculateDto) {
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
        }
        catch (error) {
            this.logger.error('❌ Error en calculate:', error);
            throw error;
        }
    }
};
exports.CalculateController = CalculateController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generar informe astrológico y numerológico completo',
        description: 'Recibe datos de nacimiento, calcula carta natal y numerología, y genera un informe personalizado que se guarda en la base de datos.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Informe generado exitosamente',
        type: calculate_dto_1.CalculateResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos inválidos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Error interno del servidor',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_dto_1.CalculateDto]),
    __metadata("design:returntype", Promise)
], CalculateController.prototype, "calculate", null);
exports.CalculateController = CalculateController = CalculateController_1 = __decorate([
    (0, swagger_1.ApiTags)('Cálculos'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], CalculateController);
//# sourceMappingURL=calculate.controller.js.map