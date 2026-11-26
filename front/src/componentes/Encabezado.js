import Link from "next/link";

// Componente reutilizable de navegación.
export default function Encabezado() {
    return (
        <header className="encabezado">
            <div className="encabezado-contenido">
                <Link href="/" className="marca">
                    AhorraTech
                </Link>

                <nav className="encabezado-nav" aria-label="Navegación principal">
                    <Link href="/">Inicio</Link>
                    <Link href="/catalogo">Catálogo</Link>
                    <Link href="/admin">Administración</Link>
                </nav>
            </div>
        </header>
    );
}
