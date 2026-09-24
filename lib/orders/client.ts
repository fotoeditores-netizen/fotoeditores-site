// Llamadas del navegador a la API de pedidos, con errores en español.

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      headers: json !== undefined ? { "Content-Type": "application/json", ...rest.headers } : rest.headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new ApiError("Sin conexión. Revisa tu internet e intenta de nuevo.", 0);
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? "Algo salió mal. Intenta de nuevo.", res.status, data.fields);
  return data as T;
}

export type PublicOrder = {
  code: string;
  status: string;
  amount_usd: number;
  customer_name: string | null;
  brief: Record<string, unknown>;
  package: {
    slug: string;
    name: string;
    price_usd: number | null;
    max_files: number;
    max_file_mb: number;
    accepts_video: boolean;
    segment: "producto" | "recuerdos" | "ambos";
  };
  files: { id: string; filename: string; mime: string; size_bytes: number; created_at: string }[];
};
