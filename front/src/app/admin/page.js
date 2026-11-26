"use client";

import { useEffect, useState } from "react";
import {
    obtenerProductos,
    crearProducto,
    eliminarProducto,
} from "../../lib/api";

export default function Administracion() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    // Consultamos los productos de SQLite.
    useEffect(() => {
        async function cargarProductos() {
            try {
                const datos = await obtenerProductos();
                setProductos(datos);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }

        cargarProductos();
    }, []);

    // Creamos un producto con los datos del formulario.
    async function guardarProducto(evento) {
        evento.preventDefault();

        const formulario = evento.currentTarget;
        const campos = new FormData(formulario);

        const producto = {
            nombre: String(campos.get("nombre")).trim(),
            categoria: String(campos.get("categoria")),
            precio: Number(campos.get("precio")),
            wattsAntes: Number(campos.get("wattsAntes")),
            wattsDespues: Number(campos.get("wattsDespues")),
            horasDia: Number(campos.get("horasDia")),
        };

        setProcesando(true);
        setMensaje("");
        setError("");

        try {
            await crearProducto(producto);

            const datos = await obtenerProductos();
            setProductos(datos);

            formulario.reset();
            setMensaje("¡Producto creado correctamente!");
        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(false);
        }
    }

    // Eliminamos un producto desde la tabla.
    async function borrarProducto(producto) {
        const confirmar = window.confirm(
            `¿Deseas eliminar "${producto.nombre}"?`
        );

        if (!confirmar) return;

        setProcesando(true);
        setMensaje("");
        setError("");

        try {
            await eliminarProducto(producto.id);

            const datos = await obtenerProductos();
            setProductos(datos);

            setMensaje("Producto eliminado correctamente.");
        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(false);
        }
    }

    return (
        <main className="administracion">
            <h1>Administración AhorraTech</h1>
            <p>Gestiona los productos de nuestra tienda.</p>

            <section className="admin-formulario">
                <h2>Registrar nuevo producto</h2>

                <form onSubmit={guardarProducto}>
                    <label htmlFor="admin-nombre">Nombre</label>
                    <input
                        id="admin-nombre"
                        name="nombre"
                        type="text"
                        required
                        placeholder="Ej. Bombillo LED inteligente"
                    />

                    <label htmlFor="admin-categoria">Categoría</label>
                    <select
                        id="admin-categoria"
                        name="categoria"
                        required
                    >
                        <option value="iluminacion">Iluminación</option>
                        <option value="electrodomesticos">
                            Electrodomésticos
                        </option>
                        <option value="solar">Solar</option>
                    </select>

                    <label htmlFor="admin-precio">Precio (COP)</label>
                    <input
                        id="admin-precio"
                        name="precio"
                        type="number"
                        min="1"
                        step="1"
                        required
                    />

                    <label htmlFor="admin-watts-antes">
                        Consumo anterior (W)
                    </label>
                    <input
                        id="admin-watts-antes"
                        name="wattsAntes"
                        type="number"
                        min="0"
                        step="any"
                        required
                    />

                    <label htmlFor="admin-watts-despues">
                        Consumo eficiente (W)
                    </label>
                    <input
                        id="admin-watts-despues"
                        name="wattsDespues"
                        type="number"
                        min="0"
                        step="any"
                        required
                    />

                    <label htmlFor="admin-horas">
                        Horas de uso al día
                    </label>
                    <input
                        id="admin-horas"
                        name="horasDia"
                        type="number"
                        min="0.1"
                        max="24"
                        step="any"
                        required
                    />

                    <button type="submit" disabled={procesando}>
                        {procesando ? "Procesando..." : "Crear producto"}
                    </button>
                </form>
            </section>

            {mensaje && <p role="status">{mensaje}</p>}
            {error && <p role="alert">{error}</p>}

            <section className="admin-productos">
                <h2>Productos registrados</h2>

                {cargando ? (
                    <p>Cargando productos...</p>
                ) : (
                    <div className="admin-tabla-contenedor">
                        <table className="admin-tabla">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.categoria}</td>
                                        <td>
                                            ${producto.precio.toLocaleString("es-CO")}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => borrarProducto(producto)}
                                                disabled={procesando}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {productos.length === 0 && !error && (
                            <p>No hay productos registrados.</p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
