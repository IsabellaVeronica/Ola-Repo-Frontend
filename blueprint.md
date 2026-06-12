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
        - En `StockAlerts.tsx` UI, se cambió la visualización de `∞` a `—` cuando no haya ventas.
- **Solución de Error de Despliegue en Vercel**:
    *   Se eliminó la carpeta `.vercel` del historial de Git (`git rm -r --cached .vercel`) y se agregó a `.gitignore`.

- **Exclusión de Consumibles y Precios Opcionales**:
    - Omitido el requerimiento de código de barras, usando SKU autogenerado por el sistema.
    - Precios y costo hechos opcionales, guardados como `NULL` en base de datos.
    - Añadida herramienta interactiva de Margen de Ganancia (+30%, +40%, etc.) en variante y cola.
    - Excluidos los productos e información de categorías de "Consumibles" del catálogo público (retornando 404 para detalles de producto).

## Plan for Current Change: General Queue Editing with Product Selector & Cost Surcharge

### Goals & Features to Implement:
1. **Dedicated Queue Editing Tab**:
   - Provide an option inside `ProductsManagement` to start general queue editing anytime.
   - Design a product selector component (`QueueEditSelector.tsx`) with search, listing, individual checkbox, and a "select all" ("marcar todos") checkbox.
2. **Cost Surcharge Dialog**:
   - Prompt the user with a dialog to optionally increase the cost by a percentage before starting the queue edit.
3. **Dynamic Frontend Surcharge Reflection**:
   - Save the surcharge percentage in the session.
   - Apply the percentage to the variant costs in the frontend state when loading.
   - Keep the inputs fully editable within the session.
   - Save the final edited costs to the database only when clicking "Guardar y Sig." (Save & Next).

### Actionable Steps:
1. **Frontend - QueueEditSelector.tsx**:
   - Create a clean selection layout listing products, filtering by query, select/deselect all, and starting bulk queue with surcharge modal.
2. **Frontend - ProductsManagement.tsx**:
   - Register the "Edición en Cola" tab and link it to the selection view.
3. **Frontend - ProductList.tsx & BulkCreateProducts.tsx**:
   - Modify the queue setup to save `cost_percentage` in `localStorage`.
   - Update `BulkCreateProducts` editor to load and pre-calculate costs dynamically with surcharge, ensuring it only runs for unsaved products.

