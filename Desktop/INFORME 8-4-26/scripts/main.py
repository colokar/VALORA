import os
import sys
import logging

# Agregar el directorio scripts al path para importar módulos
sys.path.append(os.path.dirname(__file__))

from scripts import limpiar, analizar, render

# Configurar logging básico
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    """
    Orquesta el flujo completo: limpiar datos → analizar → renderizar → guardar.
    """
    try:
        # Definir rutas relativas al directorio raíz del proyecto
        base_dir = os.path.dirname(os.path.dirname(__file__))  # Asumiendo que main.py está en scripts/
        raw_data_path = os.path.join(base_dir, 'data', 'raw', 'datos.xlsx')  # Asumir nombre de archivo
        template_path = os.path.join(base_dir, 'templates', 'informe_template.html')
        output_path = os.path.join(base_dir, 'output', 'informe.html')

        logging.info("Iniciando flujo de generación de informe")

        # 1. Data Layer: Limpiar datos
        logging.info("Paso 1: Limpiando datos")
        df = limpiar.limpiar_datos(raw_data_path)

        # 2. Processing Layer: Calcular métricas
        logging.info("Paso 2: Calculando métricas por región")
        regiones = analizar.calcular_regiones(df)

        # 3. Presentation Layer: Renderizar HTML
        logging.info("Paso 3: Renderizando HTML")
        contexto = {'regiones': regiones}
        html_content = render.render_html(contexto, template_path)

        # 4. Guardar resultado
        logging.info(f"Paso 4: Guardando informe en {output_path}")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        logging.info("Flujo completado exitosamente")

    except Exception as e:
        logging.error(f"Error en el flujo principal: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()