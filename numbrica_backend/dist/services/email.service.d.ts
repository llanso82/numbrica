import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private readonly fromEmail;
    constructor(configService: ConfigService);
    sendVerificationEmail(to: string, nombre: string, token: string): Promise<void>;
    sendPasswordResetEmail(to: string, nombre: string, token: string): Promise<void>;
    sendEmailChangeConfirmation(to: string, nombre: string): Promise<void>;
}
