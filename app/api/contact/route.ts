import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "editorgeneral@fotoeditores.com";
const FROM_EMAIL = "contacto@fotoeditores.com"; // Must be verified in Resend

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Nombre, email y mensaje son requeridos." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "El formato del email no es válido." },
        { status: 400 }
      );
    }

    // Send notification to Fotoeditores team
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Web] Nuevo contacto de ${name}${company ? ` — ${company}` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 20px; }
            .card { background: white; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #0A1628, #0066FF); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 22px; }
            .header p { color: rgba(255,255,255,0.6); margin: 5px 0 0; font-size: 14px; }
            .body { padding: 30px; }
            .field { margin-bottom: 20px; }
            .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #0066FF; margin-bottom: 5px; }
            .value { font-size: 15px; color: #1a1a2e; line-height: 1.5; }
            .message-box { background: #f0f4f8; border-radius: 8px; padding: 16px; border-left: 4px solid #0066FF; }
            .footer { text-align: center; padding: 20px; background: #f5f7fa; font-size: 12px; color: #999; }
            .badge { display: inline-block; background: rgba(0,102,255,0.1); color: #0066FF; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>📬 Nuevo Contacto desde la Web</h1>
              <p>fotoeditores.com</p>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">Nombre</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color:#0066FF">${email}</a></div>
              </div>
              ${company ? `<div class="field"><div class="label">Empresa</div><div class="value">${company}</div></div>` : ""}
              ${service ? `<div class="field"><div class="label">Servicio de interés</div><div class="value"><span class="badge">${service}</span></div></div>` : ""}
              <div class="field">
                <div class="label">Mensaje</div>
                <div class="value message-box">${message.replace(/\n/g, "<br>")}</div>
              </div>
            </div>
            <div class="footer">
              Enviado desde fotoeditores.com · ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send auto-reply to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Hola ${name}, recibimos tu mensaje — Fotoeditores`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 20px; }
            .card { background: white; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0A1628, #0066FF); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 24px; font-weight: 800; margin-bottom: 5px; }
            .logo span { color: #00D4FF; }
            .tagline { color: rgba(255,255,255,0.6); font-size: 13px; }
            .body { padding: 35px 30px; }
            h2 { color: #0A1628; font-size: 20px; margin-top: 0; }
            p { color: #444; line-height: 1.6; font-size: 15px; }
            .cta { text-align: center; margin: 30px 0; }
            .btn { background: linear-gradient(135deg, #0066FF, #00D4FF); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; }
            .stats { display: flex; gap: 20px; background: #f0f4f8; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
            .stat-val { font-size: 22px; font-weight: 800; color: #0066FF; }
            .stat-label { font-size: 11px; color: #888; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #aaa; border-top: 1px solid #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">Foto<span>editores</span></div>
              <div class="tagline">20 años de experiencia · Potenciados con IA</div>
            </div>
            <div class="body">
              <h2>Hola, ${name}. Ya recibimos tu mensaje.</h2>
              <p>Gracias por contactarnos. Uno de nuestros expertos revisará tu solicitud y te responderá en menos de <strong>24 horas hábiles</strong>.</p>
              <p>Mientras tanto, ¿sabías que nuestros clientes ahorran en promedio un <strong>55% en costos de producción</strong> y producen <strong>3.5 veces más contenido</strong> con nuestra gestión IA?</p>
              <div class="stats">
                <div style="flex:1"><div class="stat-val">-55%</div><div class="stat-label">Reducción de costos</div></div>
                <div style="flex:1"><div class="stat-val">×3.5</div><div class="stat-label">Más volumen</div></div>
                <div style="flex:1"><div class="stat-val">-70%</div><div class="stat-label">Menos tiempo</div></div>
              </div>
              <div class="cta">
                <a href="https://fotoeditores.com/tecnologia" class="btn">Ver cómo funciona →</a>
              </div>
              <p style="font-size:13px; color:#aaa;">¿Tienes una urgencia? Escríbenos directamente a <a href="mailto:editorgeneral@fotoeditores.com" style="color:#0066FF">editorgeneral@fotoeditores.com</a></p>
            </div>
            <div class="footer">© ${new Date().getFullYear()} Fotoeditores · Colombia · fotoeditores.com</div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ message: "Mensaje enviado con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { message: "Error interno. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
