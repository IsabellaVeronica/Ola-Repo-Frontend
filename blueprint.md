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

## Plan for Current Change: Optional Prices, Empty Barcodes & Exclude Consumibles from Storefront

### Goals & Features to Implement:
1. **Omit Barcode Requirement**: Allow imports from Excel even if the barcode column is blank, relying on system-generated SKUs.
2. **Optional Pricing**: 
   - Make prices and cost optional during product/variant creation and editing.
   - Store prices and cost as `NULL` if not specified.
   - Implement an interactive **Suggested Price** tool (`+30%`, `+40%`, etc.) under the price/cost input in the variant manager and bulk queue editor to calculate the list price based on the input cost.
3. **Exclude Consumibles from Public Catalog**:
   - Filter out products in the category "Consumibles" from appearing in `/catalog/products` and `/catalog/top-sellers`.
   - Filter out the "Consumibles" category itself from `/catalog/categories` in the public storefront.
   - Return 404 for `/catalog/products/:id` if the requested product is a consumable.

### Actionable Steps:
1. **Backend - catalog.routes.js**:
   - In `/catalog/categories`, exclude `'Consumibles'` by name.
   - In `/catalog/products`, `/catalog/products/:id`, and `/catalog/top-sellers`, query public category names and filter out products belonging to `'Consumibles'`.
2. **Frontend - ProductVariantsTab.tsx & BulkCreateProducts.tsx**:
   - Make `precio_lista` and `costo` fields non-required.
   - Set up empty value formatting to save fields as `null` (instead of `0`) when editing or adding variants.
   - Build a helper UI component under price/cost inputs that takes `costo`, calculates price based on selected percentage, and updates the state.
