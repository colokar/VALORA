// Capa de "API" simulada.
// Toda la app habla con este archivo, nunca con localStorage directamente.
// Esto permite reemplazar la implementación por fetch() a un backend real
// sin tocar el resto del código (misma firma de funciones, todas devuelven Promises).

import { seedUsers, seedEmpresas, seedClientes, seedItems, seedPresupuestos } from "../data/seed";

const DB_KEY = "valora_db_v1";
const SESSION_KEY = "valora_session";

function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const initial = {
    usuarios: seedUsers,
    empresas: seedEmpresas,
    clientes: seedClientes,
    items: seedItems,
    presupuestos: seedPresupuestos,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ---------- SESIÓN ----------
export async function login(email, password) {
  await delay();
  const db = loadDB();
  const user = db.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error("Email o contraseña incorrectos");
  localStorage.setItem(SESSION_KEY, user.id);
  return sanitizeUser(user);
}

export async function registrar({ nombre, apellido, empresaNombre, email, password }) {
  await delay();
  const db = loadDB();
  if (db.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Ya existe una cuenta con ese email");
  }
  const empresaId = uid("emp");
  db.empresas.push({
    id: empresaId, nombre: empresaNombre || "Mi empresa", rubro: "", logo: "", cuit: "",
    direccion: "", telefono: "", email: "", sitioWeb: "", moneda: "ARS",
  });
  const nuevo = {
    id: uid("u"), nombre, apellido, cargo: "Administrador", email, password, telefono: "", avatar: "",
    onboardingCompleto: false, empresaId, rol: "owner", twoFactor: false,
    notificaciones: { email: true, push: true, whatsapp: false },
    apariencia: { tema: "claro" },
  };
  db.usuarios.push(nuevo);
  saveDB(db);
  localStorage.setItem(SESSION_KEY, nuevo.id);
  return sanitizeUser(nuevo);
}

export async function getSesionActual() {
  await delay(120);
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const db = loadDB();
  const user = db.usuarios.find((u) => u.id === id);
  return user ? sanitizeUser(user) : null;
}

export async function cerrarSesion() {
  await delay(100);
  localStorage.removeItem(SESSION_KEY);
}

function sanitizeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// ---------- RECUPERACIÓN DE CONTRASEÑA ----------
// MVP sin backend de envío de emails: verificamos que el correo exista y
// dejamos restablecer la contraseña directamente. Al conectar un backend
// real, esto pasa a ser un flujo de dos pasos con un mail que contiene un
// link/token temporal (ver database/schema.sql para agregar una tabla de
// tokens de recuperación).
export async function solicitarRecuperacion(email) {
  await delay();
  const db = loadDB();
  const user = db.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("No encontramos una cuenta con ese email");
  return true;
}

export async function restablecerPassword(email, nuevaPassword) {
  await delay();
  const db = loadDB();
  const user = db.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("No encontramos una cuenta con ese email");
  user.password = nuevaPassword;
  saveDB(db);
  return true;
}

// ---------- USUARIO / ONBOARDING ----------
export async function completarOnboarding(userId, datosEmpresa) {
  await delay();
  const db = loadDB();
  const user = db.usuarios.find((u) => u.id === userId);
  user.onboardingCompleto = true;
  const empresa = db.empresas.find((e) => e.id === user.empresaId);
  Object.assign(empresa, datosEmpresa);
  saveDB(db);
  return sanitizeUser(user);
}

export async function actualizarUsuario(userId, cambios) {
  await delay();
  const db = loadDB();
  const user = db.usuarios.find((u) => u.id === userId);
  Object.assign(user, cambios);
  saveDB(db);
  return sanitizeUser(user);
}

export async function cambiarPassword(userId, actual, nueva) {
  await delay();
  const db = loadDB();
  const user = db.usuarios.find((u) => u.id === userId);
  if (user.password !== actual) throw new Error("La contraseña actual no es correcta");
  user.password = nueva;
  saveDB(db);
  return true;
}

export async function getUsuariosEquipo(empresaId) {
  await delay(150);
  const db = loadDB();
  return db.usuarios.filter((u) => u.empresaId === empresaId).map(sanitizeUser);
}

export async function crearUsuarioEquipo(empresaId, { nombre, email, password, rol = "miembro" }) {
  await delay();
  const db = loadDB();
  if (db.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Ya existe un usuario con ese email");
  }
  const nuevo = {
    id: uid("u"), nombre, apellido: "", cargo: rol === "admin" ? "Administrador" : "", email, password, telefono: "", avatar: "",
    onboardingCompleto: true, empresaId, rol, twoFactor: false,
    notificaciones: { email: true, push: true, whatsapp: false },
    apariencia: { tema: "claro" },
  };
  db.usuarios.push(nuevo);
  saveDB(db);
  return sanitizeUser(nuevo);
}

export async function eliminarUsuarioEquipo(userId) {
  await delay();
  const db = loadDB();
  db.usuarios = db.usuarios.filter((u) => u.id !== userId);
  saveDB(db);
  return true;
}

// ---------- EMPRESA ----------
export async function getEmpresa(empresaId) {
  await delay(150);
  const db = loadDB();
  return db.empresas.find((e) => e.id === empresaId);
}

export async function actualizarEmpresa(empresaId, cambios) {
  await delay();
  const db = loadDB();
  const empresa = db.empresas.find((e) => e.id === empresaId);
  Object.assign(empresa, cambios);
  saveDB(db);
  return empresa;
}

// ---------- CLIENTES ----------
export async function getClientes(empresaId) {
  await delay(150);
  const db = loadDB();
  return db.clientes.filter((c) => c.empresaId === empresaId);
}

export async function crearCliente(empresaId, datos) {
  await delay();
  const db = loadDB();
  const nuevo = { id: uid("c"), empresaId, ...datos };
  db.clientes.push(nuevo);
  saveDB(db);
  return nuevo;
}

export async function actualizarCliente(clienteId, cambios) {
  await delay();
  const db = loadDB();
  const cliente = db.clientes.find((c) => c.id === clienteId);
  Object.assign(cliente, cambios);
  saveDB(db);
  return cliente;
}

export async function eliminarCliente(clienteId) {
  await delay();
  const db = loadDB();
  db.clientes = db.clientes.filter((c) => c.id !== clienteId);
  saveDB(db);
  return true;
}

// ---------- ITEMS (productos y servicios) ----------
export async function getItems(empresaId) {
  await delay(150);
  const db = loadDB();
  return db.items.filter((i) => i.empresaId === empresaId);
}

export async function crearItem(empresaId, datos) {
  await delay();
  const db = loadDB();
  const nuevo = { id: uid("i"), empresaId, activo: true, ...datos };
  db.items.push(nuevo);
  saveDB(db);
  return nuevo;
}

export async function actualizarItem(itemId, cambios) {
  await delay();
  const db = loadDB();
  const item = db.items.find((i) => i.id === itemId);
  Object.assign(item, cambios);
  saveDB(db);
  return item;
}

export async function eliminarItem(itemId) {
  await delay();
  const db = loadDB();
  db.items = db.items.filter((i) => i.id !== itemId);
  saveDB(db);
  return true;
}

// ---------- PRESUPUESTOS ----------
export async function getPresupuestos(empresaId) {
  await delay(200);
  const db = loadDB();
  const presupuestos = db.presupuestos.filter((p) => p.empresaId === empresaId);
  return presupuestos.map((p) => enrichPresupuesto(p, db));
}

export async function getPresupuesto(id) {
  await delay(150);
  const db = loadDB();
  const p = db.presupuestos.find((p) => p.id === id);
  return p ? enrichPresupuesto(p, db) : null;
}

function enrichPresupuesto(p, db) {
  const cliente = db.clientes.find((c) => c.id === p.clienteId);
  const empresa = db.empresas.find((e) => e.id === p.empresaId);
  const itemsDetalle = p.items.map((it) => {
    const item = db.items.find((i) => i.id === it.itemId);
    return { ...it, nombre: item?.nombre || "Ítem eliminado", unidad: item?.unidad || "" };
  });
  const dias = Math.ceil((new Date(p.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24));
  const presupuestoOrigen = p.presupuestoOrigenId
    ? db.presupuestos.find((o) => o.id === p.presupuestoOrigenId)
    : null;
  return {
    ...p,
    cliente,
    empresa,
    itemsDetalle,
    diasParaVencer: dias,
    presupuestoOrigenNumero: presupuestoOrigen?.numero || null,
  };
}

export async function crearPresupuesto(empresaId, datos) {
  await delay(400);
  const db = loadDB();
  const ultimosNumeros = db.presupuestos
    .filter((p) => p.empresaId === empresaId)
    .map((p) => parseInt(p.numero.replace("P-", ""), 10));
  const siguiente = (Math.max(0, ...ultimosNumeros) + 1).toString().padStart(4, "0");
  const nuevo = {
    id: uid("p"),
    empresaId,
    numero: `P-${siguiente}`,
    fechaCreacion: new Date().toISOString(),
    estado: "pendiente",
    comentarioCliente: "",
    nombreServicio: "",
    observaciones: "",
    ...datos,
  };
  db.presupuestos.push(nuevo);
  saveDB(db);
  return enrichPresupuesto(nuevo, db);
}

export async function actualizarPresupuesto(id, cambios) {
  await delay(250);
  const db = loadDB();
  const p = db.presupuestos.find((p) => p.id === id);
  Object.assign(p, cambios);
  saveDB(db);
  return enrichPresupuesto(p, db);
}

export async function eliminarPresupuesto(id) {
  await delay(250);
  const db = loadDB();
  db.presupuestos = db.presupuestos.filter((p) => p.id !== id);
  saveDB(db);
  return true;
}

export async function siguienteNumero(empresaId) {
  await delay(80);
  const db = loadDB();
  const ultimosNumeros = db.presupuestos
    .filter((p) => p.empresaId === empresaId)
    .map((p) => parseInt(p.numero.replace("P-", ""), 10));
  return `P-${(Math.max(0, ...ultimosNumeros) + 1).toString().padStart(4, "0")}`;
}

export async function actualizarEstadoPresupuesto(id, estado, comentario = "") {
  await delay(200);
  const db = loadDB();
  const p = db.presupuestos.find((p) => p.id === id);
  p.estado = estado;
  if (comentario) p.comentarioCliente = comentario;
  saveDB(db);
  return enrichPresupuesto(p, db);
}
