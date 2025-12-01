"""
Motor Numerológico - Numbrica
Sistema de cálculo numerológico basado en el método Pitagórico

Este motor implementa cálculos numerológicos fundamentales para la plataforma Numbrica,
incluyendo el Número del Camino de Vida y otros números personales.
"""

from datetime import datetime
from typing import Union, Dict


def reduce_to_single_digit(number: int, keep_master_numbers: bool = True) -> int:
    """
    Reduce un número a un solo dígito mediante suma iterativa.
    
    Args:
        number: Número a reducir
        keep_master_numbers: Si True, mantiene los números maestros 11, 22, 33
        
    Returns:
        Número reducido (1-9 o números maestros 11, 22, 33)
    """
    # Los números maestros se preservan en la primera reducción
    if keep_master_numbers and number in [11, 22, 33]:
        return number
    
    while number > 9:
        # Sumar los dígitos del número
        number = sum(int(digit) for digit in str(number))
        
        # Verificar números maestros en cada iteración
        if keep_master_numbers and number in [11, 22, 33]:
            return number
    
    return number


def calculate_life_path(birth_date: Union[str, datetime, Dict[str, int]]) -> Dict[str, Union[int, str]]:
    """
    Calcula el Número del Camino de Vida según el método Pitagórico.
    
    El Camino de Vida es el número más importante en numerología y representa
    el propósito de vida y las lecciones principales que una persona debe aprender.
    
    Args:
        birth_date: Fecha de nacimiento en formato:
            - String: 'YYYY-MM-DD' o 'DD/MM/YYYY'
            - datetime object
            - Dict: {'day': int, 'month': int, 'year': int}
    
    Returns:
        Dict con:
            - 'life_path_number': Número del camino de vida (1-9, 11, 22, 33)
            - 'calculation_breakdown': Desglose del cálculo
            - 'description': Descripción breve del número
    
    Ejemplo:
        >>> calculate_life_path('1990-05-15')
        {
            'life_path_number': 3,
            'calculation_breakdown': '15 + 5 + 1990 = 2010 → 2 + 0 + 1 + 0 = 3',
            'description': 'El Comunicador Creativo'
        }
    """
    # Convertir entrada a día, mes, año
    if isinstance(birth_date, str):
        # Intentar varios formatos
        for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%Y/%m/%d']:
            try:
                dt = datetime.strptime(birth_date, fmt)
                day, month, year = dt.day, dt.month, dt.year
                break
            except ValueError:
                continue
        else:
            raise ValueError(f"Formato de fecha no reconocido: {birth_date}")
    elif isinstance(birth_date, datetime):
        day, month, year = birth_date.day, birth_date.month, birth_date.year
    elif isinstance(birth_date, dict):
        day = birth_date.get('day')
        month = birth_date.get('month')
        year = birth_date.get('year')
        if not all([day, month, year]):
            raise ValueError("El diccionario debe contener 'day', 'month' y 'year'")
    else:
        raise TypeError("birth_date debe ser str, datetime o dict")
    
    # Validar fecha
    if not (1 <= day <= 31 and 1 <= month <= 12 and 1000 <= year <= 9999):
        raise ValueError(f"Fecha inválida: {day}/{month}/{year}")
    
    # Método de reducción: sumar todos los dígitos de la fecha completa
    full_number = day + month + year
    calculation_steps = [f"{day} + {month} + {year} = {full_number}"]
    
    # Primera reducción
    step1 = reduce_to_single_digit(full_number, keep_master_numbers=True)
    if step1 != full_number:
        digits_str = ' + '.join(str(full_number))
        calculation_steps.append(f"{digits_str} = {step1}")
    
    # Si no es número maestro y es > 9, seguir reduciendo
    final_number = step1
    while final_number > 9 and final_number not in [11, 22, 33]:
        previous = final_number
        final_number = reduce_to_single_digit(final_number, keep_master_numbers=False)
        digits_str = ' + '.join(str(previous))
        calculation_steps.append(f"{digits_str} = {final_number}")
    
    # Obtener descripción del número
    description = get_life_path_description(final_number)
    
    return {
        'life_path_number': final_number,
        'calculation_breakdown': ' → '.join(calculation_steps),
        'description': description
    }


def get_life_path_description(number: int) -> str:
    """
    Obtiene una descripción breve del número del camino de vida.
    
    Args:
        number: Número del camino de vida (1-9, 11, 22, 33)
        
    Returns:
        Descripción breve del número
    """
    descriptions = {
        1: "El Líder Independiente",
        2: "El Pacificador Diplomático",
        3: "El Comunicador Creativo",
        4: "El Constructor Práctico",
        5: "El Espíritu Libre Aventurero",
        6: "El Cuidador Responsable",
        7: "El Buscador Espiritual",
        8: "El Maestro del Poder Material",
        9: "El Humanitario Universal",
        11: "El Iluminador Intuitivo (Número Maestro)",
        22: "El Arquitecto Maestro (Número Maestro)",
        33: "El Maestro Sanador (Número Maestro)"
    }
    return descriptions.get(number, "Número desconocido")


def calculate_expression_number(full_name: str) -> Dict[str, Union[int, str]]:
    """
    Calcula el Número de Expresión basado en el nombre completo.
    
    El Número de Expresión revela los talentos naturales y habilidades
    que una persona trae a este mundo.
    
    Args:
        full_name: Nombre completo de la persona
        
    Returns:
        Dict con:
            - 'expression_number': Número de expresión (1-9, 11, 22, 33)
            - 'calculation_breakdown': Desglose del cálculo
            - 'description': Descripción breve
    """
    # Tabla Pitagórica de conversión letras a números
    pythagorean_table = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
        # Letras con acentos (español)
        'Á': 1, 'É': 5, 'Í': 9, 'Ó': 6, 'Ú': 3, 'Ñ': 5
    }
    
    # Limpiar y normalizar el nombre (mantener solo letras)
    clean_name = ''.join(c.upper() for c in full_name if c.isalpha())
    
    if not clean_name:
        raise ValueError("El nombre debe contener al menos una letra")
    
    # Calcular suma de valores
    letter_values = []
    total = 0
    for letter in clean_name:
        value = pythagorean_table.get(letter, 0)
        if value > 0:
            letter_values.append(f"{letter}={value}")
            total += value
    
    calculation_steps = [f"{' + '.join(letter_values)} = {total}"]
    
    # Reducir a un solo dígito
    final_number = reduce_to_single_digit(total, keep_master_numbers=True)
    
    if final_number != total:
        digits_str = ' + '.join(str(total))
        calculation_steps.append(f"{digits_str} = {final_number}")
    
    return {
        'expression_number': final_number,
        'calculation_breakdown': ' → '.join(calculation_steps),
        'description': get_expression_number_description(final_number)
    }


def get_expression_number_description(number: int) -> str:
    """
    Obtiene descripción del número de expresión.
    
    Args:
        number: Número de expresión (1-9, 11, 22, 33)
        
    Returns:
        Descripción breve
    """
    descriptions = {
        1: "Talento para el liderazgo e innovación",
        2: "Don para la diplomacia y colaboración",
        3: "Habilidad natural para la comunicación y creatividad",
        4: "Capacidad para construir estructuras sólidas",
        5: "Versatilidad y adaptabilidad extraordinarias",
        6: "Talento para el cuidado y servicio a otros",
        7: "Don para el análisis y la sabiduría espiritual",
        8: "Habilidad para manifestar abundancia material",
        9: "Capacidad de servicio humanitario universal",
        11: "Intuición elevada y capacidad de inspirar",
        22: "Habilidad para manifestar grandes visiones",
        33: "Don supremo de sanación y enseñanza"
    }
    return descriptions.get(number, "Número desconocido")


def calculate_soul_urge(full_name: str) -> Dict[str, Union[int, str]]:
    """
    Calcula el Número del Deseo del Alma basado en las vocales del nombre.
    
    Este número revela los deseos internos y motivaciones del alma.
    
    Args:
        full_name: Nombre completo
        
    Returns:
        Dict con número, cálculo y descripción
    """
    pythagorean_table = {
        'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3,
        'Á': 1, 'É': 5, 'Í': 9, 'Ó': 6, 'Ú': 3
    }
    
    clean_name = full_name.upper()
    vowels = [c for c in clean_name if c in pythagorean_table]
    
    if not vowels:
        raise ValueError("El nombre debe contener al menos una vocal")
    
    vowel_values = [f"{v}={pythagorean_table[v]}" for v in vowels]
    total = sum(pythagorean_table[v] for v in vowels)
    
    calculation_steps = [f"{' + '.join(vowel_values)} = {total}"]
    
    final_number = reduce_to_single_digit(total, keep_master_numbers=True)
    
    if final_number != total:
        calculation_steps.append(f"{' + '.join(str(total))} = {final_number}")
    
    return {
        'soul_urge_number': final_number,
        'calculation_breakdown': ' → '.join(calculation_steps),
        'description': f"Deseo del alma número {final_number}"
    }


# Función de conveniencia para obtener perfil numerológico completo
def get_complete_numerology_profile(birth_date: Union[str, datetime], full_name: str) -> Dict:
    """
    Obtiene un perfil numerológico completo.
    
    Args:
        birth_date: Fecha de nacimiento
        full_name: Nombre completo
        
    Returns:
        Dict con todos los números numerológicos principales
    """
    return {
        'life_path': calculate_life_path(birth_date),
        'expression': calculate_expression_number(full_name),
        'soul_urge': calculate_soul_urge(full_name)
    }


if __name__ == "__main__":
    # Ejemplo de uso
    print("=== Motor Numerológico Numbrica ===\n")
    
    # Ejemplo 1: Camino de Vida
    print("Ejemplo: Fecha de nacimiento 15/05/1990")
    life_path = calculate_life_path('1990-05-15')
    print(f"Número del Camino de Vida: {life_path['life_path_number']}")
    print(f"Cálculo: {life_path['calculation_breakdown']}")
    print(f"Descripción: {life_path['description']}\n")
    
    # Ejemplo 2: Número de Expresión
    print("Ejemplo: Nombre 'María García'")
    expression = calculate_expression_number('María García')
    print(f"Número de Expresión: {expression['expression_number']}")
    print(f"Cálculo: {expression['calculation_breakdown']}")
    print(f"Descripción: {expression['description']}\n")
    
    # Ejemplo 3: Perfil completo
    print("Ejemplo: Perfil completo")
    profile = get_complete_numerology_profile('1990-05-15', 'María García')
    print(f"Perfil Numerológico Completo:")
    print(f"- Camino de Vida: {profile['life_path']['life_path_number']}")
    print(f"- Expresión: {profile['expression']['expression_number']}")
    print(f"- Deseo del Alma: {profile['soul_urge']['soul_urge_number']}")
