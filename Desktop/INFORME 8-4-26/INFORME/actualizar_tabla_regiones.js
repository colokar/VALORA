// =========================================================
// SCRIPT: ACTUALIZAR TABLA RESUMEN POR REGIÓN
// =========================================================
// Carga datos desde datos.json y actualiza la tabla
// "RESUMEN POR REGIÓN" dinámicamente
// =========================================================

async function actualizarTablaRegiones() {
    try {
        // Cargar datos.json
        const response = await fetch("datos.json");
        const datos = await response.json();
        
        const resumen = datos.resumen_por_region;
        
        if (!resumen) {
            console.warn("⚠️  No se encontró resumen_por_region en datos.json");
            return;
        }
        
        // Mapeo de regiones en orden
        const regiones = ["AMBA", "COSTA", "BA", "CEN", "CUY", "NEA", "NOA", "PAT"];
        
        // Actualizar cada fila de región
        for (const region of regiones) {
            const datosRegion = resumen[region];
            
            if (!datosRegion) continue;
            
            // Cargas
            actualizarCelda(`${region}_cargas_vc`, datosRegion.cargas.vc);
            actualizarCelda(`${region}_cargas_actas`, datosRegion.cargas.actas);
            actualizarCelda(`${region}_cargas_ret`, datosRegion.cargas.ret);
            
            // Pasajeros
            actualizarCelda(`${region}_pasajeros_vc`, datosRegion.pasajeros.vc);
            actualizarCelda(`${region}_pasajeros_actas`, datosRegion.pasajeros.actas);
            actualizarCelda(`${region}_pasajeros_ret`, datosRegion.pasajeros.ret);
            
            // Total
            actualizarCelda(`${region}_total_vc`, datosRegion.total.vc);
            actualizarCelda(`${region}_total_actas`, datosRegion.total.actas);
            actualizarCelda(`${region}_total_ret`, datosRegion.total.ret);
        }
        
        // Actualizar fila TOTAL CNRT
        if (resumen.TOTAL) {
            const total = resumen.TOTAL;
            
            actualizarCelda("total_cargas_vc", total.cargas.vc);
            actualizarCelda("total_cargas_actas", total.cargas.actas);
            actualizarCelda("total_cargas_ret", total.cargas.ret);
            
            actualizarCelda("total_pasajeros_vc", total.pasajeros.vc);
            actualizarCelda("total_pasajeros_actas", total.pasajeros.actas);
            actualizarCelda("total_pasajeros_ret", total.pasajeros.ret);
            
            actualizarCelda("total_vc", total.total.vc);
            actualizarCelda("total_actas", total.total.actas);
            actualizarCelda("total_ret", total.total.ret);
        }
        
        console.log("✅ Tabla RESUMEN POR REGIÓN actualizada");
        
    } catch (error) {
        console.error("❌ Error actualizando tabla regiones:", error);
    }
}

// =========================================================
// FUNCIÓN AUXILIAR: ACTUALIZAR CELDA
// =========================================================

function actualizarCelda(elementId, valor) {
    const elemento = document.getElementById(elementId);
    
    if (elemento) {
        // Convertir a número y formatear
        const numValor = parseInt(valor) || 0;
        elemento.textContent = numValor.toString();
        elemento.dataset.valor = numValor; // Guardar para futuras referencias
    }
}

// =========================================================
// EJECUTAR AL CARGAR LA PÁGINA
// =========================================================

document.addEventListener("DOMContentLoaded", function() {
    actualizarTablaRegiones();
});

// =========================================================
// FUNCIÓN PÚBLICA: ACTUALIZAR CON FILTRO DE FECHAS
// =========================================================

async function actualizarTablaConFechas(fechaDesde, fechaHasta) {
    /*
    Actualiza la tabla filtrando por rango de fechas.
    Requiere que calcular_resumen_regiones.py genere un nuevo resumen.
    
    Uso:
    ----
    actualizarTablaConFechas("2026-03-01", "2026-03-31");
    */
    
    try {
        // Cargar datos.json
        const response = await fetch("datos.json");
        const datos = await response.json();
        
        const registros = datos.registros || [];
        
        // Aquí se necesitaría ejecutar el cálculo en Python
        // o tener un endpoint que lo haga
        console.warn("⚠️  Para filtrar por fechas, ejecuta calcular_resumen_regiones.py desde Python");
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}
