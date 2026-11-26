
// Importamos la conexión con nuestra base de datos SQLite.
import { db } from "./conexion.js";

// Consulta todos los productos o filtra por categoría.
export function listarProductos(categoria) {
    // Si recibimos una categoría, mostramos solo sus productos.
    if (categoria) {
        return db.prepare(
            "SELECT * FROM productos WHERE categoria = ?"
        ).all(categoria);
    }

    // Si no hay filtro, mostramos todos los productos.
    return db.prepare(
        "SELECT * FROM productos"
    ).all();
}

// Busca un producto específico mediante su ID.
export function obtenerProducto(id) {
    return db.prepare(
        "SELECT * FROM productos WHERE id = ?"
    ).get(id);
}


// Guarda un producto nuevo en SQLite.
export function crearProducto(producto) {
    // Extraemos los datos que recibimos.
    const {
        nombre, categoria, precio,
        wattsAntes, wattsDespues, horasDia
    } = producto;

    // Preparamos la consulta SQL.
    const consulta = db.prepare(`
    INSERT INTO productos
    (nombre, categoria, precio, wattsAntes, wattsDespues, horasDia)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    // Insertamos los valores en la base de datos.
    const resultado = consulta.run(
        nombre, categoria, precio,
        wattsAntes, wattsDespues, horasDia
    );

    // Devolvemos el producto recién creado.
    return obtenerProducto(Number(resultado.lastInsertRowid));
}


// Modifica un producto existente mediante su ID.
export function actualizarProducto(id, producto) {

    // Extraemos los nuevos datos del producto.
    const {
        nombre, categoria, precio,
        wattsAntes, wattsDespues, horasDia
    } = producto;

    // Preparamos la consulta para actualizar sus campos.
    const consulta = db.prepare(`
    UPDATE productos
    SET nombre = ?, categoria = ?, precio = ?,
        wattsAntes = ?, wattsDespues = ?, horasDia = ?
    WHERE id = ?
  `);

    // Guardamos los cambios en SQLite.
    const resultado = consulta.run(
        nombre, categoria, precio,
        wattsAntes, wattsDespues, horasDia, id
    );

    // Devolvemos el producto actualizado, si existe.
    return resultado.changes > 0 ? obtenerProducto(id) : null;
}


// Elimina un producto de SQLite mediante su ID.
export function eliminarProducto(id) {

    // Preparamos la consulta para borrar el producto.
    const consulta = db.prepare(
        "DELETE FROM productos WHERE id = ?"
    );

    // Ejecutamos la eliminación.
    const resultado = consulta.run(id);

    // Devuelve true si se eliminó; false si no existía.
    return resultado.changes > 0;
}
