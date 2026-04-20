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

## Current Architecture: Inventory
- **Table `producto`**: Logical unit. Aggregates `total_stock` and `variants_count`.
- **Table `variante_producto`**: Physical unit. Holds `sku`, `precio`, and `codigo_barras`.
- **Table `inventario`**: Stores single row per variant with `stock`.
- **Import Flow**: `POST /api/inventario/import/excel` processes rows, validating brand/category existence and creating associated product+variant+stock record in one go.

## Current Architecture: Clients & Orders
- **Client Identification**: Clients are identified and upserted based on their `cliente_cedula` (Unique).
- **Order Linking**: Orders are linked directly to `cedula_cliente` instead of an internal serial ID.
- **Data Validation**: Checkout requires Cédula, Name, Email, and Phone. Conflict resolution (409) is implemented for overlapping contact info.

## Recent Changes
- **Navegación Rápida con Enter**: Implementado sistema de navegación secuencial por teclado (Enter) en formularios bulk y editor de cola.
- **Edición en Cola Directa**: Se habilitó la edición de precio, barras y stock directamente en la cola, con persistencia automática al avanzar.
- **Taxonomías "al vuelo"**: Añadidos botones y diálogos para crear nuevas Categorías y Marcas sin salir del flujo de carga masiva.
- **Optimización de UX**: Reestructuración de componentes para mejorar la estabilidad y disponibilidad de herramientas globales.
