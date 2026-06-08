import { jsx } from 'react/jsx-runtime';
import 'react';
import { cva } from 'class-variance-authority';
import { c as cn } from './utils_DY3iklJy.mjs';

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

class HttpError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
    this.name = "HttpError";
  }
}
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
async function FetchData(url, method = "GET", options = {}) {
  const { body, responseType = "json", token: customToken, headers: customHeaders, ...restOptions } = options;
  try {
    const headers = {
      ...customHeaders || {}
    };
    const token = customToken || getCookie("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const config = {
      method,
      headers,
      cache: "no-store",
      ...restOptions
      // Pasa signal, cache, mode, etc.
    };
    if (body) {
      if (body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
        config.body = body;
      } else if (typeof body === "string") {
        config.body = body;
      } else {
        headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(body);
      }
    }
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get("content-type");
      try {
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
      } catch {
        errorData = null;
      }
      const errorMessage = typeof errorData === "object" && errorData?.message ? errorData.message : `Error ${response.status}: ${response.statusText}`;
      throw new HttpError(response.status, errorMessage, errorData);
    }
    if (response.status === 204) {
      return null;
    }
    if (responseType === "blob") return await response.blob();
    if (responseType === "text") return await response.text();
    return await response.json();
  } catch (error) {
    console.error(`[FetchData Error] ${method} ${url}`, error);
    throw error;
  }
}

const API_ENDPOINTS = {
  LOGIN: `/api/auth/login`,
  REGISTER: `/api/auth/signup`,
  ME: `/api/auth/me`,
  CATALOG: {
    PRODUCTS: `/api/catalog/products`,
    CATEGORIES: `/api/categories`,
    BRANDS: `/api/brands`
  },
  USERS: {
    LIST: `/api/users`,
    CREATE: `/api/users`,
    UPDATE: (id, action) => `/api/users/${id}/${action}`,
    DELETE: (id) => `/api/users/${id}`
  },
  PRODUCTS: {
    LIST: `/api/products`,
    CREATE: `/api/products`,
    DETAIL: (id) => `/api/products/${id}`,
    UPDATE: (id) => `/api/products/${id}`,
    DELETE: (id) => `/api/products/${id}`,
    VARIANTS: (id) => `/api/products/${id}/variants`,
    IMAGES: (id) => `/api/products/${id}/images`
  },
  VARIANTS: {
    ITEM: (id) => `/api/variants/${id}`
  },
  IMAGES: {
    ITEM: (productId, imgId) => `/api/products/${productId}/images/${imgId}`
  },
  INVENTORY: {
    MOVEMENTS: `/api/inventario/movimientos`,
    STOCK: (id) => `/api/inventario/stock/${id}`,
    IMPORT_TEMPLATE: `/api/inventario/import/template`,
    IMPORT_EXCEL: `/api/inventario/import/excel`,
    BULK_CREATE: `/api/inventario/bulk/productos`,
    SETUP_PRODUCT: (id) => `/api/inventario/productos/${id}/setup`,
    UPDATE_SETUP: (id) => `/api/inventario/productos/${id}/marca`,
    ADD_VARIANT: (id) => `/api/inventario/productos/${id}/variantes`,
    BULK_IMAGES: (id) => `/api/products/${id}/images`
  },
  MONEY: {
    CUENTAS: `/api/money/cuentas`,
    CUENTA: (id) => `/api/money/cuentas/${id}`,
    MOVIMIENTOS: `/api/money/movimientos`,
    RESUMEN: `/api/money/resumen`
  }
};

export { API_ENDPOINTS as A, Badge as B, FetchData as F, HttpError as H };
