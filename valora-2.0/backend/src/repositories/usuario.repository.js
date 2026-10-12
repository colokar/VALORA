// Importamos la conexión a PostgreSQL.
// db es el Pool que configuramos en database.js
import pool from "../database/connection.js";

export const verifyUserByIdExistsRepository = async (usuarioId) => {
    const query = `
        SELECT EXISTS (
            SELECT 1 
            FROM usuarios 
            WHERE id = $1 
            AND deleted_at IS NULL
        ) AS existe;
    `;

    try {
        const { rows } = await pool.query(query, [usuarioId]);
        return rows[0].existe; // Retorna true o false
    } catch (error) {
        console.error("Error al verificar si el usuario existe por ID:", error);
        throw error;
    }
};

/**
 * ==================================================
 * REPOSITORY: Buscar usuario por ID
 * ==================================================
 *
 * ¿Qué hace?
 * Busca un usuario en la tabla "usuarios"
 * utilizando su ID.
 *
 * ¿Qué recibe?
 * - id: UUID del usuario.
 *
 * ¿Qué devuelve?
 * - Un objeto usuario si existe.
 * - undefined si no existe.
 */
export const findUserByIdRepository = async (id) => {

    /**
     * Consulta SQL.
     *
     * SELECT:
     * Indica qué columnas queremos obtener.
     *
     * FROM usuarios:
     * Tabla donde vamos a buscar.
     *
     * WHERE id = $1:
     * Busca el usuario cuyo id coincida.
     *
     * AND deleted_at IS NULL:
     * Ignora usuarios eliminados lógicamente.
     */
  const query = `
        SELECT
            id,
            email,
            password_hash,
            nombre, 
            apellido,
            nombre_emprendimiento,
            cargo,
            telefono,
            razon_social,
            cuil_cuit,
            direccion,
            rubro,
            sitio_web,
            rubro,
            email,
            logo_url,          
            logo_public_id,
            activo,
            created_at
        FROM usuarios
        WHERE id = $1
        AND deleted_at IS NULL
    `;

    /**
     * Ejecutamos la consulta.
     *
     * db.query() recibe:
     *
     * 1) El SQL.
     * 2) Un array con los parámetros.
     *
     * El $1 del SQL será reemplazado por el id.
     *
     * Ejemplo:
     *
     * id = "123"
     *
     * PostgreSQL ejecutará:
     *
     * SELECT *
     * FROM usuarios
     * WHERE id = '123'
     *
     * Esto evita SQL Injection.
     */
    const result = await pool.query(
        query,
        [id]
    );


    /**
     * PostgreSQL devuelve un objeto.
     *
     * Ejemplo:
     *
     * {
     *   rows: [
     *      {
     *          id: "...",
     *          email: "test@gmail.com"
     *      }
     *   ],
     *   rowCount: 1
     * }
     *
     * rows es un array.
     */

    /**
     * rows[0]
     * devuelve el primer registro encontrado.
     *
     * Si existe:
     *
     * {
     *   id: "...",
     *   email: "..."
     * }
     *
     * Si no existe:
     *
     * undefined
     */
    return result.rows[0];
};


export const findUserByEmailRepository = async (email) => {
    const query = `
        SELECT
            id,
            email,
            password_hash,
            nombre,
            apellido,
            nombre_emprendimiento,
            logo_url,
            created_at
        FROM usuarios
        WHERE email = $1
        AND deleted_at IS NULL
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0];
};

/**----------------------------------------------------- **/

export const createUserRepository = async (dato) => {

    const { 
        nombre, 
        apellido, 
        email, 
        passwordHash, 
        nombreEmprendimiento 
    } = dato;

    // Definición de la consulta SQL utilizando template literals
    // Especificamos las columnas de la tabla que queremos completar.  

    const query = `
        INSERT INTO usuarios (
            nombre,
            apellido,
            email,
            password_hash,
            nombre_emprendimiento
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, nombre_emprendimiento, created_at
    `;

    // Ejecución de la consulta enviando los parámetros de forma segura
    const result = await pool.query(
        query,
        [
            nombre,                // $1
            apellido,              // $2           
            email,                 // $3
            passwordHash,          // $4
            nombreEmprendimiento   // $5
        ]
    );

    // Retorna el primer objeto (fila) del resultado insertado
    return result.rows[0];
};

export const updateUserRubroCargoRepository = async (dato) => {
    const { 
        userId, 
        nombre_emprendimiento,
        cargo 
    } = dato;

    // Actualiza todos los campos recibidos en la tabla usuarios
    const query = `
        UPDATE usuarios
        SET 
            nombre_emprendimiento = $1,
            cargo = $2,
            updated_at = NOW()
        WHERE id = $3 AND deleted_at IS NULL
        RETURNING id, nombre_emprendimiento, cargo
    `;

    // Ejecución de la consulta pasando los valores en el orden correcto
    const result = await pool.query(query, [
        nombre_emprendimiento,
        cargo,
        userId
    ]);

    // Retorna el resultado de la actualización
    return result.rows[0];
}

export const updateUserDateRepository = async (dato) => {
    const { 
        userId, 
        nombre, 
        apellido, 
        email, 
        telefono, 
        cargo 
    } = dato;

    // Actualiza todos los campos recibidos en la tabla usuarios
    const query = `
        UPDATE usuarios
        SET 
            nombre = $1,
            apellido = $2,
            email = $3,
            telefono = $4,
            cargo = $5,
            updated_at = NOW()
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING id, nombre, apellido, email, telefono, cargo
    `;

    // Ejecución de la consulta pasando los valores en el orden correcto
    const result = await pool.query(query, [
        nombre,
        apellido,
        email,
        telefono,
        cargo,
        userId
    ]);

    // Retorna el resultado de la actualización
    return result.rows[0];
}
    
export const updateUserCompanyRepository = async ({
    userId,
    nombre_emprendimiento,
    razon_social,
    cuil_cuit,
    direccion,
    rubro,
    sitio_web,
}) => {

    // Actualiza todos los campos recibidos en la tabla usuarios
    const query = `
        UPDATE usuarios
        SET 
            nombre_emprendimiento = $1,
            razon_social = $2,
            cuil_cuit = $3,
            direccion = $4,
            rubro = $5,
            sitio_web = $6,
            updated_at = NOW()
        WHERE id = $7 AND deleted_at IS NULL
        RETURNING id, 
            nombre_emprendimiento,
            razon_social, 
            cuil_cuit, 
            direccion, 
            rubro, 
            sitio_web
    `;

    // Ejecución de la consulta pasando los valores en el orden correcto
    const result = await pool.query(query, [
        nombre_emprendimiento,
        razon_social,
        cuil_cuit,
        direccion,
        rubro,
        sitio_web,
        userId
    ]);

    // Retorna el resultado de la actualización
    return result.rows[0];
}

export const updateUserLogoRepository = async ({
    id,
    logo_url,
    logo_public_id
}) => {

    // Actualiza todos los campos recibidos en la tabla usuarios
    const query = `
        UPDATE usuarios
        SET 
            logo_url = $1,
            logo_public_id = $2,
            updated_at = NOW()
        WHERE id = $3 AND deleted_at IS NULL
        RETURNING id, logo_url, logo_public_id
    `;

    // Ejecución de la consulta pasando los valores en el orden correcto
    const result = await pool.query(query, [
        logo_url,
        logo_public_id,
        id
    ]);

    // Retorna el resultado de la actualización
    return result.rows[0];
}

export const updatePasswordRepository = async (
    id,
    passwordHash
) => {

    const query = `
        UPDATE usuarios
        SET 
            password_hash = $1,
            updated_at = NOW()
        WHERE id = $2
        AND deleted_at IS NULL
        RETURNING id;
    `;

    const result = await pool.query(
        query,
        [
            passwordHash,
            id
        ]
    );

    return result.rows[0];
};
