import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/http";
import { getWompiConfig } from "@/lib/payments/config";
import { getUsdCopRate } from "@/lib/payments/fx";
import { startCheckout } from "@/lib/payments/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/orders/[token]/checkout — crea un intento de pago y devuelve la URL
// del Web Checkout de Wompi. El monto sale de la base y de la tasa del día; el
// cuerpo de la petición se ignora (el navegador no decide cuánto se cobra).
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const wompi = getWompiConfig();
  if (!wompi) {
    return NextResponse.json({ error: "El pago en línea no está disponible. Escríbenos por WhatsApp." }, { status: 503 });
  }
  try {
    const checkout = await startCheckout(getAdminSupabase(), token, {
      publicKey: wompi.publicKey,
      integritySecret: wompi.integritySecret,
      siteUrl: new URL(request.url).origin,
      marginPercent: wompi.marginPercent,
      getRate: () => getUsdCopRate(),
    });
    return NextResponse.json(checkout);
  } catch (error) {
    return errorResponse(error);
  }
}
