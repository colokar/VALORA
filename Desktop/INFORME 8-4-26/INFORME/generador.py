# =========================================================
# IMPORTACIONES
# =========================================================

import pandas as pd
import json
import glob
import os
import re
import unicodedata

# =========================================================
# FUNCION: NORMALIZAR TEXTO
# Elimina tildes, convierte a minúsculas y limpia caracteres
# =========================================================

def normalizar(t):

    if not t:
        return ""

    t = str(t).lower()

    t = ''.join(
        c for c in unicodedata.normalize('NFD', t)
        if unicodedata.category(c) != 'Mn'
    )

    t = t.replace("ñ", "n")

    t = re.sub(r"[^a-z0-9+ ]", " ", t)

    t = re.sub(r"\s+", " ", t).strip()

    return t


# =========================================================
# FUNCION: CONVERTIR COORDENADAS DMS → DECIMAL
# Convierte coordenadas tipo:
# 34°12'45"S  → -34.2125
# =========================================================

def convertir_dms_a_decimal(coordenada):

    if not coordenada or pd.isna(coordenada):
        return None

    try:

        coord_str = str(coordenada).strip()

        patron = r"(\d+)[º°](\d+)['\'](\d+(?:\.\d+)?)[\"″]([NSEW])"

        match = re.search(patron, coord_str)

        if not match:
            return None

        grados = float(match.group(1))
        minutos = float(match.group(2))
        segundos = float(match.group(3))
        direccion = match.group(4).upper()

        decimal = grados + (minutos / 60) + (segundos / 3600)

        if direccion in ['S', 'W']:
            decimal = -decimal

        return round(decimal, 6)

    except:
        return None


# =========================================================
# FUNCION: DETECTAR INCIDENCIAS
# Busca alcoholemia positiva o sustancias
# =========================================================

def detectar_incidencia(fila):

    # ---- ALCOHOLEMIA ----

    for col in ["ALCOHOLEMIA CHOFER 1",
                "ALCOHOLEMIA CHOFER 2",
                "ALCOHOLEMIA CHOFER 3"]:

        if col not in fila:
            continue

        v = str(fila[col]).upper().strip()

        if v and any(x in v for x in ["POS", "POSITIVO", "+"]):

            try:
                val = float(v.replace(",", "."))

                if val > 0:
                    return "ALCOHOLEMIA", col

            except:
                return "ALCOHOLEMIA", col

    # ---- SUSTANCIAS ----

    for col in ["SUSTANCIAS CHOFER 1",
                "SUSTANCIAS CHOFER 2",
                "SUSTANCIAS CHOFER 3"]:

        if col not in fila:
            continue

        v = str(fila[col]).upper().strip()

        if v and any(x in v for x in ["POS", "POSITIVO", "+"]):
            return "SUSTANCIA", col

    # ---- BUSQUEDA EN OBSERVACIONES ----

    obs = str(fila.get("ACTA OBS", "")).upper()

    t = normalizar(obs)

    if any(x in t for x in [
        "sustancia positiva",
        "test droga positivo",
        "positivo sustancia"
    ]):
        return "SUSTANCIA", "ACTA OBS"

    if any(x in t for x in [
        "alcohol positivo",
        "alcoholimetro"
    ]):
        return "ALCOHOLEMIA", "ACTA OBS"

    return None, None

# =========================================================
# FILTRO ARTICULOS 108 / 110 SEGUN TRANSPORTE
# =========================================================

def elegir_articulo(transporte, items):

    t = str(transporte).lower()
    infr = str(items)

    tiene108 = "108" in infr
    tiene110 = "110" in infr

    if "carg" in t:
        if tiene108:
            return "108"
        if tiene110:
            return "110"

    if "pasaj" in t:
        if tiene110:
            return "110"
        if tiene108:
            return "108"

    if tiene108:
        return "108"

    if tiene110:
        return "110"

    return ""


# =========================================================
# BUSQUEDA AUTOMATICA DE ARCHIVOS EXCEL Carpeta /Excel
# =========================================================

carpeta_excels = os.path.join(os.path.dirname(__file__), "Excel")

archivos_excel = [
    f for f in glob.glob(os.path.join(carpeta_excels, "*.xls*"))
    if "~$" not in os.path.basename(f)
]


if not archivos_excel:

    print("✗ No se encontraron archivos Excel en /Excel")
    exit()

print("Archivos detectados:", len(archivos_excel))

for a in archivos_excel:
    print(" -", a)


# =========================================================
# PARÁMETROS DE FILTRADO (FECHAS)
# =========================================================

import sys
from datetime import datetime

fecha_desde = None
fecha_hasta = None

# Leer parámetros de línea de comando
if len(sys.argv) > 1:
    fecha_desde = sys.argv[1]
if len(sys.argv) > 2:
    fecha_hasta = sys.argv[2]

# =========================================================
# MODO DE PROCESAMIENTO DE DOMINIOS
# "A": 1 registro por fila (dominios en lista)
# "B": 1 registro por dominio (expansión)
# =========================================================

modo = "A"  # Cambiar a "B" para el modo expansión

print("=" * 60)
print("FILTRO DE FECHAS")
print("=" * 60)

if fecha_desde:
    print(f"Desde: {fecha_desde}")
if fecha_hasta:
    print(f"Hasta: {fecha_hasta}")

if not fecha_desde and not fecha_hasta:
    print("SIN FILTRO (se procesarán TODOS los datos)")

print(f"MODO DE PROCESAMIENTO: {modo}")
print("=" * 60 + "\n")

# =========================================================
# LECTURA DE ARCHIVOS EXCEL
# =========================================================

dfs = []

total_filas = 0

for archivo in archivos_excel:

    if "~$" in archivo:
        print("Ignorado:", archivo)
        continue

    try:

        print("\nLeyendo:", archivo)

        # =========================
        # DETECTAR TIPO DE EXCEL
        # =========================

        if archivo.lower().endswith(".xls"):
            df_temp = pd.read_excel(archivo, engine="xlrd")
        else:
            df_temp = pd.read_excel(
                archivo,
                engine="openpyxl",
                header=0,
            )

        df_temp = df_temp.loc[:, ~df_temp.columns.duplicated()]
        df_temp = df_temp.dropna(how="all")

        filas = df_temp.shape[0]

        print("Filas:", filas)

        total_filas += filas

        dfs.append(df_temp)

    except Exception as e:

        print("ERROR LEYENDO")
        print(archivo)
        print(e)
        print("-----------")

print("\nTOTAL ACUMULADO:", total_filas)

if not dfs:
    print("No se pudo leer")
    exit()

df = pd.concat(dfs, ignore_index=True)

print("TOTAL FINAL DF (SIN FILTRO):", df.shape[0])

# =========================================================
# NORMALIZACIÓN DE COLUMNAS CLAVE
# =========================================================

df["DOMINIO"] = df["DOMINIO"].fillna("").astype(str).str.strip().str.upper()
df["DOMINIO2"] = df["DOMINIO2"].fillna("").astype(str).str.strip().str.upper()
df["DOMINIO3"] = df["DOMINIO3"].fillna("").astype(str).str.strip().str.upper()
df["REGIONAL"] = df["REGIONAL"].fillna("").astype(str).str.strip().str.upper()
df["TRANSPORTE"] = df["TRANSPORTE"].fillna("").astype(str).str.strip().str.upper()
df["FECHA"] = df["FECHA"].fillna("").astype(str).str.strip()
df["HORA"] = df["HORA"].fillna("").astype(str).str.strip()
df["ACTA OBS"] = df["ACTA OBS"].fillna("").astype(str).str.strip()
df["RETIENE"] = df["RETIENE"].fillna("").astype(str).str.strip().str.upper()
df["ITEMS INFRACCION"] = df["ITEMS INFRACCION"].fillna("").astype(str).str.strip()

# Quitar tildes de REGIONAL
df["REGIONAL"] = df["REGIONAL"].apply(lambda x: ''.join(c for c in unicodedata.normalize('NFD', x) if unicodedata.category(c) != 'Mn'))

# =========================================================
# DEBUG ADICIONAL
# =========================================================

print("\n--- DEBUG DOMINIO ---")
print("Primeros 10 dominios:", df["DOMINIO"].head(10).tolist())
print(f"NaN en DOMINIO: {df['DOMINIO'].isna().sum()}")
print(f"Vacíos en DOMINIO: {(df['DOMINIO'] == '').sum()}")
print(f"'NAN' en DOMINIO: {(df['DOMINIO'] == 'NAN').sum()}")

print("\n--- DEBUG REGIONAL ---")
print("Regionales únicos:", df["REGIONAL"].unique()[:20])
print("Cuenta por regional:", df["REGIONAL"].value_counts().head(20).to_dict())

print("\n--- DEBUG TRANSPORTE ---")
print("Transporte únicos:", df["TRANSPORTE"].unique())
print("Cuenta por transporte:", df["TRANSPORTE"].value_counts().to_dict())

# =========================================================
# APLICAR FILTRO DE FECHAS (OPCIONAL)
# =========================================================

if fecha_desde or fecha_hasta:

    try:

        if fecha_desde:
            fecha_desde_dt = pd.to_datetime(fecha_desde, format="%Y-%m-%d")
        else:
            fecha_desde_dt = pd.to_datetime("1900-01-01")

        if fecha_hasta:
            fecha_hasta_dt = pd.to_datetime(fecha_hasta, format="%Y-%m-%d")
        else:
            fecha_hasta_dt = pd.to_datetime("2099-12-31")

        df["FECHA_TEMP"] = pd.to_datetime(df["FECHA"], format="%Y-%m-%d", errors="coerce")

        df_original_rows = df.shape[0]

        df = df[(df["FECHA_TEMP"] >= fecha_desde_dt) & (df["FECHA_TEMP"] <= fecha_hasta_dt)]

        df = df.drop("FECHA_TEMP", axis=1)

        print(f"Filtro de fechas aplicado: {df_original_rows} → {df.shape[0]} registros")

    except Exception as e:

        print(f"⚠ Error al aplicar filtro de fechas: {e}")

print(f"DF FINAL A PROCESAR: {df.shape[0]} filas\n")



# =========================================================
# NORMALIZACION DE COLUMNAS
# =========================================================

df.columns = df.columns.str.strip().str.upper()
df = df.loc[:, ~df.columns.duplicated()]

print("\nCOLUMNAS:")
for c in df.columns:
    print("-", c)

# =========================================================
# MAPA DE NORMALIZACIÓN DE REGIONES
# =========================================================

mapa_regiones = {
    "AMBA SUR": "AMBA",
    "AMBA NORTE": "AMBA",
    "COSTA ATLANTICA": "COSTA",
    "BUENOS AIRES": "BA",
    "CENTRO": "CEN",
    "CUYO": "CUY",
    "NEA": "NEA",
    "NOA": "NOA",
    "PATAGONIA": "PAT"
}

regiones_validas = ["AMBA", "COSTA", "BA", "CEN", "CUY", "NEA", "NOA", "PAT"]

# =========================================================
# PROCESAMIENTO DE REGISTROS
# =========================================================

registros = []
detalles_incidencias = []

total_cargas = 0
total_pasajeros = 0
total_retenciones = 0
total_dominios = 0

incidencias_alcoholemia = 0
incidencias_sustancias = 0

retenciones_alcoholemia = 0
retenciones_sustancias = 0

print("\n--- DEBUG TRANSPORTE ---")
print(df["TRANSPORTE"].value_counts(dropna=False).head(20))
print("------------------------\n")

for _, fila in df.iterrows():

    fecha = str(fila.get("FECHA", ""))[:10]
    hora = str(fila.get("HORA", ""))

    regional = str(fila.get("REGIONAL", "")).upper().strip()
    lugar = str(fila.get("LUGAR", "")).strip()

    # NORMALIZACIÓN DE REGIONAL
    regional = ''.join(c for c in unicodedata.normalize('NFD', regional) if unicodedata.category(c) != 'Mn')  # Remover tildes
    regional = mapa_regiones.get(regional, regional)
    # Nota: No se ignora aquí, se procesan todas las filas para generar registros

    acta = str(fila.get("ACTA OBS", "")).strip()
    retiene = str(fila.get("RETIENE", "")).upper().strip()
    items_infraccion = str(fila.get("ITEMS INFRACCION", "")).strip()

    latitud = convertir_dms_a_decimal(fila.get("LATITUD"))
    longitud = convertir_dms_a_decimal(fila.get("LONGITUD"))

    # NORMALIZACIÓN CLAVE
    transporte = str(fila.get("TRANSPORTE", "")).strip().upper()

    articulo_filtrado = elegir_articulo(transporte, items_infraccion)

    tipo_incidencia, fuente = detectar_incidencia(fila)

    # PROCESAMIENTO DE DOMINIOS: Mantener como lista, orden y posibles duplicados
    dominios_lista = [
        str(fila.get("DOMINIO", "")).strip().upper(),
        str(fila.get("DOMINIO2", "")).strip().upper(),
        str(fila.get("DOMINIO3", "")).strip().upper(),
    ]

    # Filtrar valores vacíos, NaN y strings "nan"
    dominios_validos = [
        d for d in dominios_lista
        if d and d not in ["", "NAN"]
    ]

    total_dominios += len(dominios_validos)

    es_retencion = retiene in ["SI", "SÍ"]

    # CONTADOR DE RETENCIONES (una vez por fila)
    if es_retencion:
        total_retenciones += 1

    # CONTADOR DE CARGAS Y PASAJEROS (depende del modo)
    if modo == "A":
        # Modo A: 1 por fila
        if transporte == "CA":
            total_cargas += 1
        elif transporte == "PA":
            total_pasajeros += 1
    elif modo == "B":
        # Modo B: por cantidad de dominios
        if transporte == "CA":
            total_cargas += len(dominios_validos)
        elif transporte == "PA":
            total_pasajeros += len(dominios_validos)

    # =========================
    # GENERACIÓN DE REGISTROS SEGÚN MODO
    # =========================

    if modo == "A":
        # Modo A: 1 registro por fila, dominios en lista
        registros.append({
            "fecha": fecha,
            "hora": hora,
            "regional": regional,
            "lugar": lugar,
            "dominios": dominios_validos,  # Lista de dominios
            "transporte": transporte,
            "items": items_infraccion,
            "articulo": articulo_filtrado,
            "retiene": retiene,
            "incidencia": tipo_incidencia,
            "lat": latitud,
            "lon": longitud
        })

        # INCIDENCIAS (una por fila en modo A)
        if tipo_incidencia:
            detalles_incidencias.append({
                "fecha": fecha,
                "regional": regional,
                "lugar": lugar,
                "dominios": dominios_validos,  # Lista de dominios
                "latitud": latitud,
                "longitud": longitud,
                "tipo": tipo_incidencia,
                "fuente": fuente,
                "acta_obs": acta,
                "retiene": es_retencion
            })

    elif modo == "B":
        # Modo B: 1 registro por dominio (como antes, pero sin set)
        for dominio in dominios_validos:
            registros.append({
                "fecha": fecha,
                "hora": hora,
                "regional": regional,
                "lugar": lugar,
                "dominio": dominio,  # Un dominio por registro
                "transporte": transporte,
                "items": items_infraccion,
                "articulo": articulo_filtrado,
                "retiene": retiene,
                "incidencia": tipo_incidencia,
                "lat": latitud,
                "lon": longitud
            })

            # INCIDENCIAS (una por dominio en modo B)
            if tipo_incidencia:
                detalles_incidencias.append({
                    "fecha": fecha,
                    "regional": regional,
                    "lugar": lugar,
                    "dominio": dominio,  # Un dominio por incidencia
                    "latitud": latitud,
                    "longitud": longitud,
                    "tipo": tipo_incidencia,
                    "fuente": fuente,
                    "acta_obs": acta,
                    "retiene": es_retencion
                })

    # CONTADORES DE INCIDENCIAS (fuera del loop de dominios, una vez por fila)
    if tipo_incidencia:
        if tipo_incidencia == "ALCOHOLEMIA":
            incidencias_alcoholemia += 1
            if es_retencion:
                retenciones_alcoholemia += 1
        elif tipo_incidencia == "SUSTANCIA":
            incidencias_sustancias += 1
            if es_retencion:
                retenciones_sustancias += 1


# =========================================================
# CALCULO DE MÉTRICAS POR REGIÓN
# =========================================================

from collections import defaultdict

regiones_detectadas = set()
regiones_no_mapeadas = set()

regiones = {region: {
    "cargas": {"vc": 0, "actas": 0, "ret": 0},
    "pasajeros": {"vc": 0, "actas": 0, "ret": 0},
    "total": {"vc": 0, "actas": 0, "ret": 0}
} for region in regiones_validas}

for r in registros:
    reg = r.get("regional", "").strip().upper()
    if not reg:
        continue

    if reg not in regiones_validas:
        regiones_no_mapeadas.add(reg)
        continue

    regiones_detectadas.add(reg)

    transporte = r.get("transporte", "").strip().upper()
    articulo = r.get("articulo", "").strip()
    retiene = r.get("retiene", "").strip().upper()

    if transporte == "CA":
        t = "cargas"
    elif transporte == "PA":
        t = "pasajeros"
    else:
        continue

    regiones[reg][t]["vc"] += 1
    if articulo:
        regiones[reg][t]["actas"] += 1
    if retiene == "SI":
        regiones[reg][t]["ret"] += 1

    regiones[reg]["total"]["vc"] += 1
    if articulo:
        regiones[reg]["total"]["actas"] += 1
    if retiene == "SI":
        regiones[reg]["total"]["ret"] += 1

# LOGS DE VALIDACIÓN
print(f"\nRegiones detectadas: {sorted(regiones_detectadas)}")
if regiones_no_mapeadas:
    print(f"Regiones no mapeadas (ignoradas): {sorted(regiones_no_mapeadas)}")
print(f"Total registros con regional válida: {len([r for r in registros if r.get('regional') in regiones_validas])}")


# =========================================================
# DEBUG FINAL Y LOGS DE PROCESAMIENTO
# =========================================================

print(f"\nModo de procesamiento: {modo}")
print(f"Filas Excel procesadas: {df.shape[0]}")
print(f"Dominios válidos totales encontrados: {total_dominios}")
print(f"Registros generados: {len(registros)}")
print(f"Total cargas: {total_cargas}")
print(f"Total pasajeros: {total_pasajeros}")
print(f"Total retenciones: {total_retenciones}")
print(f"Incidencias alcoholemia: {incidencias_alcoholemia}")
print(f"Incidencias sustancias: {incidencias_sustancias}")

print(f"\n--- DEBUG PROCESAMIENTO ---")
print(f"Total filas en DF: {df.shape[0]}")
print(f"Registros generados: {len(registros)}")
print(f"Dominios válidos totales: {total_dominios}")
regionales_en_registros = set(r.get('regional', '') for r in registros)
transportes_en_registros = set(r.get('transporte', '') for r in registros)
print(f"Regionales en registros: {sorted(regionales_en_registros)}")
print(f"Transportes en registros: {sorted(transportes_en_registros)}")

# =========================
# CALCULO TOTALES
# =========================

total_vehiculos = len(registros)

porc_cargas = 0
porc_pasajeros = 0

if total_vehiculos > 0:

    porc_cargas = round(total_cargas / total_vehiculos * 100, 2)

    porc_pasajeros = round(total_pasajeros / total_vehiculos * 100, 2)

# =========================================================
# GENERACION DEL ARCHIVO JSON
# =========================================================

salida = {

    "registros": registros,

    "incidencias": {

        "alcoholemia_positiva": incidencias_alcoholemia,

        "sustancias_positivas": incidencias_sustancias,

        "retenciones_alcoholemia": retenciones_alcoholemia,

        "retenciones_sustancias": retenciones_sustancias

    },

    "detalle_incidencias": detalles_incidencias,

    "metadata": {

        "total_registros": len(registros),

        "total_cargas": total_cargas,

        "total_pasajeros": total_pasajeros,

        "total_retenciones": total_retenciones,

        "registros_con_incidencia": len(detalles_incidencias),

        "fecha_generacion": pd.Timestamp.now().isoformat()

    },

    "actas": {

        "total": sum(1 for r in registros if r.get("articulo")),

        "cargas": sum(1 for r in registros if r.get("transporte") == "CA" and r.get("articulo")),

        "pasajeros": sum(1 for r in registros if r.get("transporte") == "PA" and r.get("articulo"))

    },

    "retenciones": {

        "total": total_retenciones,

        "cargas": sum(1 for r in registros if r.get("transporte") == "CA" and r.get("retiene") == "SI"),

        "pasajeros": sum(1 for r in registros if r.get("transporte") == "PA" and r.get("retiene") == "SI")

    },

    "regiones": regiones

}


# =========================================================
# GUARDAR datos.json
# =========================================================

datos_json_path = os.path.join(os.path.dirname(__file__), "datos.json")

with open(datos_json_path, "w", encoding="utf-8") as f:

    json.dump(salida, f, indent=2, ensure_ascii=False)


# =========================================================
# MENSAJE FINAL
# =========================================================

print("\n" + "=" * 60)
print("✓ datos.json generado exitosamente")
print(f"Archivo: {datos_json_path}")

if fecha_desde or fecha_hasta:
    print("\n📅 FILTRO DE FECHAS APLICADO:")
    if fecha_desde:
        print(f"   Desde: {fecha_desde}")
    if fecha_hasta:
        print(f"   Hasta: {fecha_hasta}")

print("\n📊 RESUMEN DE DATOS:")
print(f"   Vehículos Controlados: {len(registros):,}")
print(f"   - Cargas: {total_cargas:,}")
print(f"   - Pasajeros: {total_pasajeros:,}")
print(f"   Actas: {sum(1 for r in registros if r.get('articulo'))}")
print(f"   Retenciones: {total_retenciones}")
print(f"   Incidencias Alcoholemia: {incidencias_alcoholemia}")
print(f"   Incidencias Sustancias: {incidencias_sustancias}")
print("=" * 60)