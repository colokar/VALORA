// Datos ficticios iniciales. Simulan lo que vendría de una base de datos real.
// Ver /database/schema.sql para el modelo relacional equivalente.

export const seedUsers = [
  {
    id: "u-admin",
    nombre: "Admin",
    apellido: "Principal",
    cargo: "Administrador",
    email: "admin",
    password: "admin", // MVP: texto plano, en producción usar hash (bcrypt) en backend
    telefono: "+54 9 11 5555-0100",
    avatar: "",
    onboardingCompleto: true,
    empresaId: "emp-1",
    rol: "owner",
    twoFactor: false,
    notificaciones: { email: true, push: true, whatsapp: false },
    apariencia: { tema: "claro" },
  },
];

export const seedEmpresas = [
  {
    id: "emp-1",
    nombre: "Estudio Vega",
    rubro: "Diseño y desarrollo web",
    logo: "",
    cuit: "20-12345678-3",
    direccion: "Av. Corrientes 1234, CABA",
    telefono: "+54 9 11 5555-0100",
    email: "hola@estudiovega.com",
    sitioWeb: "www.estudiovega.com",
    moneda: "ARS",
  },
];

export const seedClientes = [
  { id: "c-1", empresaId: "emp-1", nombre: "María Fernández", empresaCliente: "Panadería La Espiga", email: "maria@laespiga.com", telefono: "+54 9 11 4444-1111", direccion: "San Martín 450, CABA" },
  { id: "c-2", empresaId: "emp-1", nombre: "Julián Ortiz", empresaCliente: "Ortiz & Asociados", email: "julian@ortizyasoc.com", telefono: "+54 9 11 4444-2222", direccion: "Belgrano 890, CABA" },
  { id: "c-3", empresaId: "emp-1", nombre: "Sofía Ramos", empresaCliente: "Estudio Ramos Arq.", email: "sofia@ramosarq.com", telefono: "+54 9 11 4444-3333", direccion: "Cabildo 2100, CABA" },
  { id: "c-4", empresaId: "emp-1", nombre: "Diego Molina", empresaCliente: "Molina Gastronomía", email: "diego@molinagastro.com", telefono: "+54 9 11 4444-4444", direccion: "Rivadavia 3300, CABA" },
  { id: "c-5", empresaId: "emp-1", nombre: "Camila Torres", empresaCliente: "Torres Fitness", email: "camila@torresfitness.com", telefono: "+54 9 11 4444-5555", direccion: "Las Heras 780, CABA" },
];

export const seedItems = [
  { id: "i-1", empresaId: "emp-1", tipo: "servicio", nombre: "Diseño de sitio web (5 secciones)", precio: 450000, unidad: "proyecto", activo: true },
  { id: "i-2", empresaId: "emp-1", tipo: "servicio", nombre: "Mantenimiento mensual", precio: 60000, unidad: "mes", activo: true },
  { id: "i-3", empresaId: "emp-1", tipo: "servicio", nombre: "Hora de consultoría", precio: 25000, unidad: "hora", activo: true },
  { id: "i-4", empresaId: "emp-1", tipo: "producto", nombre: "Hosting anual", precio: 80000, unidad: "año", activo: true, stock: 12 },
  { id: "i-5", empresaId: "emp-1", tipo: "servicio", nombre: "Identidad visual (logo + manual)", precio: 320000, unidad: "proyecto", activo: true },
  { id: "i-6", empresaId: "emp-1", tipo: "servicio", nombre: "Fotografía de producto (paquete x20)", precio: 150000, unidad: "paquete", activo: false },
];

// Helper para fechas relativas a "hoy" (se recalculan al cargar la app)
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const seedPresupuestos = [
  { id: "p-1006", empresaId: "emp-1", numero: "P-1006", clienteId: "c-1", fechaCreacion: daysFromNow(-1), fechaVencimiento: daysFromNow(6), monto: 450000, estado: "pendiente", items: [{ itemId: "i-1", cantidad: 1, precio: 450000 }], comentarioCliente: "" },
  { id: "p-1005", empresaId: "emp-1", numero: "P-1005", clienteId: "c-2", fechaCreacion: daysFromNow(-2), fechaVencimiento: daysFromNow(-1), monto: 320000, estado: "aprobado", items: [{ itemId: "i-5", cantidad: 1, precio: 320000 }], comentarioCliente: "Perfecto, avancemos." },
  { id: "p-1004", empresaId: "emp-1", numero: "P-1004", clienteId: "c-3", fechaCreacion: daysFromNow(-3), fechaVencimiento: daysFromNow(4), monto: 60000, estado: "pendiente", items: [{ itemId: "i-2", cantidad: 1, precio: 60000 }], comentarioCliente: "" },
  { id: "p-1003", empresaId: "emp-1", numero: "P-1003", clienteId: "c-4", fechaCreacion: daysFromNow(-5), fechaVencimiento: daysFromNow(-2), monto: 150000, estado: "rechazado", items: [{ itemId: "i-6", cantidad: 1, precio: 150000 }], comentarioCliente: "Encontramos otra opción más económica." },
  { id: "p-1002", empresaId: "emp-1", numero: "P-1002", clienteId: "c-5", fechaCreacion: daysFromNow(-6), fechaVencimiento: daysFromNow(1), monto: 105000, estado: "borrador", items: [{ itemId: "i-3", cantidad: 3, precio: 25000 }, { itemId: "i-4", cantidad: 1, precio: 80000 }], comentarioCliente: "" },
  { id: "p-1001", empresaId: "emp-1", numero: "P-1001", clienteId: "c-1", fechaCreacion: daysFromNow(-10), fechaVencimiento: daysFromNow(-3), monto: 500000, estado: "aprobado", items: [{ itemId: "i-1", cantidad: 1, precio: 450000 }, { itemId: "i-3", cantidad: 2, precio: 25000 }], comentarioCliente: "Aprobado, gracias!" },
  { id: "p-1000", empresaId: "emp-1", numero: "P-1000", clienteId: "c-2", fechaCreacion: daysFromNow(-14), fechaVencimiento: daysFromNow(-8), monto: 60000, estado: "aprobado", items: [{ itemId: "i-2", cantidad: 1, precio: 60000 }], comentarioCliente: "" },
  { id: "p-0999", empresaId: "emp-1", numero: "P-0999", clienteId: "c-3", fechaCreacion: daysFromNow(-20), fechaVencimiento: daysFromNow(-15), monto: 320000, estado: "rechazado", items: [{ itemId: "i-5", cantidad: 1, precio: 320000 }], comentarioCliente: "" },
];
