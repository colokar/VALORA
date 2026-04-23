from jinja2 import Environment, FileSystemLoader
import os
import logging

# Configurar logging básico
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def render_html(contexto, template_path):
    """
    Renderiza un template HTML usando Jinja2 con el contexto proporcionado.

    Args:
        contexto (dict): Diccionario con los datos para el template.
        template_path (str): Ruta completa al archivo de template.

    Returns:
        str: HTML renderizado.
    """
    try:
        logging.info(f"Renderizando template desde: {template_path}")
        template_dir = os.path.dirname(template_path)
        template_name = os.path.basename(template_path)

        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template(template_name)

        html_renderizado = template.render(contexto)
        logging.info("Template renderizado exitosamente")
        return html_renderizado

    except Exception as e:
        logging.error(f"Error al renderizar HTML: {str(e)}")
        raise