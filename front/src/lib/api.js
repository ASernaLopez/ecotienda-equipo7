
const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Consultamos los productos guardados en SQLite.
export async function obtenerProductos(categoria = "") {
    const filtro = categoria
        ? `?categoria=${encodeURIComponent(categoria)}`
        : "";

    const respuesta = await fetch(
        `${API_URL}/api/productos${filtro}`
    );

    if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos.");
    }

    return await respuesta.json();
}


// Enviamos un pedido a nuestra API para guardarlo en SQLite.
export async function registrarPedido(cliente, productos) {
    const respuesta = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cliente,
            productos: productos.map(({ id, cantidad }) => ({
                id,
                cantidad,
            })),
        }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo registrar el pedido.");
    }

    return datos;
}


// Crear un producto desde la administración.
export async function crearProducto(producto) {
    const respuesta = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        throw new Error(
            datos.error || "No se pudo crear el producto."
        );
    }

    return datos;
}

// Eliminar un producto por su ID.
export async function eliminarProducto(id) {
    const respuesta = await fetch(
        `${API_URL}/api/productos/${id}`,
        {
            method: "DELETE",
        }
    );

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        throw new Error(
            datos.error || "No se pudo eliminar el producto."
        );
    }

    return datos;
}
