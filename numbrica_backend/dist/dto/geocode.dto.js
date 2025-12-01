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
exports.GeocodeResponseDto = exports.GeocodeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GeocodeDto {
}
exports.GeocodeDto = GeocodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del lugar a geocodificar',
        example: 'Guadalajara, México',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El lugar es obligatorio' }),
    __metadata("design:type", String)
], GeocodeDto.prototype, "lugar", void 0);
class GeocodeResponseDto {
}
exports.GeocodeResponseDto = GeocodeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del lugar encontrado',
        example: 'Guadalajara, Jalisco, México',
    }),
    __metadata("design:type", String)
], GeocodeResponseDto.prototype, "lugar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Latitud',
        example: 20.6597,
    }),
    __metadata("design:type", Number)
], GeocodeResponseDto.prototype, "latitud", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Longitud',
        example: -103.3496,
    }),
    __metadata("design:type", Number)
], GeocodeResponseDto.prototype, "longitud", void 0);
//# sourceMappingURL=geocode.dto.js.map