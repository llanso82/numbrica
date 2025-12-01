
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.fromEmail = this.configService.get<string>('FROM_EMAIL') || 'soporte@[DOMINIO]';

    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.logger.log('SendGrid configurado correctamente');
    } else {
      this.logger.warn('SENDGRID_API_KEY no configurado - los emails no se enviarán');
    }
  }

  async sendVerificationEmail(to: string, nombre: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
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
    } catch (error) {
      this.logger.error(`Error enviando email de verificación: ${error.message}`);
      throw error;
    }
  }

  async sendPasswordResetEmail(to: string, nombre: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
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
    } catch (error) {
      this.logger.error(`Error enviando email de recuperación: ${error.message}`);
      throw error;
    }
  }

  async sendEmailChangeConfirmation(to: string, nombre: string): Promise<void> {
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
    } catch (error) {
      this.logger.error(`Error enviando email de confirmación: ${error.message}`);
    }
  }
}
