
// Traemos las funciones que consultan los productos en SQLite.
import {
    listarProductos,
    obtenerProducto
} from "../repositorios/productoRepositorio.js";

// Importamos las funciones que modifican SQLite.
import {
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../repositorios/productoRepositorio.js";


// Tarifa ilustrativa por cada kWh consumido.
const TARIFA_REFERENCIA = 960.34;

// Calcula cuánto ahorra un producto al mes.
function calcularAhorro(producto) {

    // Restamos el consumo nuevo al consumo anterior.
    const wattsAhorrados = Math.max(
        producto.wattsAntes - producto.wattsDespues, 0
    );

    // Convertimos el ahorro a kWh mensuales.
    const ahorroKwhMes =
        (wattsAhorrados * producto.horasDia * 30) / 1000;

    // Calculamos el ahorro aproximado en pesos.
    const ahorroPesosMes = ahorroKwhMes * TARIFA_REFERENCIA;

    // Devolvemos el producto con sus cálculos.
    return {
        ...producto,
        ahorroKwhMes: Number(ahorroKwhMes.toFixed(2)),
        ahorroPesosMes: Math.round(ahorroPesosMes)
    };
}

// Consulta los productos y calcula sus ahorros.
export function consultarProductos(categoria) {
    const productos = listarProductos(categoria);
    return productos.map(calcularAhorro);
}

// Consulta un producto específico por su ID.
export function consultarProductoPorId(id) {
    const producto = obtenerProducto(id);

    // Si no existe, devolvemos null.
    if (!producto) return null;

    return calcularAhorro(producto);
}


// Comprueba que los datos de un producto sean válidos.
export function validarProducto(producto) {

    // Verificamos que recibimos un objeto.
    if (!producto || typeof producto !== "object" || Array.isArray(producto)) {
        return "Debes enviar los datos del producto.";
    }

    // El nombre debe ser un texto y no estar vacío.
    if (typeof producto.nombre !== "string" ||
        !producto.nombre.trim()) {
        return "El nombre del producto es obligatorio.";
    }

    // Solo permitimos las tres categorías de AhorraTech.
    const categorias = ["iluminacion", "electrodomesticos", "solar"];

    if (!categorias.includes(producto.categoria)) {
        return "La categoría no es válida.";
    }

    // El precio debe ser un número entero positivo.
    if (!Number.isInteger(producto.precio) || producto.precio <= 0) {
        return "El precio debe ser un número entero positivo.";
    }

    // Los consumos deben ser números iguales o mayores que cero.
    if (!Number.isFinite(producto.wattsAntes) ||
        producto.wattsAntes < 0 ||
        !Number.isFinite(producto.wattsDespues) ||
        producto.wattsDespues < 0) {
        return "Los consumos eléctricos no son válidos.";
    }

    // Las horas diarias deben estar entre 0 y 24.
    if (!Number.isFinite(producto.horasDia) ||
        producto.horasDia <= 0 ||
        producto.horasDia > 24) {
        return "Las horas diarias deben estar entre 0 y 24.";
    }

    // Si todo está correcto, no devolvemos ningún error.
    return null;
}


// Valida los datos y registra un producto nuevo.
export function registrarProducto(producto) {

    // Comprobamos si hay errores en los datos recibidos.
    const error = validarProducto(producto);

    // Si hay un error, no guardamos el producto.
    if (error) {
        return { error };
    }

    // Quitamos espacios innecesarios del nombre.
    const datos = {
        ...producto,
        nombre: producto.nombre.trim()
    };


    // Intentamos guardar el producto.
    try {
        const nuevoProducto = crearProducto(datos);

        // Si se guardó, devolvemos el producto con su ahorro.
        return { producto: calcularAhorro(nuevoProducto) };

    } catch (error) {

        // Detectamos si el nombre ya existe en SQLite.
        if (error.message?.includes(
            "UNIQUE constraint failed: productos.nombre"
        )) {
            return { error: "Ya existe un producto con ese nombre." };
        }

        // Otros errores se informan para poder investigarlos.
        throw error;
    }
}


// Valida y modifica un producto existente.
export function modificarProducto(id, producto) {

    // Comprobamos que el producto exista en SQLite.
    if (!obtenerProducto(id)) {
        return { noEncontrado: true };
    }

    // Validamos los nuevos datos.
    const error = validarProducto(producto);

    if (error) {
        return { error };
    }

    // Quitamos espacios innecesarios del nombre.
    const datos = {
        ...producto,
        nombre: producto.nombre.trim()
    };

    try {
        // Solicitamos al repositorio actualizar el producto.
        const actualizado = actualizarProducto(id, datos);

        // Devolvemos el producto con el ahorro calculado.
        return { producto: calcularAhorro(actualizado) };

    } catch (error) {

        // Controlamos los nombres duplicados.
        if (error.message?.includes(
            "UNIQUE constraint failed: productos.nombre"
        )) {
            return { error: "Ya existe un producto con ese nombre." };
        }

        // Informamos otros errores inesperados.
        throw error;
    }
}


// Elimina un producto mediante su identificador.
export function borrarProducto(id) {

    // Pedimos al repositorio que elimine el producto.
    const eliminado = eliminarProducto(id);

    // Si no existía, informamos el resultado.
    if (!eliminado) {
        return { noEncontrado: true };
    }

    // Confirmamos que el producto fue eliminado.
    return { eliminado: true };
}
