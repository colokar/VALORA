"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getPresupuestosFiltroService } from "@/services/presupuesto.service";
import { getLocalPresupuestos } from "@/services/localDataService";
import { isLocalSessionActive } from "@/services/localAuthService";

export function useFiltroPresupuestos(initialLimite = 10, initialEstado = "") {
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(initialLimite);
    
    // 1. Inicializamos con un string primitivo o mantenemos la estructura estable
    const [estado, setEstado] = useState(initialEstado || "");
    const [otrosFiltros, setOtrosFiltros] = useState({});
    
    const [resultado, setResultado] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Estabilizamos el objeto de filtros usando useMemo
    const filtros = useMemo(() => ({
        ...(estado ? { estado } : {}),
        ...otrosFiltros
    }), [estado, otrosFiltros]);

    const cargarPresupuestos = useCallback(async (p, l, f) => {
        try {
            setLoading(true);
            setError(null);
            if (isLocalSessionActive()) {
                setResultado(getLocalPresupuestos(p, l));
                return;
            }
            const res = await getPresupuestosFiltroService({
                pagina: p,
                limite: l,
                filtro: JSON.stringify(f),
            });
            setResultado(res);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error al cargar los presupuestos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(
            () => cargarPresupuestos(pagina, limite, filtros),
            0
        );
        return () => window.clearTimeout(timer);
    }, [pagina, limite, filtros, cargarPresupuestos]);

    const actualizarFiltros = (nuevosFiltros) => {
        // Si vienen nuevos filtros que afectan al estado principal, los manejamos bien
        if ("estado" in nuevosFiltros) {
            setEstado(nuevosFiltros.estado);
        }
        setOtrosFiltros((prev) => ({
            ...prev,
            ...nuevosFiltros,
        }));
        setPagina(1);
    };

    const limpiarFiltros = () => {
        setEstado("");
        setOtrosFiltros({});
        setPagina(1);
    };

    const cambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
    };

    return {
        presupuestos: resultado.data || [],
        totalPaginas: resultado.meta?.totalPaginas || 1,
        totalRegistros: resultado.meta?.total || 0,
        paginaActual: pagina,
        limite,
        loading,
        error,
        cambiarPagina,
        actualizarFiltros,
        limpiarFiltros,
    };
}