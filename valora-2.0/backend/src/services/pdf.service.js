import PDFDocument from "pdfkit";
import axios from "axios";

const AZUL = "#123B5D";
const GRIS = "#E8E8E8";

const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const dinero = (valor) => {
    return `$ ${Number(valor || 0).toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};

export const generarPresupuestoPDF = async (presupuesto) => {
    let logoBuffer = null;

    if (presupuesto.logo_url) {
        try {
            const response = await axios.get(presupuesto.logo_url, {
                responseType: "arraybuffer",
            });
            logoBuffer = Buffer.from(response.data);
        } catch (error) {}
    }

    return new Promise((resolve) => {
        const doc = new PDFDocument({ size: "A4", margin: 40 });
        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const logoX = 435;
        const logoY = 40;
        const logoWidth = 150;
        const logoHeight = 100;

        if (logoBuffer) {
            doc.image(logoBuffer, logoX, logoY, {
                fit: [logoWidth, logoHeight],
                align: "center",
                valign: "center",
            });
        }

        doc.fillColor("black").font("Helvetica-Bold").fontSize(24).text("PRESUPUESTO", 40, 45);

        doc.font("Helvetica").fontSize(10)
            .text(`# ${presupuesto.numero || "-"}`, 40, 78)
            .text(`Fecha: ${formatearFecha(presupuesto.fecha)}`, 40, 105)
            .text(`Vencimiento: ${formatearFecha(presupuesto.fecha_vencimiento)}`, 40, 123);

        doc.strokeColor("#ECECEC").lineWidth(0.5).moveTo(40, 150).lineTo(555, 150).stroke();

        doc.fillColor("black").font("Helvetica-Bold").fontSize(12).text("Cliente", 40, 165);

        doc.font("Helvetica").fontSize(10)
            .text(`${presupuesto.cliente_nombre || "-"} ${presupuesto.cliente_apellido || ""}`, 40, 185)
            .text(`${presupuesto.cliente_telefono || "Tel: -"}`, 40, 203)
            .text(`${presupuesto.cliente_email || "Email: -"}`, 40, 221);

        const empresa = presupuesto.nombre_emprendimiento || "Empresa";
        const nombre = `${presupuesto.usuario_nombre || ""} ${presupuesto.usuario_apellido || ""}`;
        const telefono = `${presupuesto.usuario_telefono || "Tel: -"}`;
        const email = `${presupuesto.usuario_email || "Email: -"}`;

        doc.font("Helvetica-Bold").fontSize(12);
        const anchoEmpresa = doc.widthOfString(empresa);

        doc.font("Helvetica").fontSize(10);

        const anchoNombre = doc.widthOfString(nombre);
        const anchoTelefono = doc.widthOfString(telefono);
        const anchoEmail = doc.widthOfString(email);

        const anchoMaximo = Math.max(anchoEmpresa, anchoNombre, anchoTelefono, anchoEmail);
        const xDerecha = 555 - anchoMaximo;

        doc.fillColor("black").font("Helvetica-Bold").fontSize(12).text(empresa, xDerecha, 165);

        doc.font("Helvetica").fontSize(10)
            .text(nombre, xDerecha, 185)
            .text(telefono, xDerecha, 203)
            .text(email, xDerecha, 221);

        let y = 285;

        doc.strokeColor("GRIS").lineWidth(0.9).moveTo(40, y).lineTo(555, y);

        y += 15;

        doc.fillColor("GRIS").font("Helvetica-Bold").fontSize(9)
            .text("Servicio", 45, y)
            .text("Precio", 280, y)
            .text("Cantidad", 385, y)
            .text("Subtotal", 490, y);

        y += 18;

        doc.strokeColor("GRIS").moveTo(40, y).lineTo(555, y).stroke();

        y += 15;

        doc.fillColor("#333").font("Helvetica").fontSize(9);

        presupuesto.detalles.forEach((item) => {
            doc.text(item.nombre_item, 45, y, { width: 210 });
            doc.text(dinero(item.precio_unitario), 280, y);
            doc.text(String(item.cantidad), 402, y);
            doc.text(dinero(item.subtotal), 490, y);
            y += 25;
        });

        doc.strokeColor("GRIS").moveTo(40, y).lineTo(555, y).stroke();

        y += 25;

        const totalTexto = dinero(presupuesto.total);

        doc.font("Helvetica-Bold").fontSize(12);

        const anchoLabel = doc.widthOfString("TOTAL:");
        const anchoTotal = doc.widthOfString(totalTexto);
        const padding = 12;
        const anchoCaja = anchoLabel + anchoTotal + padding * 3;
        const xCaja = 540 - anchoCaja;

        doc.fillColor("#E8E8E8").rect(xCaja, y, anchoCaja, 30).fill();

        doc.fillColor("#333")
            .text("TOTAL:", xCaja + padding, y + 9)
            .text(totalTexto, xCaja + padding + anchoLabel + 18, y + 9);

        const yObs = 770;

        doc.font("Helvetica-Bold").fontSize(10).fillColor("#444")
            .text("Observaciones:", 40, yObs, { continued: true });

        doc.font("Helvetica").text(` ${presupuesto.observaciones || "Sin observaciones."}`);

        doc.end();
    });
};