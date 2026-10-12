// Importamos la conexión a PostgreSQL.
// db es el Pool que configuramos en database.js
import pool from "../database/connection.js";


export const findItemByIdRepository = async (itemId,usuarioId) => {

    const query = `
        SELECT
            id,
            usuario_id,
            nombre,
            tipo,
            precio,
            activo,
            created_at,
            updated_at
        FROM items
        WHERE id = $1
        AND usuario_id = $2
        AND deleted_at IS NULL;
    `;

    const result = await pool.query(query,[itemId,usuarioId]);

    // Si encuentra algo, devuelve el objeto; si no, devuelve null
    return result.rows[0] || null;

};


export const findItemsByUsuarioRepository = async (usuarioId) => {

    const query = `
        SELECT
            id,
            nombre,
            tipo,
            precio,
            activo
        FROM items
        WHERE usuario_id = $1
        AND deleted_at IS NULL
        ORDER BY nombre ASC;
    `;

    const result = await pool.query(query,[usuarioId]);

    return result.rows;

};


/**
 * ==================================================
 * Busca múltiples items por sus IDs
 * Se usa al crear presupuestos para obtener
 * el precio actual del item.
 *
 * El precio se copia al detalle_presupuesto
 * para mantener el histórico del presupuesto.
 * ==================================================
 */

export const findItemsByIdsRepository = async (itemsIds,usuarioId) => {

    const query = `
        SELECT
            id,
            nombre,
            tipo,
            precio,
            activo
        FROM items
        WHERE id = ANY($1::uuid[])
        AND usuario_id = $2
        AND deleted_at IS NULL
        AND activo = TRUE;
    `;

    const result = await pool.query(
        query,
        [
            itemsIds,
            usuarioId
        ]
    );

    return result.rows;

};



export const createItemRepository = async (itemData) => {

    const {
        usuarioId,
        nombre,
        tipo,
        precio
    } = itemData;


    const query = `
        INSERT INTO items
        (
            usuario_id,
            nombre,
            tipo,
            precio
        )
        VALUES($1,$2,$3,$4)

        RETURNING
            id,
            usuario_id,
            nombre,
            tipo,
            precio,
            activo,
            created_at;
    `;


    const result = await pool.query(
        query,
        [
            usuarioId,
            nombre,
            tipo,
            precio
        ]
    );


    return result.rows[0];

};



export const updateItemRepository = async (itemId,usuarioId,itemData) => {

    const {
        nombre,
        tipo,
        precio,
        activo
    } = itemData;


    const query = `
        UPDATE items
        SET
            nombre = $1,
            tipo = $2,
            precio = $3,
            activo = $4,
            updated_at = NOW()

        WHERE id = $5
        AND usuario_id = $6
        AND deleted_at IS NULL

        RETURNING
            id,
            usuario_id,
            nombre,
            tipo,
            precio,
            activo,
            updated_at;
    `;


    const result = await pool.query(
        query,
        [
            nombre,
            tipo,
            precio,
            activo,
            itemId,
            usuarioId
        ]
    );


    return result.rows[0] || null;

};