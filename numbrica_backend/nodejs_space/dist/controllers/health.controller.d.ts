export declare class HealthController {
    private readonly logger;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
        mensaje: string;
    };
}
