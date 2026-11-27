
# AhorraTech - Evidencia de Aprendizaje 3

Proyecto académico de Ingeniería Web I - IU Digital de Antioquia.

AhorraTech es una tienda virtual enfocada en productos de eficiencia energética. En esta tercera evidencia se integró una API REST con una aplicación web desarrollada en React y Next.js.

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- SQLite (node:sqlite)
- API REST con arquitectura de tres capas

### Frontend
- React
- Next.js 16.4.6
- JavaScript
- CSS
- Fetch API

## Estructura del proyecto

- `api/`: servidor y base de datos.
- `api/src/rutas/`: definición de endpoints HTTP.
- `api/src/servicios/`: validación y lógica de negocio.
- `api/src/repositorios/`: operaciones con SQLite.
- `api/pruebas.http`: solicitudes para probar la API.
- `front/`: aplicación web desarrollada con Next.js.
- `front/src/app/`: páginas de inicio, catálogo y administración.
- `front/src/componentes/`: componentes reutilizables.
- `front/src/lib/api.js`: comunicación con la API.

## Requisitos

- Node.js 22 o superior.
- npm.
- Dos terminales para ejecutar el backend y el frontend.

## Instalación y ejecución

### 1. Iniciar el backend

Desde la carpeta principal del repositorio:

```bash
cd api
npm ci
npm run crear-bd
npm start
```

El servidor estará disponible en:

http://localhost:3001

El comando `npm run crear-bd` se utiliza para preparar la base de datos en una instalación inicial. Crea las tablas y los productos de ejemplo.

### 2. Iniciar el frontend

Abre una segunda terminal, desde la carpeta principal del repositorio:

```bash
cd front
npm ci
npm run dev
```

Abre la aplicación en:

http://localhost:3000

## Páginas de la aplicación

- `/`: presentación de AhorraTech.
- `/catalogo`: consulta de productos, filtros por categoría, carrito y registro de pedidos.
- `/admin`: formulario para crear productos y tabla para consultarlos y eliminarlos.

## Endpoints de la API

| Método | Ruta | Función |
|---|---|---|
| GET | /api/productos | Listar productos |
| GET | /api/productos?categoria=solar | Filtrar productos |
| GET | /api/productos/:id | Consultar un producto |
| POST | /api/productos | Registrar un producto |
| PUT | /api/productos/:id | Actualizar un producto |
| DELETE | /api/productos/:id | Eliminar un producto |
| POST | /api/pedidos | Registrar un pedido |
| GET | /api/pedidos | Consultar pedidos |

La API utiliza respuestas HTTP como 200, 201, 400 y 404, según el resultado de cada operación.

## Arquitectura

La aplicación se organiza de la siguiente manera:

Frontend React / Next.js
        |
        | Solicitudes HTTP con fetch
        v
API REST Express
        |
        v
Rutas
        |
        v
Servicios (validaciones y lógica de negocio)
        |
        v
Repositorios
        |
        v
Base de datos SQLite

## Pruebas

Las solicitudes de la API fueron verificadas mediante Postman.

También se incluye `api/pruebas.http` con ejemplos de consultas y operaciones CRUD.

Para verificar las dependencias:

```bash
cd api
npm audit
```

Y desde la carpeta del frontend:

```bash
cd front
npm audit
```

Durante las pruebas de la evidencia, ambos proyectos reportaron cero vulnerabilidades conocidas.

## Compilación del frontend

Desde `front/`:

```bash
npm run build
```

Next.js genera una exportación estática en la carpeta `out/`.

Importante: para utilizar las funciones dinámicas del catálogo, carrito y administración, la API debe estar ejecutándose y ser accesible desde el navegador.

## Base de datos y archivos generados

La base de datos SQLite no se incluye en el repositorio. Se genera localmente mediante el comando correspondiente.

También se excluyen las carpetas `node_modules`, `.next` y `out`, ya que contienen dependencias o archivos generados.

## Autor

Alejandro Serna López

Tecnología en Desarrollo de Software

IU Digital de Antioquia - Ingeniería Web I