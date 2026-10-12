import pool from "../database/connection.js";

export const findClientesByClienteRepository = async (usuarioId) => {
    const query = `
        SELECT id, nombre, apellido, email, cuil_cuit,  telefono, created_at
        FROM clientes
        WHERE usuario_id = $1 AND deleted_at IS NULL
        ORDER BY nombre ASC;
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};


export const findClienteByIdRepository = async (usuarioId, clienteId) => {
    const query = `
        SELECT id, nombre, apellido, email, cuil_cuit, telefono, created_at
        FROM clientes
        WHERE id = $1 AND usuario_id = $2 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [clienteId, usuarioId]);
    return result.rows[0]; // Retorna el cliente o undefined si no existe
};

export const existsClienteRepository = async (usuario_id, clienteId) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 
            FROM clientes 
            WHERE id = $1 
            AND usuario_id = $2 
            AND deleted_at IS NULL
        );
    `;
    const result = await pool.query(query, [clienteId, usuario_id]);
    return result.rows[0].exists;
};

export const createClienteRepository = async (clienteData) => {
    const { 
        usuario_id, 
        nombre, 
        apellido, 
        email,
        cuil_cuit, 
        telefono 
    } = clienteData;
    
    const query = `
        INSERT INTO clientes (
            usuario_id, 
            nombre, 
            apellido, 
            email, 
            cuil_cuit, 
            telefono)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, usuario_id, nombre, apellido, email, cuil_cuit, telefono, created_at;
    `;
    
    // Ahora pasamos los 6 parámetros en el orden correcto
    const result = await pool.query(query, [
        usuario_id, 
        nombre, 
        apellido, 
        email, 
        cuil_cuit, 
        telefono
    ]);
    
    return result.rows[0];
};

export const updateClienteRepository = async (usuario_id, updateData) => {
    
    const { 
        id, 
        nombre, 
        apellido, 
        email, 
        cuil_cuit, 
        telefono 
    } = updateData;

    // 2. Verificamos que el ID exista para evitar errores SQL
    if (!id) {
        throw new Error("El ID del cliente es obligatorio para actualizar");
    }

    const query = `
        UPDATE clientes
        SET nombre = $1,
            apellido = $2,
            email = $3,
            cuil_cuit = $4,
            telefono = $5,
            updated_at = NOW()
        WHERE id = $6 AND usuario_id = $7 AND deleted_at IS NULL
        RETURNING id, usuario_id, nombre, apellido, email, cuil_cuit, telefono, updated_at;
    `;

    const result = await pool.query(query, [
        nombre, 
        apellido, 
        email, 
        cuil_cuit, 
        telefono, 
        id, 
        usuario_id
    ]);

    return result.rows[0];
};

export const filterClientesRepository = async (usuarioId, filtros, limite, skip) => {
    // 1. Condiciones base para la tabla clientes
    const conditions = ["usuario_id = $1", "deleted_at IS NULL"];
    const values = [usuarioId];

    // 2. Filtro de búsqueda (nombre, apellido o email)
    if (filtros?.busqueda) {
        conditions.push(`(nombre ILIKE $${values.length + 1} OR apellido ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1})`);
        values.push(`%${filtros.busqueda}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // 3. Ordenamiento dinámico
    let ordenSQL = "ORDER BY nombre ASC"; // Por defecto
    if (filtros?.orden === "antiguo") {
        ordenSQL = "ORDER BY created_at ASC";
    } else if (filtros?.orden === "reciente") {
        ordenSQL = "ORDER BY created_at DESC";
    }

    // 4. Consulta para traer los datos paginados
    const queryData = `
        SELECT id, nombre, apellido, email, cuil_cuit, telefono, created_at
        FROM clientes
        ${whereClause}
        ${ordenSQL}
        LIMIT $${values.length + 1} OFFSET $${values.length + 2};
    `;

    // 5. Consulta para obtener el total de registros con los mismos filtros
    const queryCount = `
        SELECT COUNT(*) as total
        FROM clientes
        ${whereClause};
    `;

    // Ejecutamos ambas consultas pasando los parámetros de paginación al final de data
    const [resultData, resultCount] = await Promise.all([
        pool.query(queryData, [...values, limite, skip]),
        pool.query(queryCount, values) // El count solo necesita las condiciones de búsqueda
    ]);

    const totalRegistros = parseInt(resultCount.rows[0].total, 10);

    return {
        data: resultData.rows,
        total: totalRegistros
    };
};
