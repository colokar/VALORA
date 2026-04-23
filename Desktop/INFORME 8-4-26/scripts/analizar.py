import pandas as pd
import logging

# Configurar logging básico
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def calcular_regiones(df):
    """
    Calcula métricas por región: agrupa por 'nombre_region', cuenta registros,
    ordena descendentemente y retorna lista de diccionarios.

    Args:
        df (pd.DataFrame): DataFrame limpio con columna 'nombre_region'.

    Returns:
        list: Lista de diccionarios con 'nombre_region' y 'cantidad'.
    """
    try:
        logging.info("Calculando métricas por región")
        if 'nombre_region' not in df.columns:
            raise ValueError("La columna 'nombre_region' no existe en el DataFrame")

        # Agrupar por 'nombre_region' y contar registros
        grouped = df.groupby('nombre_region').size().reset_index(name='cantidad')

        # Ordenar descendentemente por cantidad
        sorted_grouped = grouped.sort_values('cantidad', ascending=False)

        # Convertir a lista de diccionarios
        result = sorted_grouped.to_dict(orient='records')

        logging.info(f"Cálculo completado. Regiones procesadas: {len(result)}")
        return result

    except Exception as e:
        logging.error(f"Error al calcular regiones: {str(e)}")
        raise