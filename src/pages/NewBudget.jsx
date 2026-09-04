import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Plus, Trash2, Search, ChevronDown, Eye, UserPlus, FileText, Calendar, RefreshCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import * as api from "../services/api";
import ShareBudgetModal from "../components/ShareBudgetModal";
import ClientPickerModal from "../components/ClientPickerModal";
import DaysDropdown from "../components/DaysDropdown";
import Modal from "../components/Modal";
import { Loader } from "../components/Common";
import { formatMonto } from "../utils/format";

export default function NewBudget() {
  const { usuario } = useAuth();
  const { empresa, clientes, items, recargarClientes, recargarPresupuestos } = useData();
  const navigate = useNavigate();
  const { id } = useParams(); // presente = editando un borrador existente
  const [searchParams] = useSearchParams();
  const basadoEnId = searchParams.get("basadoEn"); // presente = nuevo presupuesto a partir de uno rechazado

  const modoEdicion = !!id;

  const [cargandoInicial, setCargandoInicial] = useState(modoEdicion || !!basadoEnId);
  const [numero, setNumero] = useState("");
  const [cliente, setCliente] = useState(null);
  const [nombreServicio, setNombreServicio] = useState("");
  const [lineas, setLineas] = useState([]); // { itemId, nombre, cantidad, precio }
  const [vencimientoDias, setVencimientoDias] = useState(30);
  const [observaciones, setObservaciones] = useState("");
  const [obsAbierta, setObsAbierta] = useState(false);
  const [origen, setOrigen] = useState(null); // presupuesto rechazado del cual se parte

  const [pickerCliente, setPickerCliente] = useState(false);
  const [pickerItem, setPickerItem] = useState(false);
  const [busquedaItem, setBusquedaItem] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [presupuestoCreado, setPresupuestoCreado] = useState(null);

  // Número correlativo para presupuestos nuevos (no aplica si estamos editando uno existente)
  useEffect(() => {
    if (!modoEdicion) api.siguienteNumero(usuario.empresaId).then(setNumero);
  }, [usuario.empresaId, modoEdicion]);

  // Cargar un borrador existente para editarlo
  useEffect(() => {
    if (!modoEdicion) return;
    api.getPresupuesto(id).then((p) => {
      if (!p || p.estado !== "borrador") {
        navigate(p ? `/presupuesto/${id}` : "/historial");
        return;
      }
      setNumero(p.numero);
      setCliente(p.cliente || null);
      setNombreServicio(p.nombreServicio || "");
      setObservaciones(p.observaciones || "");
      setLineas(p.itemsDetalle.map((it) => ({ itemId: it.itemId, nombre: it.nombre, cantidad: it.cantidad, precio: it.precio })));
      const dias = Math.round((new Date(p.fechaVencimiento) - new Date(p.fechaCreacion)) / (1000 * 60 * 60 * 24));
      setVencimientoDias(dias > 0 ? dias : 30);
      if (p.presupuestoOrigenId) setOrigen({ id: p.presupuestoOrigenId, numero: p.presupuestoOrigenNumero });
      setCargandoInicial(false);
    });
  }, [modoEdicion, id, navigate]);

  // Prellenar a partir de un presupuesto rechazado
  useEffect(() => {
    if (modoEdicion || !basadoEnId) return;
    api.getPresupuesto(basadoEnId).then((p) => {
      if (!p) {
        setCargandoInicial(false);
        return;
      }
      setCliente(p.cliente || null);
      setNombreServicio(p.nombreServicio || "");
      setObservaciones(p.observaciones || "");
      setLineas(p.itemsDetalle.map((it) => ({ itemId: it.itemId, nombre: it.nombre, cantidad: it.cantidad, precio: it.precio })));
      setOrigen({ id: p.id, numero: p.numero, comentario: p.comentarioCliente });
      setCargandoInicial(false);
    });
  }, [modoEdicion, basadoEnId]);

  const itemsActivos = items.filter((i) => i.activo);
  const itemsFiltrados = itemsActivos.filter((i) => i.nombre.toLowerCase().includes(busquedaItem.toLowerCase()));

  const total = useMemo(() => lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0), [lineas]);

  function agregarItem(item) {
    if (lineas.some((l) => l.itemId === item.id)) {
      setPickerItem(false);
      return;
    }
    setLineas([...lineas, { itemId: item.id, nombre: item.nombre, cantidad: 1, precio: item.precio }]);
    setPickerItem(false);
    setBusquedaItem("");
  }

  function actualizarLinea(itemId, campo, valor) {
    setLineas((ls) => ls.map((l) => (l.itemId === itemId ? { ...l, [campo]: Math.max(0, Number(valor) || 0) } : l)));
  }

  function quitarLinea(itemId) {
    setLineas((ls) => ls.filter((l) => l.itemId !== itemId));
  }

  async function crearClienteRapido(datos) {
    const nuevo = await api.crearCliente(usuario.empresaId, datos);
    await recargarClientes();
    return nuevo;
  }

  async function guardar(estado) {
    setGuardando(true);
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + Number(vencimientoDias));

    const datos = {
      clienteId: cliente.id,
      monto: total,
      nombreServicio,
      observaciones,
      fechaVencimiento: fechaVencimiento.toISOString(),
      estado,
      items: lineas.map((l) => ({ itemId: l.itemId, cantidad: l.cantidad, precio: l.precio })),
    };

    let nuevo;
    if (modoEdicion) {
      nuevo = await api.actualizarPresupuesto(id, datos);
    } else {
      nuevo = await api.crearPresupuesto(usuario.empresaId, {
        ...datos,
        creadoPor: usuario.id,
        ...(origen ? { presupuestoOrigenId: origen.id } : {}),
      });
    }
    await recargarPresupuestos();
    setGuardando(false);

    if (estado === "borrador") navigate("/historial");
    else setPresupuestoCreado(nuevo);
  }

  const puedeGenerar = cliente && nombreServicio && lineas.length > 0;

  if (cargandoInicial) return <div className="app-shell"><Loader /></div>;

  return (
    <div className="app-shell">
      <div className="page-content px-5 pt-6">
        <h1 className="vx-page-title mb-2">
          {modoEdicion ? "Editar presupuesto" : origen ? "Presupuesto modificado" : "Nuevo presupuesto"}
        </h1>

        {origen && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl2 p-3.5 mb-6 flex gap-2.5">
            <RefreshCcw size={16} className="text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-gray-500">
              <p>
                Basado en <span className="font-semibold text-gray-700">{origen.numero}</span>, que fue rechazado.
              </p>
              {origen.comentario && <p className="mt-1">Comentario del cliente: "{origen.comentario}"</p>}
            </div>
          </div>
        )}

        <h2 className="vx-section-title mb-3">Datos básicos</h2>

        {/* Cliente */}
        <div className="mb-4">
          <label className="vx-label vx-label-required block mb-1.5">Cliente</label>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setPickerCliente(true)} className="vx-input-row flex-1 text-left">
              <Search size={16} className="text-gray-400 shrink-0" />
              <span className={cliente ? "text-gray-700" : "text-gray-400"}>
                {cliente ? `${cliente.nombre}${cliente.empresaCliente ? " — " + cliente.empresaCliente : ""}` : "Buscar o crear cliente..."}
              </span>
            </button>
            <button onClick={() => setPickerCliente(true)} className="vx-btn-icon-primary">
              <UserPlus size={19} />
            </button>
          </div>
        </div>

        {/* Nombre del servicio */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <label className="vx-label vx-label-required">Nombre del servicio</label>
            <span className="text-sm font-semibold text-primary">#{numero}</span>
          </div>
          <input
            value={nombreServicio}
            onChange={(e) => setNombreServicio(e.target.value)}
            placeholder="Agregar servicio o producto"
            className="vx-input"
          />
        </div>

        {/* Ítems */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="vx-section-title">Ítems del presupuesto</h2>
          <button onClick={() => setPickerItem(true)} className="flex items-center gap-1 vx-btn-outline-primary py-1.5 px-3">
            <Plus size={14} /> Agregar ítem
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {lineas.length === 0 && (
            <div className="vx-card p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Ítem</p>
              <div className="grid grid-cols-3 text-center mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cantidad</p>
                  <p className="text-sm font-semibold text-gray-400">0</p>
                </div>
                <div className="border-x border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Precio unitario</p>
                  <p className="text-sm font-semibold text-gray-400">$0,00</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Subtotal</p>
                  <p className="text-sm font-semibold text-gray-400">$0,00</p>
                </div>
              </div>
              <button disabled className="w-full flex items-center justify-center gap-1.5 border border-rejected/30 text-rejected/50 rounded-xl py-2 text-sm font-medium">
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          )}

          {lineas.map((l) => (
            <div key={l.itemId} className="vx-card p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">{l.nombre}</p>
              <div className="grid grid-cols-3 text-center mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cantidad</p>
                  <input
                    type="number"
                    min={0}
                    value={l.cantidad}
                    onChange={(e) => actualizarLinea(l.itemId, "cantidad", e.target.value)}
                    className="w-full text-center text-sm font-semibold text-primary focus:outline-none"
                  />
                </div>
                <div className="border-x border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Precio unitario</p>
                  <input
                    type="number"
                    min={0}
                    value={l.precio}
                    onChange={(e) => actualizarLinea(l.itemId, "precio", e.target.value)}
                    className="w-full text-center text-sm font-semibold text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Subtotal</p>
                  <p className="text-sm font-semibold text-primary">{formatMonto(l.precio * l.cantidad, empresa?.moneda)}</p>
                </div>
              </div>
              <button
                onClick={() => quitarLinea(l.itemId)}
                className="w-full flex items-center justify-center gap-1.5 border border-rejected/40 text-rejected rounded-xl py-2 text-sm font-medium active:scale-[0.98] transition-transform"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Fecha + Validez */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="vx-label block mb-1.5">Fecha</label>
            <div className="vx-input-row">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700">{new Date().toLocaleDateString("es-AR")}</span>
            </div>
          </div>
          <div>
            <label className="vx-label block mb-1.5">Validez del presupuesto</label>
            <DaysDropdown value={vencimientoDias} onChange={setVencimientoDias} />
          </div>
        </div>

        {/* Observaciones */}
        <div className="vx-card mb-6 overflow-hidden">
          <button
            onClick={() => setObsAbierta((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-3.5"
          >
            <FileText size={18} className="text-primary shrink-0" />
            <span className="flex-1 text-left">
              <span className="block text-sm font-semibold text-gray-700">Observaciones</span>
              {!obsAbierta && (
                <span className="block text-xs text-gray-400 truncate">{observaciones || "Sin observaciones"}</span>
              )}
            </span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${obsAbierta ? "rotate-180" : ""}`} />
          </button>
          {obsAbierta && (
            <div className="px-4 pb-4">
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej: Si contrata se descuenta la visita."
                rows={3}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-6">
          <span className="text-base font-semibold text-gray-500">Total:</span>
          <span className="text-xl font-extrabold text-primary">{formatMonto(total, empresa?.moneda)}</span>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => guardar("borrador")}
            disabled={!cliente || guardando}
            className="flex-1 flex items-center justify-center gap-2 vx-btn-outline"
          >
            <Eye size={16} /> Guardar borrador
          </button>
          <button
            onClick={() => guardar("pendiente")}
            disabled={!puedeGenerar || guardando}
            className="flex-1 vx-btn-primary"
          >
            {guardando ? "Generando..." : "Generar presupuesto"}
          </button>
        </div>
      </div>

      <ClientPickerModal
        open={pickerCliente}
        onClose={() => setPickerCliente(false)}
        clientes={clientes}
        onSeleccionar={setCliente}
        onCrear={crearClienteRapido}
      />

      <Modal open={pickerItem} onClose={() => setPickerItem(false)} title="Agregar ítem">
        <div className="vx-input-row mb-3">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            autoFocus
            value={busquedaItem}
            onChange={(e) => setBusquedaItem(e.target.value)}
            placeholder="Buscar producto o servicio guardado..."
            className="w-full text-sm focus:outline-none bg-transparent"
          />
        </div>
        <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
          {itemsFiltrados.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">
              Sin resultados. Agregalo en Perfil &gt; Mis productos y servicios.
            </p>
          )}
          {itemsFiltrados.map((item) => (
            <button
              key={item.id}
              onClick={() => agregarItem(item)}
              className="flex items-center justify-between border border-gray-100 rounded-xl px-3 py-2.5 text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">{item.nombre}</p>
                <p className="text-[11px] text-gray-400 capitalize">
                  {item.tipo} · por {item.unidad}
                  {item.tipo === "producto" && (
                    <> · stock: {item.stock ?? 0}</>
                  )}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">{formatMonto(item.precio, empresa?.moneda)}</span>
            </button>
          ))}
        </div>
      </Modal>

      <ShareBudgetModal
        open={!!presupuestoCreado}
        onClose={() => navigate("/home")}
        presupuesto={presupuestoCreado}
        empresa={empresa}
      />
    </div>
  );
}
