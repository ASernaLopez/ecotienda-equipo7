
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Encabezado from "../componentes/Encabezado";

// Fuentes utilizadas en nuestra aplicación.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Información que identifica nuestra tienda.
export const metadata = {
  title: "AhorraTech | Tecnología eficiente",
  description:
    "Tienda de productos eficientes para ahorrar energía. Menos consumo. Más futuro.",
};

// Estructura compartida de todas las páginas.
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Encabezado />
        {children}
      </body>
    </html>
  );
}
