#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ejemplo de uso de las plantillas de interpretación Numbrica
Muestra cómo generar un informe personalizado combinando astrología y numerología
"""

import json
from datetime import datetime

# Cargar plantillas
with open('interpretations.json', 'r', encoding='utf-8') as f:
    templates = json.load(f)

def generar_informe_ejemplo():
    """
    Genera un informe de ejemplo para un usuario ficticio
    """
    
    # Datos de ejemplo del usuario
    usuario = {
        'nombre': 'María Luna',
        'fecha_nacimiento': '15/03/1990',
        'signo_solar': 'piscis',
        'numero_camino_vida': 1,  # 1+5+0+3+1+9+9+0 = 28 -> 2+8 = 10 -> 1+0 = 1
        'aspectos_principales': [
            {'tipo': 'trigono', 'planeta1': 'Sol', 'planeta2': 'Luna'},
            {'tipo': 'cuadratura', 'planeta1': 'Venus', 'planeta2': 'Marte'}
        ]
    }
    
    # Construir el informe
    informe = []
    
    # Encabezado
    informe.append("=" * 80)
    informe.append(f"CARTA ASTRAL Y NUMEROLÓGICA PERSONALIZADA")
    informe.append(f"{usuario['nombre']}")
    informe.append(f"Fecha de nacimiento: {usuario['fecha_nacimiento']}")
    informe.append("=" * 80)
    informe.append("")
    
    # Texto de integración
    informe.append("📜 LA SABIDURÍA DE LAS ESTRELLAS Y LOS NÚMEROS")
    informe.append("-" * 80)
    informe.append(templates['integracion'])
    informe.append("")
    
    # Signo Solar
    informe.append("=" * 80)
    informe.append(f"☀️ TU SOL EN {usuario['signo_solar'].upper()}")
    informe.append("=" * 80)
    informe.append("")
    signo = usuario['signo_solar'].lower()
    informe.append(templates['signos_solares'][signo])
    informe.append("")
    
    # Número de Camino de Vida
    informe.append("=" * 80)
    informe.append(f"🔢 TU NÚMERO DE CAMINO DE VIDA: {usuario['numero_camino_vida']}")
    informe.append("=" * 80)
    informe.append("")
    numero = str(usuario['numero_camino_vida'])
    informe.append(templates['numeros_camino_vida'][numero])
    informe.append("")
    
    # Aspectos Destacados
    informe.append("=" * 80)
    informe.append("⭐ ASPECTOS DESTACADOS EN TU CARTA")
    informe.append("=" * 80)
    informe.append("")
    
    for aspecto in usuario['aspectos_principales']:
        tipo = aspecto['tipo']
        p1 = aspecto['planeta1']
        p2 = aspecto['planeta2']
        
        informe.append("-" * 80)
        informe.append(f"🌟 {p1} en {tipo.title()} con {p2}")
        informe.append("-" * 80)
        informe.append("")
        informe.append(templates['aspectos_genericos'][tipo])
        informe.append("")
    
    # Cierre
    informe.append("=" * 80)
    informe.append("✨ REFLEXIÓN FINAL")
    informe.append("=" * 80)
    informe.append("")
    informe.append("Este informe es un espejo sagrado de tu alma. Las palabras aquí escritas")
    informe.append("son semillas plantadas en el jardín de tu consciencia. Permíteles germinar")
    informe.append("a su propio ritmo. Regresa a este documento cuando necesites recordar")
    informe.append("quién eres, por qué viniste, y hacia dónde te diriges.")
    informe.append("")
    informe.append("El universo te reconoce. Tu alma es vista. Tu camino es honrado.")
    informe.append("")
    informe.append("Que estas palabras te acompañen en tu viaje.")
    informe.append("=" * 80)
    
    return "\n".join(informe)


def estadisticas_plantillas():
    """
    Muestra estadísticas sobre las plantillas
    """
    print("\n📊 ESTADÍSTICAS DEL CORPUS DE PLANTILLAS")
    print("=" * 80)
    
    # Signos solares
    print(f"\n✓ Signos Solares: {len(templates['signos_solares'])} interpretaciones")
    total_palabras_signos = sum(len(texto.split()) for texto in templates['signos_solares'].values())
    print(f"  - Total palabras: {total_palabras_signos}")
    print(f"  - Promedio palabras/signo: {total_palabras_signos // len(templates['signos_solares'])}")
    
    # Números de camino de vida
    print(f"\n✓ Números de Camino de Vida: {len(templates['numeros_camino_vida'])} interpretaciones")
    total_palabras_numeros = sum(len(texto.split()) for texto in templates['numeros_camino_vida'].values())
    print(f"  - Total palabras: {total_palabras_numeros}")
    print(f"  - Promedio palabras/número: {total_palabras_numeros // len(templates['numeros_camino_vida'])}")
    
    # Aspectos genéricos
    print(f"\n✓ Aspectos Genéricos: {len(templates['aspectos_genericos'])} interpretaciones")
    total_palabras_aspectos = sum(len(texto.split()) for texto in templates['aspectos_genericos'].values())
    print(f"  - Total palabras: {total_palabras_aspectos}")
    print(f"  - Promedio palabras/aspecto: {total_palabras_aspectos // len(templates['aspectos_genericos'])}")
    
    # Integración
    palabras_integracion = len(templates['integracion'].split())
    print(f"\n✓ Texto de Integración: {palabras_integracion} palabras")
    
    # Total
    total_palabras = total_palabras_signos + total_palabras_numeros + total_palabras_aspectos + palabras_integracion
    print(f"\n✓ TOTAL CORPUS: {total_palabras} palabras")
    print("=" * 80)


if __name__ == "__main__":
    # Mostrar estadísticas
    estadisticas_plantillas()
    
    # Generar informe de ejemplo
    print("\n\n📄 GENERANDO INFORME DE EJEMPLO...")
    print("=" * 80)
    informe = generar_informe_ejemplo()
    
    # Guardar el informe
    with open('ejemplo_informe.txt', 'w', encoding='utf-8') as f:
        f.write(informe)
    
    print("\n✅ Informe generado exitosamente: ejemplo_informe.txt")
    print("\nPrimeras líneas del informe:\n")
    print("\n".join(informe.split("\n")[:20]))
    print("\n... (ver archivo completo en ejemplo_informe.txt)")
