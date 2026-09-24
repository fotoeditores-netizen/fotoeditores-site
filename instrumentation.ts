// Next ejecuta register() una vez al arrancar el servidor: si falta una variable
// obligatoria, el despliegue falla aquí con un mensaje claro en lugar de fallar
// después, a mitad de un pedido o de un pago.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { parseServerEnv } = await import("./lib/env/schema");
    parseServerEnv(process.env);
  }
}
