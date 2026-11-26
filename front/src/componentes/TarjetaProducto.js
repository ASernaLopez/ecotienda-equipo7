export default function TarjetaProducto({ producto, onAgregar }) {
    return (
        <article className="tarjeta-producto">
            <span className="tarjeta-categoria">
                {producto.categoria}
            </span>

            <h2>{producto.nombre}</h2>

            <p className="tarjeta-precio">
                ${producto.precio.toLocaleString("es-CO")}
            </p>

            <p className="tarjeta-ahorro">
                Ahorro estimado: {producto.ahorroKwhMes} kWh/mes
            </p>

            <button
                type="button"
                className="boton-agregar"
                onClick={() => onAgregar(producto)}
            >
                + Añadir al carrito
            </button>
        </article>
    );
}
