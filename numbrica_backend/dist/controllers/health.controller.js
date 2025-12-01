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
var HealthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/public.decorator");
let HealthController = HealthController_1 = class HealthController {
    constructor() {
        this.logger = new common_1.Logger(HealthController_1.name);
    }
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
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Verifica que la API está operativa y lista para recibir solicitudes.',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = HealthController_1 = __decorate([
    (0, swagger_1.ApiTags)('Utilidades'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('api')
], HealthController);
//# sourceMappingURL=health.controller.js.map