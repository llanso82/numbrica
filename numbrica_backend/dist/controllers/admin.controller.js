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
var AdminController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const prisma_service_1 = require("../services/prisma.service");
let AdminController = AdminController_1 = class AdminController {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AdminController_1.name);
    }
    async getUsers(page = '1', limit = '20', search) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = search
            ? {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { nombre: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    email: true,
                    nombre: true,
                    rol: true,
                    email_verificado: true,
                    consentimiento_marketing: true,
                    created_at: true,
                    _count: {
                        select: { informes: true },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }
    async getUserDetail(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
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
                informes: {
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
                },
            },
        });
        if (!user) {
            return { error: 'Usuario no encontrado' };
        }
        return user;
    }
    async getStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(todayStart);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const [totalUsers, totalInformes, usersToday, informesToday, informesLastWeek] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.informe.count(),
            this.prisma.user.count({
                where: { created_at: { gte: todayStart } },
            }),
            this.prisma.informe.count({
                where: { created_at: { gte: todayStart } },
            }),
            this.prisma.informe.findMany({
                where: { created_at: { gte: sevenDaysAgo } },
                select: { created_at: true },
            }),
        ]);
        const informesPorDia = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            informesPorDia[dateStr] = 0;
        }
        informesLastWeek.forEach((informe) => {
            const dateStr = informe.created_at.toISOString().split('T')[0];
            if (informesPorDia[dateStr] !== undefined) {
                informesPorDia[dateStr]++;
            }
        });
        return {
            total_usuarios: totalUsers,
            total_informes: totalInformes,
            nuevos_usuarios_hoy: usersToday,
            informes_hoy: informesToday,
            informes_ultimos_7_dias: Object.entries(informesPorDia).map(([fecha, cantidad]) => ({
                fecha,
                cantidad,
            })),
        };
    }
    async getAllInformes(page = '1', limit = '20') {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const [informes, total] = await Promise.all([
            this.prisma.informe.findMany({
                skip,
                take: limitNum,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    nombre: true,
                    fecha_nacimiento: true,
                    lugar: true,
                    signo_solar: true,
                    numero_camino_vida: true,
                    created_at: true,
                    user: {
                        select: {
                            email: true,
                            nombre: true,
                        },
                    },
                },
            }),
            this.prisma.informe.count(),
        ]);
        return {
            informes,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }
    async deleteUser(id) {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
            this.logger.log(`Usuario eliminado: ${id}`);
            return { mensaje: 'Usuario eliminado exitosamente' };
        }
        catch (error) {
            this.logger.error(`Error eliminando usuario: ${error.message}`);
            return { error: 'Error eliminando usuario' };
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los usuarios (solo admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalle de un usuario (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalle del usuario' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetail", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas generales (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas del sistema' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('informes'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los informes (solo admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de informes' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllInformes", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar usuario (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario eliminado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
exports.AdminController = AdminController = AdminController_1 = __decorate([
    (0, swagger_1.ApiTags)('Administración'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map