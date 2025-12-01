export declare class NumerologyService {
    private readonly logger;
    private readonly pythonEnginesPath;
    calculateLifePath(fechaNacimiento: string): Promise<any>;
    calculateExpressionNumber(nombreCompleto: string): Promise<any>;
    getCompleteProfile(fechaNacimiento: string, nombreCompleto: string): Promise<any>;
}
