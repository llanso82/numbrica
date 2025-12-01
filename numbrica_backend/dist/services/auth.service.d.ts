import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { EmailService } from './email.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from '../dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        mensaje: string;
        user: {
            id: string;
            nombre: string;
            created_at: Date;
            email: string;
            rol: import(".prisma/client").$Enums.Rol;
            email_verificado: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: import(".prisma/client").$Enums.Rol;
            email_verificado: boolean;
        };
    }>;
    verifyEmail(token: string): Promise<{
        mensaje: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        mensaje: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        mensaje: string;
    }>;
}
