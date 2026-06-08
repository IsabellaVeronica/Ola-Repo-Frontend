# Project Blueprint

## Overview

This project is a static-first web application built with Astro.js. It is designed to be developed within the Firebase Studio (formerly Project IDX) environment. The focus is on creating a fast, highly-performant, and scalable site that delivers minimal JavaScript by default, ensuring an exceptional user experience and top-tier Core Web Vitals.

## Implemented Features

*   **Logo & Branding**: Integrated original company logo and fuchsia theme.
*   **Soft Delete**: Implemented logical deletion for users to preserve audit history.
*   **Dynamic Hero**: Added dashboard settings to customize storefront hero text.
*   **Inventory Management**:
    *   **Products as Groupers**: Public listing shows aggregated stock and variant counts.
    *   **Variants as Units of Stock**: SKUs and individual stock levels managed at the variant level.
    *   **Auto-Default**: Automatic creation of "Estándar" variant when creating new products.
    *   **Excel Bulk Import**: Massive creation of products and variants via `.xlsx` files, including template download and detailed validation reporting.
*   **Audit Preservation**: Enhanced auditoria to keep actor names even after user deletion.
*   **Lifestyle Collage**: Added a premium image collage section to the storefront using brand experience imagery.
*   **Cédula-Based Client System**: Unique identification of clients via "Cédula", with automatic data recovery for returning customers in the Cart.
*   **Money Management Module**: Integrated bank accounts and physically tracked cash registers with an immutable ledger (`cuenta` and `transaccion_caja`), supporting real-time transaction query, balance overview, and transaction-safe modifications.
*   **Sales Section Layout**: Restructured sales dashboard to feature clear, easily toggleable sections using Radix Tabs.
*   **Módulo Independiente de Reportes**: Se extrajo la pestaña de reportes de la sección de inventario para crear un nuevo módulo independiente accesible directamente desde el menú lateral de navegación.

## Recent Changes
- **Pestañas de Ventas**: Se dividió la pantalla de ventas en pestañas rápidas: Registrar Venta (POS) y Ventas Registradas (Historial).
- **Selección de Moneda y Auto-Cálculo**: Se refinó la interfaz de pagos mixtos para permitir seleccionar la moneda de pago de un menú desplegable (USD, VES, COP) y digitar el monto en USD ($), calculando automáticamente el equivalente en la divisa seleccionada mediante la tasa de cambio, y filtrando las cuentas destino correspondientes.
- **Creación de Reportes como Módulo Independiente**: Integrado con éxito en el Sidebar del Dashboard.
- **Área de Inteligencia Financiera**: Integración de los KPIs de Ventas y Ganancias, resumen de facturación semanal del mes actual y gráfico temporal en la pestaña "Ventas y Ganancias" del módulo de reportes.

## Current Plan: Corrección de Predicción de Reposición
- **Backend (Express)**:
  - Modificar `/reports/inventario/top-salidas` en `reports.routes.js` para soportar el parámetro de consulta `days` y filtrar los movimientos por fecha usando `NOW() - make_interval(days => $1::int)`.
- **Frontend (Astro & React)**:
  - En `reposicion.ts` (Astro API proxy), propagar `min_stock` en el objeto enriquecido usando el parámetro `threshold`.
  - En `StockAlerts.tsx`, ajustar `computeReplenishment` para usar `min_stock` como amortiguador de seguridad cuando no hay ventas, y forzar `semanas_restantes = 0` si el stock actual es 0.
  - En la interfaz de usuario de `StockAlerts.tsx`, cambiar la visualización de `∞` a `—` cuando no haya ventas del producto para mejorar la legibilidad y coherencia visual.

