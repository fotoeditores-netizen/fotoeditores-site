import type { OrderView } from "@/lib/orders/service";

// Lo que ve el dueño del token: sin id interno ni rutas de almacenamiento.
export function publicOrder(order: OrderView) {
  return {
    code: order.code,
    status: order.status,
    amount_usd: order.amount_usd,
    customer_name: order.customer_name,
    brief: order.brief,
    package: {
      slug: order.package.slug,
      name: order.package.name,
      price_usd: order.package.price_usd,
      max_files: order.package.max_files,
      max_file_mb: order.package.max_file_mb,
      accepts_video: order.package.accepts_video,
      segment: order.package.segment,
    },
    files: order.files,
  };
}
