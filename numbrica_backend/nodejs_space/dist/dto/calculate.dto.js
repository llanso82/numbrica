"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateResponseDto = exports.CalculateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CalculateDto {
}
exports.CalculateDto = CalculateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo de la persona',
        example: 'María Guadalupe López',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
    __metadata("design:type", String)
], CalculateDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de nacimiento en formato YYYY-MM-DD',
        example: '1990-05-15',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de nacimiento es obligatoria' }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La fecha debe estar en formato YYYY-MM-DD',
    }),
    __metadata("design:type", String)
], CalculateDto.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hora de nacimiento en formato HH:MM (opcional, se usa mediodía si no se proporciona)',
        example: '14:30',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, {
        message: 'La hora debe estar en formato HH:MM',
    }),
    __metadata("design:type", String)
], CalculateDto.prototype, "hora_nacimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lugar de nacimiento',
        example: 'Ciudad de México, México',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El lugar es obligatorio' }),
    __metadata("design:type", String)
], CalculateDto.prototype, "lugar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Latitud del lugar de nacimiento',
        example: 19.4326,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La latitud es obligatoria' }),
    __metadata("design:type", Number)
], CalculateDto.prototype, "latitud", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Longitud del lugar de nacimiento',
        example: -99.1332,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La longitud es obligatoria' }),
    __metadata("design:type", Number)
], CalculateDto.prototype, "longitud", void 0);
class CalculateResponseDto {
}
exports.CalculateResponseDto = CalculateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del informe generado',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    __metadata("design:type", String)
], CalculateResponseDto.prototype, "informe_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje de confirmación',
        example: 'Informe generado exitosamente',
    }),
    __metadata("design:type", String)
], CalculateResponseDto.prototype, "mensaje", void 0);
//# sourceMappingURL=calculate.dto.js.map