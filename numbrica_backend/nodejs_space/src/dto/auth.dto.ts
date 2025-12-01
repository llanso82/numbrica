
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsBoolean,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Contraseña123!', minimum: 8 })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  password: string;

  @ApiProperty({ example: true, description: 'Consentimiento para usar el servicio (requerido)' })
  @IsBoolean()
  consentimiento_servicio: boolean;

  @ApiProperty({ example: false, description: 'Consentimiento para recibir marketing (opcional)' })
  @IsBoolean()
  consentimiento_marketing: boolean;
}

export class LoginDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Contraseña123!' })
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123-def456-ghi789' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NuevaContraseña123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  nueva_password: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'Juan Pérez Actualizado', required: false })
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'nuevo@ejemplo.com', required: false })
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}

export class UpdateConsentimientosDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  consentimiento_marketing: boolean;
}
