import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Value } from "@/components/legal/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de los servicios de edición de Fotoeditores: pedidos, pagos, entregas, ajustes y devoluciones.",
  alternates: { canonical: "https://fotoeditores.com/terminos" },
};

/*
 * Borrador conforme a la Ley 1480 de 2011 (Estatuto del Consumidor), en
 * especial las reglas de comercio electrónico (arts. 49-50) y el derecho de
 * retracto (art. 47). PENDIENTE DE REVISIÓN JURÍDICA: ver aviso en la página.
 */
export default function TerminosPage() {
  const email = <a href={`mailto:${LEGAL.dataEmail}`}>{LEGAL.dataEmail}</a>;

  return (
    <LegalPage
      title="Términos y condiciones"
      intro={
        <p>
          Estos términos regulan los servicios de edición y producción de imagen que contratas en fotoeditores.com. Al
          hacer un pedido declaras que los leíste y los aceptas. Si tienes dudas, escríbenos antes de pagar.
        </p>
      }
      sections={[
        {
          id: "quienes",
          title: "Quiénes somos",
          body: (
            <p>
              El servicio lo presta <Value value={LEGAL.companyName} pending="razón social" />, NIT{" "}
              <Value value={LEGAL.taxId} pending="NIT" />, con domicilio en {LEGAL.city} (
              <Value value={LEGAL.address} pending="dirección" />
              ). Contacto: {email}.
            </p>
          ),
        },
        {
          id: "servicio",
          title: "El servicio",
          body: (
            <>
              <p>
                Editores humanos con experiencia editan, restauran o producen imágenes y videos a partir del material
                que nos envías, con apoyo de herramientas de inteligencia artificial.
              </p>
              <ul>
                <li>
                  El resultado depende de la calidad del material original. Si lo que buscas no es posible con tus
                  archivos, te lo diremos antes de empezar.
                </li>
                <li>
                  Las técnicas de inteligencia artificial pueden reconstruir o generar detalles que no estaban en la
                  imagen original. Eso es parte del servicio y lo revisa siempre un editor humano.
                </li>
                <li>Cada paquete indica cuántos archivos incluye, el tiempo de entrega y los ajustes incluidos.</li>
              </ul>
            </>
          ),
        },
        {
          id: "pedido-precio",
          title: "Pedido, precio y pago",
          body: (
            <ul>
              <li>Los precios se publican en dólares estadounidenses (USD) e incluyen el servicio descrito en cada paquete.</li>
              <li>
                El pago se procesa en pesos colombianos (COP). Antes de pagar verás el valor exacto en pesos, calculado
                con la tasa de cambio del día, y ese es el valor que se cobra.
              </li>
              <li>
                El pedido queda en firme cuando se confirma el pago. El precio aplicable es el vigente en el momento en
                que envías el pedido.
              </li>
              <li>
                Mientras habilitamos el pago en línea, tu editor te contactará por WhatsApp para coordinar el pago
                antes de empezar.
              </li>
            </ul>
          ),
        },
        {
          id: "entrega",
          title: "Entrega",
          body: (
            <ul>
              <li>
                El tiempo de entrega de cada paquete empieza a contar cuando se confirma el pago y tenemos todos tus
                archivos. Se cuenta en <Value value={LEGAL.deliveryDaysType} pending="días calendario o hábiles" />.
              </li>
              <li>Te entregamos los archivos finales por un enlace privado de descarga.</li>
              <li>
                Descarga tus resultados a tiempo: eliminamos los archivos{" "}
                <Value value={LEGAL.fileRetentionDays} pending="número de días" /> días después de la entrega (ver la{" "}
                <Link href="/privacidad">política de datos</Link>).
              </li>
            </ul>
          ),
        },
        {
          id: "ajustes",
          title: "Ajustes",
          body: (
            <ul>
              <li>Cada paquete incluye un número de rondas de ajustes, indicado en su descripción.</li>
              <li>
                Un ajuste es una corrección sobre el mismo trabajo entregado (por ejemplo, más brillo, otro tono o un
                recorte distinto). Un cambio de idea o un trabajo nuevo se cotiza aparte.
              </li>
              <li>
                Los ajustes se piden dentro de los{" "}
                <Value value={LEGAL.adjustmentWindowDays} pending="número de días" /> días siguientes a la entrega.
              </li>
            </ul>
          ),
        },
        {
          id: "devoluciones",
          title: "Devoluciones y derecho de retracto",
          body: (
            <>
              <p>
                Puedes pedir la devolución de tu pago dentro de los 7 días calendario siguientes a la fecha del pago,
                siempre que no hayamos empezado a trabajar en tu pedido. Si ya iniciamos la edición, la revisión de tu
                material o cualquier gestión sobre el pedido, el pago queda aplicado al trabajo.
              </p>
              <p>
                El derecho de retracto de las compras en línea (artículo 47 de la Ley 1480 de 2011) no aplica a los
                servicios cuya prestación comenzó con tu acuerdo, ni a trabajos confeccionados conforme a tus
                especificaciones o claramente personalizados.
              </p>
              <p>
                Para pedir una devolución escribe a {email} con tu nombre, documento de identidad o NIT, el código del
                pedido, la fecha y el valor del pago, y el motivo. Si procede, el reembolso se hace por el mismo medio
                de pago.
              </p>
            </>
          ),
        },
        {
          id: "tu-material",
          title: "Tu material y tus responsabilidades",
          body: (
            <>
              <p>Al enviarnos imágenes o videos declaras que:</p>
              <ul>
                <li>Tienes derecho a usarlos y a encargar su edición.</li>
                <li>
                  Cuentas con la autorización de las personas que aparecen en ellos y, si hay menores de edad, eres su
                  representante legal o tienes la autorización de quien lo sea.
                </li>
              </ul>
              <p>
                No aceptamos pedidos para suplantar la identidad de otra persona, engañar, difamar, crear contenido
                sexual de personas reales sin su consentimiento, cualquier contenido que involucre a menores de forma
                indebida, ni ninguna finalidad ilícita. Podemos rechazar o cancelar esos pedidos; en ese caso, si no
                hubo trabajo, reembolsamos el pago.
              </p>
            </>
          ),
        },
        {
          id: "derechos",
          title: "Derechos sobre los resultados",
          body: (
            <ul>
              <li>Conservas todos tus derechos sobre el material original que nos envías.</li>
              <li>
                Una vez pagado el pedido, puedes usar los archivos finales para fines personales o comerciales, siempre
                que sean lícitos.
              </li>
              <li>
                Solo usamos tus resultados en nuestro portafolio, redes o publicidad si nos das una autorización
                expresa y separada.
              </li>
            </ul>
          ),
        },
        {
          id: "responsabilidad",
          title: "Responsabilidad",
          body: (
            <p>
              Respondemos por prestar el servicio con la calidad y en los términos ofrecidos, conforme a la garantía
              legal del Estatuto del Consumidor. Si no podemos cumplirlo, lo corregimos o te devolvemos lo pagado por el
              pedido afectado. Guarda siempre una copia de tus archivos originales: no somos un servicio de respaldo.
            </p>
          ),
        },
        {
          id: "datos",
          title: "Datos personales",
          body: (
            <p>
              Tratamos tus datos y tus imágenes según nuestra{" "}
              <Link href="/privacidad">política de tratamiento de datos personales</Link>.
            </p>
          ),
        },
        {
          id: "ley",
          title: "Ley aplicable y reclamos",
          body: (
            <p>
              Estos términos se rigen por la ley colombiana. Si tienes un reclamo, escríbenos primero a {email} y lo
              resolveremos directamente. También puedes acudir a la Superintendencia de Industria y Comercio (SIC).
            </p>
          ),
        },
      ]}
    />
  );
}
