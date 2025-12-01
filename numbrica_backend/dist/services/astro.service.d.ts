export declare class AstroService {
    private readonly logger;
    private readonly pythonEnginesPath;
    calculateNatalChart(fechaNacimiento: string, horaNacimiento: string | null, latitud: number, longitud: number): Promise<any>;
    getSimpleChart(fechaNacimiento: string, horaNacimiento?: string): Promise<any>;
}
