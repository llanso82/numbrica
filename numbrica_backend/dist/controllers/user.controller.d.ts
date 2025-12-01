import { PrismaService } from '../services/prisma.service';
import { UpdateProfileDto, UpdateConsentimientosDto } from '../dto/auth.dto';
import { EmailService } from '../services/email.service';
export declare class UserController {
    private prisma;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
    getProfile(user: any): Promise<{
        id: string;
        nombre: string;
        created_at: Date;
        email: string;
        consentimiento_servicio: boolean;
        consentimiento_marketing: boolean;
        rol: import(".prisma/client").$Enums.Rol;
        email_verificado: boolean;
        consentimiento_timestamp: Date;
        updated_at: Date;
    }>;
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
        error: string;
        mensaje?: undefined;
        user?: undefined;
    } | {
        mensaje: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            email_verificado: boolean;
            updated_at: Date;
        };
        error?: undefined;
    }>;
    getUserInformes(user: any): Promise<{
        total: number;
        informes: {
            id: string;
            nombre: string;
            fecha_nacimiento: Date;
            lugar: string;
            signo_solar: string;
            numero_camino_vida: number;
            created_at: Date;
        }[];
    }>;
    updateConsentimientos(user: any, dto: UpdateConsentimientosDto): Promise<{
        mensaje: string;
    }>;
}
