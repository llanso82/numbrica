[README.md](https://github.com/user-attachments/files/29114013/README.md)
# Numbrica Codex Starter Pack

This pack contains reusable Codex guidance for fixing and premiumizing Numbrica.

## Files

- `AGENTS.md` — durable repo-level instructions for Codex
- `.agents/skills/*/SKILL.md` — reusable skills
- `docs/ARCHITECTURE_REUSABLE_MODULES.md` — plan to extract reusable modules
- `docs/PREMIUM_QA_CHECKLIST.md` — QA checklist for premium guides
- `docs/LAUNCH_CHECKLIST.md` — launch readiness checklist
- `.codex/config.example.toml` — optional config reference

## How to use

1. Copy these files into the root of your Numbrica project.
2. Open Codex in that project folder.
3. Ask Codex to read `AGENTS.md`.
4. Start with Sprint 0 audit.
5. Do not proceed to implementation until Sprint 0 is approved.

## Sprint 0 Prompt

Paste this into Codex after copying the files:

```txt
Use the numbrica-premium-auditor skill.

Actúa como senior full-stack engineer, arquitecto de producto premium y experto en astrología occidental, numerología pitagórica y BaZi.

Objetivo:
Auditar Numbrica para convertirlo en una plataforma premium-only de guías de vida, relación, familia y negocio.

Contexto:
El PDF familiar actual es demasiado pobre. Tiene capítulos de 1–3 renglones, frases genéricas y no usa de forma profunda todos los datos del motor. Quiero corregir el producto de raíz, no solo mejorar copy.

No modifiques lógica todavía.
No cambies componentes.
No arregles código todavía.
Solo audita y documenta.

Audita estos archivos si existen:
- lib/premium/life-map-builder.ts
- lib/premium/compatibility-builder.ts
- lib/premium/family-map-builder.ts
- lib/premium/business-map-builder.ts
- lib/premium/premium-report-orchestrator.ts
- lib/premium/premium-pdf-template.ts
- lib/premium/premium-visuals.ts
- lib/premium/premium-quality-validator.ts
- app/api/generate-pdf/route.ts
- app/page.tsx
- app/generar/page.tsx
- app/generar/report-form.tsx
- app/productos/page.tsx
- app/informe/[id]/page.tsx
- app/informe/[id]/premium-upgrade.tsx
- app/informe/[id]/premium-sections.tsx
- app/informe/[id]/download-button.tsx
- lib/newsletter.ts
- lib/newsletter-template.ts
- lib/sincronia-vital/delivery.ts
- app/api/sincronia-vital/chat/route.ts

Busca y documenta:
1. Fallbacks pobres.
2. Frases genéricas prohibidas.
3. Lugares donde se aceptan premiumReports pobres.
4. Lugares donde se genera PDF aunque el contenido no tenga calidad.
5. Datos del motor que existen pero no se usan.
6. Por qué pareja/familia/negocio salen más pobres que individual.
7. Qué falta para un Premium Data Dossier.
8. Qué falta para una newsletter diaria tipo maestro de vida.
9. Qué falta para consultas 100% automatizadas.
10. Qué textos públicos todavía dicen generar reporte, informe, PDF, upgrade premium o producto normal.

Crea este archivo:
docs/NUMBRICA_PREMIUM_AUDIT.md

El documento debe incluir:
A. Resumen ejecutivo.
B. Diagnóstico por archivo.
C. Fallas críticas del pipeline premium.
D. Frases prohibidas encontradas.
E. Datos del motor que no se están aprovechando.
F. Debilidad por producto: individual, pareja, familia, negocio.
G. Diagnóstico del PDF premium.
H. Diagnóstico de la página premium-only.
I. Diagnóstico de newsletter.
J. Diagnóstico de consultas automatizadas.
K. Plan de corrección en sprints pequeños.
L. Riesgos técnicos.
M. Recomendación final.

Criterio de aceptación:
- No modificar lógica.
- No cambiar UI.
- No cambiar builders.
- Solo crear docs/NUMBRICA_PREMIUM_AUDIT.md.
- Al final reportar archivos leídos y hallazgos principales.
```
