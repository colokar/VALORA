-- ==================================================
-- TABLA: usuarios
-- Guarda los datos del emprendedor
-- En PostgreSQL podés usar UUID:
-- 550e8400-e29b-41d4-a716-446655440000
-- ==================================================

CREATE TABLE usuarios(
    -- Clave Primaria
    -- PostgreSQL genera el UUID Automaticamente
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Nombre del cliente
    nombre VARCHAR(100) NOT NULL,

    -- Apellido
    apellido VARCHAR(100),

    -- Telefono del usuaroio
    telefono VARCHAR(50),

    razon_social VARCHAR(255),

    -- Nombre del Emprendimiento
    nombre_emprendimiento VARCHAR(255) NOT NULL,

    -- Nombre del Usuario
    cargo VARCHAR(100),

    -- Cuil o Cuit del Usuario
    cuil_cuit VARCHAR(100),

    -- Direccion del Usuario
    direccion VARCHAR(100),

    -- Rubro del Usuario
    rubro VARCHAR(100),

    -- Sitio Web del Usuario
    sitio_web VARCHAR(200),

    -- Email para login y registro
    email VARCHAR(255) NOT NULL UNIQUE,

    activo BOOLEAN DEFAULT true,

    -- contraseña hasheada con bcrypt
    password_hash TEXT NOT NULL,

    -- URL del logo almacenado en cloudinary
    logo_url TEXT,

   -- ID de Cloudinary para poder eliminar o actualizar el logo
    logo_public_id TEXT,

    -- Fecha de creación del registro
    created_at TIMESTAMP DEFAULT NOW(),

    -- Fecha de modificación
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Soft Delete
    deleted_at TIMESTAMP
)