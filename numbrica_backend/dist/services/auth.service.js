"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("./prisma.service");
const email_service_1 = require("./email.service");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        this.logger.log(`Intentando registrar usuario: ${dto.email}`);
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Este email ya está registrado');
        }
        if (!dto.consentimiento_servicio) {
            throw new common_1.BadRequestException('Debes aceptar los términos de servicio para registrarte');
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(dto.password, salt);
        const token_verificacion = (0, uuid_1.v4)();
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password_hash,
                nombre: dto.nombre,
                token_verificacion,
                consentimiento_servicio: dto.consentimiento_servicio,
                consentimiento_marketing: dto.consentimiento_marketing || false,
                consentimiento_timestamp: new Date(),
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                email_verificado: true,
                created_at: true,
            },
        });
        this.logger.log(`Usuario creado exitosamente: ${user.email}`);
        try {
            await this.emailService.sendVerificationEmail(user.email, user.nombre, token_verificacion);
            this.logger.log(`Email de verificación enviado a ${user.email}`);
        }
        catch (error) {
            this.logger.error(`Error enviando email de verificación: ${error.message}`);
        }
        return {
            mensaje: 'Usuario registrado exitosamente. Por favor verifica tu email.',
            user,
        };
    }
    async login(dto) {
        this.logger.log(`Intento de login: ${dto.email}`);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
        }
        this.logger.log(`Login exitoso: ${user.email}`);
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
                email_verificado: user.email_verificado,
            },
        };
    }
    async verifyEmail(token) {
        this.logger.log(`Verificando email con token: ${token.substring(0, 8)}...`);
        const user = await this.prisma.user.findUnique({
            where: { token_verificacion: token },
        });
        if (!user) {
            throw new common_1.NotFoundException('Token de verificación inválido');
        }
        if (user.email_verificado) {
            return { mensaje: 'Email ya verificado previamente' };
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                email_verificado: true,
                token_verificacion: null,
            },
        });
        this.logger.log(`Email verificado exitosamente: ${user.email}`);
        return { mensaje: 'Email verificado exitosamente' };
    }
    async forgotPassword(dto) {
        this.logger.log(`Solicitud de recuperación de contraseña: ${dto.email}`);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return {
                mensaje: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación',
            };
        }
        const token_recuperacion = (0, uuid_1.v4)();
        const token_expiracion = new Date();
        token_expiracion.setHours(token_expiracion.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                token_recuperacion,
                token_expiracion,
            },
        });
        try {
            await this.emailService.sendPasswordResetEmail(user.email, user.nombre, token_recuperacion);
            this.logger.log(`Email de recuperación enviado a ${user.email}`);
        }
        catch (error) {
            this.logger.error(`Error enviando email de recuperación: ${error.message}`);
        }
        return {
            mensaje: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación',
        };
    }
    async resetPassword(dto) {
        this.logger.log(`Restableciendo contraseña con token: ${dto.token.substring(0, 8)}...`);
        const user = await this.prisma.user.findUnique({
            where: { token_recuperacion: dto.token },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token de recuperación inválido');
        }
        if (new Date() > user.token_expiracion) {
            throw new common_1.BadRequestException('El token de recuperación ha expirado. Solicita uno nuevo.');
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(dto.nueva_password, salt);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash,
                token_recuperacion: null,
                token_expiracion: null,
            },
        });
        this.logger.log(`Contraseña restablecida exitosamente: ${user.email}`);
        return { mensaje: 'Contraseña restablecida exitosamente' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map