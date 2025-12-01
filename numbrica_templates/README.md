
# Plantillas de Interpretación Numbrica

## Descripción

Este directorio contiene el corpus de plantillas de interpretación en español para el proyecto Numbrica, una plataforma que integra astrología y numerología para ofrecer cartas astrales y numerológicas personalizadas.

## Estructura del Archivo JSON

El archivo `interpretations.json` contiene cuatro secciones principales:

### 1. `signos_solares`
Interpretaciones profundas de los 12 signos zodiacales desde una perspectiva esotérica y de propósito del alma.

**Signos incluidos:**
- Aries, Tauro, Géminis, Cáncer, Leo, Virgo, Libra, Escorpio, Sagitario, Capricornio, Acuario, Piscis

**Longitud:** 150-250 palabras cada uno

**Uso:** Para interpretar el signo solar del usuario en su carta astral personalizada.

### 2. `numeros_camino_vida`
Interpretaciones de los números del 1 al 9 desde la numerología pitagórica, enfocándose en el camino del alma y propósito de vida.

**Números incluidos:** 1, 2, 3, 4, 5, 6, 7, 8, 9

**Longitud:** 150-250 palabras cada uno

**Uso:** Para interpretar el número de camino de vida calculado desde la fecha de nacimiento del usuario.

### 3. `aspectos_genericos`
Interpretaciones de los cinco aspectos astrológicos principales sin referencia a planetas específicos.

**Aspectos incluidos:**
- Conjunción (0°)
- Oposición (180°)
- Cuadratura (90°)
- Trígono (120°)
- Sextil (60°)

**Longitud:** 100-150 palabras cada uno

**Uso:** Como plantillas base para interpretar aspectos entre planetas en la carta astral. Se pueden personalizar añadiendo los planetas específicos involucrados.

### 4. `integracion`
Un texto único que explica cómo la astrología y numerología se complementan como dos lenguajes del alma.

**Longitud:** 200-300 palabras

**Uso:** Para la introducción o conclusión del informe personalizado, explicando la filosofía integradora de Numbrica.

## Cómo Usar las Plantillas

### Backend Python

```python
import json

# Cargar las plantillas
with open('/home/ubuntu/numbrica_templates/interpretations.json', 'r', encoding='utf-8') as f:
    templates = json.load(f)

# Obtener interpretación de signo solar
signo_usuario = "aries"  # desde cálculo astrológico
interpretacion_signo = templates['signos_solares'][signo_usuario]

# Obtener interpretación de número de camino de vida
numero_camino = "7"  # desde cálculo numerológico
interpretacion_numero = templates['numeros_camino_vida'][numero_camino]

# Obtener texto de integración
texto_integracion = templates['integracion']

# Obtener interpretación de aspecto
aspecto_tipo = "trigono"  # desde análisis de aspectos
interpretacion_aspecto = templates['aspectos_genericos'][aspecto_tipo]
```

### Personalización de Aspectos

Los aspectos genéricos pueden personalizarse añadiendo información de los planetas involucrados:

```python
aspecto_base = templates['aspectos_genericos']['conjuncion']
planetas = "Sol y Luna"
interpretacion_personalizada = f"**{planetas} en Conjunción**\n\n{aspecto_base}"
```

### Generación de Informe Completo

```python
def generar_informe(datos_usuario):
    """
    Genera un informe personalizado combinando astrología y numerología
    """
    informe = []
    
    # Introducción
    informe.append("# Tu Carta Astral y Numerológica Personalizada\n")
    informe.append(templates['integracion'])
    
    # Sección Astrológica
    informe.append("\n## Tu Signo Solar\n")
    signo = datos_usuario['signo_solar'].lower()
    informe.append(templates['signos_solares'][signo])
    
    # Sección Numerológica
    informe.append("\n## Tu Número de Camino de Vida\n")
    numero = str(datos_usuario['numero_camino_vida'])
    informe.append(templates['numeros_camino_vida'][numero])
    
    # Aspectos Principales
    informe.append("\n## Aspectos Destacados en tu Carta\n")
    for aspecto in datos_usuario['aspectos_principales']:
        tipo = aspecto['tipo']
        planetas = f"{aspecto['planeta1']} y {aspecto['planeta2']}"
        informe.append(f"\n### {planetas} en {tipo.title()}\n")
        informe.append(templates['aspectos_genericos'][tipo])
    
    return "\n".join(informe)
```

## Formato de Salida

Las interpretaciones están diseñadas para ser presentadas en formato Markdown, que puede convertirse fácilmente a:
- HTML para web
- PDF para descargas
- Texto plano para emails

## Características del Contenido

- **Tono:** Esotérico, místico, profundo pero accesible
- **Lenguaje:** Simbólico, poético, inspirador
- **Enfoque:** Propósito del alma, crecimiento espiritual, autoconocimiento
- **Estilo:** Directo, en segunda persona, como carta personal del universo
- **Sin:** Jerga técnica, explicaciones científicas, predicciones deterministas

## Mantenimiento

Para añadir o modificar interpretaciones:

1. Mantener el formato JSON válido
2. Respetar el tono y estilo establecido (ver `TONE_GUIDE.md`)
3. Mantener las longitudes recomendadas
4. Asegurar que las claves sean consistentes con el código backend

## Notas Técnicas

- Codificación: UTF-8
- Formato: JSON
- Longitud total: ~15,000 palabras
- Idioma: Español (tono formal pero cálido)

## Versionado

- Versión: 1.0.0
- Fecha: Noviembre 2025
- Autor: Corpus inicial para Proyecto Numbrica
