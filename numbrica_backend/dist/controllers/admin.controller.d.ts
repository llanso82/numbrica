import { PrismaService } from '../services/prisma.service';
export declare class AdminController {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getUsers(page?: string, limit?: string, search?: string): Promise<{
        users: {
            id: string;
            nombre: string;
            created_at: Date;
            email: string;
            consentimiento_marketing: boolean;
            rol: import(".prisma/client").$Enums.Rol;
            email_verificado: boolean;
            _count: {
                informes: number;
            };
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserDetail(id: string): Promise<{
        id: string;
        nombre: string;
        created_at: Date;
        informes: {
            id: string;
            nombre: string;
            fecha_nacimiento: Date;
            lugar: string;
            signo_solar: string;
            numero_camino_vida: number;
            created_at: Date;
        }[];
        email: string;
        consentimiento_servicio: boolean;
        consentimiento_marketing: boolean;
        rol: import(".prisma/client").$Enums.Rol;
        email_verificado: boolean;
        consentimiento_timestamp: Date;
        updated_at: Date;
    } | {
        error: string;
    }>;
    getStats(): Promise<{
        total_usuarios: number;
        total_informes: number;
        nuevos_usuarios_hoy: number;
        informes_hoy: number;
        informes_ultimos_7_dias: {
            fecha: string;
            cantidad: unknown;
        }[];
    }>;
    getAllInformes(page?: string, limit?: string): Promise<{
        informes: {
            user: {
                nombre: string;
                email: string;
            };
            id: string;
            nombre: string;
            fecha_nacimiento: Date;
            lugar: string;
            signo_solar: string;
            numero_camino_vida: number;
            created_at: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    deleteUser(id: string): Promise<{
        mensaje: string;
        error?: undefined;
    } | {
        error: string;
        mensaje?: undefined;
    }>;
}
