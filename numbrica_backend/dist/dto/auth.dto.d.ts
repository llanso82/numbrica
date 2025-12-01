export declare class RegisterDto {
    nombre: string;
    email: string;
    password: string;
    consentimiento_servicio: boolean;
    consentimiento_marketing: boolean;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    nueva_password: string;
}
export declare class UpdateProfileDto {
    nombre?: string;
    email?: string;
}
export declare class UpdateConsentimientosDto {
    consentimiento_marketing: boolean;
}
