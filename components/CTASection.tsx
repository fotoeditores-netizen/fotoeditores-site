import Link from "next/link";

export default function CTASection() {
  return (
    <section id="contacto" className="py-20 px-6 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          ¿Listo para transformar tus fotos?
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Envíanos tus imágenes hoy y recibe una muestra gratuita sin compromiso.
          Respuesta en menos de 2 horas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="mailto:fotoeditores@gmail.com"
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors text-lg"
          >
            Enviar mis fotos
          </Link>
          <Link
            href="https://wa.me/message/fotoeditores"
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-lg"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
