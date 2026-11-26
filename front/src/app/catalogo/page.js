"use client";

import { useEffect, useState } from "react";
import { obtenerProductos, registrarPedido } from "../../lib/api";
import TarjetaProducto from "../../componentes/TarjetaProducto";
import Filtros from "../../componentes/Filtros";
import Carrito from "../../componentes/Carrito";

export default function Catalogo() {
    // Estados del catálogo.
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Estados del carrito.
    const [carrito, setCarrito] = useState([]);
    const [cliente, setCliente] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // Consultamos los productos desde nuestra API.
    useEffect(() => {
        let activo = true;

        async function cargarProductos() {
            setCargando(true);
            setError("");

            try {
                const datos = await obtenerProductos(categoria);

                if (activo) {
                    setProductos(datos);
                }
            } catch (error) {
                if (activo) {
                    setError(error.message);
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        cargarProductos();

        return () => {
            activo = false;
        };
    }, [categoria]);

    // Añadimos un producto al carrito.
    function agregarAlCarrito(producto) {
        setCarrito((anterior) => {
            const existente = anterior.find(
                (item) => item.id === producto.id
            );

            if (existente) {
                return anterior.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            return [...anterior, { ...producto, cantidad: 1 }];
        });

        setMensaje("");
    }

    // Aumentamos, disminuimos o quitamos productos.
    function cambiarCantidad(id, cambio) {
        setCarrito((anterior) =>
            anterior
                .map((item) => {
                    if (item.id !== id) return item;

                    return {
                        ...item,
                        cantidad:
                            cambio === 0 ? 0 : item.cantidad + cambio,
                    };
                })
                .filter((item) => item.cantidad > 0)
        );

        setMensaje("");
    }

    // Enviamos el pedido a Express y SQLite.
    async function confirmarPedido() {
        if (!cliente.trim()) {
            setMensaje("Escribe el nombre del cliente.");
            return;
        }

        if (carrito.length === 0) {
            setMensaje("Agrega productos antes de confirmar.");
            return;
        }

        setEnviando(true);
        setMensaje("");

        try {
            const pedido = await registrarPedido(cliente.trim(), carrito);

            setMensaje(
                `¡Pedido #${pedido.id} registrado correctamente!`
            );
            setCarrito([]);
            setCliente("");
        } catch (error) {
            setMensaje(error.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="catalogo">
            <h1>Catálogo AhorraTech</h1>
            <p>Productos eficientes para consumir menos energía.</p>

            <Filtros
                categoria={categoria}
                onCambiarCategoria={setCategoria}
            />

            {cargando && <p>Cargando productos...</p>}

            {error && <p role="alert">{error}</p>}

            {!cargando && !error && (
                <section className="lista-productos">
                    {productos.map((producto) => (
                        <TarjetaProducto
                            key={producto.id}
                            producto={producto}
                            onAgregar={agregarAlCarrito}
                        />
                    ))}
                </section>
            )}

            <section className="zona-carrito">
                <label htmlFor="nombre-cliente">
                    Nombre del cliente
                </label>

                <input
                    id="nombre-cliente"
                    type="text"
                    value={cliente}
                    onChange={(evento) =>
                        setCliente(evento.target.value)
                    }
                    placeholder="Escribe tu nombre"
                    maxLength={100}
                />

                <Carrito
                    productos={carrito}
                    onCambiarCantidad={cambiarCantidad}
                    onConfirmar={confirmarPedido}
                    enviando={enviando}
                    mensaje={mensaje}
                />
            </section>
        </main>
    );
}
