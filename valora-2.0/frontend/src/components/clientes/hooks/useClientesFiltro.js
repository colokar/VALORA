"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getClientesFiltroService } from "@/services/clientes.service";  

export function useClientesFiltro(initialLimite = 10, initialEstado = "") {
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(initialLimite);

    const [estado, setEstado] = useState(initialEstado || "");
    const [otrosFiltros, setOtrosFiltros] = useState({});
    
    const [resultado, setResultado] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtros = useMemo(() => ({ 
        ...(estado ? { estado } : {}),
        ...otrosFiltros 
    }), [estado, otrosFiltros]);    

    const cargarClientes = useCallback(async (p, l, f) => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await getClientesFiltroService({
                pagina: p,
                limite: l,
                filtro: JSON.stringify(f),
            });
            
            setResultado(res);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarClientes(pagina, limite, filtros);
    }, [pagina, limite, filtros, cargarClientes]);
    
    const actualizarFiltros = (nuevosFiltros) => {
        if ("estado" in nuevosFiltros) {
            setEstado(nuevosFiltros.estado);
        }   

        // 💡 Vital: Guardamos los demás filtros (busqueda, orden, etc.)
        setOtrosFiltros((prev) => ({
            ...prev,
            ...nuevosFiltros,
        }));

        setPagina(1); // Siempre volvemos a la página 1 al aplicar un filtro nuevo
    }

    const limpiarFiltros = () => {
        setEstado("");
        setOtrosFiltros({});
        setPagina(1);
    }       

    const cambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
    }

    return {
        clientes: resultado.data || [],
        totalPaginas: resultado.meta?.totalPaginas || 1,
        totalRegistros: resultado.meta?.total || 0, // 💡 Corregido con la "s" final
        paginaActual: pagina,
        limite,
        loading,
        error,
        cambiarPagina,
        actualizarFiltros,
        limpiarFiltros,
    };
}