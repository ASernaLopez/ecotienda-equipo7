
import express from "express";

// Importamos las funciones de pedidos.
import {
    registrarPedido,
    consultarPedidos
} from "../servicios/pedidoServicio.js";

const router = express.Router();

// GET: consultar los pedidos registrados.
router.get("/", (req, res) => {
    try {
        const pedidos = consultarPedidos();
        return res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error al consultar pedidos:", error);
        return res.status(500).json({
            error: "No se pudieron consultar los pedidos."
        });
    }
});

// POST: registrar un pedido nuevo.
router.post("/", (req, res) => {
    try {
        const resultado = registrarPedido(req.body);

        if (resultado.error) {
            return res.status(400).json({
                error: resultado.error
            });
        }

        return res.status(201).json(resultado.pedido);
    } catch (error) {
        console.error("Error al registrar pedido:", error);
        return res.status(500).json({
            error: "No se pudo registrar el pedido."
        });
    }
});

export default router;
