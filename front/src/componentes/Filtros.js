export default function Filtros({ categoria, onCambiarCategoria }) {
    const categorias = [
        { valor: "", nombre: "Todos" },
        { valor: "iluminacion", nombre: "Iluminación" },
        { valor: "electrodomesticos", nombre: "Electrodomésticos" },
        { valor: "solar", nombre: "Solar" },
    ];

    return (
        <div className="filtros">
            <p className="filtros-titulo">Filtrar productos:</p>

            <div className="filtros-opciones">
                {categorias.map(({ valor, nombre }) => (
                    <button
                        key={valor}
                        type="button"
                        className={
                            categoria === valor
                                ? "filtro-boton activo"
                                : "filtro-boton"
                        }
                        onClick={() => onCambiarCategoria(valor)}
                        aria-pressed={categoria === valor}
                    >
                        {nombre}
                    </button>
                ))}
            </div>
        </div>
    );
}
