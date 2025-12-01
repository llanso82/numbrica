import { PrismaService } from './prisma.service';
import { AstroService } from './astro.service';
import { NumerologyService } from './numerology.service';
import { TemplatesService } from './templates.service';
export declare class ReportService {
    private prisma;
    private astroService;
    private numerologyService;
    private templatesService;
    private readonly logger;
    constructor(prisma: PrismaService, astroService: AstroService, numerologyService: NumerologyService, templatesService: TemplatesService);
    generateReport(data: {
        nombre: string;
        fecha_nacimiento: string;
        hora_nacimiento?: string;
        lugar: string;
        latitud: number;
        longitud: number;
    }): Promise<{
        informe_id: string;
        mensaje: string;
    }>;
    getInforme(id: string): Promise<any>;
    getAllInformes(): Promise<any[]>;
}
