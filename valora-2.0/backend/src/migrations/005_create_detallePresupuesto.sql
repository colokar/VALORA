-- ==================================================
-- TABLA: detalle_presupuesto
-- Guarda cada línea de ítem dentro de un presupuesto
-- (relación 1 presupuesto -> N ítems)
-- ==================================================

CREATE TABLE IF NOT EXISTS detalle_presupuesto(

    -- Clave Primaria: Genera un UUID único automáticamente usando la función nativa de Postgres
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Presupuesto al que pertenece esta línea (Clave Foránea hacia la tabla presupuestos)
    presupuesto_id UUID NOT NULL,

    -- Ítem cotizado en esta línea (Clave Foránea hacia la tabla items)
    item_id UUID NOT NULL,

    -- Nombre del ítem al momento de crear el presupuesto
    nombre_item VARCHAR(150) NOT NULL,

    -- Cantidad cotizada de este ítem
    cantidad INTEGER NOT NULL DEFAULT 1,

    -- Precio unitario al momento de cotizar
    precio_unitario NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Subtotal de la línea: cantidad * precio_unitario
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,

    -- Auditoría: Fecha de inserción del registro en la base de datos
    created_at TIMESTAMP DEFAULT NOW(),

    -- Auditoría: Fecha de la última actualización del registro
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Soft Delete: Fecha de eliminación lógica
    deleted_at TIMESTAMP,


    -- Relación con la tabla presupuestos: Si el presupuesto se elimina, se borran sus líneas en cascada
    CONSTRAINT fk_detalle_presupuesto_presupuesto
        FOREIGN KEY (presupuesto_id)
        REFERENCES presupuestos(id)
        ON DELETE CASCADE,


    -- Relación con la tabla items: Si el ítem se elimina, no permite borrar si tiene presupuestos asociados para proteger el historial de cotizaciones
    CONSTRAINT fk_detalle_presupuesto_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE RESTRICT
);