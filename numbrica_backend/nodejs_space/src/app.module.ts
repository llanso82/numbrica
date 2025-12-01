
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Controllers
import { CalculateController } from './controllers/calculate.controller';
import { InformeController } from './controllers/informe.controller';
import { GeocodeController } from './controllers/geocode.controller';
import { HealthController } from './controllers/health.controller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AdminController } from './controllers/admin.controller';

// Services
import { AstroService } from './services/astro.service';
import { NumerologyService } from './services/numerology.service';
import { GeoccodingService } from './services/geocoding.service';
import { ReportService } from './services/report.service';
import { TemplatesService } from './services/templates.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';

// Auth
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'numbrica-secret-key-change-in-production',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 10, // 10 requests por minuto
      },
    ]),
  ],
  controllers: [
    CalculateController,
    InformeController,
    GeocodeController,
    HealthController,
    AuthController,
    UserController,
    AdminController,
  ],
  providers: [
    PrismaService,
    AstroService,
    NumerologyService,
    GeoccodingService,
    ReportService,
    TemplatesService,
    AuthService,
    EmailService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RolesGuard,
  ],
})
export class AppModule {}
