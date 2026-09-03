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
- **Corrección de Predicción de Reposición**:
    *   **Backend (Express)**: Se modificó `/reports/inventario/top-salidas` en `reports.routes.js` para soportar el parámetro de consulta `days` y filtrar los movimientos por fecha.
    *   **Frontend (Astro & React)**:
        - En `reposicion.ts`, se propaga `min_stock` en el objeto enriquecido usando el parámetro `threshold`.
        - En `StockAlerts.tsx`, se ajustó `computeReplenishment` para usar `min_stock` como amortiguador de seguridad cuando no hay ventas.
        - En `StockAlerts.tsx` UI, se cambió la visualización de `∞` a `—` when no haya ventas.
- **Solución de Error de Despliegue en Vercel**:
    *   Se eliminó la carpeta `.vercel` del historial de Git (`git rm -r --cached .vercel`) y se agregó a `.gitignore`.
- **Corrección de Registro de Cargas Masivas**:
    *   Se corrigió un error en el endpoint del backend `GET /api/inventario/cargas` en `inventario.routes.js` donde se consultaba la columna inexistente `id_auditoria` de la tabla `public.auditoria`. Se cambió al nombre de columna real `id` y se mapeó como `id_auditoria` para mantener la compatibilidad del frontend, permitiendo la carga exitosa del historial de cargas masivas anteriores.
- **Exclusión de Consumibles y Precios Opcionales**:
    - Omitido el requerimiento de código de barras, usando SKU autogenerado por el sistema.
    - Precios y costo hechos opcionales, guardados como `NULL` en base de datos.
    - Añadida herramienta interactiva de Margen de Ganancia (+30%, +40%, etc.) en variante y cola.
    - Excluidos los productos e información de categorías de "Consumibles" del catálogo público (retornando 404 para detalles de producto).
- **Edición en Cola General con Selector de Productos y Recargo de Costo**:
    - Se implementó la pestaña "Edición en Cola" en la gestión de productos con selección interactiva.
    - Se añadió diálogo de recargo de costo y propagación de precios/costos dinámicos en sesión.
- **Filtros del Catálogo y Límite de Productos**:
    - Se aumentó el límite de productos en el backend de 100 a 1000 items.
    - Se modificó `ProductGrid.tsx` para pasar los parámetros de categoría y marca al backend y escuchar sus cambios, lo que corrigió el truncamiento del catálogo.
    - Se corrigió el mapeo de ordenamiento y se incrementó el límite de la vista POS a 1000 items.

## Plan for Current Change: Exclude Money Transfers from Income Reports

### Goals & Features to Implement:
1. **Identify Internal Money Transfers**:
   - Add an `es_transferencia` boolean column to the `transaccion_caja` table.
   - Set `es_transferencia = true` for both sides of a transfer when executing `POST /api/money/transferir`.
2. **Exclude Transfers from Income Reports & Summaries**:
   - Filter out transactions where `es_transferencia` is true from the weekly summary query.
   - Filter out transactions where `es_transferencia` is true from the sales profit query (revenue KPIs and chart series).

### Actionable Steps:
1. **Database Migration**:
   - Create a migration script `migrate_transacciones_transferencia.js` to add the `es_transferencia` column and backfill existing transfer records in the DB.
2. **Backend - money.routes.js**:
   - Modify the `/money/transferir` route to insert both outgoing (`egreso`) and incoming (`ingreso`) transactions with `es_transferencia = true`.
3. **Backend - reports.routes.js**:
   - Add `AND COALESCE(t.es_transferencia, false) = false` to the income/sales query parts in `/reports/sales-weekly-summary` and `/reports/sales-profit`.

