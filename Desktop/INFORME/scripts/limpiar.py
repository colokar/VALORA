import pandas as pd
import os
import logging

# Configurar logging básico
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def limpiar_datos(ruta_excel):
    """
    Lee un archivo Excel, limpia los datos y retorna un DataFrame limpio.

    Args:
        ruta_excel (str): Ruta al archivo Excel.

    Returns:
        pd.DataFrame: DataFrame limpio.
    """
    try:
        logging.info(f"Leyendo archivo Excel desde: {ruta_excel}")
        df = pd.read_excel(ruta_excel)
        logging.info(f"Archivo leído exitosamente. Dimensiones: {df.shape}")

        # Limpiar datos: eliminar filas con NaN en columnas críticas (asumiendo 'nombre_region' es crítica)
        df = df.dropna(subset=['nombre_region'])
        logging.info("Eliminadas filas con NaN en 'nombre_region'")

        # Eliminar duplicados
        df = df.drop_duplicates()
        logging.info("Duplicados eliminados")

        # Formatear columnas si es necesario (ejemplo: convertir a string si hay números)
        if 'nombre_region' in df.columns:
            df['nombre_region'] = df['nombre_region'].astype(str).str.strip()

        logging.info(f"Datos limpiados. Dimensiones finales: {df.shape}")
        return df

    except FileNotFoundError:
        logging.error(f"Archivo no encontrado: {ruta_excel}")
        raise
    except Exception as e:
        logging.error(f"Error al limpiar datos: {str(e)}")
        raise