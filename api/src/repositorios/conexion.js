
 // Importa la herramienta para trabajar con SQLite.
import { DatabaseSync } from "node:sqlite";

// Convierte una dirección de archivo en una ruta del computador.
import { fileURLToPath } from "node:url";

// Ubica nuestra base de datos tienda.db.
const rutaDb = fileURLToPath(
  new URL("../../datos/tienda.db", import.meta.url)
);

// Abre la conexión y permite usarla en otros archivos.
export const db = new DatabaseSync(rutaDb);
