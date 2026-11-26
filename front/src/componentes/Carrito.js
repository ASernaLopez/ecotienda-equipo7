export default function Carrito({
    productos,
    onCambiarCantidad,
    onConfirmar,
    enviando,
    mensaje,
}) {
    // Calculamos el precio total del carrito.
    const total = productos.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    return (
        <aside className="carrito">
            <h2>Tu carrito</h2>

            {productos.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <ul className="carrito-lista">
                        {productos.map((producto) => (
                            <li key={producto.id}>
                                <strong>{producto.nombre}</strong>

                                <p>
                                    ${producto.precio.toLocaleString("es-CO")}
                                </p>

                                <div className="carrito-controles">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onCambiarCantidad(producto.id, -1)
                                        }
                                    >
                                        −
                                    </button>

                                    <span>{producto.cantidad}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onCambiarCantidad(producto.id, 1)
                                        }
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onCambiarCantidad(producto.id, 0)
                                        }
                                    >
                                        Quitar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <p className="carrito-total">
                        Total: ${total.toLocaleString("es-CO")}
                    </p>

                    <button
                        type="button"
                        onClick={onConfirmar}
                        disabled={enviando}
                        className="boton-confirmar"
                    >
                        {enviando ? "Procesando..." : "Confirmar pedido"}
                    </button>
                </>
            )}

            {mensaje && <p role="status">{mensaje}</p>}
        </aside>
    );
}
