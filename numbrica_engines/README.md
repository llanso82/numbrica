# 🔮 Motores de Cálculo Numbrica

Motores independientes de cálculo numerológico y astrológico para la plataforma Numbrica.

## 📋 Descripción

Este proyecto contiene dos motores de cálculo fundamentales:

1. **Motor Numerológico** (`numerology_engine.py`) - Implementa cálculos numerológicos basados en el método Pitagórico
2. **Motor Astrológico** (`astro_engine.py`) - Realiza cálculos astrológicos usando Swiss Ephemeris

Ambos motores son independientes y pueden ser usados de forma standalone o integrados en aplicaciones más grandes.

## 🚀 Instalación

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Instalación de Dependencias

```bash
# Clonar o descargar el proyecto
cd numbrica_engines

# Instalar dependencias
pip install -r requirements.txt
```

### Dependencias Principales

- `pyswisseph==2.10.3.2` - Swiss Ephemeris para cálculos astrológicos de alta precisión
- `pytest==7.4.3` - Framework de testing
- `numpy==1.24.3` - Computación numérica (opcional)

## 📖 Uso

### Motor Numerológico

#### Cálculo del Número del Camino de Vida

```python
from numerology_engine import calculate_life_path

# Usando string
result = calculate_life_path('1990-05-15')
print(f"Camino de Vida: {result['life_path_number']}")
print(f"Descripción: {result['description']}")
print(f"Cálculo: {result['calculation_breakdown']}")

# Usando datetime
from datetime import datetime
result = calculate_life_path(datetime(1990, 5, 15))

# Usando diccionario
result = calculate_life_path({'year': 1990, 'month': 5, 'day': 15})
```

**Salida ejemplo:**
```
Camino de Vida: 3
Descripción: El Comunicador Creativo
Cálculo: 15 + 5 + 1990 = 2010 → 2 + 0 + 1 + 0 = 3
```

#### Cálculo del Número de Expresión

```python
from numerology_engine import calculate_expression_number

result = calculate_expression_number('María García')
print(f"Número de Expresión: {result['expression_number']}")
print(f"Descripción: {result['description']}")
```

#### Perfil Numerológico Completo

```python
from numerology_engine import get_complete_numerology_profile

profile = get_complete_numerology_profile('1990-05-15', 'María García')

print(f"Camino de Vida: {profile['life_path']['life_path_number']}")
print(f"Expresión: {profile['expression']['expression_number']}")
print(f"Deseo del Alma: {profile['soul_urge']['soul_urge_number']}")
```

### Motor Astrológico

#### Carta Natal Completa

```python
from astro_engine import calculate_natal_chart

# Carta natal con ubicación precisa
chart = calculate_natal_chart(
    birth_date='1990-05-15',
    birth_time='14:30',
    latitude=40.4168,    # Madrid, España
    longitude=-3.7038,
    location_name='Madrid, España'
)

print(f"Signo Solar: {chart['sun_sign']['sign']}")
print(f"Signo Lunar: {chart['moon_sign']['sign']}")
print(f"Ascendente: {chart['ascendant']['sign']}")

# Ver posiciones planetarias
for planet, data in chart['planets'].items():
    retro = " ℞" if data['is_retrograde'] else ""
    print(f"{planet}: {data['position']}{retro}")

# Ver aspectos
for aspect in chart['aspects']:
    print(f"{aspect['description']} (orbe: {aspect['orb']}°)")
```

#### Carta Natal Simplificada

Si no conoces la hora exacta de nacimiento o la ubicación:

```python
from astro_engine import get_simple_chart

# Solo requiere fecha
chart = get_simple_chart('1990-05-15')

print(f"Signo Solar: {chart['sun_sign']['sign']}")
print(f"Signo Lunar: {chart['moon_sign']['sign']}")
# Nota: El ascendente no será preciso sin hora y ubicación exactas
```

#### Conversión de Grados a Signos Zodiacales

```python
from astro_engine import degrees_to_zodiac

# Convertir grados eclípticos a signo zodiacal
position = degrees_to_zodiac(45.5)
print(f"Posición: {position['formatted']}")  # "15°30' Tauro"
print(f"Signo: {position['sign']}")          # "Tauro"
```

### Perfil Completo (Numerología + Astrología)

```python
from numerology_engine import get_complete_numerology_profile
from astro_engine import calculate_natal_chart

# Datos de la persona
birth_date = '1990-05-15'
birth_time = '14:30'
full_name = 'María García'
latitude = 40.4168
longitude = -3.7038

# Obtener ambos perfiles
numerology = get_complete_numerology_profile(birth_date, full_name)
astrology = calculate_natal_chart(birth_date, birth_time, latitude, longitude)

# Crear perfil integrado
complete_profile = {
    'personal_info': {
        'name': full_name,
        'birth_date': birth_date,
        'birth_time': birth_time
    },
    'numerology': numerology,
    'astrology': astrology
}

print("=== PERFIL COMPLETO ===")
print(f"Nombre: {full_name}")
print(f"\nNUMEROLOGÍA:")
print(f"  Camino de Vida: {numerology['life_path']['life_path_number']}")
print(f"  Expresión: {numerology['expression']['expression_number']}")
print(f"\nASTROLOGÍA:")
print(f"  Sol: {astrology['sun_sign']['sign']}")
print(f"  Luna: {astrology['moon_sign']['sign']}")
print(f"  Ascendente: {astrology['ascendant']['sign']}")
```

## 🧪 Testing

Ejecutar todos los tests:

```bash
# Método 1: Usando pytest directamente
pytest test_engines.py -v

# Método 2: Ejecutar el archivo de tests
python test_engines.py

# Con cobertura
pytest test_engines.py --cov=. --cov-report=html
```

### Tests Incluidos

**Motor Numerológico:**
- ✅ Reducción de números a un solo dígito
- ✅ Números maestros (11, 22, 33)
- ✅ Cálculo de Camino de Vida con fechas conocidas
- ✅ Diferentes formatos de entrada (string, datetime, dict)
- ✅ Número de Expresión
- ✅ Deseo del Alma
- ✅ Perfil completo
- ✅ Manejo de errores

**Motor Astrológico:**
- ✅ Conversión de grados a signos zodiacales
- ✅ Conversión datetime a juliano
- ✅ Cálculo de carta natal básica
- ✅ Carta natal sin hora de nacimiento
- ✅ Signos solares para todos los meses
- ✅ Cálculo de aspectos planetarios
- ✅ Detección de planetas retrógrados
- ✅ Diferentes formatos de fecha

**Integración:**
- ✅ Perfil completo (numerología + astrología)

## 📁 Estructura del Proyecto

```
numbrica_engines/
├── README.md                  # Este archivo
├── requirements.txt           # Dependencias del proyecto
├── numerology_engine.py       # Motor numerológico
├── astro_engine.py           # Motor astrológico
└── test_engines.py           # Tests unitarios
```

## 🔍 Ejemplos de Datos de Salida

### Resultado de Camino de Vida

```python
{
    'life_path_number': 3,
    'calculation_breakdown': '15 + 5 + 1990 = 2010 → 2 + 0 + 1 + 0 = 3',
    'description': 'El Comunicador Creativo'
}
```

### Resultado de Carta Natal

```python
{
    'birth_info': {
        'date': '1990-05-15',
        'time': '14:30:00',
        'location': 'Madrid, España',
        'latitude': 40.4168,
        'longitude': -3.7038
    },
    'sun_sign': {
        'sign': 'Tauro',
        'position': "24°30' Tauro",
        'description': 'El constructor paciente y sensual'
    },
    'moon_sign': {
        'sign': 'Cáncer',
        'position': "10°15' Cáncer"
    },
    'ascendant': {
        'sign': 'Virgo',
        'position': "5°42' Virgo"
    },
    'planets': {
        'Sol': {'position': "24°30' Tauro", 'is_retrograde': False},
        'Luna': {'position': "10°15' Cáncer", 'is_retrograde': False},
        # ... más planetas
    },
    'aspects': [
        {
            'description': 'Sol Trígono Luna',
            'aspect': 'Trígono',
            'orb': 2.5
        },
        # ... más aspectos
    ]
}
```

## 🎯 Funciones Principales

### Motor Numerológico (`numerology_engine.py`)

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `calculate_life_path(birth_date)` | Calcula el Número del Camino de Vida | Dict con número, cálculo y descripción |
| `calculate_expression_number(full_name)` | Calcula el Número de Expresión | Dict con número, cálculo y descripción |
| `calculate_soul_urge(full_name)` | Calcula el Deseo del Alma | Dict con número, cálculo y descripción |
| `get_complete_numerology_profile(birth_date, full_name)` | Perfil numerológico completo | Dict con todos los números |
| `reduce_to_single_digit(number)` | Reduce número a un dígito | Int (1-9, 11, 22, 33) |

### Motor Astrológico (`astro_engine.py`)

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `calculate_natal_chart(birth_date, birth_time, lat, lon)` | Calcula carta natal completa | Dict con toda la información astrológica |
| `get_simple_chart(birth_date)` | Carta simplificada sin coordenadas | Dict con información básica |
| `degrees_to_zodiac(degrees)` | Convierte grados a signo zodiacal | Dict con signo y posición |
| `calculate_aspect(lon1, lon2)` | Calcula aspecto entre dos puntos | Dict con información del aspecto o None |

## ⚙️ Configuración Avanzada

### Datos de Efemérides (Opcional)

Para mayor precisión en cálculos astrológicos antiguos o futuros, puedes descargar archivos de efemérides adicionales:

```python
import swisseph as swe

# Configurar ruta personalizada para datos de efemérides
swe.set_ephe_path('/path/to/ephemeris/data')
```

Descarga efemérides desde: https://www.astro.com/swisseph/

### Personalizar Orbes de Aspectos

En `astro_engine.py`, puedes modificar el diccionario `ASPECTS`:

```python
ASPECTS = {
    'Conjunción': {'angle': 0, 'orb': 10},  # Orbe más amplio
    'Trígono': {'angle': 120, 'orb': 6},    # Orbe más estrecho
    # ...
}
```

## 🐛 Solución de Problemas

### Error: "No module named 'swisseph'"

```bash
pip install pyswisseph
```

### Error en cálculos astrológicos para fechas antiguas

Descarga archivos de efemérides adicionales y configura la ruta con `swe.set_ephe_path()`.

### Los tests fallan

Asegúrate de tener todas las dependencias instaladas:

```bash
pip install -r requirements.txt
```

## 📝 Notas Importantes

1. **Hora de Nacimiento**: Sin hora exacta de nacimiento, el Ascendente y las casas astrológicas no serán precisos. El motor usa mediodía (12:00) como valor por defecto.

2. **Coordenadas Geográficas**: Para cálculos astrológicos precisos, necesitas las coordenadas exactas del lugar de nacimiento.

3. **Números Maestros**: En numerología, los números 11, 22 y 33 son "números maestros" y no se reducen automáticamente.

4. **Zona Horaria**: Los cálculos astrológicos usan la hora como fue ingresada. Asegúrate de usar la hora local del lugar de nacimiento.

## 🔮 Integración con FastAPI

Estos motores están diseñados para ser fácilmente integrados en un backend FastAPI:

```python
from fastapi import FastAPI
from numerology_engine import calculate_life_path
from astro_engine import calculate_natal_chart

app = FastAPI()

@app.post("/api/numerology/life-path")
def get_life_path(birth_date: str):
    return calculate_life_path(birth_date)

@app.post("/api/astrology/natal-chart")
def get_natal_chart(
    birth_date: str,
    birth_time: str,
    latitude: float,
    longitude: float
):
    return calculate_natal_chart(birth_date, birth_time, latitude, longitude)
```

## 📄 Licencia

Proyecto interno Numbrica - Todos los derechos reservados.

## 👥 Contribución

Este es un proyecto en desarrollo activo. Para sugerencias o mejoras, contacta al equipo de desarrollo.

## 🌟 Próximas Características

- [ ] Tránsitos planetarios
- [ ] Progresiones secundarias
- [ ] Sinastría (compatibilidad de cartas)
- [ ] Numerología Caldea
- [ ] Más aspectos menores
- [ ] Cálculo de Luna Nueva/Llena
- [ ] Retornos solares

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025  
**Proyecto:** Numbrica - Plataforma de Astrología y Numerología
