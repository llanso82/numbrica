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
var GeocodeController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const geocoding_service_1 = require("../services/geocoding.service");
const geocode_dto_1 = require("../dto/geocode.dto");
const public_decorator_1 = require("../auth/public.decorator");
let GeocodeController = GeocodeController_1 = class GeocodeController {
    constructor(geocodingService) {
        this.geocodingService = geocodingService;
        this.logger = new common_1.Logger(GeocodeController_1.name);
    }
    async geocode(geocodeDto) {
        try {
            this.logger.log(`🌍 Geocodificando: ${geocodeDto.lugar}`);
            const result = await this.geocodingService.geocode(geocodeDto.lugar);
            this.logger.log(`✅ Coordenadas: ${result.latitud}, ${result.longitud}`);
            return result;
        }
        catch (error) {
            this.logger.error('❌ Error en geocode:', error);
            throw error;
        }
    }
};
exports.GeocodeController = GeocodeController;
__decorate([
    (0, common_1.Post)('geocode'),
    (0, swagger_1.ApiOperation)({
        summary: 'Convertir lugar a coordenadas',
        description: 'Servicio auxiliar que convierte el nombre de un lugar a coordenadas geográficas (latitud y longitud) usando OpenStreetMap.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Coordenadas encontradas',
        type: geocode_dto_1.GeocodeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Lugar no encontrado',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geocode_dto_1.GeocodeDto]),
    __metadata("design:returntype", Promise)
], GeocodeController.prototype, "geocode", null);
exports.GeocodeController = GeocodeController = GeocodeController_1 = __decorate([
    (0, swagger_1.ApiTags)('Utilidades'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [geocoding_service_1.GeoccodingService])
], GeocodeController);
//# sourceMappingURL=geocode.controller.js.map