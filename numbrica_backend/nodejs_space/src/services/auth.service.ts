
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { EmailService } from './email.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Intentando registrar usuario: ${dto.email}`);

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Este email ya está registrado');
    }

    // Verificar que aceptó el consentimiento de servicio
    if (!dto.consentimiento_servicio) {
      throw new BadRequestException(
        'Debes aceptar los términos de servicio para registrarte',
      );
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(dto.password, salt);

    // Generar token de verificación
    const token_verificacion = uuidv4();

    // Crear usuario
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

    // Enviar email de verificación
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.nombre,
        token_verificacion,
      );
      this.logger.log(`Email de verificación enviado a ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Error enviando email de verificación: ${error.message}`,
      );
      // No lanzar error aquí para no bloquear el registro
    }

    return {
      mensaje:
        'Usuario registrado exitosamente. Por favor verifica tu email.',
      user,
    };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Intento de login: ${dto.email}`);

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Verificar contraseña
    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);

    if (!passwordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    this.logger.log(`Login exitoso: ${user.email}`);

    // Generar JWT
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

  async verifyEmail(token: string) {
    this.logger.log(`Verificando email con token: ${token.substring(0, 8)}...`);

    const user = await this.prisma.user.findUnique({
      where: { token_verificacion: token },
    });

    if (!user) {
      throw new NotFoundException('Token de verificación inválido');
    }

    if (user.email_verificado) {
      return { mensaje: 'Email ya verificado previamente' };
    }

    // Marcar email como verificado
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

  async forgotPassword(dto: ForgotPasswordDto) {
    this.logger.log(`Solicitud de recuperación de contraseña: ${dto.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return {
        mensaje:
          'Si el email existe en nuestro sistema, recibirás un enlace de recuperación',
      };
    }

    // Generar token de recuperación
    const token_recuperacion = uuidv4();
    const token_expiracion = new Date();
    token_expiracion.setHours(token_expiracion.getHours() + 1); // Expira en 1 hora

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        token_recuperacion,
        token_expiracion,
      },
    });

    // Enviar email de recuperación
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.nombre,
        token_recuperacion,
      );
      this.logger.log(`Email de recuperación enviado a ${user.email}`);
    } catch (error) {
      this.logger.error(`Error enviando email de recuperación: ${error.message}`);
    }

    return {
      mensaje:
        'Si el email existe en nuestro sistema, recibirás un enlace de recuperación',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    this.logger.log(`Restableciendo contraseña con token: ${dto.token.substring(0, 8)}...`);

    const user = await this.prisma.user.findUnique({
      where: { token_recuperacion: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Token de recuperación inválido');
    }

    // Verificar que el token no haya expirado
    if (new Date() > user.token_expiracion) {
      throw new BadRequestException(
        'El token de recuperación ha expirado. Solicita uno nuevo.',
      );
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(dto.nueva_password, salt);

    // Actualizar contraseña y limpiar token
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
}
