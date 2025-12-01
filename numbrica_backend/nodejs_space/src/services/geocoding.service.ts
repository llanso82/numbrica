
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeoccodingService {
  private readonly logger = new Logger(GeoccodingService.name);
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  async geocode(lugar: string): Promise<{ lugar: string; latitud: number; longitud: number }> {
    try {
      const response = await axios.get(this.nominatimUrl, {
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
    } catch (error) {
      this.logger.error(`❌ Error en geocoding para "${lugar}":`, error.message);
      throw new Error(`Error al geocodificar ubicación: ${error.message}`);
    }
  }

  async reverseGeocode(latitud: number, longitud: number): Promise<string> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
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
    } catch (error) {
      this.logger.error('❌ Error en reverse geocoding:', error.message);
      return `${latitud}, ${longitud}`;
    }
  }
}
