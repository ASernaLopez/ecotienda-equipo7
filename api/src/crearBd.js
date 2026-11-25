// Importa la herramienta para crear y consultar bases de datos SQLite.
import { DatabaseSync } from "node:sqlite";

// Importa la función para crear carpetas en el computador.
import { mkdirSync } from "node:fs";

// dirname obtiene la carpeta de un archivo.
// join une partes de una ruta.
import { dirname, join } from "node:path";

// Convierte la ubicación del archivo JavaScript en una ruta del computador.
import { fileURLToPath } from "node:url";

// 1. Ubicamos la carpeta donde guardaremos la base de datos.
const carpetaActual = dirname(fileURLToPath(import.meta.url));
const carpetaDatos = join(carpetaActual, "..", "datos");

// Creamos la carpeta "datos" si todavía no existe.
mkdirSync(carpetaDatos, { recursive: true });

// Abrimos o creamos el archivo SQLite.
const db = new DatabaseSync(join(carpetaDatos, "tienda.db"));

// 2. Creamos las dos tablas que exige el profesor.
db.exec(`
  -- Guarda los productos disponibles en AhorraTech.
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL,
    precio INTEGER NOT NULL CHECK (precio > 0),
    wattsAntes REAL NOT NULL CHECK (wattsAntes >= 0),
    wattsDespues REAL NOT NULL CHECK (wattsDespues >= 0),
    horasDia REAL NOT NULL CHECK (horasDia > 0 AND horasDia <= 24)
  );

  -- Guarda los pedidos realizados por los clientes.
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT NOT NULL,
    fecha TEXT NOT NULL DEFAULT (datetime('now')),
    total INTEGER NOT NULL CHECK (total >= 0),
    detalle TEXT NOT NULL
  );
`);

// 3. Definimos ocho productos propios de AhorraTech.
// Orden: nombre, categoría, precio, watts antes,
// watts después y horas de uso diario.
// Los precios y consumos son ejemplos académicos.
const productos = [
  // Iluminación
  ["Lámpara de escritorio LED 7 W", "iluminacion", 45900, 40, 7, 5],
  ["Luminaria exterior LED con sensor", "iluminacion", 129900, 80, 15, 4],
  ["Tira LED eficiente de 5 metros", "iluminacion", 79900, 60, 18, 5],

  // Electrodomésticos
  ["Ventilador de pedestal con motor DC", "electrodomesticos", 299900, 75, 30, 8],
  ["Lavadora con motor inverter", "electrodomesticos", 1899000, 600, 350, 1.5],
  ["Deshumidificador de bajo consumo", "electrodomesticos", 779900, 350, 210, 4],

  // Energía solar
  ["Reflector solar LED autónomo", "solar", 179900, 100, 0, 5],
  ["Sistema de iluminación solar para senderos", "solar", 349900, 120, 0, 5]
];

// 4. Preparamos la consulta para guardar productos.
// Los signos ? reciben los valores de cada producto.
const insertar = db.prepare(`
  INSERT OR IGNORE INTO productos
  (nombre, categoria, precio, wattsAntes, wattsDespues, horasDia)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Recorremos los ocho productos y los guardamos.
for (const producto of productos) {
  insertar.run(...producto);
}

// 5. Contamos los productos registrados.
const resultado = db.prepare(
  "SELECT COUNT(*) AS total FROM productos"
).get();

// Mostramos el resultado en la terminal.
console.log("Base de datos creada correctamente.");
console.log("Tablas: productos y pedidos.");
console.log("Productos registrados:", resultado.total);

// Cerramos la conexión con SQLite.
db.close();
