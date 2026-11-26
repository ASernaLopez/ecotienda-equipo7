
// Importamos Express para crear nuestro servidor web.
import express from "express";

// Importamos CORS para permitir solicitudes del frontend.
import cors from "cors";

// Importamos las rutas de productos.
import productoRutas from "./rutas/productoRutas.js";

// Importamos las rutas de pedidos.
import pedidoRutas from "./rutas/pedidoRutas.js";

// Creamos la aplicación de Express.
const app = express();

// Permitimos solicitudes desde otros orígenes.
app.use(cors());

// Permitimos recibir datos en formato JSON.
app.use(express.json());
// Conectamos las rutas de productos con nuestra API.
app.use("/api/productos", productoRutas);

// Conectamos las rutas de pedidos con nuestra API.
app.use("/api/pedidos", pedidoRutas);

// Elegimos el puerto del servidor.
const puerto = process.env.PORT || 3001;

// Ponemos el servidor a escuchar solicitudes.
app.listen(puerto, () => {
    console.log(`API AhorraTech iniciada en el puerto ${puerto}`);
});
