"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NumerologyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumerologyService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = require("path");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let NumerologyService = NumerologyService_1 = class NumerologyService {
    constructor() {
        this.logger = new common_1.Logger(NumerologyService_1.name);
        this.pythonEnginesPath = process.env.PYTHON_ENGINES_PATH
            ? (0, path_1.join)(process.cwd(), process.env.PYTHON_ENGINES_PATH)
            : (0, path_1.join)(process.cwd(), 'python_engines');
    }
    async calculateLifePath(fechaNacimiento) {
        try {
            const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from numerology_engine import calculate_life_path
import json

result = calculate_life_path('${fechaNacimiento}')
print(json.dumps(result, ensure_ascii=False))
`;
            const { stdout, stderr } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
            if (stderr) {
                this.logger.warn('Advertencia del motor numerológico:', stderr);
            }
            const result = JSON.parse(stdout);
            this.logger.log(`✅ Número de camino de vida calculado: ${result.life_path_number}`);
            return result;
        }
        catch (error) {
            this.logger.error('❌ Error calculando número de camino de vida:', error);
            throw new Error(`Error en cálculo numerológico: ${error.message}`);
        }
    }
    async calculateExpressionNumber(nombreCompleto) {
        try {
            const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from numerology_engine import calculate_expression_number
import json

result = calculate_expression_number('${nombreCompleto}')
print(json.dumps(result, ensure_ascii=False))
`;
            const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
            const result = JSON.parse(stdout);
            return result;
        }
        catch (error) {
            this.logger.error('❌ Error calculando número de expresión:', error);
            throw error;
        }
    }
    async getCompleteProfile(fechaNacimiento, nombreCompleto) {
        try {
            const pythonScript = `
import sys
sys.path.insert(0, '${this.pythonEnginesPath}')
from numerology_engine import get_complete_numerology_profile
import json

result = get_complete_numerology_profile('${fechaNacimiento}', '${nombreCompleto}')
print(json.dumps(result, ensure_ascii=False))
`;
            const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
            const result = JSON.parse(stdout);
            this.logger.log(`✅ Perfil numerológico completo calculado para ${nombreCompleto}`);
            return result;
        }
        catch (error) {
            this.logger.error('❌ Error en perfil numerológico completo:', error);
            throw error;
        }
    }
};
exports.NumerologyService = NumerologyService;
exports.NumerologyService = NumerologyService = NumerologyService_1 = __decorate([
    (0, common_1.Injectable)()
], NumerologyService);
//# sourceMappingURL=numerology.service.js.map