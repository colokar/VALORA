import pool from "../database/connection.js";


export const createPasswordResetRepository = async ({
    userId,
    token,
    expiresAt
}) => {

    const query = `
        INSERT INTO password_resets (
            user_id,
            token,
            expires_at
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `;


    const result = await pool.query(
        query,
        [
            userId,
            token,
            expiresAt
        ]
    );


    return result.rows[0];
};



export const findPasswordResetByTokenRepository = async (token) => {

    const query = `
        SELECT *
        FROM password_resets
        WHERE token = $1
        AND expires_at > NOW()
    `;


    const result = await pool.query(
        query,
        [token]
    );


    return result.rows[0];

};



export const deletePasswordResetRepository = async (token) => {

    await pool.query(
        `
        DELETE FROM password_resets
        WHERE token = $1
        `,
        [token]
    );

};