-- ==================================================
-- TABLA: PRESUPUESTOS
-- Guarda los presupuestos creados por cada usuario para sus clientes
-- ==================================================

CREATE TABLE IF NOT EXISTS presupuestos(

    -- Clave Primaria: Genera un UUID único automáticamente usando la función nativa de Postgres
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Usuario dueño del presupuesto (Clave Foránea hacia la tabla usuarios)
    usuario_id UUID NOT NULL, 

    -- Cliente al que se le emite el presupuesto (Clave Foránea hacia la tabla clientes)
    cliente_id UUID NOT NULL, 

    -- Número del presupuesto (ej: P-001)
    numero VARCHAR(20) NOT NULL,

    -- Fecha de creación del presupuesto
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Subtotal: suma de todos los ítems antes del total final
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Total: monto final del presupuesto
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Estado actual del presupuesto
    estado VARCHAR(50) DEFAULT 'Borrador'
        CHECK (estado IN ('Borrador', 'Guardado', 'Enviado', 'Aceptado', 'Rechazado')),

    -- URL pública del documento PDF almacenado en Cloudinary
    pdf_url TEXT,

    -- Identificador único de Cloudinary para poder borrar o reemplazar el PDF
    pdf_public_id TEXT,

    -- Fecha límite de validez del presupuesto
    fecha_vencimiento DATE,

    -- Observaciones adicionales del presupuesto
    observaciones TEXT,

    -- Auditoría: Fecha de inserción del registro en la base de datos
    created_at TIMESTAMP DEFAULT NOW(),

    -- Auditoría: Fecha de la última actualización del registro
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Soft Delete: Fecha de eliminación lógica
    deleted_at TIMESTAMP,


    -- Relación con la tabla usuarios: Si el usuario se elimina, se borran sus presupuestos en cascada
    CONSTRAINT fk_presupuesto_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,


    -- Relación con la tabla clientes: Si el cliente se elimina, se borran sus presupuestos en cascada
    CONSTRAINT fk_presupuesto_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE CASCADE
);