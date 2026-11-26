// Importamos la conexión con SQLite.
import { db } from "./conexion.js";

// Guarda un pedido realizado por un cliente.
export function guardarPedido(cliente, total, detalle) {

    // Preparamos la consulta SQL.
    const consulta = db.prepare(`
    INSERT INTO pedidos (cliente, total, detalle)
    VALUES (?, ?, ?)
  `);

    // Guardamos el pedido y su detalle en formato JSON.
    const resultado = consulta.run(
        cliente,
        total,
        JSON.stringify(detalle)
    );

    // Consultamos el pedido recién creado.
    return db.prepare(
        "SELECT * FROM pedidos WHERE id = ?"
    ).get(Number(resultado.lastInsertRowid));
}

// Consulta los pedidos guardados.
export function listarPedidos() {

    // Mostramos primero los pedidos más recientes.
    return db.prepare(
        "SELECT * FROM pedidos ORDER BY id DESC"
    ).all();
}
