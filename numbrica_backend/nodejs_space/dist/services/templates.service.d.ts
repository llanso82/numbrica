import { OnModuleInit } from '@nestjs/common';
export declare class TemplatesService implements OnModuleInit {
    private readonly logger;
    private interpretations;
    onModuleInit(): Promise<void>;
    private loadTemplates;
    getSignoSolarInterpretation(signo: string): string;
    getNumeroCaminoVidaInterpretation(numero: number): string;
    getAspectoInterpretation(aspecto: string): string;
    getIntegracion(): string;
}
