import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "editorgeneral@fotoeditores.com";
const FROM_EMAIL = "contacto@fotoeditores.com";
const PAYMENT_URL = process.env.PAYMENT_URL ?? "https://fotoeditores.com";
const CONTACT_PHONE = "+57 300 000 0000";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const {
      name, phone, email, company, sector,
      quoteSummary, total, currency, copRate,
      hasMaintenance, hasEcommerce,
    } = body as {
      name: string; phone: string; email: string; company: string; sector: string;
      quoteSummary: string[]; total: number; currency: string; copRate: number;
      hasMaintenance: boolean; hasEcommerce: boolean;
    };

    if (!name || !email) {
      return NextResponse.json({ message: "Nombre y email son requeridos." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "El formato del email no es válido." }, { status: 400 });
    }

    const MAINTENANCE_PRICE = 29;
    const projectType = hasEcommerce ? "tienda en línea / e-commerce" : "sitio web";
    const formattedTotal =
      currency === "USD"
        ? `$${total} USD`
        : `$${(total * copRate).toLocaleString("es-CO")} COP`;
    const maintenanceFmt =
      currency === "USD"
        ? `$${MAINTENANCE_PRICE} USD/mes`
        : `$${(MAINTENANCE_PRICE * copRate).toLocaleString("es-CO")} COP/mes`;

    const summaryItemsHtml = quoteSummary
      .map((line) => `<li>${line.replace(/^✅ /, "")}</li>`)
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Tu cotización de Fotoeditores — ${formattedTotal}`,
      html: clientEmailHtml({ name, projectType, summaryItemsHtml, formattedTotal, maintenanceFmt, hasMaintenance }),
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Cotizador] ${name}${company ? ` · ${company}` : ""} — ${formattedTotal}`,
      html: teamEmailHtml({ name, phone, email, company, sector, summaryItemsHtml, formattedTotal, hasMaintenance, maintenanceFmt }),
    });

    return NextResponse.json({ message: "Cotización enviada con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Cotizador API error:", error);
    return NextResponse.json({ message: "Error interno. Intenta de nuevo." }, { status: 500 });
  }
}

function clientEmailHtml(p: {
  name: string;
  projectType: string;
  summaryItemsHtml: string;
  formattedTotal: string;
  maintenanceFmt: string;
  hasMaintenance: boolean;
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Arial,sans-serif;background:#f0f4f8;padding:20px}
.wrap{max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)}
.hdr{background:linear-gradient(135deg,#0A1628 0%,#0066FF 100%);padding:40px 30px;text-align:center}
.logo{color:#fff;font-size:28px;font-weight:800;letter-spacing:-.5px}
.logo span{color:#00D4FF}
.tag{color:rgba(255,255,255,.55);font-size:13px;margin-top:8px}
.bdy{padding:38px 32px}
h2{color:#0A1628;font-size:22px;margin-bottom:16px}
p{color:#444;line-height:1.65;font-size:15px;margin-bottom:16px}
.cta-wrap{text-align:center;margin:32px 0}
.cta{display:inline-block;background:linear-gradient(135deg,#0066FF,#00D4FF);color:#fff!important;text-decoration:none;padding:16px 44px;border-radius:12px;font-weight:700;font-size:16px;letter-spacing:.02em}
.qbox{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:22px 24px;margin:24px 0}
.qbox-title{color:#0066FF;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}
.qbox ul{list-style:none;padding:0}
.qbox ul li{color:#444;font-size:14px;padding:5px 0;border-bottom:1px solid #f0f0f0}
.qbox ul li:last-child{border:0}
.qtotal{font-size:20px;font-weight:800;color:#0A1628;border-top:1px solid #e2e8f0;padding-top:14px;margin-top:14px}
.brief{background:#f0f7ff;border-left:4px solid #0066FF;border-radius:0 10px 10px 0;padding:18px 20px;margin:20px 0}
.brief h4{color:#0066FF;font-size:14px;margin-bottom:10px;font-weight:700}
.brief p{font-size:13px;color:#555;margin-bottom:10px;line-height:1.6}
.brief p:last-child{margin:0}
.refund{background:#fffbf0;border:1px solid #fde68a;border-radius:10px;padding:20px 22px;margin:24px 0}
.refund h4{color:#92400e;font-size:14px;margin-bottom:10px;font-weight:700}
.refund p{font-size:13px;color:#78350f;line-height:1.6;margin-bottom:10px}
.refund p:last-child{margin:0}
.ftr{text-align:center;padding:24px 20px;background:#f8fafc;border-top:1px solid #e2e8f0}
.ftr strong{color:#0A1628;font-size:16px;display:block;margin-bottom:8px}
.ftr p{color:#888;font-size:12px;line-height:1.9}
.ftr a{color:#0066FF;text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="logo">Foto<span>editores</span></div>
    <div class="tag">Creadores de contenido · Laboratorio de IA</div>
  </div>
  <div class="bdy">
    <h2>Hola, ${p.name}.</h2>
    <p>Gracias por confiar en <strong>Fotoeditores</strong> para acompañarte en la creación de tu <strong>${p.projectType}</strong>.</p>
    <p>Hemos recibido tu solicitud y ya tienes disponible la cotización correspondiente. Para avanzar con el inicio del proyecto, puedes realizar el pago de aprobación a través del siguiente botón:</p>
    <div class="cta-wrap">
      <a href="${PAYMENT_URL}" class="cta">Aprobar cotización y realizar pago</a>
    </div>
    <div class="qbox">
      <div class="qbox-title">Detalle de tu cotización</div>
      <ul>${p.summaryItemsHtml}</ul>
      <div class="qtotal">Total: ${p.formattedTotal}${p.hasMaintenance ? ` + ${p.maintenanceFmt} mantenimiento` : ""}</div>
    </div>
    <p>Una vez confirmado el pago, nuestro equipo validará la información y activará el proceso inicial del proyecto.</p>
    <p>En los próximos minutos recibirás un enlace para diligenciar el brief correspondiente, según el tipo de proyecto:</p>
    <div class="brief">
      <h4>Briefing del proyecto</h4>
      <p><strong>Brief para sitio web sencillo:</strong> recoge la información necesaria sobre objetivo del sitio, páginas, contenidos, materiales, dominio, hosting, GitHub, responsables y aprobación del proyecto.</p>
      <p><strong>Brief para tienda en línea / e-commerce:</strong> recoge información sobre catálogo, productos, inventario, pagos, envíos, políticas, accesos, dominio, hosting, GitHub y responsables del proyecto.</p>
      <p>Este brief es fundamental para entender tu negocio, definir el alcance real del proyecto y evitar retrasos durante el diseño, desarrollo y publicación.</p>
    </div>
    <div class="refund">
      <h4>Condición de devolución del dinero</h4>
      <p>El pago realizado podrá ser devuelto dentro de los siete (7) días calendario siguientes a la fecha de pago, únicamente si Fotoeditores no ha iniciado ningún acercamiento, contacto, reunión, revisión de información, análisis, asesoría, levantamiento de requerimientos, intercambio de mensajes o actividad relacionada con la empresa o persona solicitante.</p>
      <p>Si durante ese periodo Fotoeditores ya ha realizado algún contacto o gestión inicial con el cliente, se entenderá que el proceso ha comenzado y el pago quedará aplicado al inicio del proyecto, conforme a la cotización aceptada.</p>
      <p>Para solicitar una devolución, el cliente deberá escribir al correo <strong>editorgeneral@fotoeditores.com</strong>, indicando nombre, identificación o NIT, fecha de pago, valor pagado, medio de pago y motivo de la solicitud.</p>
    </div>
    <p>Gracias nuevamente por confiar en nosotros.</p>
  </div>
  <div class="ftr">
    <strong>Fotoeditores</strong>
    <p>
      Creadores de contenido · Laboratorio de IA<br>
      <a href="tel:${CONTACT_PHONE.replace(/\s/g, "")}">${CONTACT_PHONE}</a> &nbsp;·&nbsp;
      <a href="mailto:${TO_EMAIL}">${TO_EMAIL}</a><br>
      <a href="https://fotoeditores.com">www.fotoeditores.com</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

function teamEmailHtml(p: {
  name: string;
  phone: string;
  email: string;
  company: string;
  sector: string;
  summaryItemsHtml: string;
  formattedTotal: string;
  hasMaintenance: boolean;
  maintenanceFmt: string;
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
body{font-family:Arial,sans-serif;background:#f5f7fa;padding:20px}
.wrap{background:#fff;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.hdr{background:linear-gradient(135deg,#0A1628,#0066FF);padding:30px;text-align:center}
.hdr h1{color:#fff;margin:0;font-size:20px}
.hdr p{color:rgba(255,255,255,.6);margin:5px 0 0;font-size:13px}
.bdy{padding:30px}
.field{margin-bottom:18px}
.lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0066FF;margin-bottom:5px}
.val{font-size:15px;color:#1a1a2e;line-height:1.5}
.qbox{background:#f0f4f8;border-radius:8px;padding:16px;margin:12px 0}
.qbox ul{list-style:none;padding:0;margin:0}
.qbox ul li{font-size:14px;color:#444;padding:4px 0;border-bottom:1px solid #e2e8f0}
.qbox ul li:last-child{border:0}
.qtotal{font-size:18px;font-weight:800;color:#0A1628;border-top:1px solid #ddd;padding-top:10px;margin-top:10px}
.ftr{text-align:center;padding:18px;background:#f5f7fa;font-size:12px;color:#999}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>📋 Nueva solicitud de cotización</h1>
    <p>fotoeditores.com</p>
  </div>
  <div class="bdy">
    <div class="field"><div class="lbl">Nombre</div><div class="val">${p.name}</div></div>
    <div class="field"><div class="lbl">Email</div><div class="val"><a href="mailto:${p.email}" style="color:#0066FF">${p.email}</a></div></div>
    ${p.phone ? `<div class="field"><div class="lbl">Teléfono</div><div class="val">${p.phone}</div></div>` : ""}
    ${p.company ? `<div class="field"><div class="lbl">Empresa</div><div class="val">${p.company}</div></div>` : ""}
    ${p.sector ? `<div class="field"><div class="lbl">Sector</div><div class="val">${p.sector}</div></div>` : ""}
    <div class="field">
      <div class="lbl">Cotización</div>
      <div class="qbox">
        <ul>${p.summaryItemsHtml}</ul>
        <div class="qtotal">Total: ${p.formattedTotal}${p.hasMaintenance ? ` + ${p.maintenanceFmt}` : ""}</div>
      </div>
    </div>
  </div>
  <div class="ftr">Enviado desde fotoeditores.com · ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</div>
</div>
</body>
</html>`;
}
