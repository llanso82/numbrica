import { ReportService } from '../services/report.service';
import { CalculateDto, CalculateResponseDto } from '../dto/calculate.dto';
export declare class CalculateController {
    private readonly reportService;
    private readonly logger;
    constructor(reportService: ReportService);
    calculate(calculateDto: CalculateDto): Promise<CalculateResponseDto>;
}
