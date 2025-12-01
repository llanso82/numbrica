"""
Tests Unitarios para los Motores de Numbrica
Valida funcionalidad de motores numerológicos y astrológicos
"""

import pytest
from datetime import datetime, time
import numerology_engine as ne
import astro_engine as ae


# ============================================================================
# TESTS MOTOR NUMEROLÓGICO
# ============================================================================

class TestNumerologyEngine:
    """Tests para el motor numerológico"""
    
    def test_reduce_to_single_digit(self):
        """Test reducción de números a un solo dígito"""
        # Número simple
        assert ne.reduce_to_single_digit(25) == 7  # 2 + 5 = 7
        
        # Número que requiere múltiples reducciones
        assert ne.reduce_to_single_digit(99) == 9  # 9 + 9 = 18, 1 + 8 = 9
        
        # Número maestro 11
        assert ne.reduce_to_single_digit(11, keep_master_numbers=True) == 11
        
        # Número maestro 22
        assert ne.reduce_to_single_digit(22, keep_master_numbers=True) == 22
        
        # Número maestro 33
        assert ne.reduce_to_single_digit(33, keep_master_numbers=True) == 33
        
        # Forzar reducción de número maestro
        assert ne.reduce_to_single_digit(11, keep_master_numbers=False) == 2
    
    def test_calculate_life_path_known_dates(self):
        """Test cálculo de camino de vida con fechas conocidas"""
        
        # Test 1: 15/05/1990 = 15 + 5 + 1990 = 2010 → 3
        result = ne.calculate_life_path('1990-05-15')
        assert result['life_path_number'] == 3
        assert 'calculation_breakdown' in result
        assert 'description' in result
        
        # Test 2: 01/01/2000 = 1 + 1 + 2000 = 2002 → 4
        result = ne.calculate_life_path('2000-01-01')
        assert result['life_path_number'] == 4
        
        # Test 3: Fecha con número maestro - 29/11/1975
        # 29 + 11 + 1975 = 2015 → 8
        result = ne.calculate_life_path('1975-11-29')
        assert result['life_path_number'] == 8
    
    def test_calculate_life_path_different_formats(self):
        """Test diferentes formatos de entrada de fecha"""
        
        # Formato string YYYY-MM-DD
        result1 = ne.calculate_life_path('1990-05-15')
        
        # Formato datetime
        result2 = ne.calculate_life_path(datetime(1990, 5, 15))
        
        # Formato dict
        result3 = ne.calculate_life_path({'year': 1990, 'month': 5, 'day': 15})
        
        # Todos deben dar el mismo resultado
        assert result1['life_path_number'] == result2['life_path_number']
        assert result2['life_path_number'] == result3['life_path_number']
        assert result1['life_path_number'] == 3
    
    def test_calculate_expression_number(self):
        """Test cálculo del número de expresión"""
        
        # Test con nombre simple
        result = ne.calculate_expression_number('MARIA')
        assert 'expression_number' in result
        assert 1 <= result['expression_number'] <= 33
        
        # Test con nombre completo
        result = ne.calculate_expression_number('Juan Pérez García')
        assert 'calculation_breakdown' in result
        assert 'description' in result
    
    def test_calculate_soul_urge(self):
        """Test cálculo del deseo del alma"""
        
        result = ne.calculate_soul_urge('María García')
        assert 'soul_urge_number' in result
        assert 1 <= result['soul_urge_number'] <= 33
        assert 'calculation_breakdown' in result
    
    def test_complete_numerology_profile(self):
        """Test perfil numerológico completo"""
        
        profile = ne.get_complete_numerology_profile('1990-05-15', 'María García')
        
        # Verificar que contiene todas las secciones
        assert 'life_path' in profile
        assert 'expression' in profile
        assert 'soul_urge' in profile
        
        # Verificar que cada sección tiene sus datos
        assert 'life_path_number' in profile['life_path']
        assert 'expression_number' in profile['expression']
        assert 'soul_urge_number' in profile['soul_urge']
    
    def test_invalid_inputs(self):
        """Test manejo de entradas inválidas"""
        
        # Fecha inválida
        with pytest.raises(ValueError):
            ne.calculate_life_path('invalid-date')
        
        # Nombre vacío
        with pytest.raises(ValueError):
            ne.calculate_expression_number('')


# ============================================================================
# TESTS MOTOR ASTROLÓGICO
# ============================================================================

class TestAstroEngine:
    """Tests para el motor astrológico"""
    
    def test_degrees_to_zodiac(self):
        """Test conversión de grados a signos zodiacales"""
        
        # 0° = Aries 0°
        result = ae.degrees_to_zodiac(0)
        assert result['sign'] == 'Aries'
        assert result['sign_index'] == 0
        
        # 30° = Tauro 0°
        result = ae.degrees_to_zodiac(30)
        assert result['sign'] == 'Tauro'
        assert result['sign_index'] == 1
        
        # 45° = Tauro 15°
        result = ae.degrees_to_zodiac(45)
        assert result['sign'] == 'Tauro'
        assert 14 <= result['degrees_in_sign'] <= 16
        
        # 180° = Libra 0°
        result = ae.degrees_to_zodiac(180)
        assert result['sign'] == 'Libra'
        
        # 359° = Piscis 29°
        result = ae.degrees_to_zodiac(359)
        assert result['sign'] == 'Piscis'
        assert result['degrees_in_sign'] > 28
    
    def test_datetime_to_julian(self):
        """Test conversión de datetime a juliano"""
        
        # Fecha conocida: 1 enero 2000, mediodía = JD 2451545.0
        dt = datetime(2000, 1, 1, 12, 0, 0)
        jd = ae.datetime_to_julian(dt)
        
        # Verificar que está cerca del valor conocido (pequeñas diferencias por zona horaria)
        assert 2451544 < jd < 2451546
    
    def test_calculate_natal_chart_basic(self):
        """Test cálculo básico de carta natal"""
        
        # Carta natal para una fecha conocida
        chart = ae.calculate_natal_chart(
            birth_date='1990-05-15',
            birth_time='14:30',
            latitude=40.4168,  # Madrid
            longitude=-3.7038,
            location_name='Madrid'
        )
        
        # Verificar estructura básica
        assert 'birth_info' in chart
        assert 'sun_sign' in chart
        assert 'moon_sign' in chart
        assert 'ascendant' in chart
        assert 'planets' in chart
        assert 'aspects' in chart
        assert 'houses' in chart
        
        # Verificar signo solar (Sol en Tauro el 15 de mayo)
        assert chart['sun_sign']['sign'] == 'Tauro'
        
        # Verificar que hay 10 planetas
        assert len(chart['planets']) == 10
        
        # Verificar que hay 12 casas
        assert len(chart['houses']) == 12
    
    def test_calculate_natal_chart_without_time(self):
        """Test carta natal sin hora de nacimiento"""
        
        chart = ae.calculate_natal_chart(
            birth_date='1990-05-15',
            birth_time=None,  # Sin hora
            latitude=0.0,
            longitude=0.0
        )
        
        # Debe usar mediodía por defecto
        assert chart['birth_info']['time'] == '12:00:00'
        assert chart['birth_info']['time_unknown'] == True
        
        # Aún debe calcular signo solar correctamente
        assert chart['sun_sign']['sign'] == 'Tauro'
    
    def test_sun_sign_for_all_months(self):
        """Test que el signo solar cambia correctamente a lo largo del año"""
        
        # Mapeo aproximado de fechas a signos (usando fechas típicas de cada signo)
        expected_signs = [
            ('2000-01-15', 'Capricornio'),
            ('2000-02-15', 'Acuario'),
            ('2000-03-15', 'Piscis'),
            ('2000-04-15', 'Aries'),
            ('2000-05-15', 'Tauro'),
            ('2000-06-15', 'Géminis'),
            ('2000-07-15', 'Cáncer'),
            ('2000-08-15', 'Leo'),
            ('2000-09-15', 'Virgo'),
            ('2000-10-15', 'Libra'),
            ('2000-11-15', 'Escorpio'),
            ('2000-12-15', 'Sagitario')
        ]
        
        for date_str, expected_sign in expected_signs:
            chart = ae.get_simple_chart(date_str)
            assert chart['sun_sign']['sign'] == expected_sign, \
                f"Fecha {date_str} debería ser {expected_sign}, pero fue {chart['sun_sign']['sign']}"
    
    def test_calculate_aspects(self):
        """Test cálculo de aspectos planetarios"""
        
        # Conjunción: 0° de diferencia
        aspect = ae.calculate_aspect(0, 5)  # 5° de diferencia
        assert aspect is not None
        assert aspect['aspect'] == 'Conjunción'
        
        # Oposición: 180° de diferencia
        aspect = ae.calculate_aspect(0, 180)
        assert aspect is not None
        assert aspect['aspect'] == 'Oposición'
        
        # Trígono: 120° de diferencia
        aspect = ae.calculate_aspect(0, 120)
        assert aspect is not None
        assert aspect['aspect'] == 'Trígono'
        
        # Sin aspecto (30° no es un aspecto mayor)
        aspect = ae.calculate_aspect(0, 30)
        assert aspect is None
    
    def test_planet_positions_retrograde(self):
        """Test detección de planetas retrógrados"""
        
        # Calcular carta para una fecha donde Mercurio suele estar retrógrado
        # (esto puede variar, es solo una prueba de funcionalidad)
        chart = ae.calculate_natal_chart('2024-04-01', '12:00', 0, 0)
        
        # Verificar que la información de retrógrado está presente
        for planet, data in chart['planets'].items():
            assert 'is_retrograde' in data
            assert isinstance(data['is_retrograde'], bool)
    
    def test_get_simple_chart(self):
        """Test función simplificada de carta natal"""
        
        chart = ae.get_simple_chart('1990-05-15')
        
        # Debe contener información básica
        assert 'sun_sign' in chart
        assert 'moon_sign' in chart
        assert chart['sun_sign']['sign'] == 'Tauro'
    
    def test_different_date_formats(self):
        """Test diferentes formatos de fecha"""
        
        # String
        chart1 = ae.calculate_natal_chart('1990-05-15', '14:30', 0, 0)
        
        # Datetime
        chart2 = ae.calculate_natal_chart(datetime(1990, 5, 15), time(14, 30), 0, 0)
        
        # Dict
        chart3 = ae.calculate_natal_chart(
            {'year': 1990, 'month': 5, 'day': 15},
            '14:30',
            0, 0
        )
        
        # Todos deben dar el mismo signo solar
        assert chart1['sun_sign']['sign'] == chart2['sun_sign']['sign']
        assert chart2['sun_sign']['sign'] == chart3['sun_sign']['sign']


# ============================================================================
# TESTS DE INTEGRACIÓN
# ============================================================================

class TestIntegration:
    """Tests de integración entre ambos motores"""
    
    def test_complete_profile(self):
        """Test creación de perfil completo: numerología + astrología"""
        
        # Datos de prueba
        birth_date = '1990-05-15'
        birth_time = '14:30'
        full_name = 'María García'
        
        # Obtener perfil numerológico
        numerology = ne.get_complete_numerology_profile(birth_date, full_name)
        
        # Obtener carta natal
        astrology = ae.calculate_natal_chart(birth_date, birth_time, 40.4168, -3.7038, 'Madrid')
        
        # Verificar que ambos perfiles se generaron correctamente
        assert numerology['life_path']['life_path_number'] == 3
        assert astrology['sun_sign']['sign'] == 'Tauro'
        
        # Crear perfil combinado
        complete_profile = {
            'personal_info': {
                'name': full_name,
                'birth_date': birth_date,
                'birth_time': birth_time
            },
            'numerology': numerology,
            'astrology': {
                'sun_sign': astrology['sun_sign'],
                'moon_sign': astrology['moon_sign'],
                'ascendant': astrology['ascendant']
            }
        }
        
        # Verificar estructura
        assert 'personal_info' in complete_profile
        assert 'numerology' in complete_profile
        assert 'astrology' in complete_profile


# ============================================================================
# EJECUTAR TESTS
# ============================================================================

if __name__ == "__main__":
    print("="*70)
    print("EJECUTANDO TESTS DE LOS MOTORES NUMBRICA")
    print("="*70)
    
    # Ejecutar con pytest
    pytest.main([__file__, '-v', '--tb=short'])
