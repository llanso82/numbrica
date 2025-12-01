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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = __importStar(require("@sendgrid/mail"));
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        this.fromEmail = this.configService.get('FROM_EMAIL') || 'soporte@[DOMINIO]';
        if (apiKey) {
            sgMail.setApiKey(apiKey);
            this.logger.log('SendGrid configurado correctamente');
        }
        else {
            this.logger.warn('SENDGRID_API_KEY no configurado - los emails no se enviarán');
        }
    }
    async sendVerificationEmail(to, nombre, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const verificationUrl = `${frontendUrl}/verify-email/${token}`;
        const msg = {
            to,
            from: this.fromEmail,
            subject: '✨ Bienvenido a Numbrica - Verifica tu email',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a2332; color: #ffffff; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 32px; margin: 0;">NUMBRICA</h1>
            <p style="color: #d4af37; font-size: 14px; margin: 5px 0;">Numerología y Cartas Astrales</p>
          </div>
          
          <div style="background-color: #2a3442; padding: 30px; border-radius: 10px;">
            <h2 style="color: #d4af37; margin-top: 0;">¡Bienvenido, ${nombre}!</h2>
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Gracias por unirte a Numbrica. Tu viaje de autoconocimiento espiritual está a punto de comenzar.
            </p>
            <p style="line-height: 1.6; margin-bottom: 30px;">
              Para activar tu cuenta y comenzar a explorar los misterios de tu carta astral y numerología,
              por favor verifica tu email haciendo clic en el botón de abajo:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #d4af37; color: #1a2332; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verificar mi Email
              </a>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              Si no creaste esta cuenta, puedes ignorar este email.
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <span style="color: #d4af37;">${verificationUrl}</span>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2025 Numbrica. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
        };
        try {
            await sgMail.send(msg);
            this.logger.log(`Email de verificación enviado a ${to}`);
        }
        catch (error) {
            this.logger.error(`Error enviando email de verificación: ${error.message}`);
            throw error;
        }
    }
    async sendPasswordResetEmail(to, nombre, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const resetUrl = `${frontendUrl}/reset-password/${token}`;
        const msg = {
            to,
            from: this.fromEmail,
            subject: '🔑 Numbrica - Recuperación de contraseña',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a2332; color: #ffffff; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 32px; margin: 0;">NUMBRICA</h1>
            <p style="color: #d4af37; font-size: 14px; margin: 5px 0;">Numerología y Cartas Astrales</p>
          </div>
          
          <div style="background-color: #2a3442; padding: 30px; border-radius: 10px;">
            <h2 style="color: #d4af37; margin-top: 0;">Recuperación de contraseña</h2>
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Hola, ${nombre}
            </p>
            <p style="line-height: 1.6; margin-bottom: 30px;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Numbrica.
              Si fuiste tú, haz clic en el botón de abajo para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #d4af37; color: #1a2332; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              Este enlace expirará en 1 hora por seguridad.
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura.
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <span style="color: #d4af37;">${resetUrl}</span>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2025 Numbrica. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
        };
        try {
            await sgMail.send(msg);
            this.logger.log(`Email de recuperación enviado a ${to}`);
        }
        catch (error) {
            this.logger.error(`Error enviando email de recuperación: ${error.message}`);
            throw error;
        }
    }
    async sendEmailChangeConfirmation(to, nombre) {
        const msg = {
            to,
            from: this.fromEmail,
            subject: '✅ Numbrica - Cambio de email confirmado',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a2332; color: #ffffff; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 32px; margin: 0;">NUMBRICA</h1>
            <p style="color: #d4af37; font-size: 14px; margin: 5px 0;">Numerología y Cartas Astrales</p>
          </div>
          
          <div style="background-color: #2a3442; padding: 30px; border-radius: 10px;">
            <h2 style="color: #d4af37; margin-top: 0;">Email actualizado</h2>
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Hola, ${nombre}
            </p>
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Tu email en Numbrica ha sido actualizado exitosamente a esta dirección.
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              Si no realizaste este cambio, contacta inmediatamente a soporte@[DOMINIO]
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2025 Numbrica. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
        };
        try {
            await sgMail.send(msg);
            this.logger.log(`Email de confirmación de cambio enviado a ${to}`);
        }
        catch (error) {
            this.logger.error(`Error enviando email de confirmación: ${error.message}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map