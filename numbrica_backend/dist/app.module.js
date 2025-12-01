"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const calculate_controller_1 = require("./controllers/calculate.controller");
const informe_controller_1 = require("./controllers/informe.controller");
const geocode_controller_1 = require("./controllers/geocode.controller");
const health_controller_1 = require("./controllers/health.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const user_controller_1 = require("./controllers/user.controller");
const admin_controller_1 = require("./controllers/admin.controller");
const astro_service_1 = require("./services/astro.service");
const numerology_service_1 = require("./services/numerology.service");
const geocoding_service_1 = require("./services/geocoding.service");
const report_service_1 = require("./services/report.service");
const templates_service_1 = require("./services/templates.service");
const prisma_service_1 = require("./services/prisma.service");
const auth_service_1 = require("./services/auth.service");
const email_service_1 = require("./services/email.service");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const roles_guard_1 = require("./auth/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') ||
                        'numbrica-secret-key-change-in-production',
                    signOptions: { expiresIn: '7d' },
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
        ],
        controllers: [
            calculate_controller_1.CalculateController,
            informe_controller_1.InformeController,
            geocode_controller_1.GeocodeController,
            health_controller_1.HealthController,
            auth_controller_1.AuthController,
            user_controller_1.UserController,
            admin_controller_1.AdminController,
        ],
        providers: [
            prisma_service_1.PrismaService,
            astro_service_1.AstroService,
            numerology_service_1.NumerologyService,
            geocoding_service_1.GeoccodingService,
            report_service_1.ReportService,
            templates_service_1.TemplatesService,
            auth_service_1.AuthService,
            email_service_1.EmailService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            roles_guard_1.RolesGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map