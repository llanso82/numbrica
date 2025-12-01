
# Documentos Legales de Numbrica

Este directorio contiene los documentos legales de la plataforma Numbrica. Todos los documentos están en **español** y deben ser completados con información corporativa real antes del lanzamiento a producción.

## 📄 Documentos Incluidos

### 1. **PRIVACY_POLICY.md** - Aviso de Privacidad
**Propósito:** Informa a los usuarios cómo Numbrica recopila, usa, almacena y protege sus datos personales, cumpliendo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México).

**Contenido:**
- Datos personales que se recopilan
- Finalidades del tratamiento
- Con quién se comparten los datos
- Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)
- Medidas de seguridad implementadas
- Políticas de cookies

**Estado:** ✅ Completo con placeholders

---

### 2. **TERMS_OF_SERVICE.md** - Términos y Condiciones de Servicio
**Propósito:** Establece las reglas, obligaciones y limitaciones para el uso de la plataforma Numbrica.

**Contenido:**
- Descripción del servicio
- Uso permitido y prohibido
- Naturaleza de los informes (autoconocimiento, NO asesoramiento profesional)
- Política de no reembolsos
- Manejo de suscripciones
- Propiedad intelectual
- Proceso de atención a disputas
- Limitación de responsabilidad

**Estado:** ✅ Completo con placeholders

---

### 3. **CONSENT_POLICY.md** - Política de Consentimientos
**Propósito:** Explica el sistema de consentimientos granulares de Numbrica (servicio vs. marketing) y cómo los usuarios pueden gestionarlos.

**Contenido:**
- Tipos de consentimientos (obligatorio vs. opcional)
- Cómo se registran los consentimientos
- Cómo modificar o revocar consentimientos
- Consecuencias de cada tipo de consentimiento
- Derechos adicionales

**Estado:** ✅ Completo con placeholders

---

## 🔧 Placeholders a Completar

Antes de lanzar a producción, **DEBE reemplazar** los siguientes placeholders en TODOS los documentos:

| Placeholder | Ejemplo | Dónde Obtenerlo |
|------------|---------|-----------------|
| `[RAZÓN SOCIAL]` | "Numbrica S.A. de C.V." | Acta constitutiva de la empresa |
| `[DIRECCIÓN FISCAL]` | "Av. Insurgentes Sur 123, Col. Roma, CDMX, CP 06700, México" | Registro fiscal oficial |
| `[DOMINIO]` | "numbrica.com" | Dominio registrado |
| `[FECHA]` | "1 de diciembre de 2025" | Fecha de última actualización |
| `[CIUDAD], [ESTADO]` | "Ciudad de México, CDMX" | Jurisdicción legal |

### Buscar y Reemplazar:

```bash
# En Linux/Mac
cd /home/ubuntu/numbrica_legal
sed -i 's/\[RAZÓN SOCIAL\]/Numbrica S.A. de C.V./g' *.md
sed -i 's/\[DIRECCIÓN FISCAL\]/Tu dirección fiscal completa/g' *.md
sed -i 's/\[DOMINIO\]/numbrica.com/g' *.md
sed -i 's/\[FECHA\]/1 de diciembre de 2025/g' *.md
sed -i 's/\[CIUDAD\]/Ciudad de México/g' *.md
sed -i 's/\[ESTADO\]/CDMX/g' *.md
```

---

## 🌐 Integración con el Frontend

### Ubicación Recomendada en el Sitio Web:

1. **Footer** (todas las páginas):
   - "Aviso de Privacidad" → enlace a `/aviso-privacidad`
   - "Términos de Servicio" → enlace a `/terminos`
   - "Política de Consentimientos" → enlace a `/consentimientos`

2. **Página de Registro**:
   - Checkbox: "Acepto los [Términos de Servicio] y [Aviso de Privacidad]" (REQUERIDO)
   - Checkbox: "Deseo recibir newsletters" (OPCIONAL) con link a Política de Consentimientos

3. **Página de Configuración de Usuario**:
   - Sección "Privacidad y Consentimientos"
   - Toggle para activar/desactivar marketing
   - Links a todos los documentos legales

### Implementación en Next.js:

#### Opción 1: Páginas Estáticas

```typescript
// pages/aviso-privacidad.tsx
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default function AvisoPrivacidad({ content }: { content: string }) {
  return (
    <div className="legal-document">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), '../numbrica_legal/PRIVACY_POLICY.md');
  const content = fs.readFileSync(filePath, 'utf8');
  return { props: { content } };
};
```

#### Opción 2: Componente Modal

```typescript
// components/LegalModal.tsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function LegalModal({ type }: { type: 'privacy' | 'terms' | 'consent' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  const loadContent = async () => {
    const response = await fetch(`/api/legal/${type}`);
    const data = await response.text();
    setContent(data);
    setIsOpen(true);
  };

  return (
    <>
      <button onClick={loadContent}>Ver {type === 'privacy' ? 'Aviso de Privacidad' : 'Términos'}</button>
      {isOpen && (
        <div className="modal">
          <ReactMarkdown>{content}</ReactMarkdown>
          <button onClick={() => setIsOpen(false)}>Cerrar</button>
        </div>
      )}
    </>
  );
}
```

---

## 🔌 Integración con el Backend

### Endpoints API Recomendados:

```typescript
// GET /api/legal/privacy
// GET /api/legal/terms
// GET /api/legal/consent
router.get('/api/legal/:type', async (req, res) => {
  const { type } = req.params;
  const fileMap = {
    privacy: 'PRIVACY_POLICY.md',
    terms: 'TERMS_OF_SERVICE.md',
    consent: 'CONSENT_POLICY.md',
  };
  
  const filePath = path.join(__dirname, '../../numbrica_legal', fileMap[type]);
  const content = fs.readFileSync(filePath, 'utf8');
  res.send(content);
});
```

### Registro de Consentimientos:

El backend ya implementa el registro de consentimientos en la tabla `users`:

- `consentimiento_servicio` (Boolean, REQUERIDO)
- `consentimiento_marketing` (Boolean, OPCIONAL)
- `consentimiento_timestamp` (DateTime)

---

## 📧 Templates de Email

Los emails transaccionales (verificación, recuperación de contraseña) ya incluyen disclaimers legales básicos. Considera agregar:

**Footer de Email:**
```
Has recibido este email porque tienes una cuenta en Numbrica.
Para más información sobre cómo manejamos tus datos: [Aviso de Privacidad]

Si deseas dejar de recibir emails promocionales: [Cancelar suscripción]

© 2025 [RAZÓN SOCIAL]. Todos los derechos reservados.
[DIRECCIÓN FISCAL]
```

---

## ✅ Checklist Pre-Lanzamiento

Antes de lanzar a producción, verifica:

- [ ] Todos los placeholders han sido reemplazados con información real
- [ ] Los documentos han sido revisados por un abogado especializado en protección de datos
- [ ] Las fechas de "última actualización" están correctas
- [ ] Los links en el footer del sitio web funcionan correctamente
- [ ] El formulario de registro muestra los consentimientos claramente
- [ ] El sistema de consentimientos está funcionando (guardar/actualizar/revocar)
- [ ] Los emails transaccionales incluyen los disclaimers legales
- [ ] Existe un proceso claro para usuarios que deseen ejercer sus derechos ARCO
- [ ] Los correos privacidad@[DOMINIO] y soporte@[DOMINIO] están activos y monitoreados

---

## 📋 Mantenimiento

### Cuándo Actualizar estos Documentos:

1. **Cambios en la ley**: Si la legislación de protección de datos cambia
2. **Nuevas funcionalidades**: Si se agregan servicios que requieren nuevos tipos de datos
3. **Cambios corporativos**: Si cambia la razón social, dirección o estructura de la empresa
4. **Nuevos proveedores**: Si se agregan proveedores de servicios que procesarán datos de usuarios
5. **Anualmente**: Revisión general para asegurar que todo sigue vigente

### Proceso de Actualización:

1. Actualizar el documento correspondiente
2. Cambiar la fecha de "última actualización"
3. Notificar a los usuarios (email para cambios sustanciales)
4. Publicar en el sitio web
5. Mantener una versión archivada de documentos anteriores

---

## 🆘 Soporte Legal

Para consultas legales sobre estos documentos:

- **Asesor legal especializado en protección de datos**
- **Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)**: https://home.inai.org.mx/

---

## 📎 Archivos Adicionales

Este directorio también contiene versiones PDF de los documentos para facilitar su descarga y lectura:

- `PRIVACY_POLICY.pdf`
- `TERMS_OF_SERVICE.pdf`
- `CONSENT_POLICY.pdf`

Los PDFs se regeneran automáticamente cuando se actualizan los archivos Markdown.

---

**Nota:** Estos documentos proporcionan una base sólida, pero DEBEN ser revisados por un abogado especializado antes del lanzamiento a producción para asegurar cumplimiento total con la legislación mexicana vigente.

---

© 2025 Numbrica. Documentación legal interna.
