import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "editorgeneral@fotoeditores.com";
const FROM_EMAIL = "contacto@fotoeditores.com"; // Must be verified in Resend

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { message: "Nombre y email son requeridos." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "El formato del email no es válido." },
        { status: 400 }
      );
    }

    // Notify team of new lead
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `🎯 Nuevo lead (guía gratuita): ${name} — ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0066FF;">🎯 Nuevo Lead Capturado</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Lead magnet:</strong> Guía 5 Secretos de Fotografía con Celular</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</p>
          <hr style="border-color: #eee; margin: 20px 0;">
          <p style="font-size:12px; color:#999;">Recuerda hacer seguimiento en las próximas 24 horas para maximizar conversión.</p>
        </div>
      `,
    });

    // Send lead magnet guide to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Tu guía gratuita llegó: 5 Secretos para Fotografiar Productos — Fotoeditores`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 20px; }
            .card { background: white; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0A1628, #0066FF); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 24px; font-weight: 800; margin-bottom: 5px; }
            .logo span { color: #00D4FF; }
            .badge { background: rgba(255,184,0,0.2); color: #FFB800; border-radius: 20px; padding: 5px 15px; font-size: 12px; font-weight: 700; display: inline-block; margin-top: 8px; }
            .body { padding: 35px 30px; }
            h2 { color: #0A1628; font-size: 22px; margin-top: 0; }
            p { color: #444; line-height: 1.6; font-size: 15px; }
            .secret { background: #f0f4f8; border-radius: 10px; padding: 18px 20px; margin: 12px 0; border-left: 4px solid #0066FF; }
            .secret-num { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0066FF; letter-spacing: 1px; margin-bottom: 4px; }
            .secret-title { font-size: 16px; font-weight: 700; color: #0A1628; margin-bottom: 5px; }
            .secret-desc { font-size: 13px; color: #666; line-height: 1.5; margin: 0; }
            .cta-section { background: linear-gradient(135deg, #0A1628, #0066FF); border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0; }
            .cta-title { color: white; font-size: 18px; font-weight: 700; margin: 0 0 8px; }
            .cta-sub { color: rgba(255,255,255,0.7); font-size: 13px; margin: 0 0 18px; }
            .btn { background: linear-gradient(135deg, #00D4FF, #0066FF); color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #aaa; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">Foto<span>editores</span></div>
              <div class="badge">✨ Tu Guía Gratuita</div>
            </div>
            <div class="body">
              <h2>Hola, ${name}! Aquí están tus 5 secretos 📸</h2>
              <p>En los próximos meses, estas técnicas van a transformar la calidad de tu contenido visual. Son las mismas que usamos para preparar a nuestros clientes antes de aplicarles nuestra gestión IA.</p>

              <div class="secret">
                <div class="secret-num">Secreto #1</div>
                <div class="secret-title">La "Hora Dorada" del Hogar</div>
                <p class="secret-desc">No necesitas flash ni luces profesionales. La luz natural indirecta cerca de una ventana (no solar directa) entre las 8-10 AM o 3-5 PM da una calidad de estudio fotográfico. Coloca tu producto a 45° de la ventana y usa un papel blanco al lado opuesto como reflector gratuito.</p>
              </div>

              <div class="secret">
                <div class="secret-num">Secreto #2</div>
                <div class="secret-title">El Fondo que Más Convierte</div>
                <p class="secret-desc">Para e-commerce: fondo blanco puro (cartulina o tela) aumenta conversiones hasta 30%. Para redes sociales: fondos de textura natural (madera, mármol, tela lino) generan 2x más engagement. Evita fondos de colores saturados que compiten con el producto.</p>
              </div>

              <div class="secret">
                <div class="secret-num">Secreto #3</div>
                <div class="secret-title">El Ángulo del 75%</div>
                <p class="secret-desc">Fotografía de ¾ desde arriba (ángulo de 45°). Este ángulo muestra el frente, el costado y la parte superior del producto simultáneamente, dando más información visual. Es el ángulo con mayor tasa de "detener el scroll" en estudios de eye-tracking de Instagram.</p>
              </div>

              <div class="secret">
                <div class="secret-num">Secreto #4</div>
                <div class="secret-title">Prepara tus Fotos para IA</div>
                <p class="secret-desc">Fotografía siempre con el producto perfectamente enfocado y sin sombras duras. La IA editorial (como la que usamos en Fotoeditores) necesita fotos con buena nitidez para generar fondos perfectos. Una foto borrosa o con sombras quemadas multiplica los errores de la IA por 5.</p>
              </div>

              <div class="secret">
                <div class="secret-num">Secreto #5</div>
                <div class="secret-title">Las 3 Apps Gratuitas del Pro</div>
                <p class="secret-desc"><strong>Lightroom Mobile</strong> (ajustes de exposición y color), <strong>Snapseed</strong> (eliminación de manchas y perspectiva), <strong>Remove.bg</strong> (eliminación de fondo gratis para 5 fotos/mes). En ese orden de uso, transforman cualquier foto de celular en material listo para publicar.</p>
              </div>

              <div class="cta-section">
                <p class="cta-title">¿Listo para el siguiente nivel?</p>
                <p class="cta-sub">Cuando ya tengas fotos de calidad, nosotros aplicamos gestión IA editorial para multiplicar tu producción ×3.5 y reducir tus costos -55%.</p>
                <a href="https://fotoeditores.com/contacto" class="btn">Hablar con un experto →</a>
              </div>

              <p style="font-size: 13px; color: #888;">¿Tienes preguntas sobre cómo aplicar estos secretos? Responde este email y uno de nuestros editores personales te ayuda directamente.</p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} Fotoeditores · Colombia<br>
              <a href="https://fotoeditores.com" style="color: #0066FF;">fotoeditores.com</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "¡Guía enviada! Revisa tu correo." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead magnet API error:", error);
    return NextResponse.json(
      { message: "Error interno. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
