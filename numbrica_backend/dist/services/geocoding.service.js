"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GeoccodingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoccodingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GeoccodingService = GeoccodingService_1 = class GeoccodingService {
    constructor() {
        this.logger = new common_1.Logger(GeoccodingService_1.name);
        this.nominatimUrl = 'https://nominatim.openstreetmap.org/search';
    }
    async geocode(lugar) {
        try {
            const response = await axios_1.default.get(this.nominatimUrl, {
                params: {
                    q: lugar,
                    format: 'json',
                    limit: 1,
                    addressdetails: 1,
                },
                headers: {
                    'User-Agent': 'Numbrica/1.0',
                },
            });
            if (!response.data || response.data.length === 0) {
                throw new Error(`No se encontraron coordenadas para: ${lugar}`);
            }
            const result = response.data[0];
            const lugarCompleto = result.display_name || lugar;
            this.logger.log(`✅ Geocoding exitoso: ${lugarCompleto}`);
            return {
                lugar: lugarCompleto,
                latitud: parseFloat(result.lat),
                longitud: parseFloat(result.lon),
            };
        }
        catch (error) {
            this.logger.error(`❌ Error en geocoding para "${lugar}":`, error.message);
            throw new Error(`Error al geocodificar ubicación: ${error.message}`);
        }
    }
    async reverseGeocode(latitud, longitud) {
        try {
            const response = await axios_1.default.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    lat: latitud,
                    lon: longitud,
                    format: 'json',
                },
                headers: {
                    'User-Agent': 'Numbrica/1.0',
                },
            });
            return response.data.display_name || `${latitud}, ${longitud}`;
        }
        catch (error) {
            this.logger.error('❌ Error en reverse geocoding:', error.message);
            return `${latitud}, ${longitud}`;
        }
    }
};
exports.GeoccodingService = GeoccodingService;
exports.GeoccodingService = GeoccodingService = GeoccodingService_1 = __decorate([
    (0, common_1.Injectable)()
], GeoccodingService);
//# sourceMappingURL=geocoding.service.js.map