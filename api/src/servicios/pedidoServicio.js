// Importamos la función para buscar productos en SQLite.
import { obtenerProducto } from "../repositorios/productoRepositorio.js";

// Importamos las funciones para guardar y consultar pedidos.
import {
    guardarPedido,
    listarPedidos
} from "../repositorios/pedidoRepositorio.js";

// Convierte el detalle guardado como texto en datos JSON.
function prepararPedido(pedido) {
    return {
        ...pedido,
        detalle: JSON.parse(pedido.detalle)
    };
}

// Valida una compra y la registra en SQLite.
export function registrarPedido(datos) {

    // Comprobamos que recibimos un objeto.
    if (!datos || typeof datos !== "object" ||
        Array.isArray(datos)) {
        return { error: "Debes enviar un pedido válido." };
    }

    // Extraemos el cliente y los productos del carrito.
    const { cliente, productos } = datos;

    // El nombre del cliente es obligatorio.
    if (typeof cliente !== "string" || !cliente.trim()) {
        return { error: "El nombre del cliente es obligatorio." };
    }

    // El carrito debe contener al menos un producto.
    if (!Array.isArray(productos) || productos.length === 0) {
        return { error: "El carrito está vacío." };
    }

    // Preparamos el total y el detalle de la compra.
    let total = 0;
    const detalle = [];

    // Revisamos cada producto del carrito.
    for (const item of productos) {

        // El ID y la cantidad deben ser enteros positivos.
        if (!item ||
            !Number.isInteger(item.id) || item.id <= 0 ||
            !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
            return { error: "El producto o la cantidad no son válidos." };
        }

        // Buscamos el precio verdadero en SQLite.
        const producto = obtenerProducto(item.id);

        if (!producto) {
            return { error: `El producto ${item.id} no existe.` };
        }

        // Calculamos el subtotal y evitamos cifras inseguras.
        const subtotal = producto.precio * item.cantidad;

        if (!Number.isSafeInteger(subtotal) ||
            !Number.isSafeInteger(total + subtotal)) {
            return { error: "El total del pedido es demasiado grande." };
        }

        // Sumamos el subtotal al valor de la compra.
        total += subtotal;

        // Guardamos el detalle de cada producto.
        detalle.push({
            id: producto.id,
            nombre: producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: producto.precio,
            subtotal
        });
    }

    // Guardamos el pedido en SQLite.
    const pedido = guardarPedido(cliente.trim(), total, detalle);

    // Devolvemos el pedido con su información completa.
    return { pedido: prepararPedido(pedido) };
}

// Consulta los pedidos registrados.
export function consultarPedidos() {
    return listarPedidos().map(prepararPedido);
}
