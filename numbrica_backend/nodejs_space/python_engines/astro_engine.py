"""
Motor Astrológico - Numbrica
Sistema de cálculo astrológico usando Swiss Ephemeris (pyswisseph)

Este motor implementa cálculos astrológicos fundamentales para la plataforma Numbrica,
incluyendo cartas natales, posiciones planetarias y aspectos.
"""

import swisseph as swe
from datetime import datetime, time
from typing import Dict, List, Tuple, Union, Optional
import math


# Configurar ruta de datos efemerides (opcional)
# swe.set_ephe_path('/path/to/ephemeris/data')

# Constantes zodiacales
ZODIAC_SIGNS = [
    "Aries", "Tauro", "Géminis", "Cáncer", 
    "Leo", "Virgo", "Libra", "Escorpio",
    "Sagitario", "Capricornio", "Acuario", "Piscis"
]

# Planetas a calcular (códigos Swiss Ephemeris)
PLANETS = {
    'Sol': swe.SUN,
    'Luna': swe.MOON,
    'Mercurio': swe.MERCURY,
    'Venus': swe.VENUS,
    'Marte': swe.MARS,
    'Júpiter': swe.JUPITER,
    'Saturno': swe.SATURN,
    'Urano': swe.URANUS,
    'Neptuno': swe.NEPTUNE,
    'Plutón': swe.PLUTO
}

# Aspectos y sus ángulos (orbe = tolerancia)
ASPECTS = {
    'Conjunción': {'angle': 0, 'orb': 8},
    'Sextil': {'angle': 60, 'orb': 6},
    'Cuadratura': {'angle': 90, 'orb': 8},
    'Trígono': {'angle': 120, 'orb': 8},
    'Oposición': {'angle': 180, 'orb': 8}
}


def datetime_to_julian(dt: datetime) -> float:
    """
    Convierte datetime a número juliano (formato requerido por Swiss Ephemeris).
    
    Args:
        dt: Objeto datetime
        
    Returns:
        Número juliano
    """
    year = dt.year
    month = dt.month
    day = dt.day
    hour = dt.hour + dt.minute / 60.0 + dt.second / 3600.0
    
    return swe.julday(year, month, day, hour)


def degrees_to_zodiac(degrees: float) -> Dict[str, Union[str, float, int]]:
    """
    Convierte grados eclípticos (0-360) a signo zodiacal y grados dentro del signo.
    
    Args:
        degrees: Grados eclípticos (0-360)
        
    Returns:
        Dict con:
            - 'sign': Nombre del signo zodiacal
            - 'sign_index': Índice del signo (0-11)
            - 'degrees_in_sign': Grados dentro del signo (0-30)
            - 'formatted': Formato legible (ej: "15°30' Tauro")
    """
    # Normalizar a 0-360
    degrees = degrees % 360
    
    # Cada signo ocupa 30 grados
    sign_index = int(degrees / 30)
    degrees_in_sign = degrees % 30
    
    # Convertir grados decimales a grados y minutos
    deg_whole = int(degrees_in_sign)
    minutes = int((degrees_in_sign - deg_whole) * 60)
    
    return {
        'sign': ZODIAC_SIGNS[sign_index],
        'sign_index': sign_index,
        'degrees_in_sign': degrees_in_sign,
        'formatted': f"{deg_whole}°{minutes:02d}' {ZODIAC_SIGNS[sign_index]}",
        'ecliptic_degrees': degrees
    }


def calculate_planet_position(planet_code: int, julian_day: float) -> Dict:
    """
    Calcula la posición de un planeta para una fecha juliana dada.
    
    Args:
        planet_code: Código del planeta en Swiss Ephemeris
        julian_day: Fecha en formato juliano
        
    Returns:
        Dict con posición del planeta y datos zodiacales
    """
    # Calcular posición (retorna: longitud, latitud, distancia, velocidad long, velocidad lat, velocidad dist)
    result, ret_flag = swe.calc_ut(julian_day, planet_code)
    
    longitude = result[0]  # Longitud eclíptica en grados
    latitude = result[1]   # Latitud eclíptica
    distance = result[2]   # Distancia desde la Tierra
    speed = result[3]      # Velocidad en longitud
    
    # Convertir a signo zodiacal
    zodiac_info = degrees_to_zodiac(longitude)
    
    # Determinar si está retrógrado (velocidad negativa)
    is_retrograde = speed < 0
    
    return {
        'longitude': longitude,
        'latitude': latitude,
        'distance': distance,
        'speed': speed,
        'is_retrograde': is_retrograde,
        'zodiac': zodiac_info
    }


def calculate_ascendant(julian_day: float, latitude: float, longitude: float) -> Dict:
    """
    Calcula el Ascendente (punto del horizonte este en el momento del nacimiento).
    
    Args:
        julian_day: Fecha en formato juliano
        latitude: Latitud geográfica (positiva norte, negativa sur)
        longitude: Longitud geográfica (positiva este, negativa oeste)
        
    Returns:
        Dict con información del Ascendente
    """
    # Calcular casas (sistema Placidus por defecto)
    # houses_cusps contiene las cúspides de las 12 casas
    # ascmc contiene: Ascendente, MC, ARMC, Vertex, Equatorial Ascendant, etc.
    houses_cusps, ascmc = swe.houses(julian_day, latitude, longitude, b'P')
    
    ascendant_degrees = ascmc[0]  # Ascendente
    mc_degrees = ascmc[1]         # Medio Cielo (MC)
    
    return {
        'ascendant': degrees_to_zodiac(ascendant_degrees),
        'midheaven': degrees_to_zodiac(mc_degrees),
        'houses': [degrees_to_zodiac(cusp) for cusp in houses_cusps]
    }


def calculate_aspect(planet1_long: float, planet2_long: float) -> Optional[Dict]:
    """
    Determina si existe un aspecto entre dos planetas.
    
    Args:
        planet1_long: Longitud eclíptica del planeta 1
        planet2_long: Longitud eclíptica del planeta 2
        
    Returns:
        Dict con información del aspecto si existe, None si no hay aspecto
    """
    # Calcular diferencia angular
    diff = abs(planet1_long - planet2_long)
    
    # Normalizar a 0-180 (aspectos son simétricos)
    if diff > 180:
        diff = 360 - diff
    
    # Verificar cada tipo de aspecto
    for aspect_name, aspect_info in ASPECTS.items():
        angle = aspect_info['angle']
        orb = aspect_info['orb']
        
        # Verificar si la diferencia está dentro del orbe
        if abs(diff - angle) <= orb:
            exactness = abs(diff - angle)  # Qué tan exacto es el aspecto
            return {
                'aspect': aspect_name,
                'angle': angle,
                'actual_angle': diff,
                'orb': exactness,
                'applying': True  # Simplificado, se podría calcular con velocidades
            }
    
    return None


def calculate_all_aspects(planet_positions: Dict[str, Dict]) -> List[Dict]:
    """
    Calcula todos los aspectos entre planetas.
    
    Args:
        planet_positions: Dict con posiciones de todos los planetas
        
    Returns:
        Lista de aspectos encontrados
    """
    aspects = []
    planet_names = list(planet_positions.keys())
    
    # Comparar cada par de planetas
    for i, planet1 in enumerate(planet_names):
        for planet2 in planet_names[i+1:]:
            long1 = planet_positions[planet1]['longitude']
            long2 = planet_positions[planet2]['longitude']
            
            aspect = calculate_aspect(long1, long2)
            if aspect:
                aspect['planet1'] = planet1
                aspect['planet2'] = planet2
                aspects.append(aspect)
    
    return aspects


def calculate_natal_chart(
    birth_date: Union[str, datetime, Dict],
    birth_time: Optional[Union[str, time]] = None,
    latitude: float = 0.0,
    longitude: float = 0.0,
    location_name: str = "Desconocido"
) -> Dict:
    """
    Calcula la carta natal completa.
    
    Args:
        birth_date: Fecha de nacimiento
            - String: 'YYYY-MM-DD'
            - datetime object
            - Dict: {'year': int, 'month': int, 'day': int}
        birth_time: Hora de nacimiento (opcional, default: mediodía)
            - String: 'HH:MM' o 'HH:MM:SS'
            - time object
            - None: usa 12:00 PM
        latitude: Latitud del lugar de nacimiento
        longitude: Longitud del lugar de nacimiento
        location_name: Nombre del lugar
        
    Returns:
        Dict con carta natal completa:
            - 'birth_info': Información del nacimiento
            - 'sun_sign': Signo solar
            - 'moon_sign': Signo lunar
            - 'ascendant': Ascendente
            - 'planets': Posiciones de todos los planetas
            - 'aspects': Aspectos entre planetas
            - 'houses': Casas astrológicas
    
    Ejemplo:
        >>> calculate_natal_chart('1990-05-15', '14:30', 40.4168, -3.7038, 'Madrid')
    """
    # Procesar fecha de nacimiento
    if isinstance(birth_date, str):
        dt_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
    elif isinstance(birth_date, datetime):
        dt_date = birth_date.date()
    elif isinstance(birth_date, dict):
        dt_date = datetime(birth_date['year'], birth_date['month'], birth_date['day']).date()
    else:
        raise TypeError("birth_date debe ser str, datetime o dict")
    
    # Procesar hora de nacimiento
    if birth_time is None:
        dt_time = time(12, 0, 0)  # Mediodía por defecto
        time_unknown = True
    elif isinstance(birth_time, str):
        parts = birth_time.split(':')
        if len(parts) == 2:
            dt_time = time(int(parts[0]), int(parts[1]), 0)
        elif len(parts) == 3:
            dt_time = time(int(parts[0]), int(parts[1]), int(parts[2]))
        else:
            raise ValueError("Formato de hora inválido. Use 'HH:MM' o 'HH:MM:SS'")
        time_unknown = False
    elif isinstance(birth_time, time):
        dt_time = birth_time
        time_unknown = False
    else:
        raise TypeError("birth_time debe ser str, time object o None")
    
    # Combinar fecha y hora
    birth_datetime = datetime.combine(dt_date, dt_time)
    julian_day = datetime_to_julian(birth_datetime)
    
    # Calcular posiciones planetarias
    planet_positions = {}
    for planet_name, planet_code in PLANETS.items():
        planet_positions[planet_name] = calculate_planet_position(planet_code, julian_day)
    
    # Calcular Ascendente y casas
    ascendant_data = calculate_ascendant(julian_day, latitude, longitude)
    
    # Calcular aspectos
    aspects = calculate_all_aspects(planet_positions)
    
    # Construir resultado
    result = {
        'birth_info': {
            'date': birth_datetime.strftime('%Y-%m-%d'),
            'time': birth_datetime.strftime('%H:%M:%S'),
            'time_unknown': time_unknown,
            'location': location_name,
            'latitude': latitude,
            'longitude': longitude,
            'julian_day': julian_day
        },
        'sun_sign': {
            'sign': planet_positions['Sol']['zodiac']['sign'],
            'position': planet_positions['Sol']['zodiac']['formatted'],
            'description': get_sun_sign_description(planet_positions['Sol']['zodiac']['sign'])
        },
        'moon_sign': {
            'sign': planet_positions['Luna']['zodiac']['sign'],
            'position': planet_positions['Luna']['zodiac']['formatted'],
            'description': "La Luna representa tus emociones y necesidades internas"
        },
        'ascendant': {
            'sign': ascendant_data['ascendant']['sign'],
            'position': ascendant_data['ascendant']['formatted'],
            'description': "Tu Ascendente representa cómo te presentas al mundo"
        },
        'midheaven': {
            'sign': ascendant_data['midheaven']['sign'],
            'position': ascendant_data['midheaven']['formatted'],
            'description': "El Medio Cielo representa tu vocación y propósito público"
        },
        'planets': {
            name: {
                'position': data['zodiac']['formatted'],
                'sign': data['zodiac']['sign'],
                'degrees': data['zodiac']['degrees_in_sign'],
                'is_retrograde': data['is_retrograde']
            }
            for name, data in planet_positions.items()
        },
        'aspects': [
            {
                'description': f"{asp['planet1']} {asp['aspect']} {asp['planet2']}",
                'planet1': asp['planet1'],
                'planet2': asp['planet2'],
                'aspect': asp['aspect'],
                'orb': round(asp['orb'], 2),
                'interpretation': get_aspect_interpretation(
                    asp['planet1'], asp['planet2'], asp['aspect']
                )
            }
            for asp in aspects
        ],
        'houses': [
            {
                'house_number': i + 1,
                'cusp_sign': house['sign'],
                'cusp_position': house['formatted']
            }
            for i, house in enumerate(ascendant_data['houses'])
        ]
    }
    
    return result


def get_sun_sign_description(sign: str) -> str:
    """
    Obtiene una descripción breve del signo solar.
    
    Args:
        sign: Nombre del signo zodiacal
        
    Returns:
        Descripción del signo
    """
    descriptions = {
        'Aries': 'El pionero valiente y líder natural',
        'Tauro': 'El constructor paciente y sensual',
        'Géminis': 'El comunicador versátil e intelectual',
        'Cáncer': 'El cuidador emocional y protector',
        'Leo': 'El creativo carismático y generoso',
        'Virgo': 'El analista meticuloso y servicial',
        'Libra': 'El diplomático equilibrado y armonioso',
        'Escorpio': 'El transformador intenso y profundo',
        'Sagitario': 'El filósofo aventurero y optimista',
        'Capricornio': 'El estratega ambicioso y disciplinado',
        'Acuario': 'El visionario humanitario e innovador',
        'Piscis': 'El místico compasivo e intuitivo'
    }
    return descriptions.get(sign, 'Signo solar')


def get_aspect_interpretation(planet1: str, planet2: str, aspect: str) -> str:
    """
    Genera una interpretación básica de un aspecto.
    
    Args:
        planet1: Primer planeta
        planet2: Segundo planeta
        aspect: Tipo de aspecto
        
    Returns:
        Interpretación del aspecto
    """
    aspect_nature = {
        'Conjunción': 'unifica las energías',
        'Sextil': 'crea oportunidades entre',
        'Cuadratura': 'genera tensión dinámica entre',
        'Trígono': 'fluye armoniosamente entre',
        'Oposición': 'polariza las energías'
    }
    
    nature = aspect_nature.get(aspect, 'conecta')
    return f"Este aspecto {nature} {planet1} y {planet2}"


# Función auxiliar para obtener carta simplificada
def get_simple_chart(birth_date: str, birth_time: Optional[str] = None) -> Dict:
    """
    Obtiene una carta natal simplificada sin requerir coordenadas.
    Usa coordenadas 0,0 como placeholder.
    
    Args:
        birth_date: Fecha de nacimiento 'YYYY-MM-DD'
        birth_time: Hora opcional 'HH:MM'
        
    Returns:
        Carta natal simplificada
    """
    return calculate_natal_chart(birth_date, birth_time, 0.0, 0.0, "Ubicación genérica")


if __name__ == "__main__":
    # Ejemplo de uso
    print("=== Motor Astrológico Numbrica ===\n")
    
    # Ejemplo 1: Carta natal completa con coordenadas de Madrid
    print("Ejemplo: Carta natal para 15 Mayo 1990, 14:30, Madrid")
    chart = calculate_natal_chart(
        birth_date='1990-05-15',
        birth_time='14:30',
        latitude=40.4168,
        longitude=-3.7038,
        location_name='Madrid, España'
    )
    
    print(f"\n📅 Fecha de nacimiento: {chart['birth_info']['date']} {chart['birth_info']['time']}")
    print(f"📍 Lugar: {chart['birth_info']['location']}")
    print(f"\n☀️ Signo Solar: {chart['sun_sign']['sign']} - {chart['sun_sign']['position']}")
    print(f"   {chart['sun_sign']['description']}")
    print(f"\n🌙 Signo Lunar: {chart['moon_sign']['sign']} - {chart['moon_sign']['position']}")
    print(f"\n⬆️ Ascendente: {chart['ascendant']['sign']} - {chart['ascendant']['position']}")
    
    print(f"\n🪐 Posiciones Planetarias:")
    for planet, data in chart['planets'].items():
        retro = " ℞" if data['is_retrograde'] else ""
        print(f"   {planet}: {data['position']}{retro}")
    
    print(f"\n✨ Aspectos Principales ({len(chart['aspects'])} encontrados):")
    for aspect in chart['aspects'][:5]:  # Mostrar solo los primeros 5
        print(f"   • {aspect['description']} (orbe: {aspect['orb']}°)")
    
    print("\n" + "="*50)
    
    # Ejemplo 2: Carta simple sin hora
    print("\nEjemplo: Carta simple sin hora exacta")
    simple = get_simple_chart('1990-05-15')
    print(f"Signo Solar: {simple['sun_sign']['sign']}")
    print(f"Signo Lunar: {simple['moon_sign']['sign']}")
    print("(Ascendente no es preciso sin hora y ubicación exactas)")
