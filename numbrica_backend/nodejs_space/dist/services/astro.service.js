"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AstroService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstroService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = require("path");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let AstroService = AstroService_1 = class AstroService {
    constructor() {
        this.logger = new common_1.Logger(AstroService_1.name);
        this.pythonEnginesPath = process.env.PYTHON_ENGINES_PATH
            ? (0, path_1.join)(process.cwd(), process.env.PYTHON_ENGINES_PATH)
            : (0, path_1.join)(process.cwd(), 'python_engines');
    }
    async calculateNatalChart(fechaNacimiento, horaNacimiento, latitud, longitud) {
        try {
            const hora = horaNacimiento || '12:00';
            const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from astro_engine import calculate_natal_chart
import json

result = calculate_natal_chart(
    birth_date='${fechaNacimiento}',
    birth_time='${hora}',
    latitude=${latitud},
    longitude=${longitud}
)

print(json.dumps(result, ensure_ascii=False))
`;
            const { stdout, stderr } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
            if (stderr) {
                this.logger.warn('Advertencia del motor astrológico:', stderr);
            }
            const result = JSON.parse(stdout);
            this.logger.log(`✅ Carta natal calculada para ${fechaNacimiento}`);
            return result;
        }
        catch (error) {
            this.logger.error('❌ Error calculando carta natal:', error);
            throw new Error(`Error en cálculo astrológico: ${error.message}`);
        }
    }
    async getSimpleChart(fechaNacimiento, horaNacimiento) {
        try {
            const hora = horaNacimiento || '12:00';
            const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from astro_engine import get_simple_chart
import json

result = get_simple_chart(
    birth_date='${fechaNacimiento}',
    birth_time='${hora}'
)

print(json.dumps(result, ensure_ascii=False))
`;
            const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
            const result = JSON.parse(stdout);
            return result;
        }
        catch (error) {
            this.logger.error('❌ Error en getSimpleChart:', error);
            throw error;
        }
    }
};
exports.AstroService = AstroService;
exports.AstroService = AstroService = AstroService_1 = __decorate([
    (0, common_1.Injectable)()
], AstroService);
//# sourceMappingURL=astro.service.js.map