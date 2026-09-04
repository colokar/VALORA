# Valora — Generador de presupuestos (MVP)

Es un **prototipo funcional (front-end)**. Los datos se guardan en el
`localStorage` del navegador simulando una base de datos (ver `src/services/api.js`)
para que puedas navegar toda la app sin backend de momento. En `database/schema.sql` está el
modelo relacional pensado para cuando conectes un backend real (Postgres):
cada función de `api.js` está pensada para transformarse 1 a 1 en un endpoint.

---

## 1. Requisitos previos

Para verificar que Node está instalado, abrí una terminal y corré:

```bash
node -v
npm -v
```

## 2. Descomprimir y abrir el proyecto

1. Descomprimí el archivo `valora.zip` en la carpeta que prefieras.
2. Abrí VS Code.
3. `Archivo > Abrir carpeta...` y seleccioná la carpeta `valora` que descomprimiste.

## 3. Instalar dependencias

Abrí una terminal integrada en VS Code (`Ctrl + ñ` o menú
`Terminal > Nueva terminal`) y corré:

```bash
npm install
```

Esto va a descargar React, Tailwind, React Router, Recharts (gráficos) y
Lucide (íconos) — puede tardar 1-2 minutos.

## 4. Correr la app en modo desarrollo

```bash
npm run dev
```

La terminal va a mostrar algo como:

```
VITE ready
Local:   http://localhost:5173/
```

Abrí ese link en el navegador (Ctrl + clic sobre la URL en la terminal, o
copiala y pegala). Para ver el diseño móvil tal cual está pensado, achicá el
ancho de la ventana del navegador, o abrí las DevTools (F12) y activá el modo
responsive/dispositivo móvil (ícono de celular/tablet).

## 5. Usuario de prueba

Ya viene un usuario administrador cargado, con datos ficticios (clientes,
productos/servicios y presupuestos de ejemplo):

- Usuario: `admin`
- Contraseña: `admin`

Desde `Perfil > Usuarios del equipo` ese admin puede crear más usuarios.
También podés tocar "Creá una cuenta gratis" en el login para probar el flujo
completo de registro + onboarding desde cero.

## 6. Reiniciar los datos de ejemplo

Como todo se guarda en `localStorage`, si querés volver al estado inicial
(borrar presupuestos/clientes que hayas creado en tus pruebas), abrí las
DevTools del navegador (F12) → pestaña Application/Aplicación →
Local Storage → borrá las claves `valora_db_v1` y `valora_session`, y
recargá la página.

## 7. Generar una versión de producción (opcional)

```bash
npm run build
npm run preview
```

`npm run build` genera la carpeta `dist/` lista para subir a cualquier
hosting estático (Vercel, Netlify, etc). `npm run preview` te deja probarla
localmente antes de publicarla.

---

## Estructura del proyecto

```
src/
  components/     Componentes reutilizables (navbar, tarjetas, modales, etc.)
  context/        Estado global: sesión (AuthContext) y datos (DataContext)
  data/           Datos ficticios iniciales (seed)
  pages/          Pantallas principales (Home, Historial, Perfil, etc.)
  pages/perfil/   Subpantallas de Perfil (Mis datos, Mi empresa, Seguridad, ...)
  services/api.js Capa que simula el backend (localStorage). Reemplazar acá
                  por llamadas fetch() reales cuando exista un backend.
  utils/          Formato de moneda/fechas
database/
  schema.sql      Modelo de base de datos relacional (Postgres) equivalente
```

## Qué falta para llevarlo a producción

- Backend real (Node/Django/Rails, lo que prefieras) implementando los mismos
  endpoints que hoy simula `src/services/api.js`, sobre el esquema de
  `database/schema.sql`.
- Autenticación real (hash de contraseñas, tokens/JWT, recuperación de clave).
- Envío real del link/PDF por WhatsApp/Email (hoy el botón "Descargar PDF" abre
  una vista imprimible; conectando un backend se puede generar el PDF con una
  librería como Puppeteer o WeasyPrint).
- Notificaciones push/email/WhatsApp reales.
- Subida de logo de empresa y foto de perfil (hoy son solo iniciales).

## Mejoras sugeridas que ya están incluidas en este MVP

- Usuarios del equipo: el admin puede crear más usuarios de la misma empresa.
- Vista de impresión para el PDF con el mismo diseño que el link público, para
  que ambos formatos "tengan la misma estructura visual" tal como pediste.
- Toggle activo/inactivo en productos/servicios, para que solo los activos
  aparezcan al armar un presupuesto nuevo.
- Estados vacíos (empty state) en Home, Historial, Clientes e Ítems para
  cuando todavía no hay datos cargados.
