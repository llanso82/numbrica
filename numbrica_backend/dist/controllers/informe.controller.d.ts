import { ReportService } from '../services/report.service';
export declare class InformeController {
    private readonly reportService;
    private readonly logger;
    constructor(reportService: ReportService);
    getInforme(id: string): Promise<any>;
    getAllInformes(): Promise<any[]>;
}
