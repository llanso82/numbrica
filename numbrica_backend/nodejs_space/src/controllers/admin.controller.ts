
import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../services/prisma.service';

@ApiTags('Administración')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('api/admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private prisma: PrismaService) {}

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { nombre: { contains: search, mode: 'insensitive' as const } },
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

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener detalle de un usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Detalle del usuario' })
  async getUserDetail(@Param('id') id: string) {
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

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas generales (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas del sistema' })
  async getStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalUsers, totalInformes, usersToday, informesToday, informesLastWeek] =
      await Promise.all([
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

    // Agrupar informes por día
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
      informes_ultimos_7_dias: Object.entries(informesPorDia).map(
        ([fecha, cantidad]) => ({
          fecha,
          cantidad,
        }),
      ),
    };
  }

  @Get('informes')
  @ApiOperation({ summary: 'Listar todos los informes (solo admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de informes' })
  async getAllInformes(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
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

  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  async deleteUser(@Param('id') id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      this.logger.log(`Usuario eliminado: ${id}`);

      return { mensaje: 'Usuario eliminado exitosamente' };
    } catch (error) {
      this.logger.error(`Error eliminando usuario: ${error.message}`);
      return { error: 'Error eliminando usuario' };
    }
  }
}
