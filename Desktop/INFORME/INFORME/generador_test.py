import os
import glob
import pandas as pd
import json
from flask import Flask, jsonify, request
from datetime import datetime

# =========================================================
# CONFIGURACIÓN
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_DIR = os.path.join(BASE_DIR, "Excel")

app = Flask(__name__)

# =========================================================
# UTILIDADES DE LIMPIEZA
# =========================================================
def limpiar_texto(txt):
    if pd.isna(txt): return ""
    return str(txt).strip().upper()

def leer_archivo_robusto(ruta):
    """Lector universal para .xlsx, .csv y .xls (incluye falsos HTML)"""
    try:
        ext = os.path.splitext(ruta)[1].lower()
        if ext == ".csv":
            return pd.read_csv(ruta, sep=None, engine="python", encoding="utf-8")
        elif ext == ".xlsx":
            return pd.read_excel(ruta, engine="openpyxl")
        elif ext == ".xls":
            try:
                return pd.read_excel(ruta, engine="xlrd")
            except:
                # Caso: Reportes CNRT exportados como HTML con extensión .xls
                return pd.read_html(ruta)[0]
    except Exception as e:
        print(f"   ✗ Error en {os.path.basename(ruta)}: {e}")
        return None

# =========================================================
# LÓGICA DE NEGOCIO (ESTADÍSTICAS CNRT)
# =========================================================
def generar_resumen(desde=None, hasta=None):
    # 1. Carga masiva de archivos
    archivos = glob.glob(os.path.join(EXCEL_DIR, "*"))
    dataframes = [leer_archivo_robusto(f) for f in archivos if leer_archivo_robusto(f) is not None]
    
    if not dataframes:
        return {"error": "No se encontraron datos"}

    df = pd.concat(dataframes, ignore_index=True)

    # 2. Normalización de columnas (Nombres en Mayúsculas y sin espacios)
    df.columns = [limpiar_texto(c) for c in df.columns]

    # 3. Filtro de Fechas (Si existe columna de fecha)
    # Intentamos detectar columnas comunes de fecha en los reportes
    col_fecha = next((c for c in df.columns if "FECHA" in c or "DIA" in c), None)
    
    if col_fecha:
        df[col_fecha] = pd.to_datetime(df[col_fecha], errors='coerce')
        if desde:
            df = df[df[col_fecha] >= pd.to_datetime(desde)]
        if hasta:
            df = df[df[col_fecha] <= pd.to_datetime(hasta)]

    # 4. Preparación de métricas base
    # Definimos que un vehículo tiene ACTA si existe un valor en columnas típicas de infracción
    col_acta = next((c for c in df.columns if "ACTA" in c or "NRO_INF" in c), None)
    df["TIENE_ACTA"] = df[col_acta].notna().astype(int) if col_acta else 0
    
    # Retenciones (Columna RETIENE o similar)
    col_ret = next((c for c in df.columns if "RETIENE" in c or "RETENCION" in c), None)
    df["TIENE_RET"] = df[col_ret].apply(lambda x: 1 if str(x).strip().upper() in ["S", "SI", "1", "TRUE"] else 0) if col_ret else 0

    # 5. Agrupación por Región y Tipo (Cargas/Pasajeros)
    # Aseguramos que existan las columnas REGIONAL y TRANSPORTE
    if "REGIONAL" not in df.columns: df["REGIONAL"] = "SIN REGION"
    if "TRANSPORTE" not in df.columns: df["TRANSPORTE"] = "OTROS"
    
    # Limpiamos valores
    df["REGIONAL"] = df["REGIONAL"].apply(limpiar_texto)
    df["TRANSPORTE"] = df["TRANSPORTE"].apply(limpiar_texto)

    # Procesamiento por Regiones usando GroupBy (Alta Performance)
    stats_regiones = {}
    grupos = df.groupby(["REGIONAL", "TRANSPORTE"])

    resumen_grupos = grupos.agg(
        vc=('DOMINIO', 'count'),
        actas=('TIENE_ACTA', 'sum'),
        ret=('TIENE_RET', 'sum')
    ).reset_index()

    for reg in resumen_grupos["REGIONAL"].unique():
        df_reg = resumen_grupos[resumen_grupos["REGIONAL"] == reg]
        
        def get_data(tipo):
            row = df_reg[df_reg["TRANSPORTE"] == tipo]
            if row.empty: return {"vc": 0, "actas": 0, "ret": 0}
            return {
                "vc": int(row["vc"].iloc[0]),
                "actas": int(row["actas"].iloc[0]),
                "ret": int(row["ret"].iloc[0])
            }

        cargas = get_data("CA") # CA = Cargas
        pasajeros = get_data("PA") # PA = Pasajeros

        stats_regiones[reg] = {
            "cargas": cargas,
            "pasajeros": pasajeros,
            "total": {
                "vc": cargas["vc"] + pasajeros["vc"],
                "actas": cargas["actas"] + pasajeros["actas"],
                "ret": cargas["ret"] + pasajeros["ret"]
            }
        }

    # 6. Metadata Global
    metadata = {
        "total_registros": int(len(df)),
        "total_actas": int(df["TIENE_ACTA"].sum()),
        "total_retenciones": int(df["TIENE_RET"].sum()),
        "total_cargas": int(len(df[df["TRANSPORTE"] == "CA"])),
        "total_pasajeros": int(len(df[df["TRANSPORTE"] == "PA"])),
        "ultima_actualizacion": datetime.now().strftime("%d/%m/%Y %H:%M")
    }

    return {
        "metadata": metadata,
        "regiones": stats_regiones
    }

# =========================================================
# ENDPOINT FLASK
# =========================================================
@app.route("/resumen")
def resumen():
    desde = request.args.get("desde") # Formato YYYY-MM-DD
    hasta = request.args.get("hasta") # Formato YYYY-MM-DD
    
    try:
        data = generar_resumen(desde, hasta)
        return jsonify(data)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    # Asegurar que la carpeta Excel existe
    if not os.path.exists(EXCEL_DIR):
        os.makedirs(EXCEL_DIR)
        
    print(f"🚀 Dashboard Backend Operativo")
    print(f"📍 URL: http://127.0.0.1:5000/resumen")
    app.run(debug=True, port=5000)