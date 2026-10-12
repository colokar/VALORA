"use client";
import { useState, useEffect, useCallback } from "react";
import { 
    getDetallePresupuestosService, 
    updatePresupuestoEstadoService
} from "@/services/presupuesto.service";

export function useDetallePresupuesto(presupuestoId) {
    const [data, setData] = useState(null);
    const [actualizandoEstado, setActualizandoEstado] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarDetalle = useCallback(async () => {
        if (!presupuestoId) return;
        
        try {
            setLoading(true);
            setError(null);
            const resultado = await getDetallePresupuestosService(presupuestoId);
            setData(resultado.presupuesto);
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar el detalle del presupuesto");
        } finally {
            setLoading(false);
        }
    }, [presupuestoId]);

    const cambiarEstado = async (nuevoEstado) => {
        if(!presupuestoId) return;
        try{
            setActualizandoEstado(true);
            setError(null);
            const resultado = await updatePresupuestoEstadoService(nuevoEstado, presupuestoId);
            // Actualizamos el estado localmente para reflejar el cambio de inmediato
            setData((prevData) => {
                if (!prevData) return null;
                
                // Si el backend devuelve el objeto dentro de 'presupuesto' o directamente
                const presupuestoActualizado = resultado?.presupuesto || resultado;

                return {
                    ...prevData,
                    estado: presupuestoActualizado?.estado || nuevoEstado,
                    updated_at: presupuestoActualizado?.updated_at || new Date().toISOString()
                };
            });

            return resultado;
        }catch(err){const mensajeError = err.response?.data?.message || "Error al actualizar el estado del presupuesto";
            setError(mensajeError);
            throw err;
        } finally {
            setActualizandoEstado(false);
        }
    }

     useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!presupuestoId) return;
            try {
                const resultado = await getDetallePresupuestosService(presupuestoId);
                if (isMounted) {
                    setData(resultado.presupuesto);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || "Error al cargar el detalle del presupuesto");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [presupuestoId]);

    return {
        presupuesto: data,
        loading,
        error,
        actualizandoEstado,
        recargarDetalle: cargarDetalle,
        cambiarEstado
    };
}