
// Importamos Express para crear las rutas de nuestra API.
import express from "express";

// Importamos las funciones para gestionar productos.
import {
    consultarProductos,
    consultarProductoPorId,
    registrarProducto,
    modificarProducto,
    borrarProducto
} from "../servicios/productoServicio.js";

// Creamos un conjunto de rutas.
const router = express.Router();

// GET: consulta todos los productos o filtra por categoría.
router.get("/", (req, res) => {

    // Leemos la categoría enviada en la URL.
    const categoria = req.query.categoria;

    // Comprobamos que el filtro sea un texto, si existe.
    if (categoria !== undefined && typeof categoria !== "string") {
        return res.status(400).json({
            error: "La categoría debe ser un texto."
        });
    }

    // Solicitamos los productos a la capa de servicios.
    const productos = consultarProductos(categoria);

    // Respondemos con los productos en formato JSON.
    return res.status(200).json(productos);
});


// GET: consulta un producto mediante su ID.
router.get("/:id", (req, res) => {

    // Obtenemos el ID enviado en la URL.
    const idTexto = req.params.id;

    // Comprobamos que sea un entero positivo.
    if (!/^[0-9]+$/.test(idTexto)) {
        return res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
    }

    // Convertimos el ID a número.
    const id = Number(idTexto);

    // Comprobamos que sea un número válido y seguro.
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
    }

    // Buscamos el producto en SQLite mediante el servicio.
    const producto = consultarProductoPorId(id);

    // Si no existe, devolvemos HTTP 404.
    if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado."
        });
    }

    // Si existe, devolvemos HTTP 200 y sus datos.
    return res.status(200).json(producto);
});


// POST: registra un producto nuevo.
router.post("/", (req, res) => {

    try {
        // Recibimos los datos enviados por el cliente.
        const datos = req.body;

        // El servicio valida y registra el producto.
        const resultado = registrarProducto(datos);

        // Si los datos son incorrectos, respondemos HTTP 400.
        if (resultado.error) {
            return res.status(400).json({
                error: resultado.error
            });
        }

        // Si se creó correctamente, respondemos HTTP 201.
        return res.status(201).json(resultado.producto);

    } catch (error) {

        // Registramos el error para investigarlo.
        console.error("Error al registrar producto:", error);

        // Evitamos mostrar detalles internos al cliente.
        return res.status(500).json({
            error: "No se pudo registrar el producto."
        });
    }
});


// PUT: actualiza un producto mediante su ID.
router.put("/:id", (req, res) => {
    try {
        // Obtenemos el ID enviado en la URL.
        const idTexto = req.params.id;
        const id = Number(idTexto);

        // Comprobamos que el ID sea válido.
        if (!/^[0-9]+$/.test(idTexto) ||
            !Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "El ID debe ser un número entero positivo."
            });
        }

        // Enviamos los nuevos datos al servicio.
        const resultado = modificarProducto(id, req.body);

        // Si el producto no existe, respondemos 404.
        if (resultado.noEncontrado) {
            return res.status(404).json({
                error: "Producto no encontrado."
            });
        }

        // Si los datos son incorrectos, respondemos 400.
        if (resultado.error) {
            return res.status(400).json({
                error: resultado.error
            });
        }

        // Devolvemos el producto actualizado.
        return res.status(200).json(resultado.producto);

    } catch (error) {
        // Registramos los errores inesperados.
        console.error("Error al actualizar producto:", error);

        return res.status(500).json({
            error: "No se pudo actualizar el producto."
        });
    }
});


// DELETE: elimina un producto mediante su ID.
router.delete("/:id", (req, res) => {
    try {
        // Obtenemos el identificador de la URL.
        const idTexto = req.params.id;
        const id = Number(idTexto);

        // Verificamos que el ID sea válido.
        if (!/^[0-9]+$/.test(idTexto) ||
            !Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "El ID debe ser un número entero positivo."
            });
        }

        // Solicitamos la eliminación al servicio.
        const resultado = borrarProducto(id);

        // Si no existe, respondemos HTTP 404.
        if (resultado.noEncontrado) {
            return res.status(404).json({
                error: "Producto no encontrado."
            });
        }

        // Confirmamos la eliminación con HTTP 200.
        return res.status(200).json({
            mensaje: "Producto eliminado correctamente."
        });

    } catch (error) {
        // Registramos errores inesperados.
        console.error("Error al eliminar producto:", error);

        return res.status(500).json({
            error: "No se pudo eliminar el producto."
        });
    }
});


// Permitimos utilizar estas rutas desde servidor.js.
export default router;
