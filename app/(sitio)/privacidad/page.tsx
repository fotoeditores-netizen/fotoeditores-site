import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Value } from "@/components/legal/LegalPage";
import { LEGAL, formatPhone } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",
  description: "Cómo Fotoeditores recolecta, usa y protege tus datos personales y tus imágenes (Ley 1581 de 2012).",
  alternates: { canonical: "https://fotoeditores.com/privacidad" },
};

/*
 * Borrador conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado
 * en el Decreto 1074 de 2015, art. 2.2.2.25.3.1 sobre el contenido mínimo de la
 * política). PENDIENTE DE REVISIÓN JURÍDICA: ver aviso en la página.
 */
export default function PrivacidadPage() {
  const email = <a href={`mailto:${LEGAL.dataEmail}`}>{LEGAL.dataEmail}</a>;

  return (
    <LegalPage
      title="Política de tratamiento de datos personales"
      intro={
        <p>
          En Fotoeditores tratamos tus datos y tus imágenes con el mismo cuidado con el que las editamos. Esta política
          explica qué datos recolectamos, para qué los usamos, con quién los compartimos, cuánto tiempo los guardamos y
          cómo puedes ejercer tus derechos, de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en
          el Decreto 1074 de 2015).
        </p>
      }
      sections={[
        {
          id: "responsable",
          title: "Responsable del tratamiento",
          body: (
            <ul>
              <li>
                Razón social: <Value value={LEGAL.companyName} pending="razón social" />
              </li>
              <li>
                NIT: <Value value={LEGAL.taxId} pending="NIT" />
              </li>
              <li>Domicilio: {LEGAL.city}</li>
              <li>
                Dirección: <Value value={LEGAL.address} pending="dirección de notificación" />
              </li>
              <li>Correo para asuntos de datos personales: {email}</li>
              <li>
                Teléfono y WhatsApp: <Value value={formatPhone(LEGAL.phoneDigits)} pending="teléfono" />
              </li>
              <li>Sitio web: fotoeditores.com</li>
            </ul>
          ),
        },
        {
          id: "datos",
          title: "Qué datos recolectamos",
          body: (
            <>
              <ul>
                <li>
                  <strong>Datos de contacto:</strong> nombre, correo electrónico y número de WhatsApp.
                </li>
                <li>
                  <strong>Datos del pedido:</strong> el paquete elegido, lo que nos cuentas sobre lo que necesitas y los
                  enlaces que compartes.
                </li>
                <li>
                  <strong>Imágenes y videos que nos envías.</strong> Pueden mostrar a personas, incluidos niños, niñas y
                  adolescentes, y en ese caso contienen datos personales de esas personas (ver la sección 5).
                </li>
                <li>
                  <strong>Datos de pago:</strong> el pago lo procesa la pasarela de pagos (Wompi). Fotoeditores no recibe
                  ni almacena los números de tu tarjeta ni tus claves bancarias; solo el resultado y la referencia de la
                  transacción.
                </li>
                <li>
                  <strong>Datos de navegación:</strong> la campaña o el anuncio por el que llegaste al sitio (parámetros
                  UTM), guardados en una cookie propia durante 30 días, y los datos técnicos que usa el sistema anti-bots
                  (Cloudflare Turnstile) para verificar que eres una persona.
                </li>
              </ul>
              <p>
                No te pedimos datos sensibles. Si alguna imagen que decides enviarnos los revela (por ejemplo, datos de
                salud), la usamos solo para hacer el trabajo que nos pides. Entregar ese tipo de información es
                facultativo: no estás obligado a hacerlo.
              </p>
            </>
          ),
        },
        {
          id: "finalidades",
          title: "Para qué usamos tus datos",
          body: (
            <ul>
              <li>Recibir, editar y entregar tu pedido, y atender los ajustes incluidos en tu paquete.</li>
              <li>Comunicarnos contigo por WhatsApp o correo sobre tu pedido.</li>
              <li>Gestionar pagos, reembolsos, facturación y obligaciones contables y tributarias.</li>
              <li>Atender tus consultas, peticiones, quejas y reclamos.</li>
              <li>Proteger el sitio contra fraude y uso automatizado (bots).</li>
              <li>Medir qué anuncios y campañas funcionan, de forma agregada.</li>
              <li>
                Enviarte información comercial <strong>solo si nos das una autorización separada</strong> para ello.
              </li>
            </ul>
          ),
        },
        {
          id: "imagenes",
          title: "Tus imágenes y el uso de inteligencia artificial",
          body: (
            <>
              <p>
                Nuestros editores trabajan tus imágenes con herramientas profesionales de edición y de inteligencia
                artificial de proveedores especializados. Esos proveedores las procesan como encargados, únicamente para
                producir tu pedido.
              </p>
              <ul>
                <li>
                  <strong>No usamos tus imágenes en nuestro portafolio, redes o publicidad</strong> sin una autorización
                  expresa y separada de tu parte.
                </li>
                <li>No vendemos ni cedemos tus imágenes ni tus datos a terceros.</li>
                <li>
                  Tus archivos se guardan en almacenamiento privado: no son públicos y solo el equipo que trabaja tu
                  pedido puede acceder a ellos, mediante enlaces temporales.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "terceros-menores",
          title: "Imágenes de otras personas y de menores de edad",
          body: (
            <>
              <p>
                Cuando nos envías imágenes en las que aparecen otras personas, declaras que cuentas con su autorización
                para entregárnoslas y para que las editemos con la finalidad de tu pedido.
              </p>
              <p>
                Si aparecen niños, niñas o adolescentes, declaras ser su representante legal o contar con la
                autorización de quien lo sea. Trataremos esas imágenes respetando el interés superior del menor y sus
                derechos fundamentales, como exige el artículo 7 de la Ley 1581 de 2012, y únicamente para realizar el
                trabajo que nos encargas.
              </p>
            </>
          ),
        },
        {
          id: "encargados",
          title: "Con quién compartimos tus datos",
          body: (
            <>
              <p>
                Para prestar el servicio usamos proveedores que tratan datos por cuenta nuestra (encargados). Algunos
                tienen sus servidores fuera de Colombia, por lo que tus datos pueden transmitirse internacionalmente a
                ellos, siempre para las finalidades de esta política:
              </p>
              <ul>
                <li>Almacenamiento de archivos y base de datos (Supabase, servidores en Brasil).</li>
                <li>Alojamiento del sitio web (Vercel).</li>
                <li>Envío de correos electrónicos (Resend).</li>
                <li>Seguridad y verificación anti-bots (Cloudflare).</li>
                <li>Procesamiento de pagos (Wompi, Colombia).</li>
                <li>Mensajería (WhatsApp, de Meta), cuando nos escribes o te escribimos por ese medio.</li>
                <li>Herramientas de edición e inteligencia artificial usadas por nuestros editores.</li>
              </ul>
              <p>También entregaremos datos a autoridades cuando una ley o una orden judicial lo exija.</p>
            </>
          ),
        },
        {
          id: "conservacion",
          title: "Cuánto tiempo guardamos tus datos",
          body: (
            <ul>
              <li>
                <strong>Pedidos que no se envían:</strong> se borran automáticamente, con sus archivos, a los{" "}
                {LEGAL.draftRetentionDays} días.
              </li>
              <li>
                <strong>Tus archivos originales y las entregas:</strong> se eliminan{" "}
                <Value value={LEGAL.fileRetentionDays} pending="número de días" /> días después de la entrega de tu
                pedido. Descarga tus resultados antes de ese plazo.
              </li>
              <li>
                <strong>Datos del pedido y del pago:</strong> el tiempo que exijan las normas contables, tributarias y
                comerciales.
              </li>
              <li>Puedes pedirnos que borremos tus archivos antes de esos plazos (sección 10).</li>
            </ul>
          ),
        },
        {
          id: "derechos",
          title: "Tus derechos",
          body: (
            <>
              <p>Como titular de tus datos, de acuerdo con el artículo 8 de la Ley 1581 de 2012, puedes:</p>
              <ul>
                <li>Conocer, actualizar y rectificar tus datos personales.</li>
                <li>Pedir prueba de la autorización que nos diste.</li>
                <li>Ser informado sobre el uso que les hemos dado.</li>
                <li>
                  Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber agotado el
                  trámite de consulta o reclamo con nosotros.
                </li>
                <li>
                  Revocar la autorización y pedir la supresión de tus datos, cuando no exista un deber legal o
                  contractual de conservarlos.
                </li>
                <li>Acceder gratuitamente a tus datos personales.</li>
              </ul>
            </>
          ),
        },
        {
          id: "responsable-peticiones",
          title: "Quién atiende tus solicitudes",
          body: (
            <p>
              El equipo administrativo de Fotoeditores atiende las consultas y reclamos sobre datos personales en {email}
              . Indica en el asunto «Datos personales».
            </p>
          ),
        },
        {
          id: "procedimiento",
          title: "Cómo ejercer tus derechos",
          body: (
            <>
              <p>
                Escríbenos a {email} con tu nombre, tu documento de identidad o el código de tu pedido, y lo que
                solicitas. Si actúas en nombre de otra persona, adjunta el documento que te acredita.
              </p>
              <ul>
                <li>
                  <strong>Consultas</strong> (conocer tus datos o cómo los usamos): respondemos en un máximo de 10 días
                  hábiles. Si no podemos hacerlo en ese plazo, te informaremos el motivo y responderemos en un máximo
                  de 5 días hábiles adicionales (artículo 14 de la Ley 1581 de 2012).
                </li>
                <li>
                  <strong>Reclamos</strong> (corregir, actualizar o suprimir datos, o revocar la autorización): incluye
                  la descripción de los hechos, tu dirección y los documentos que quieras hacer valer. Si falta
                  información, te la pediremos dentro de los 5 días siguientes; si no la envías en 2 meses,
                  entenderemos que desististe. Respondemos en un máximo de 15 días hábiles, prorrogables hasta 8 días
                  hábiles más con aviso previo (artículo 15 de la Ley 1581 de 2012).
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "seguridad",
          title: "Cómo protegemos tus datos",
          body: (
            <ul>
              <li>Toda la comunicación con el sitio va cifrada (HTTPS).</li>
              <li>Los archivos se guardan en almacenamiento privado y se accede a ellos con enlaces que vencen.</li>
              <li>El acceso de nuestro equipo es personal y restringido a lo necesario para trabajar tu pedido.</li>
              <li>
                Tu pedido se identifica con un enlace privado y difícil de adivinar. No lo compartas: quien lo tenga
                podrá ver el estado del pedido.
              </li>
            </ul>
          ),
        },
        {
          id: "cookies",
          title: "Cookies y almacenamiento en tu navegador",
          body: (
            <ul>
              <li>
                <strong>Necesarias:</strong> guardamos en tu navegador el avance de tu pedido para que no lo pierdas si
                recargas la página, y el sistema anti-bots de Cloudflare usa datos técnicos para funcionar.
              </li>
              <li>
                <strong>De procedencia:</strong> la cookie «fe_utm» recuerda durante 30 días la campaña por la que
                llegaste.
              </li>
              <li>
                <strong>Analítica y publicidad:</strong> si en el futuro usamos herramientas de medición o publicidad
                (como Google Analytics o el píxel de Meta), te pediremos tu consentimiento antes de activarlas.
              </li>
            </ul>
          ),
        },
        {
          id: "vigencia",
          title: "Vigencia y cambios",
          body: (
            <p>
              Esta política rige desde el {LEGAL.effectiveDate}. Las bases de datos se conservarán mientras Fotoeditores
              preste sus servicios y durante los plazos indicados en la sección 7. Si hacemos cambios sustanciales, los
              publicaremos en esta página y te los informaremos por los medios de contacto que nos diste. Consulta
              también nuestros <Link href="/terminos">términos y condiciones</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
