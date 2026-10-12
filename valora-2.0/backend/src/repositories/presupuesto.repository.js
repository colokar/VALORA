import pool from "../database/connection.js";
import { AppError } from "../utils/AppError.util.js";

export const findPresupuestoConClienteRepository = async (presupuestoId, usuarioId) => {
    const query = `
        SELECT
            p.id,
            p.estado,
            p.cliente_id,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.email AS cliente_email
        FROM presupuestos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE p.id = $1
        AND p.usuario_id = $2
        AND p.deleted_at IS NULL;
    `;

    const result = await pool.query(query, [presupuestoId, usuarioId]);

    return result.rows[0] || null;
};

export const verifyPresupuestoByIdExistsRepository = async (presuespotId) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 
            FROM presupuestos 
            WHERE id = $1 
            AND deleted_at IS NULL
        ) AS existe;
    `;

    try {
        const { rows } = await pool.query(query, [presupuestoId]);
        return rows[0].existe; // Retorna true o false
    } catch (error) {
        console.error("Error al verificar si el usuario existe por ID:", error);
        throw error;
    }
};


/**
 * ==================================================
 * Obtiene un presupuesto completo con sus detalles
 * y datos del cliente
 * ==================================================
 */
export const findPresupuestoConDetallesRepository = async (
    presupuestoId, 
    usuarioId
) => {
    const query = `
        SELECT
            p.id,
            p.numero,
            p.fecha,
            p.fecha_vencimiento,
            p.subtotal,
            p.total,
            p.estado,
            p.observaciones,

            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.telefono AS cliente_telefono,
            c.email AS cliente_email,

            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            u.telefono AS usuario_telefono,
            u.email AS usuario_email,
            u.nombre_emprendimiento,
            u.logo_url,

            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', dp.id,
                    'item_id', dp.item_id,
                    'nombre_item', dp.nombre_item,
                    'cantidad', dp.cantidad,
                    'precio_unitario', dp.precio_unitario,
                    'subtotal', dp.subtotal
                )
                ORDER BY dp.created_at
            ) AS detalles

        FROM presupuestos p
        JOIN clientes c
            ON p.cliente_id = c.id
        JOIN usuarios u
            ON p.usuario_id = u.id
        LEFT JOIN detalle_presupuesto dp
            ON dp.presupuesto_id = p.id

        WHERE p.id = $1
        AND p.usuario_id = $2
        AND p.deleted_at IS NULL

        GROUP BY
            p.id,
            c.nombre,
            c.apellido,
            c.telefono,
            c.email,
            u.nombre,
            u.apellido,
            u.telefono,
            u.email,
            u.nombre_emprendimiento,
            u.logo_url;
    `;

    const result = await pool.query(query, [presupuestoId, usuarioId]);

    return result.rows[0] || null;
};


/**
 * ==================================================
 * REPOSITORY: Crear presupuesto
 * ==================================================
 **/
export const createPresupuestoTransaccionRepository = async ({
    usuarioId,
    clienteId,
    fecha,
    fechaVencimiento,
    estado,
    observaciones,
    subtotal,
    total,
    detallesProcesados,
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Generar número de presupuesto por usuario
        const {rows:[contador]} = await client.query(
            `
            SELECT COUNT(*) + 1 AS numero
            FROM presupuestos
            WHERE usuario_id = $1;
            `,
            [usuarioId]
        );

        const numero = `P-${String(contador.numero).padStart(3,"0")}`;

        // 2. Insertar cabecera del presupuesto
        const {rows:[nuevoPresupuesto]} = await client.query(
            `
            INSERT INTO presupuestos
            (
                usuario_id,
                cliente_id,
                numero,
                fecha,
                fecha_vencimiento,
                estado,
                observaciones,
                subtotal,
                total
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING
                id,
                numero,
                fecha,
                fecha_vencimiento,
                observaciones,
                created_at,
                subtotal,
                total,
                estado;
            `,
            [
                usuarioId,
                clienteId,
                numero,
                fecha,
                fechaVencimiento,
                estado,
                observaciones || null,
                subtotal,
                total
            ]
        );

        // 3. Insertar cada ítem del detalle
        for (const det of detallesProcesados) {
            await client.query(
                `
                INSERT INTO detalle_presupuesto
                (
                    presupuesto_id,
                    item_id,
                    nombre_item,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES($1,$2,$3,$4,$5,$6);
                `,
                [
                    nuevoPresupuesto.id,
                    det.item_id,
                    det.nombre_item,
                    det.cantidad,
                    det.precio_unitario,
                    det.subtotal
                ]
            );
        }

        await client.query("COMMIT");

        return { ...nuevoPresupuesto, detalles: detallesProcesados };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * ===================================================
 * REPOSITORY: GUARDAR PRESUPUESTO PDF
 * ===================================================
 */
export const addPdfRepository = async (dato) => {
    const { usuarioId, presupuestoId, pdf_url, pdf_public_id, estado } = dato;

    const query = `
        UPDATE presupuestos
        SET
            pdf_url = $1,
            pdf_public_id = $2,
            estado = $3,
            updated_at = NOW()
        WHERE id = $4
        AND usuario_id = $5
        AND deleted_at IS NULL
        RETURNING id,pdf_url,estado;
    `;

    const result = await pool.query(query, [pdf_url, pdf_public_id, estado, presupuestoId, usuarioId]);

    // Si no encuentra presupuesto o no pertenece al usuario
    if (result.rows.length === 0)
        throw new AppError("No se pudo actualizar el PDF", 404);

    return result.rows[0];
};

/**
 * =================================================
 * REPOSITORY: FILTROS POR FECHA, ESTADO Y CLIENTE
 * =================================================
 */
export const findPresupuestosConFiltrosRepository = async (usuarioId, filtros, limite, skip) => {
    
    const conditions = ["p.usuario_id = $1", "p.deleted_at IS NULL"];
    const values = [usuarioId];
    
    if (filtros.estado) {
        if(filtros.estado === "Pendiente"){
            filtros.estado = "Guardado"
        }
        
        conditions.push(`p.estado = $${values.length + 1}`);
        values.push(filtros.estado);
    }

    if (filtros.busqueda) {
        conditions.push(
            `(c.nombre ILIKE $${values.length + 1}
            OR c.apellido ILIKE $${values.length + 1})`
        );
        values.push(`%${filtros.busqueda}%`);
    }

    // NUEVO: Filtro por rango de fechas (ej: seleccionado en el calendario)
    if (filtros.fechaInicio && filtros.fechaFin) {
        conditions.push(`p.fecha BETWEEN $${values.length + 1} AND $${values.length + 2}`);
        values.push(filtros.fechaInicio, filtros.fechaFin);
    } else if (filtros.fechaInicio) {
        // Por si querés filtrar desde una fecha exacta en adelante
        conditions.push(`p.fecha >= $${values.length + 1}`);
        values.push(filtros.fechaInicio);
    }

    // NUEVO: Filtro por montos (ej: montoMinimo y montoMaximo)
    if (filtros.montoMinimo !== undefined) {
        conditions.push(`p.total >= $${values.length + 1}`); // Ajusta "total" al nombre de tu columna de monto
        values.push(filtros.montoMinimo);
    }
    if (filtros.montoMaximo !== undefined) {
        conditions.push(`p.total <= $${values.length + 1}`);
        values.push(filtros.montoMaximo);
    }

    // 1. Definimos las opciones de ordenamiento de forma limpia
    let ordenSQL = "ORDER BY p.created_at DESC"; // Por defecto (recientes)
    
    if (filtros.orden === "antiguo") {
        ordenSQL = "ORDER BY p.created_at ASC";
    } else if (filtros.orden === "monto_alto") {
        ordenSQL = "ORDER BY p.total DESC";
    } else if (filtros.orden === "monto_bajo") {
        ordenSQL = "ORDER BY p.total ASC";
    }

    const query = `
        SELECT
            p.*,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido
        FROM presupuestos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE ${conditions.join(" AND ")}
        ${ordenSQL}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2};
    `;

    values.push(limite, skip);

    const result = await pool.query(query, values);

    return result.rows;
};

export const contarPresupuestosConFiltrosRepository = async (usuarioId, filtros) => {
    const conditions = ["p.usuario_id = $1", "p.deleted_at IS NULL"];
    const values = [usuarioId];
    
    if (filtros.estado) {
        if(filtros.estado === "Pendiente"){
            filtros.estado = "guardado"
        }
        conditions.push(`p.estado = $${values.length + 1}`);
        values.push(filtros.estado);
    }

    // NUEVO: Agregar la misma condición de fechas para el conteo total
    if (filtros.fechaInicio && filtros.fechaFin) {
        conditions.push(`p.fecha BETWEEN $${values.length + 1} AND $${values.length + 2}`);
        values.push(filtros.fechaInicio, filtros.fechaFin);
    } else if (filtros.fechaInicio) {
        conditions.push(`p.fecha >= $${values.length + 1}`);
        values.push(filtros.fechaInicio);
    }

    // NUEVO: Filtro por montos (ej: montoMinimo y montoMaximo)
    if (filtros.montoMinimo !== undefined) {
        conditions.push(`p.total >= $${values.length + 1}`); // Ajusta "total" al nombre de tu columna de monto
        values.push(filtros.montoMinimo);
    }
    if (filtros.montoMaximo !== undefined) {
        conditions.push(`p.total <= $${values.length + 1}`);
        values.push(filtros.montoMaximo);
    }

    const query = `
        SELECT COUNT(*)
        FROM presupuestos p
        WHERE ${conditions.join(" AND ")};
    `;

    const result = await pool.query(query, values);

    // Retornamos cantidad como número
    return parseInt(result.rows[0].count, 10);
};

/**
 * DASHBOARD
 * SUMA TOTAL DE PRESUPUESTO
 * CANTIDAD DE PRESUPUESTO ESTADOS
 * ACTIVIDAD SEMANAL
 */


export const getDashboardDataRepository = async (usuarioId, periodo = 'semanal') => {
    let filtroFecha = "created_at >= NOW() - INTERVAL '7 days'";
    let agrupacion = "TO_CHAR(created_at, 'Dy')";
    let ordenNumero = "EXTRACT(ISODOW FROM MIN(created_at)) ASC";

    if (periodo === 'diario') {
        filtroFecha = "created_at >= CURRENT_DATE";
        agrupacion = "TO_CHAR(created_at, 'HH24:00')";
        ordenNumero = "MIN(created_at) ASC";
    } else if (periodo === 'mensual') {
        filtroFecha = "created_at >= NOW() - INTERVAL '30 days'";
        agrupacion = "TO_CHAR(created_at::date, 'YYYY-MM-DD')";
        ordenNumero = "MIN(created_at) ASC";
    }

    const query = `
        WITH estadisticas AS (
            SELECT
                COALESCE(SUM(p.total), 0) AS suma_total,
                COALESCE(
                    SUM(p.total) FILTER (
                        WHERE p.fecha >= DATE_TRUNC('month', CURRENT_DATE)
                            AND p.fecha < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                    ),
                    0
                ) AS suma_total_mes,
                COALESCE(
                    SUM(p.total) FILTER (
                        WHERE p.fecha >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
                            AND p.fecha < DATE_TRUNC('month', CURRENT_DATE)
                    ),
                    0
                ) AS suma_total_mes_anterior,
                COUNT(p.id) FILTER(WHERE p.estado = 'Guardado') AS guardados,
                COUNT(p.id) FILTER(WHERE p.estado = 'Aceptado') AS aceptados,
                COUNT(p.id) FILTER(WHERE p.estado = 'Rechazado') AS rechazados,
                COUNT(p.id) FILTER(WHERE p.estado = 'Borrador') AS borradores,
                COUNT(p.id) FILTER(WHERE p.estado IN ('Guardado', 'Enviado')) AS pendientes,
                COUNT(p.id) FILTER(WHERE p.estado <> 'Borrador') AS total_estados,
                COUNT(p.id) FILTER (
                    WHERE p.fecha >= DATE_TRUNC('month', CURRENT_DATE)
                        AND p.fecha < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                ) AS presupuestos_mes,
                COUNT(p.id) FILTER (
                    WHERE p.estado = 'Aceptado'
                        AND p.fecha >= DATE_TRUNC('month', CURRENT_DATE)
                        AND p.fecha < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                ) AS aceptados_mes,
                COUNT(p.id) FILTER (
                    WHERE p.estado = 'Rechazado'
                        AND p.fecha >= DATE_TRUNC('month', CURRENT_DATE)
                        AND p.fecha < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                ) AS rechazados_mes,
                COUNT(p.id) AS total_presupuestos,
                u.nombre AS usuario_nombre,
                u.apellido AS usuario_apellido
            FROM usuarios u
            LEFT JOIN presupuestos p ON u.id = p.usuario_id AND p.deleted_at IS NULL
            WHERE u.id = $1
            AND u.deleted_at IS NULL
            GROUP BY u.nombre, u.apellido
        ),
        actividad AS (
            SELECT 
                ${agrupacion} AS dia_corto,
                COUNT(*) FILTER (WHERE estado IN ('Guardado', 'Enviado')) AS pendientes,
                COUNT(*) FILTER (WHERE estado = 'Aceptado') AS aceptados,
                COUNT(*) FILTER (WHERE estado = 'Rechazado') AS rechazados
            FROM presupuestos
            WHERE usuario_id = $1 
              AND deleted_at IS NULL
              AND ${filtroFecha}
            GROUP BY dia_corto
            ORDER BY ${ordenNumero}
        ),
        historial_mensual AS (
            SELECT
                meses.mes,
                COALESCE(SUM(p.total), 0) AS total
            FROM GENERATE_SERIES(
                DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months',
                DATE_TRUNC('month', CURRENT_DATE),
                INTERVAL '1 month'
            ) AS meses(mes)
            LEFT JOIN presupuestos p
                ON p.usuario_id = $1
                AND p.deleted_at IS NULL
                AND p.fecha >= meses.mes
                AND p.fecha < meses.mes + INTERVAL '1 month'
            GROUP BY meses.mes
        ),
        ultimos_clientes AS (
            SELECT
                c.id,
                c.nombre,
                c.apellido,
                MAX(p.fecha) AS ultima_fecha
            FROM clientes c
            INNER JOIN presupuestos p
                ON p.cliente_id = c.id
                AND p.usuario_id = $1
                AND p.deleted_at IS NULL
            WHERE c.usuario_id = $1
                AND c.deleted_at IS NULL
            GROUP BY c.id, c.nombre, c.apellido
            ORDER BY ultima_fecha DESC
            LIMIT 5
        )
        SELECT
            (SELECT ROW_TO_JSON(estadisticas) FROM estadisticas) AS stats,
            (SELECT COALESCE(JSON_AGG(actividad), '[]'::json) FROM actividad) AS semanal,
            (
                SELECT COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'mes', TO_CHAR(mes, 'YYYY-MM'),
                            'total', total
                        )
                        ORDER BY mes
                    ),
                    '[]'::json
                )
                FROM historial_mensual
            ) AS historial_mensual,
            (
                SELECT COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', id,
                            'nombre', nombre,
                            'apellido', apellido
                        )
                        ORDER BY ultima_fecha DESC
                    ),
                    '[]'::json
                )
                FROM ultimos_clientes
            ) AS ultimos_clientes;
    `;

    const { rows } = await pool.query(query, [usuarioId]);
    const resultado = rows[0] || {};
    const statsData = resultado.stats || {};

    return {
        estadisticas: {
            sumaTotal: parseFloat(statsData.suma_total || 0),
            sumaTotalMes: parseFloat(statsData.suma_total_mes || 0),
            sumaTotalMesAnterior: parseFloat(statsData.suma_total_mes_anterior || 0),
            guardados: parseInt(statsData.guardados || 0, 10),
            aceptados: parseInt(statsData.aceptados || 0, 10),
            rechazados: parseInt(statsData.rechazados || 0, 10),
            borradores: parseInt(statsData.borradores || 0, 10),
            pendientes: parseInt(statsData.pendientes || 0, 10),
            totalEstados: parseInt(statsData.total_estados || 0, 10),
            presupuestosMes: parseInt(statsData.presupuestos_mes || 0, 10),
            aceptadosMes: parseInt(statsData.aceptados_mes || 0, 10),
            rechazadosMes: parseInt(statsData.rechazados_mes || 0, 10),
            totalPresupuestos: parseInt(statsData.total_presupuestos || 0, 10),
            usuarioNombre: statsData.usuario_nombre || "",
            usuarioApellido: statsData.usuario_apellido || ""
        },
        actividadSemanal: (resultado.semanal || []).map(row => ({
            dia: row.dia_corto,
            pendientes: parseInt(row.pendientes, 10),
            aprobados: parseInt(row.aceptados, 10),
            rechazados: parseInt(row.rechazados, 10)
        })),
        historialMensual: resultado.historial_mensual || [],
        ultimosClientes: resultado.ultimos_clientes || []
    };
};

export const getBudgetRepository = async (usuarioId, limit = null, offset = 0) => {
    let query = `
        SELECT 
            p.id AS presupuesto_id, 
            p.numero,
            p.fecha,
            p.fecha_vencimiento, 
            p.total, 
            p.estado,
            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            STRING_AGG(dp.nombre_item, ', ') AS nombres_items
        FROM presupuestos p
        INNER JOIN clientes c ON p.cliente_id = c.id
        LEFT JOIN detalle_presupuesto dp ON p.id = dp.presupuesto_id
        WHERE p.usuario_id=$1
        AND p.deleted_at IS NULL
        GROUP BY p.id, c.id, c.nombre, c.apellido
        ORDER BY p.created_at DESC
    `;

    const params = [usuarioId];

    // Si se manda límite agregamos paginación
    if (limit !== null) {
        query += `
            LIMIT $2 OFFSET $3
        `;
        params.push(limit, offset);
    }

    const {rows} = await pool.query(query, params);

    return rows;
};

export const updateStateRepository = async ( 
    estado, presupuestoId, usuarioId 
) =>{
    
    const query = `
        UPDATE presupuestos
        SET 
            estado = $1,
            updated_at = NOW()
        WHERE id = $2
          AND usuario_id = $3
          AND deleted_at IS NULL
        RETURNING 
            id,
            estado,
            updated_at;
    `;


    // Pasamos los 3 parámetros en el orden exacto de los $
    const result = await pool.query(
        query, 
        [estado, presupuestoId, usuarioId]
    );

    return result.rows[0] || null;

}

export const updatePublicStateRepository = async (
    presupuestoId,
    estado
) => {

    const query = `
        UPDATE presupuestos
        SET
            estado = $1,
            updated_at = NOW()
        WHERE
            id = $2
            AND deleted_at IS NULL
        RETURNING
            id,
            numero,
            estado,
            updated_at;
    `;

    const values = [
        estado,
        presupuestoId,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
};


export const findPublicPresupuestoConDetallesRepository = async (
    presupuestoId
) => {

    const query = `
        SELECT
            p.id,
            p.numero,
            p.fecha,
            p.fecha_vencimiento,
            p.subtotal,
            p.total,
            p.estado,
            p.observaciones,
            p.updated_at,

            c.nombre AS cliente_nombre,
            c.apellido AS cliente_apellido,
            c.telefono AS cliente_telefono,
            c.email AS cliente_email,

            u.nombre AS usuario_nombre,
            u.apellido AS usuario_apellido,
            u.telefono AS usuario_telefono,
            u.email AS usuario_email,
            u.nombre_emprendimiento,
            u.logo_url,

            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', dp.id,
                    'item_id', dp.item_id,
                    'nombre_item', dp.nombre_item,
                    'cantidad', dp.cantidad,
                    'precio_unitario', dp.precio_unitario,
                    'subtotal', dp.subtotal
                )
                ORDER BY dp.created_at
            ) AS detalles

        FROM presupuestos p
        JOIN clientes c
            ON p.cliente_id = c.id
        JOIN usuarios u
            ON p.usuario_id = u.id
        LEFT JOIN detalle_presupuesto dp
            ON dp.presupuesto_id = p.id

        WHERE p.id = $1
        AND p.deleted_at IS NULL

        GROUP BY
            p.id,
            c.nombre,
            c.apellido,
            c.telefono,
            c.email,
            u.nombre,
            u.apellido,
            u.telefono,
            u.email,
            u.nombre_emprendimiento,
            u.logo_url;
    `;

    const { rows } = await pool.query(query, [presupuestoId]);

    return rows[0] || null;
};

export const updatePresupuestoRepository = async ({
    presupuestoId,
    usuarioId,
    clienteId,
    fecha,
    fechaVencimiento,
    estado,
    observaciones,
    subtotal,
    total,
    detallesProcesados,
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        await client.query(
            `
            UPDATE presupuestos
            SET
                cliente_id = $1,
                fecha = $2,
                fecha_vencimiento = $3,
                estado = $4,
                observaciones = $5,
                subtotal = $6,
                total = $7,
                updated_at = NOW()

            WHERE id = $8
            AND usuario_id = $9
            AND deleted_at IS NULL;
            `,
            [
                clienteId,
                fecha,
                fechaVencimiento,
                estado,
                observaciones || null,
                subtotal,
                total,
                presupuestoId,
                usuarioId
            ]
        );


        await client.query(
            `
            DELETE FROM detalle_presupuesto
            WHERE presupuesto_id = $1;
            `,
            [
                presupuestoId
            ]
        );


        for (const det of detallesProcesados) {

            await client.query(
                `
                INSERT INTO detalle_presupuesto
                (
                    presupuesto_id,
                    item_id,
                    nombre_item,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES($1,$2,$3,$4,$5,$6);
                `,
                [
                    presupuestoId,
                    det.item_id,
                    det.nombre_item,
                    det.cantidad,
                    det.precio_unitario,
                    det.subtotal
                ]
            );

        }


        await client.query("COMMIT");


        return {
            id: presupuestoId,
            estado,
        };


    } catch(error){

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};