// Formato de orders.public_token (lo genera la base: 24 bytes en base64url).
// Validar antes de consultar evita pegarle a la base con basura y descarta
// intentos de inyección en las rutas /pedido/[token].
const PUBLIC_TOKEN_RE = /^[A-Za-z0-9_-]{32}$/;

export function isValidPublicToken(value: unknown): value is string {
  return typeof value === "string" && PUBLIC_TOKEN_RE.test(value);
}

// Formato de orders.code: FE-AAMM-NNNN (4 dígitos o más).
const ORDER_CODE_RE = /^FE-\d{4}-\d{4,}$/;

export function isValidOrderCode(value: unknown): value is string {
  return typeof value === "string" && ORDER_CODE_RE.test(value);
}
