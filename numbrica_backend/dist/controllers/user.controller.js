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
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_decorator_1 = require("../auth/user.decorator");
const prisma_service_1 = require("../services/prisma.service");
const auth_dto_1 = require("../dto/auth.dto");
const email_service_1 = require("../services/email.service");
let UserController = UserController_1 = class UserController {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.logger = new common_1.Logger(UserController_1.name);
    }
    async getProfile(user) {
        const userData = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                email_verificado: true,
                consentimiento_servicio: true,
                consentimiento_marketing: true,
                consentimiento_timestamp: true,
                created_at: true,
                updated_at: true,
            },
        });
        return userData;
    }
    async updateProfile(user, dto) {
        const updateData = {};
        if (dto.nombre) {
            updateData.nombre = dto.nombre;
        }
        if (dto.email && dto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (existingUser) {
                return {
                    error: 'Este email ya está en uso',
                };
            }
            updateData.email = dto.email;
            updateData.email_verificado = false;
            try {
                await this.emailService.sendEmailChangeConfirmation(dto.email, user.nombre);
            }
            catch (error) {
                this.logger.error(`Error enviando email de confirmación: ${error.message}`);
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                email: true,
                nombre: true,
                email_verificado: true,
                updated_at: true,
            },
        });
        return {
            mensaje: 'Perfil actualizado exitosamente',
            user: updatedUser,
        };
    }
    async getUserInformes(user) {
        const informes = await this.prisma.informe.findMany({
            where: { user_id: user.id },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                nombre: true,
                fecha_nacimiento: true,
                lugar: true,
                signo_solar: true,
                numero_camino_vida: true,
                created_at: true,
            },
        });
        return {
            total: informes.length,
            informes,
        };
    }
    async updateConsentimientos(user, dto) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                consentimiento_marketing: dto.consentimiento_marketing,
                consentimiento_timestamp: new Date(),
            },
        });
        return {
            mensaje: 'Consentimientos actualizados exitosamente',
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfil del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil del usuario' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar perfil del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil actualizado' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('informes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener informes del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de informes' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInformes", null);
__decorate([
    (0, common_1.Put)('consentimientos'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar consentimientos de marketing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consentimientos actualizados' }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateConsentimientosDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateConsentimientos", null);
exports.UserController = UserController = UserController_1 = __decorate([
    (0, swagger_1.ApiTags)('Usuario'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/user'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], UserController);
//# sourceMappingURL=user.controller.js.map