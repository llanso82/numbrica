
# Ejemplos de Uso - API Numbrica

## 🔮 Ejemplos de Requests

### 1. Health Check
Verifica que la API está operativa:

```bash
curl http://localhost:3000/api/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T20:45:01.803Z",
  "service": "Numbrica Backend",
  "version": "1.0.0",
  "mensaje": "🔮 API de Astrología y Numerología operativa"
}
```

---

### 2. Geocoding
Convierte nombre de lugar a coordenadas:

```bash
curl -X POST http://localhost:3000/api/geocode \
  -H "Content-Type: application/json" \
  -d '{
    "lugar": "Guadalajara, México"
  }'
```

**Respuesta:**
```json
{
  "lugar": "Guadalajara, Jalisco, México",
  "latitud": 20.6597,
  "longitud": -103.3496
}
```

**Otros ejemplos de lugares:**
- "Monterrey, México"
- "Buenos Aires, Argentina"
- "Madrid, España"
- "Barcelona, España"

---

### 3. Generar Informe Completo
Calcula carta natal y numerología, genera informe personalizado:

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María Guadalupe López",
    "fecha_nacimiento": "1990-05-15",
    "hora_nacimiento": "14:30",
    "lugar": "Ciudad de México, México",
    "latitud": 19.4326,
    "longitud": -99.1332
  }'
```

**Respuesta:**
```json
{
  "informe_id": "bb6d2579-44d6-48b2-b856-71cdd8cf426a",
  "mensaje": "Informe generado exitosamente"
}
```

#### Ejemplo sin hora de nacimiento
Si no se conoce la hora exacta, se puede omitir (usa mediodía por defecto):

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos Pérez",
    "fecha_nacimiento": "1988-03-20",
    "lugar": "Monterrey, México",
    "latitud": 25.6866,
    "longitud": -100.3161
  }'
```

---

### 4. Obtener Informe por ID
Recupera un informe previamente generado:

```bash
curl http://localhost:3000/api/informe/bb6d2579-44d6-48b2-b856-71cdd8cf426a
```

**Respuesta (resumida):**
```json
{
  "id": "bb6d2579-44d6-48b2-b856-71cdd8cf426a",
  "nombre": "María Guadalupe López",
  "fecha_nacimiento": "1990-05-15T00:00:00.000Z",
  "signo_solar": "tauro",
  "numero_camino_vida": 3,
  "datos_personales": {
    "nombre": "María Guadalupe López",
    "fecha_nacimiento": "1990-05-15",
    "hora_nacimiento": "14:30",
    "lugar": "Ciudad de México, México"
  },
  "astrologia": {
    "signo_solar": "tauro",
    "interpretacion_signo": "Llegas a este mundo como guardián de lo sagrado tangible...",
    "planetas": {
      "Sol": {
        "sign": "Tauro",
        "degrees": 24.123,
        "house": 10
      },
      "Luna": {
        "sign": "Capricornio",
        "degrees": 20.178,
        "house": 6
      }
      // ... más planetas
    },
    "aspectos": [
      {
        "planet1": "Sol",
        "planet2": "Luna",
        "aspect": "Trígono",
        "orb": 3.95,
        "interpretacion": "Dos fuerzas fluyen en perfecta armonía..."
      }
      // ... más aspectos
    ]
  },
  "numerologia": {
    "numero_camino_vida": 3,
    "interpretacion_numero": "Tu alma danza al ritmo del creador...",
    "perfil_completo": {
      "life_path": {
        "life_path_number": 3,
        "calculation": "1+9+9+0+5+1+5 = 30 → 3+0 = 3"
      }
      // ... más números
    }
  },
  "integracion": "La astrología y la numerología son dos lenguajes sagrados..."
}
```

---

### 5. Listar Todos los Informes
Obtiene lista resumida de todos los informes:

```bash
curl http://localhost:3000/api/informes
```

**Respuesta:**
```json
[
  {
    "id": "2501a09a-2d03-47ec-acc3-fd72344ddaf2",
    "nombre": "Carlos Alberto Mendoza",
    "fecha_nacimiento": "1985-12-25T00:00:00.000Z",
    "lugar": "Guadalajara, Jalisco, México",
    "signo_solar": "capricornio",
    "numero_camino_vida": 6,
    "created_at": "2025-11-18T20:45:53.102Z"
  },
  {
    "id": "bb6d2579-44d6-48b2-b856-71cdd8cf426a",
    "nombre": "María Guadalupe López",
    "fecha_nacimiento": "1990-05-15T00:00:00.000Z",
    "lugar": "Ciudad de México, México",
    "signo_solar": "tauro",
    "numero_camino_vida": 3,
    "created_at": "2025-11-18T20:45:12.913Z"
  }
]
```

---

## 🌟 Casos de Uso Completos

### Flujo completo: De lugar a informe

1. **Paso 1: Obtener coordenadas del lugar**
```bash
curl -X POST http://localhost:3000/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"lugar": "Mérida, Yucatán, México"}'
```
Resultado: `latitud: 20.9674, longitud: -89.5926`

2. **Paso 2: Generar informe con esas coordenadas**
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Isabel Tun",
    "fecha_nacimiento": "1995-08-10",
    "hora_nacimiento": "16:45",
    "lugar": "Mérida, Yucatán, México",
    "latitud": 20.9674,
    "longitud": -89.5926
  }'
```

3. **Paso 3: Recuperar y usar el informe**
```bash
curl http://localhost:3000/api/informe/{informe_id}
```

---

## 📊 Estructura de Datos

### Signos Solares Soportados
- Aries, Tauro, Géminis, Cáncer
- Leo, Virgo, Libra, Escorpio
- Sagitario, Capricornio, Acuario, Piscis

### Números de Camino de Vida
- 1 al 9: Números simples
- 11, 22, 33: Números maestros (preservados automáticamente)

### Aspectos Astrológicos
- **Conjunción** (0°, orbe ±8°)
- **Sextil** (60°, orbe ±6°)
- **Cuadratura** (90°, orbe ±8°)
- **Trígono** (120°, orbe ±8°)
- **Oposición** (180°, orbe ±8°)

---

## 🔐 Validaciones

### Formato de Fecha
- **Formato requerido:** `YYYY-MM-DD`
- **Ejemplo válido:** `1990-05-15`
- **Ejemplo inválido:** `15/05/1990` ❌

### Formato de Hora
- **Formato requerido:** `HH:MM`
- **Ejemplo válido:** `14:30`
- **Ejemplo inválido:** `2:30 PM` ❌
- **Opcional:** Si se omite, usa `12:00` (mediodía)

### Coordenadas
- **Latitud:** -90 a 90
- **Longitud:** -180 a 180

---

## ⚠️ Manejo de Errores

### Error 400: Datos inválidos
```json
{
  "statusCode": 400,
  "message": [
    "La fecha debe estar en formato YYYY-MM-DD"
  ],
  "error": "Bad Request"
}
```

### Error 404: Informe no encontrado
```json
{
  "statusCode": 404,
  "message": "Informe con ID xyz no encontrado",
  "error": "Not Found"
}
```

### Error 500: Error en cálculo
```json
{
  "statusCode": 500,
  "message": "Error en cálculo astrológico: Invalid date format"
}
```

---

## 🧪 Testing con cURL

Script completo de prueba:

```bash
#!/bin/bash

echo "1️⃣ Testing health endpoint..."
curl http://localhost:3000/api/health

echo -e "\n\n2️⃣ Testing geocode..."
curl -X POST http://localhost:3000/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"lugar": "Santiago de Chile"}'

echo -e "\n\n3️⃣ Generating informe..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Usuario",
    "fecha_nacimiento": "1992-07-22",
    "hora_nacimiento": "10:00",
    "lugar": "Santiago, Chile",
    "latitud": -33.4489,
    "longitud": -70.6693
  }')

INFORME_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['informe_id'])")

echo -e "\n\n4️⃣ Retrieving informe $INFORME_ID..."
curl http://localhost:3000/api/informe/$INFORME_ID

echo -e "\n\n✅ All tests completed!"
```

---

## 📚 Documentación Interactiva

Accede a la documentación Swagger completa en:
**http://localhost:3000/api-docs**

Desde ahí puedes:
- Ver todos los endpoints disponibles
- Probar requests directamente desde el navegador
- Ver schemas de request/response
- Descargar especificación OpenAPI

---

## 🎯 Próximos Pasos

Este backend está listo para:
1. **Integración con frontend Next.js**
2. **Generación de PDFs** (próxima fase)
3. **Sistema de autenticación** (usuarios registrados)
4. **Informes semanales automatizados** (tránsitos)
5. **Webhook para pagos** (Stripe/Mercado Pago)

---

**Numbrica Backend v1.0** - Astrología y Numerología al servicio del autoconocimiento 🔮✨
