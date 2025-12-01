
# Numbrica Backend

Backend de la plataforma Numbrica - Sistema de Astrología y Numerología en español.

## 🌟 Características

- **API REST** completa con endpoints para cálculo de cartas natales y numerología
- **PostgreSQL** con TypeORM para almacenamiento persistente
- **Integración** con motores Python de cálculo astrológico y numerológico
- **Geocoding** automático para conversión de lugares a coordenadas
- **Documentación Swagger** en `/api-docs`
- **Tono esotérico/místico** en todas las interpretaciones

## 📋 Requisitos

- Node.js 18+ y yarn
- PostgreSQL 14+
- Python 3.9+ con dependencias de los motores instaladas

## 🚀 Instalación

1. **Clonar e instalar dependencias:**
```bash
cd /home/ubuntu/numbrica_backend
yarn install
```

2. **Configurar base de datos:**
```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
nano .env
```

3. **Inicializar base de datos:**
La base de datos se creará automáticamente al iniciar la aplicación.

## 🎯 Uso

### Desarrollo
```bash
yarn start:dev
```

La API estará disponible en: `http://localhost:3000`

### Producción
```bash
yarn build
yarn start:prod
```

## 📚 Endpoints API

### POST /api/calculate
Calcula carta natal y numerología, genera informe completo.

**Request:**
```json
{
  "nombre": "María López",
  "fecha_nacimiento": "1990-05-15",
  "hora_nacimiento": "14:30",
  "lugar": "Ciudad de México",
  "latitud": 19.4326,
  "longitud": -99.1332
}
```

**Response:**
```json
{
  "informe_id": "uuid-here",
  "mensaje": "Informe generado exitosamente"
}
```

### GET /api/informe/:id
Obtiene un informe completo por ID.

**Response:**
```json
{
  "id": "uuid",
  "nombre": "María López",
  "fecha_nacimiento": "1990-05-15",
  "datos_personales": {...},
  "astrologia": {
    "signo_solar": "tauro",
    "interpretacion_signo": "...",
    "planetas": [...],
    "aspectos": [...]
  },
  "numerologia": {
    "numero_camino_vida": 5,
    "interpretacion_numero": "..."
  },
  "integracion": "..."
}
```

### POST /api/geocode
Convierte nombre de lugar a coordenadas.

**Request:**
```json
{
  "lugar": "Ciudad de México"
}
```

**Response:**
```json
{
  "lugar": "Ciudad de México, México",
  "latitud": 19.4326,
  "longitud": -99.1332
}
```

### GET /api/health
Health check endpoint.

## 🗄️ Base de Datos

### Tabla: informes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Primary key |
| nombre | VARCHAR | Nombre completo |
| fecha_nacimiento | DATE | Fecha de nacimiento |
| hora_nacimiento | TIME | Hora de nacimiento (opcional) |
| lugar | VARCHAR | Lugar de nacimiento |
| latitud | FLOAT | Latitud |
| longitud | FLOAT | Longitud |
| signo_solar | VARCHAR | Signo solar calculado |
| numero_camino_vida | INTEGER | Número de camino de vida |
| informe_json | JSONB | Informe completo |
| created_at | TIMESTAMP | Fecha de creación |

## 🔧 Estructura del Proyecto

```
/home/ubuntu/numbrica_backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Módulo principal
│   ├── config/
│   │   └── database.config.ts  # Configuración DB
│   ├── entities/
│   │   └── informe.entity.ts   # Entidad Informe
│   ├── dto/
│   │   ├── calculate.dto.ts    # DTOs para validación
│   │   └── geocode.dto.ts
│   ├── services/
│   │   ├── astro.service.ts    # Integración motor astro
│   │   ├── numerology.service.ts
│   │   ├── geocoding.service.ts
│   │   ├── report.service.ts   # Generador de informes
│   │   └── templates.service.ts
│   └── controllers/
│       ├── calculate.controller.ts
│       ├── informe.controller.ts
│       ├── geocode.controller.ts
│       └── health.controller.ts
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🎨 Documentación API

Accede a la documentación interactiva Swagger en:
`http://localhost:3000/api-docs`

## 🔐 Variables de Entorno

Ver `.env.example` para la lista completa de variables de configuración.

## 📝 Licencia

Proyecto privado - Numbrica © 2025
