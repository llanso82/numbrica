
import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { PrismaService } from '../services/prisma.service';
import { UpdateProfileDto, UpdateConsentimientosDto } from '../dto/auth.dto';
import { EmailService } from '../services/email.service';

@ApiTags('Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  async getProfile(@CurrentUser() user: any) {
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

  @Put('profile')
  @ApiOperation({ summary: 'Actualizar perfil del usuario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    const updateData: any = {};

    if (dto.nombre) {
      updateData.nombre = dto.nombre;
    }

    if (dto.email && dto.email !== user.email) {
      // Verificar que el nuevo email no esté en uso
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        return {
          error: 'Este email ya está en uso',
        };
      }

      updateData.email = dto.email;
      updateData.email_verificado = false; // Requiere nueva verificación

      // Enviar email de confirmación al nuevo email
      try {
        await this.emailService.sendEmailChangeConfirmation(
          dto.email,
          user.nombre,
        );
      } catch (error) {
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

  @Get('informes')
  @ApiOperation({ summary: 'Obtener informes del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de informes' })
  async getUserInformes(@CurrentUser() user: any) {
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

  @Put('consentimientos')
  @ApiOperation({ summary: 'Actualizar consentimientos de marketing' })
  @ApiResponse({ status: 200, description: 'Consentimientos actualizados' })
  async updateConsentimientos(
    @CurrentUser() user: any,
    @Body() dto: UpdateConsentimientosDto,
  ) {
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
}
