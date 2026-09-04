-- ============================================================
-- VALORA · Esquema de base de datos (PostgreSQL)
-- Este esquema representa el modelo de datos que hoy simula
-- src/services/api.js con localStorage. Al construir el backend
-- real, cada función de api.js pasa a ser un endpoint que
-- consulta estas tablas.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- EMPRESAS ----------
CREATE TABLE empresas (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          VARCHAR(150) NOT NULL,
    rubro           VARCHAR(100),
    logo_url        TEXT,
    cuit            VARCHAR(30),
    direccion       VARCHAR(200),
    telefono        VARCHAR(30),
    email           VARCHAR(150),
    sitio_web       VARCHAR(150),
    moneda          VARCHAR(10) DEFAULT 'ARS',
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- USUARIOS ----------
CREATE TABLE usuarios (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id           UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre               VARCHAR(100) NOT NULL,
    apellido             VARCHAR(100),
    cargo                VARCHAR(100) DEFAULT 'Administrador',
    email                VARCHAR(150) NOT NULL UNIQUE,
    password_hash        TEXT NOT NULL,
    telefono             VARCHAR(30),
    avatar_url           TEXT,
    rol                  VARCHAR(20) NOT NULL DEFAULT 'owner', -- owner | admin | miembro
    onboarding_completo  BOOLEAN NOT NULL DEFAULT false,
    two_factor_activo    BOOLEAN NOT NULL DEFAULT false,
    notif_email          BOOLEAN NOT NULL DEFAULT true,
    notif_push           BOOLEAN NOT NULL DEFAULT true,
    notif_whatsapp       BOOLEAN NOT NULL DEFAULT false,
    tema                 VARCHAR(10) NOT NULL DEFAULT 'claro', -- claro | oscuro
    creado_en            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_usuarios_empresa ON usuarios(empresa_id);

-- ---------- CLIENTES (cartera del emprendedor) ----------
CREATE TABLE clientes (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id       UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nombre           VARCHAR(150) NOT NULL,
    empresa_cliente  VARCHAR(150),
    email            VARCHAR(150),
    telefono         VARCHAR(30),
    direccion        VARCHAR(200),
    creado_en        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clientes_empresa ON clientes(empresa_id);

-- ---------- ITEMS (productos y servicios reutilizables) ----------
CREATE TABLE items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('producto', 'servicio')),
    nombre      VARCHAR(200) NOT NULL,
    precio      NUMERIC(14,2) NOT NULL,
    unidad      VARCHAR(30), -- hora, proyecto, mes, unidad, etc.
    stock       INTEGER, -- solo aplica a tipo = 'producto'; NULL para servicios
    activo      BOOLEAN NOT NULL DEFAULT true,
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_items_empresa ON items(empresa_id);

-- ---------- PRESUPUESTOS ----------
CREATE TABLE presupuestos (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id          UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    cliente_id          UUID NOT NULL REFERENCES clientes(id),
    numero              VARCHAR(20) NOT NULL,   -- P-0001, correlativo por empresa
    titulo              VARCHAR(200),           -- "Nombre del servicio" que ve el cliente
    observaciones       TEXT,
    estado              VARCHAR(20) NOT NULL DEFAULT 'borrador'
                         CHECK (estado IN ('borrador', 'pendiente', 'aprobado', 'rechazado')),
    monto_total         NUMERIC(14,2) NOT NULL,
    fecha_creacion      TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_vencimiento   TIMESTAMPTZ NOT NULL,
    comentario_cliente  TEXT,
    token_publico       UUID NOT NULL DEFAULT uuid_generate_v4(), -- para el link compartible
    creado_por          UUID REFERENCES usuarios(id),
    presupuesto_origen_id UUID REFERENCES presupuestos(id), -- si este presupuesto es una versión modificada de uno rechazado
    UNIQUE (empresa_id, numero)
);

CREATE INDEX idx_presupuestos_empresa ON presupuestos(empresa_id);
CREATE INDEX idx_presupuestos_cliente ON presupuestos(cliente_id);
CREATE INDEX idx_presupuestos_token ON presupuestos(token_publico);
CREATE INDEX idx_presupuestos_origen ON presupuestos(presupuesto_origen_id);

-- ---------- ITEMS DE CADA PRESUPUESTO (detalle) ----------
CREATE TABLE presupuesto_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presupuesto_id  UUID NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    item_id         UUID REFERENCES items(id),
    nombre          VARCHAR(200) NOT NULL, -- copia al momento de crear (histórico)
    cantidad        NUMERIC(10,2) NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(14,2) NOT NULL
);

CREATE INDEX idx_presupuesto_items_presupuesto ON presupuesto_items(presupuesto_id);

-- ---------- HISTORIAL DE ESTADOS (auditoría / línea de tiempo) ----------
CREATE TABLE presupuesto_historial (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presupuesto_id  UUID NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo    VARCHAR(20) NOT NULL,
    comentario      TEXT,
    origen          VARCHAR(20) NOT NULL DEFAULT 'cliente', -- cliente | usuario | sistema
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_historial_presupuesto ON presupuesto_historial(presupuesto_id);

-- ---------- TOKENS DE RECUPERACIÓN DE CONTRASEÑA ----------
-- Al conectar un backend real, "Olvidé mi contraseña" pasa a generar un
-- registro acá con expiración corta y a enviar el link por email; hoy
-- src/services/api.js lo resuelve directo contra localStorage sin token.
CREATE TABLE password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token       UUID NOT NULL DEFAULT uuid_generate_v4(),
    usado       BOOLEAN NOT NULL DEFAULT false,
    expira_en   TIMESTAMPTZ NOT NULL,
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_password_reset_usuario ON password_reset_tokens(usuario_id);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);

-- ---------- VISTA: actividad semanal (para el dashboard de Home) ----------
CREATE VIEW vista_actividad_semanal AS
SELECT
    empresa_id,
    date_trunc('week', fecha_creacion) AS semana,
    COUNT(*) AS cantidad_presupuestos,
    SUM(monto_total) FILTER (WHERE estado = 'aprobado') AS monto_confirmado
FROM presupuestos
GROUP BY empresa_id, date_trunc('week', fecha_creacion);
