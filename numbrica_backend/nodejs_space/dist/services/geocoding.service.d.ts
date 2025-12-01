export declare class GeoccodingService {
    private readonly logger;
    private readonly nominatimUrl;
    geocode(lugar: string): Promise<{
        lugar: string;
        latitud: number;
        longitud: number;
    }>;
    reverseGeocode(latitud: number, longitud: number): Promise<string>;
}
