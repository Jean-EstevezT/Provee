# Provee

Tu administrador de inventario del hogar. Lleva un control de tu alacena, planifica tus compras y monitorea tu presupuesto de forma local.

Este proyecto es una PWA (Progressive Web App) "Local First", lo que significa que tus datos se guardan de forma segura en tu dispositivo.

## Tecnologías Utilizadas

- **React (Vite)**: Framework principal para construir la interfaz de usuario de forma increíblemente rápida.
- **TypeScript**: Tipado estático para un código más robusto y mantenible.
- **CSS / Tailwind CSS (v4)**: Para un diseño moderno, estéticamente agradable e interfaces que se adaptan a cualquier pantalla.
- **IndexedDB / Dexie.js**: Base de datos local directamente en el navegador, asegurando un acceso veloz a tu información incluso sin internet.

## Estructura del Proyecto

El proyecto se divide en las siguientes categorías principales (ubicadas en `src/pages`):

- **Configuración**: Ajustes generales de la aplicación.
- **Alacena**: Control del inventario que tienes actualmente en casa.
- **Listas de compras**: Para planificar tus visitas al supermercado.
- **Productos**: Catálogo de artículos con los que interactúas.
- **Categorías**: Gestión de categorías para organizar mejor tus productos.
- **Historial de compras**: Registro de adquisiciones pasadas.
- **Presupuesto**: Planeamiento de cuánto quieres gastar.
- **Mis gastos**: Seguimiento real de los desembolsos realizados.
- **Acerca de**: Información sobre la aplicación.

## Requisitos

- Node.js (v18 o superior)
- npm o pnpm

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar todas las dependencias.
3. Ejecuta `npm run dev` para levantar el servidor de desarrollo local.
4. (Opcional) Ejecuta `npm run build` para crear la versión de producción optimizada.
