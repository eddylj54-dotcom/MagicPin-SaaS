# Resumen del Proyecto

Esta es una aplicación web full-stack para gestionar cuentas de redes sociales. Es un "Panel de control SaaS moderno" inspirado en herramientas como Linear, Notion y Asana. La aplicación permite a los usuarios conectar sus cuentas de redes sociales, programar publicaciones, generar contenido con IA y ver análisis.

## Tecnologías

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Tailwind CSS
    *   Radix UI
    *   Wouter (para el enrutamiento)
    *   React Query (para la obtención de datos)
*   **Backend:**
    *   Node.js
    *   Express
    *   Firebase (para autenticación y otros servicios)
    *   Google Generative AI

## Compilación y Ejecución

*   **Desarrollo:**
    *   Para iniciar el servidor de desarrollo, ejecuta:
        ```bash
        npm run dev
        ```
*   **Compilación para Producción:**
    *   Para compilar el cliente y el servidor para producción, ejecuta:
        ```bash
        npm run build
        ```
*   **Inicio en Producción:**
    *   Para iniciar el servidor de producción, ejecuta:
        ```bash
        npm run start
        ```
*   **Verificación de Tipos:**
    *   Para verificar errores de TypeScript, ejecuta:
        ```bash
        npm run check
        ```

## Convenciones de Desarrollo

El proyecto sigue una estética de diseño SaaS moderna, con un enfoque en la claridad, la eficiencia y la densidad de la información. Las directrices de diseño están documentadas en `design_guidelines.md`. El frontend está construido con una arquitectura basada en componentes, utilizando una combinación de componentes personalizados y primitivas de Radix UI. El backend es una aplicación Express estándar con rutas para los puntos finales de la API.