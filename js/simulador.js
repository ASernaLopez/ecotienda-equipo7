
/* Simulador de ahorro energético de AhorraTech */

// Elementos HTML que vamos a actualizar.
const controlHoras = document.querySelector("#horas-uso");
const horasValor = document.querySelector("#horas-valor");
const kwhValor = document.querySelector("#kwh-valor");
const pesosValor = document.querySelector("#pesos-valor");

// Datos de la comparación.
const POTENCIA_TRADICIONAL = 60;
const POTENCIA_LED = 9;
const TARIFA_SIMULADOR = 950;
const DIAS_SIMULADOR = 30;

// Calcula el ahorro según las horas seleccionadas.
function calcularSimulacion() {
    const horas = Number(controlHoras.value);

    const ahorroKwh =
        ((POTENCIA_TRADICIONAL - POTENCIA_LED) *
            horas *
            DIAS_SIMULADOR) / 1000;

    const ahorroPesos = ahorroKwh * TARIFA_SIMULADOR;

    // Actualiza los resultados visibles.
    horasValor.textContent = horas;
    kwhValor.textContent =
        `${ahorroKwh.toLocaleString("es-CO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} kWh`;

    pesosValor.textContent =
        `$${Math.round(ahorroPesos).toLocaleString("es-CO")}`;
}

// Recalcula inmediatamente al mover el control.
controlHoras.addEventListener("input", calcularSimulacion);

// Muestra los valores iniciales.
calcularSimulacion();
