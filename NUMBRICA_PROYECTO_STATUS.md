# 🌟 Proyecto Numbrica - Estado Actual

## 📋 Visión General

**Numbrica** es una plataforma web de astrología y numerología personalizada en español, con tono esotérico/místico, enfocada en autoconocimiento y propósito del alma.

---

## ✅ Componentes Completados

### 1. Motores de Cálculo ✓
**Ubicación:** `/home/ubuntu/numbrica_engines/`

- ✅ `astro_engine.py` - Motor de cálculos astrológicos
  - Cálculo de carta natal (posiciones planetarias)
  - Identificación de aspectos
  - Cálculo de casas astrológicas
  - Basado en Swiss Ephemeris (swisseph)

- ✅ `numerology_engine.py` - Motor de cálculos numerológicos
  - Número de camino de vida
  - Número de expresión (desde nombre)
  - Número de alma
  - Números personales y cíclicos

**Características:**
- Cálculos precisos y profesionales
- Funciones modulares reutilizables
- Documentación completa
- Tests incluidos

---

### 2. Corpus de Plantillas ✓
**Ubicación:** `/home/ubuntu/numbrica_templates/`

#### Archivos Principales

**`interpretations.json`** (35 KB)
- 12 interpretaciones de signos solares (150-250 palabras c/u)
- 9 interpretaciones de números de camino de vida (150-250 palabras c/u)
- 5 interpretaciones de aspectos astrológicos (100-150 palabras c/u)
- 1 texto de integración astrología/numerología (300 palabras)
- **Total: 5,622 palabras de contenido esotérico profundo**

**`README.md`** (5.2 KB)
- Documentación técnica completa
- Estructura del JSON
- Ejemplos de uso en Python
- Guías de integración

**`TONE_GUIDE.md`** (7.9 KB)
- Filosofía del tono esotérico/místico
- Ejemplos comparativos (correcto vs incorrecto)
- Vocabulario recomendado
- Checklist de revisión

**`ejemplo_uso.py`** (5.7 KB)
- Script funcional de ejemplo
- Generación de informe completo
- Estadísticas del corpus
- Demostración práctica

**`ejemplo_informe.txt`**
- Informe generado de ejemplo
- Muestra integración de todos los elementos
- Usuario ficticio: María Luna (15/03/1990)

#### Contenido Incluido

**Signos Solares (12):**
♈ Aries • ♉ Tauro • ♊ Géminis • ♋ Cáncer • ♌ Leo • ♍ Virgo
♎ Libra • ♏ Escorpio • ♐ Sagitario • ♑ Capricornio • ♒ Acuario • ♓ Piscis

**Números de Camino (9):**
1️⃣ Pionero • 2️⃣ Diplomático • 3️⃣ Creador • 4️⃣ Constructor • 5️⃣ Explorador
6️⃣ Sanador • 7️⃣ Místico • 8️⃣ Maestro • 9️⃣ Humanista

**Aspectos (5):**
⚪ Conjunción • ⚫ Oposición • 🔲 Cuadratura • 🔺 Trígono • ⬡ Sextil

---

## 🔄 Integración de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    PROYECTO NUMBRICA                        │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
       ┌──────▼──────┐                ┌──────▼──────┐
       │   MOTORES   │                │  PLANTILLAS │
       │  DE CÁLCULO │                │    (JSON)   │
       └──────┬──────┘                └──────┬──────┘
              │                               │
    ┌─────────┴─────────┐                    │
    │                   │                    │
┌───▼────┐      ┌──────▼──────┐             │
│ Astro  │      │ Numerology  │             │
│ Engine │      │   Engine    │             │
└───┬────┘      └──────┬──────┘             │
    │                  │                     │
    └──────────┬───────┘                     │
               │                             │
               └──────────┬──────────────────┘
                          │
                 ┌────────▼─────────┐
                 │  BACKEND API     │
                 │  (Pendiente)     │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │  FRONTEND WEB    │
                 │  (Pendiente)     │
                 └──────────────────┘
```

---

## 🎯 Cómo se Conectan

### Flujo de Generación de Informe

```python
# 1. USUARIO INGRESA DATOS
datos_usuario = {
    'nombre': 'María Luna',
    'fecha_nacimiento': '15/03/1990',
    'hora_nacimiento': '14:30',
    'lugar_nacimiento': 'Madrid, España'
}

# 2. CÁLCULOS CON MOTORES
from astro_engine import AstroEngine
from numerology_engine import NumerologyEngine

astro = AstroEngine()
num = NumerologyEngine()

carta_astral = astro.calcular_carta(datos_usuario)
# → Retorna: signo_solar='piscis', aspectos=[...], casas=[...]

perfil_num = num.calcular_perfil(datos_usuario)
# → Retorna: camino_vida=1, expresion=7, alma=3

# 3. OBTENER INTERPRETACIONES
import json
with open('numbrica_templates/interpretations.json', 'r') as f:
    templates = json.load(f)

interpretacion_signo = templates['signos_solares'][carta_astral['signo_solar']]
interpretacion_numero = templates['numeros_camino_vida'][str(perfil_num['camino_vida'])]

# 4. GENERAR INFORME PERSONALIZADO
informe = generar_documento(
    interpretaciones=interpretacion_signo + interpretacion_numero,
    datos_calculados=carta_astral + perfil_num
)

# 5. ENTREGAR AL USUARIO (PDF, HTML, Email)
```

---

## 📊 Estadísticas del Proyecto

| Componente | Estado | Archivos | Líneas de Código | Palabras |
|------------|--------|----------|------------------|----------|
| **Motores de Cálculo** | ✅ | 2 | ~800 | - |
| **Plantillas JSON** | ✅ | 1 | - | 5,622 |
| **Documentación** | ✅ | 4 | - | ~4,000 |
| **Backend API** | ⏳ | - | - | - |
| **Frontend Web** | ⏳ | - | - | - |
| **Newsletter** | ⏳ | - | - | - |

---

## 🎨 Características del Tono

### ✅ Lo que SÍ es Numbrica:
- Herramienta de autoconocimiento espiritual
- Lenguaje simbólico y poético
- Enfoque en propósito del alma
- Empoderamiento y compasión
- Profundo pero accesible

### ❌ Lo que NO es Numbrica:
- Astrología técnica/astronómica
- Predicciones deterministas
- Horóscopos de revista
- Análisis científico
- Jerga complicada

---

## 🚀 Próximos Pasos (Pendientes)

### Fase 2: Backend API
- [ ] Crear API REST (Flask/FastAPI)
- [ ] Endpoints para cálculo de carta
- [ ] Generación de informes en PDF
- [ ] Base de datos de usuarios
- [ ] Sistema de autenticación

### Fase 3: Frontend Web
- [ ] Diseño UI/UX inspirado en imágenes de referencia
- [ ] Formulario de ingreso de datos
- [ ] Visualización de carta natal
- [ ] Dashboard de usuario
- [ ] Sistema de suscripción

### Fase 4: Newsletter
- [ ] Sistema de envío semanal
- [ ] Personalización por datos de usuario
- [ ] Plantillas de email
- [ ] Automatización

---

## 📁 Estructura del Proyecto

```
/home/ubuntu/
│
├── numbrica_engines/          ✅ COMPLETO
│   ├── astro_engine.py
│   ├── numerology_engine.py
│   └── README.md
│
├── numbrica_templates/        ✅ COMPLETO
│   ├── interpretations.json
│   ├── README.md
│   ├── TONE_GUIDE.md
│   ├── VISTA_PREVIA.md
│   ├── RESUMEN.md
│   ├── ejemplo_uso.py
│   └── ejemplo_informe.txt
│
├── numbrica_backend/          ⏳ PENDIENTE
│   └── (API, servicios, DB)
│
└── numbrica_frontend/         ⏳ PENDIENTE
    └── (Web app, UI/UX)
```

---

## 🎯 Referencias de Diseño

Las imágenes subidas muestran:
- Estética dark/navy con acentos dorados
- Logo circular con geometría sagrada
- Tipografía elegante (serif para títulos)
- Iconografía esotérica
- Paleta: Azul oscuro #1a2332, Dorado #d4af37, Crema #f5f0e8

---

## 📝 Notas Importantes

1. **Todo el contenido es original** - 5,622 palabras escritas específicamente para Numbrica
2. **Tono consistente** - Revisado con guía TONE_GUIDE.md
3. **JSON válido** - Verificado y funcional
4. **Scripts funcionales** - ejemplo_uso.py probado y operativo
5. **Documentación completa** - README técnico y guía de estilo incluidas
6. **Listo para integración** - Los motores y plantillas están listos para conectarse con backend

---

## ✨ Estado Actual: 40% Completado

**✅ Completado:**
- Motores de cálculo (astrología y numerología)
- Corpus completo de interpretaciones
- Documentación exhaustiva
- Scripts de ejemplo

**⏳ En progreso:**
- Ninguno (esperando próximas instrucciones)

**🔮 Pendiente:**
- Backend API
- Frontend web
- Sistema de newsletter
- Integración completa

---

**Última actualización:** Noviembre 18, 2025
**Proyecto:** Numbrica - Astrología y Numerología Personalizada
**Fase actual:** 1 - Fundamentos Técnicos ✅
