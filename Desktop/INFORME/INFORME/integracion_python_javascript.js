// ========================================================
// INTEGRACIÓN JAVASCRIPT ↔ PYTHON
// ========================================================
//
// Este archivo muestra cómo leer los resúmenes
// generados por Python desde JavaScript.
//
// Flujo:
// 1. Python ejecuta: generador.py
// 2. Se actualiza: datos.json con metadata y regiones
// 3. JavaScript fetch: datos.json
// 4. HTML se actualiza automáticamente
// ========================================================

/**
 * Carga los resúmenes desde datos.json (generados por Python)
 * y actualiza la tabla HTML
 */
async function actualizarDesdeResumenesPython() {
    try {
        console.log("Cargando resúmenes calculados por Python...");
        
        const response = await fetch("datos.json");
        if (!response.ok) throw new Error("No se pudo cargar datos.json");
        
        const datos = await response.json();
        
        // Verificar que existen los resúmenes
        if (!datos.metadata || !datos.regiones) {
            console.warn("Advertencia: El JSON no contiene las claves esperadas metadata/regiones");
            console.log("Ejecuta: python generador.py");
            return;
        }
        
        console.log("Datos del generador Python encontrados:");
        
        // ====================================================
        // 1. ACTUALIZAR RESUMEN GENERAL
        // ====================================================
        
        const resumenGeneral = datos.metadata;
        const regionesData = datos.regiones || {};
        
        // Total VC calculado a partir de las regiones
        const totalVC = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.total?.vc) || 0), 0);
        const vcCargas = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.cargas?.vc) || 0), 0);
        const vcPasajeros = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.pasajeros?.vc) || 0), 0);
        const totalRetenciones = parseInt(resumenGeneral.total_retenciones) || 0;
        const totalCargasActas = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.cargas?.actas) || 0), 0);
        const totalCargasRet = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.cargas?.ret) || 0), 0);
        const totalPasajerosActas = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.pasajeros?.actas) || 0), 0);
        const totalPasajerosRet = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.pasajeros?.ret) || 0), 0);
        const totalActas = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.total?.actas) || 0), 0);
        const totalRetencionesOverall = Object.values(regionesData).reduce((sum, reg) => sum + (parseInt(reg.total?.ret) || 0), 0);
        
        console.log(`Total VC: ${totalVC}`);
        
        const porcCargas = totalVC > 0 ? Math.round((vcCargas / totalVC) * 100) : 0;
        const porcPasajeros = totalVC > 0 ? Math.round((vcPasajeros / totalVC) * 100) : 0;
        
        // Actualizar elementos HTML (ejemplo)
        if (document.getElementById("vc_total")) {
            document.getElementById("vc_total").textContent = totalVC;
        }
        
        if (document.getElementById("vc_cargas_pct")) {
            document.getElementById("vc_cargas_pct").textContent = porcCargas + "%";
        }
        
        if (document.getElementById("vc_pasajeros_pct")) {
            document.getElementById("vc_pasajeros_pct").textContent = porcPasajeros + "%";
        }
        
        // ====================================================
        // 2. ACTUALIZAR TABLA POR REGIÓN
        // ====================================================
        
        const resumenPorRegion = datos.regiones;
        
        // Regiones e sus IDs en la tabla
        const regiones = ["AMBA", "COSTA", "CEN", "CUY", "NEA", "NOA", "PAT"];
        
        regiones.forEach(region => {
            
            const datosRegion = resumenPorRegion[region];
            
            // Para cada tipo (cargas, pasajeros, total)
            // y cada métrica (vc, actas, ret)
            
            // CARGAS
            actualizarCelda(`${region.toLowerCase()}_cargas_vc`, datosRegion.cargas.vc);
            actualizarCelda(`${region.toLowerCase()}_cargas_actas`, datosRegion.cargas.actas);
            actualizarCelda(`${region.toLowerCase()}_cargas_ret`, datosRegion.cargas.ret);
            
            // PASAJEROS
            actualizarCelda(`${region.toLowerCase()}_pasajeros_vc`, datosRegion.pasajeros.vc);
            actualizarCelda(`${region.toLowerCase()}_pasajeros_actas`, datosRegion.pasajeros.actas);
            actualizarCelda(`${region.toLowerCase()}_pasajeros_ret`, datosRegion.pasajeros.ret);
            
            // TOTALES
            actualizarCelda(`${region.toLowerCase()}_total_vc`, datosRegion.total.vc);
            actualizarCelda(`${region.toLowerCase()}_total_actas`, datosRegion.total.actas);
            actualizarCelda(`${region.toLowerCase()}_total_ret`, datosRegion.total.ret);
        });
        
        // ====================================================
        // 3. ACTUALIZAR TOTALES GENERALES EN TABLA
        // ====================================================
        
        actualizarCelda("total_cargas_vc", vcCargas);
        actualizarCelda("total_cargas_actas", totalCargasActas);
        actualizarCelda("total_cargas_ret", totalCargasRet);
        
        actualizarCelda("total_pasajeros_vc", vcPasajeros);
        actualizarCelda("total_pasajeros_actas", totalPasajerosActas);
        actualizarCelda("total_pasajeros_ret", totalPasajerosRet);
        
        actualizarCelda("total_vc", totalVC);
        actualizarCelda("total_actas", totalActas);
        actualizarCelda("total_ret", totalRetencionesOverall);
        
        console.log("Tabla actualizada exitosamente");
        
    } catch (error) {
        console.error("Error al cargar resúmenes:", error);
    }
}

/**
 * Helper: Actualiza una celda de la tabla por ID
 */
function actualizarCelda(elementId, valor) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = valor || 0;
    }
}

/**
 * Flujo: El usuario hace click en "Generar Informe"
 * 
 * OPCIÓN 1 - Solo JavaScript (lectura):
 *   - JavaScript lee datos.json
 *   - Usa los resúmenes ya calculados por Python
 * 
 * OPCIÓN 2 - Con Backend (recalcular):
 *   - JavaScript envía POST a endpoint Python
 *   - Python recalcula con nuevas fechas
 *   - Python actualiza datos.json
 *   - JavaScript lee los nuevos datos
 */

async function generarInformeModerno() {
    
    console.log("Generando informe...");
    
    // Obtener fechas del HTML
    const fechaDesde = document.getElementById("fecha_desde")?.value;
    const fechaHasta = document.getElementById("fecha_hasta")?.value;
    
    console.log(`Fechas: ${fechaDesde} a ${fechaHasta}`);
    
    // ====================================================
    // OPCIÓN 1: Solo leer datos.json (ya procesados)
    // ====================================================
    // Esto funciona si los datos ya fueron procesados
    // por: python gestor_fiscalizacion.py
    
    await actualizarDesdeResumenesPython();
    
    // ====================================================
    // OPCIÓN 2: Enviar al backend para recalcular
    // ====================================================
    // Descomentar esto si tienes un servidor Flask/Django
    
    /*
    try {
        const response = await fetch("/api/generar-informe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fecha_desde: fechaDesde,
                fecha_hasta: fechaHasta
            })
        });
        
        const resultado = await response.json();
        
        if (resultado.exito) {
            // Actualizar HTML con nuevos datos
            await actualizarDesdeResumenesPython();
        } else {
            console.error("Error en backend:", resultado.error);
        }
    } catch (error) {
        console.error("Error en request:", error);
    }
    */
}

// ========================================================
// EJECUTAR AL CARGAR LA PÁGINA
// ========================================================

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página cargada. Actualizando con datos de Python...");
    actualizarDesdeResumenesPython();
});

// ========================================================
// INTEGRACIÓN CON BOTÓN "GENERAR INFORME"
// ========================================================
//
// En index.html, reemplaza:
//
//   <button onclick="generarInforme()">
//
// Por:
//
//   <button onclick="generarInformeModerno()">
//
// ========================================================
