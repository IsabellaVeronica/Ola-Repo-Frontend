/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, r as renderTemplate, p as renderComponent, h as addAttribute } from '../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/utils_DY3iklJy.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import React__default, { useState, useEffect, useMemo, useRef } from 'react';
import { I as Input } from '../chunks/input_VyVQ34R2.mjs';
import { D as Dialog, b as DialogContent } from '../chunks/dialog_C_p9J4uV.mjs';
import { B as Button } from '../chunks/button_D3TXvS4A.mjs';
import { F as FetchData, A as API_ENDPOINTS, B as Badge } from '../chunks/api_CUvdBGU1.mjs';
import { map } from 'nanostores';
import { Minus, Plus, ShoppingCart, Search, Store, Trophy, ShoppingBag, X, Trash2, Hash, Loader2, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { useStore } from '@nanostores/react';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const ProductCard = ({ product, onSelect, settings }) => {
  const [hovered, setHovered] = useState(false);
  const currency = settings?.catalogo?.simbolo_moneda || "$";
  const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
  const formattedPrice = showDecimals ? product.price.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(product.price).toLocaleString();
  const brandLabel = product.brand || product.category || "Exclusivo";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group cursor-pointer",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onClick: () => onSelect(product),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full aspect-[3/4] overflow-hidden mb-5", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 bg-secondary origin-bottom transition-transform duration-700 ease-in-out z-0",
              style: { transform: hovered ? "scaleY(1)" : "scaleY(0)" }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-foreground/[0.04] z-0" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: product.image,
              alt: product.name,
              className: "absolute inset-0 w-full h-full object-contain p-4 sm:p-6 z-10 transition-all duration-700 ease-out drop-shadow-xl mix-blend-darken dark:mix-blend-normal",
              style: { transform: hovered ? "scale(1.08) translateY(-6px)" : "scale(1) translateY(0)" }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute top-4 left-4 z-20 transition-all duration-500",
              style: { opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)" },
              children: /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold tracking-[0.3em] uppercase bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full", children: brandLabel })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute top-4 right-4 z-20 transition-all duration-500",
              style: { opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(8px)" },
              children: /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-bold tracking-wider bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full", children: [
                currency,
                formattedPrice
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-5 left-1/2 -translate-x-1/2 z-20 transition-all duration-500",
              style: { opacity: hovered ? 1 : 0, transform: `translateX(-50%) ${hovered ? "translateY(0)" : "translateY(12px)"}` },
              children: /* @__PURE__ */ jsx(
                "button",
                {
                  className: "bg-background text-foreground text-[9px] sm:text-[10px] tracking-[0.25em] uppercase px-7 py-3 rounded-full font-semibold shadow-2xl border border-background/20 whitespace-nowrap hover:bg-secondary hover:text-secondary-foreground transition-colors duration-200",
                  onClick: (e) => {
                    e.stopPropagation();
                    onSelect(product);
                  },
                  children: "Ver Detalles"
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center px-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "h-[1.5px] bg-secondary transition-all duration-500",
                style: { width: hovered ? "28px" : "0px" }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold tracking-[0.25em] text-secondary uppercase", children: brandLabel }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "h-[1.5px] bg-secondary transition-all duration-500",
                style: { width: hovered ? "28px" : "0px" }
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "font-display text-lg md:text-2xl text-foreground leading-tight font-light transition-colors duration-300",
              style: { color: hovered ? "hsl(var(--secondary))" : void 0 },
              children: product.name
            }
          )
        ] })
      ]
    }
  );
};

const cartItems = map({});
function addCartItem(item, amount = 1) {
  if (item.maxStock !== void 0 && item.maxStock <= 0) {
    alert("No hay stock disponible para este producto.");
    return;
  }
  const key = item.variantId !== void 0 ? `${item.id}-${item.variantId}` : item.id;
  const existingItem = cartItems.get()[key];
  if (existingItem) {
    if (existingItem.quantity + amount > item.maxStock) {
      alert(`Solo quedan ${item.maxStock} unidades en stock.`);
      return;
    }
    cartItems.setKey(key, {
      ...existingItem,
      quantity: existingItem.quantity + amount
    });
  } else {
    if (amount > item.maxStock) {
      alert(`Solo quedan ${item.maxStock} unidades en stock.`);
      return;
    }
    cartItems.setKey(key, {
      ...item,
      quantity: amount
    });
  }
}
function removeCartItem(key) {
  const existingItem = cartItems.get()[key];
  if (existingItem) {
    if (existingItem.quantity > 1) {
      const current = cartItems.get();
      const { [key]: _, ...rest } = current;
      cartItems.set(rest);
    } else {
      const current = cartItems.get();
      const { [key]: _, ...rest } = current;
      cartItems.set(rest);
    }
  }
}
function updateItemQuantity(key, delta) {
  const existingItem = cartItems.get()[key];
  if (!existingItem) return;
  const newQty = existingItem.quantity + delta;
  if (newQty <= 0) {
    const current = cartItems.get();
    const { [key]: _, ...rest } = current;
    cartItems.set(rest);
    return;
  }
  if (existingItem.maxStock && newQty > existingItem.maxStock) {
    alert(`Solo quedan ${existingItem.maxStock} unidades en stock.`);
    return;
  }
  cartItems.setKey(key, { ...existingItem, quantity: newQty });
}
function clearCart() {
  cartItems.set({});
}

const cartStore = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  addCartItem,
  cartItems,
  clearCart,
  removeCartItem,
  updateItemQuantity
}, Symbol.toStringTag, { value: 'Module' }));

const ProductDetailDialog = ({ productId, isOpen, onClose, settings }) => {
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [simpleQuantity, setSimpleQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  useEffect(() => {
    if (isOpen && productId) {
      fetchDetails();
    } else {
      setProduct(null);
      setVariants([]);
      setImages([]);
      setQuantities({});
      setSimpleQuantity(1);
    }
  }, [isOpen, productId]);
  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await FetchData(`${API_ENDPOINTS.CATALOG.PRODUCTS}/${productId}`);
      setProduct(data);
      setVariants(data.variantes || []);
      setImages(data.imagenes || []);
      if (data.imagenes?.length > 0) setMainImage(data.imagenes[0]);
      if (data.variantes?.length > 0) {
        const initialQty = {};
        data.variantes.forEach((_, idx) => initialQty[idx] = 0);
        setQuantities(initialQty);
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateQuantity = (index, delta, maxStock) => {
    setQuantities((prev) => {
      const current = prev[index] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      if (next > maxStock) return prev;
      return { ...prev, [index]: next };
    });
  };
  const handleSimpleQuantityChange = (delta) => {
    if (!product) return;
    setSimpleQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      return next;
    });
  };
  const calculateTotal = () => {
    if (!product) return 0;
    if (variants.length === 0) {
      return product.precio * simpleQuantity;
    }
    return variants.reduce((acc, v, idx) => {
      const qty = quantities[idx] || 0;
      return acc + v.precio_lista * qty;
    }, 0);
  };
  const getTotalItems = () => {
    if (variants.length === 0) return simpleQuantity;
    return Object.values(quantities).reduce((a, b) => a + b, 0);
  };
  const handleAddToCart = () => {
    if (!product) return;
    if (variants.length > 0) {
      let added = false;
      variants.forEach((variant, idx) => {
        const qty = quantities[idx];
        if (qty > 0) {
          const price = variant.precio_lista;
          const stock = variant.stock;
          const variantAttrs = variant.atributos_json ? Object.entries(variant.atributos_json).map(([k, v]) => `${v}`).join(", ") : "";
          const cartItemName = variantAttrs ? `${product.nombre} (${variantAttrs})` : product.nombre;
          addCartItem({
            id: String(product.id_producto),
            variantId: variant.id_variante_producto || variant.id,
            name: cartItemName,
            image: mainImage || product.image || "https://placehold.co/400",
            price: Number(price),
            maxStock: Number(stock),
            sku: variant.sku,
            attributes: variant.atributos_json
          }, qty);
          added = true;
        }
      });
      if (!added) {
        alert("Por favor selecciona al menos una cantidad a agregar.");
        return;
      }
    } else {
      const firstVariant = variants[0];
      const vId = firstVariant?.id_variante_producto || firstVariant?.id;
      if (!vId) {
        console.error("ProductDetailDialog: ERROR - No se encontró ID de variante para producto simple", product);
      }
      addCartItem({
        id: String(product.id_producto),
        variantId: vId,
        name: product.nombre,
        image: mainImage || product.image || "https://placehold.co/400",
        price: Number(product.precio || firstVariant?.precio_lista),
        maxStock: firstVariant ? Number(firstVariant.stock) : 999,
        sku: firstVariant?.sku || product.sku_base || ""
      }, simpleQuantity);
    }
    onClose();
  };
  const getStockLabel = (v) => {
    if (!v.activo) return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "No disp." });
    if (v.stock <= 0) return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Agotado" });
    const mode = settings?.catalogo?.modo_etiqueta_stock || "exacto";
    if (mode === "generico") {
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-foreground border-foreground font-bold tracking-tight", children: "EN STOCK" });
    }
    return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-foreground border-foreground font-normal", children: [
      v.stock,
      " Disp."
    ] });
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto w-full", children: loading ? /* @__PURE__ */ jsx("div", { className: "py-20 text-center", children: "Cargando detalles..." }) : !product ? /* @__PURE__ */ jsx("div", { className: "py-20 text-center", children: "No se encontró el producto." }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-100 rounded-lg overflow-hidden border", children: /* @__PURE__ */ jsx("img", { src: mainImage, alt: product.nombre, className: "w-full h-full object-contain" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: images.map((img, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMainImage(img),
          className: `w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 ${mainImage === img ? "ring-2 ring-primary" : ""}`,
          children: /* @__PURE__ */ jsx("img", { src: img, alt: "Thumbnail", className: "w-full h-full object-cover" })
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: product.nombre }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: product.descripcion })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto max-h-[400px] pr-2", children: variants.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 border-b", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm", children: "Elige tus variantes:" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Stock total: ",
            variants.reduce((a, v) => a + (v.stock || 0), 0)
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3", children: variants.map((variant, index) => {
          const attrs = variant.atributos_json || {};
          const attrString = Object.entries(attrs).map(([k, v]) => `${k}: ${v}`).join(", ") || variant.sku;
          const qty = quantities[index] || 0;
          const outOfStock = variant.stock <= 0;
          const stock = variant.stock || 0;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `
                                                        p-3 border rounded-lg flex justify-between items-center transition-all bg-card
                                                        ${qty > 0 ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:border-gray-300"}
                                                        ${outOfStock ? "opacity-60 bg-gray-50" : ""}
                                                    `,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 flex-1 mr-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-sm truncate", children: attrString }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: (() => {
                      const currency = settings?.catalogo?.simbolo_moneda || "$";
                      const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
                      const formatted = showDecimals ? variant.precio_lista.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(variant.precio_lista).toLocaleString();
                      return `${currency}${formatted}`;
                    })() }),
                    getStockLabel(variant)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center border rounded-md bg-background shadow-sm h-8", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-full w-8 rounded-r-none hover:bg-gray-100",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleUpdateQuantity(index, -1, stock);
                      },
                      disabled: qty <= 0,
                      children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "w-8 text-center text-sm font-semibold select-none", children: qty }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-full w-8 rounded-l-none hover:bg-gray-100",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleUpdateQuantity(index, 1, stock);
                      },
                      disabled: outOfStock || qty >= stock,
                      children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                    }
                  )
                ] })
              ]
            },
            variant.id_variante_producto || index
          );
        }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-muted text-muted-foreground border border-border rounded-md text-sm mb-4", children: "Producto estándar (sin variantes)." }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: "Cantidad:" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center border rounded-md", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-r-none",
                onClick: () => handleSimpleQuantityChange(-1),
                disabled: simpleQuantity <= 1,
                children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-10 text-center text-sm font-semibold", children: simpleQuantity }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-l-none",
                onClick: () => handleSimpleQuantityChange(1),
                children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t flex flex-col gap-4 mt-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-secondary/20 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Total a pagar:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              getTotalItems(),
              " productos seleccionados"
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-primary", children: (() => {
            const total = calculateTotal();
            const currency = settings?.catalogo?.simbolo_moneda || "$";
            const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
            const formatted = showDecimals ? total.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(total).toLocaleString();
            return `${currency}${formatted}`;
          })() })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "lg",
            className: "w-full text-lg py-6",
            onClick: handleAddToCart,
            disabled: getTotalItems() === 0,
            children: [
              /* @__PURE__ */ jsx(ShoppingCart, { className: "mr-2 h-5 w-5" }),
              "Agregar al Carrito"
            ]
          }
        )
      ] })
    ] })
  ] }) }) });
};

const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/public/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching public settings:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);
  return { settings, loading, refreshSettings: fetchSettings };
};

const ProductGrid = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [products, setProducts] = useState([]);
  const [storeClosed, setStoreClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(void 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({ id: "all", name: "Todos" });
  const [selectedBrand, setSelectedBrand] = useState({ id: "all", name: "Todas" });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1e4 });
  const [orderBy, setOrderBy] = useState("default");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsData, brandsData] = await Promise.all([
          FetchData(API_ENDPOINTS.CATALOG.CATEGORIES, "GET"),
          FetchData(API_ENDPOINTS.CATALOG.BRANDS, "GET")
        ]);
        const getList = (data) => {
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.data)) return data.data;
          return [];
        };
        const catsList = getList(catsData);
        if (catsList.length > 0) {
          setCategories([{ id: "all", name: "Todos" }, ...catsList.map((c) => ({
            id: String(c.id_categoria || c.id || c),
            name: c.nombre || c.name || String(c)
          }))]);
        }
        const brandsList = getList(brandsData);
        if (brandsList.length > 0) {
          setBrands([{ id: "all", name: "Todas" }, ...brandsList.map((b) => ({
            id: String(b.id_marca || b.id || b),
            name: b.nombre || b.name || String(b)
          }))]);
        }
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMetadata();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("limit", "100");
        if (searchTerm) params.append("q", searchTerm);
        if (orderBy === "price-asc") {
          params.append("sort", "price");
          params.append("dir", "asc");
        } else if (orderBy === "price-desc") {
          params.append("sort", "price");
          params.append("dir", "desc");
        } else if (orderBy === "name-asc") {
          params.append("sort", "name");
          params.append("dir", "asc");
        } else if (orderBy === "name-desc") {
          params.append("sort", "name");
          params.append("dir", "desc");
        }
        const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}?${params.toString()}`;
        const response = await FetchData(url, "GET");
        if (response.message === "Tienda cerrada") {
          setStoreClosed(true);
          setProducts([]);
          return;
        }
        setStoreClosed(false);
        const rawProducts = response.data || [];
        const mappedProducts = rawProducts.map((p) => ({
          id: String(p.id_producto),
          name: p.nombre,
          price: Number(p.min_price) || Number(p.precio) || 0,
          image: p.imagen_principal || "https://placehold.co/400x400/261633/FFF5F7?text=Producto",
          // Placeholder
          description: p.descripcion || "",
          category: p.categoria || "",
          brand: p.marca || "",
          categoryId: String(p.id_categoria),
          brandId: String(p.id_marca)
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, orderBy]);
  const enrichedProducts = useMemo(() => {
    return products.map((p) => {
      const brandName = p.brand || brands.find((b) => b.id === p.brandId)?.name || "";
      const catName = p.category || categories.find((c) => c.id === p.categoryId)?.name || "";
      return { ...p, brand: brandName, category: catName };
    });
  }, [products, brands, categories]);
  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter((product) => {
      const matchCategory = selectedCategory.id === "all" || product.categoryId === selectedCategory.id;
      const matchBrand = selectedBrand.id === "all" || product.brandId === selectedBrand.id;
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchCategory && matchBrand && matchPrice;
    });
  }, [enrichedProducts, selectedCategory, selectedBrand, priceRange]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 max-w-6xl mx-auto bg-card/50 p-6 rounded-xl border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: "Buscar productos, categorías...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-accent w-full text-lg"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1", children: "Categoría" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: selectedCategory.id,
              onChange: (e) => {
                const cat = categories.find((c) => c.id === e.target.value);
                if (cat) setSelectedCategory(cat);
              },
              className: "w-full bg-background border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all",
              children: categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1", children: "Marca" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: selectedBrand.id,
              onChange: (e) => {
                const brd = brands.find((b) => b.id === e.target.value);
                if (brd) setSelectedBrand(brd);
              },
              className: "w-full bg-background border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all",
              children: brands.map((brand) => /* @__PURE__ */ jsx("option", { value: brand.id, children: brand.name }, brand.id))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1", children: "Rango de Precio" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                placeholder: "Min",
                value: priceRange.min,
                onChange: (e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) })),
                className: "w-full bg-background border-input text-foreground h-10"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "-" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                placeholder: "Max",
                value: priceRange.max,
                onChange: (e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) })),
                className: "w-full bg-background border-input text-foreground h-10"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1", children: "Ordenar por" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: orderBy,
              onChange: (e) => setOrderBy(e.target.value),
              className: "w-full bg-background border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all",
              children: [
                /* @__PURE__ */ jsx("option", { value: "default", children: "Seleccionar..." }),
                /* @__PURE__ */ jsx("option", { value: "price-asc", children: "Precio: Menor a Mayor" }),
                /* @__PURE__ */ jsx("option", { value: "price-desc", children: "Precio: Mayor a Menor" }),
                /* @__PURE__ */ jsx("option", { value: "name-asc", children: "Nombre: A-Z" }),
                /* @__PURE__ */ jsx("option", { value: "name-desc", children: "Nombre: Z-A" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8", children: loading || settingsLoading ? /* @__PURE__ */ jsx("div", { className: "col-span-full text-center py-20 text-muted-foreground animate-pulse font-medium", children: "Buscando productos..." }) : storeClosed ? /* @__PURE__ */ jsxs("div", { className: "col-span-full py-20 bg-card/40 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Store, { className: "h-10 w-10 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black uppercase tracking-tight", children: "Catálogo Cerrado" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium", children: "Estamos actualizando nuestro inventario. ¡Regresa pronto!" })
      ] })
    ] }) : filteredProducts.length > 0 ? filteredProducts.map((product) => /* @__PURE__ */ jsx(
      ProductCard,
      {
        product,
        settings,
        onSelect: (p) => {
          setSelectedProductId(Number(p.id));
          setDetailOpen(true);
        }
      },
      product.id
    )) : /* @__PURE__ */ jsx("div", { className: "col-span-full text-center py-12 text-muted-foreground", children: /* @__PURE__ */ jsx("p", { className: "text-xl", children: "No encontramos productos." }) }) }),
    /* @__PURE__ */ jsx(
      ProductDetailDialog,
      {
        isOpen: detailOpen,
        onClose: () => setDetailOpen(false),
        productId: selectedProductId,
        settings
      }
    )
  ] });
};

const TopPerfumes = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(void 0);
  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/catalog/top-sellers?limit=3");
        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : data.data || [];
        const apiBase = "http://localhost:3001/api"?.replace("/api", "") || "";
        if (rawProducts.length > 0) {
          const mappedProducts = rawProducts.slice(0, 3).map((p) => {
            let imgUrl = p.imagen_principal || p.imagen || p.image || "";
            if (imgUrl && !imgUrl.startsWith("http") && !imgUrl.startsWith("blob:")) {
              imgUrl = `${apiBase}/${imgUrl.startsWith("/") ? imgUrl.slice(1) : imgUrl}`;
            }
            return {
              id: String(p.id_producto || p.id),
              name: p.nombre || p.name,
              price: Number(p.min_price) || Number(p.precio) || 0,
              image: imgUrl || "https://placehold.co/400x400/261633/FFF5F7?text=Perfume",
              description: p.descripcion || p.description || "",
              category: p.categoria || p.category || "",
              brand: p.marca || p.brand || "",
              categoryId: String(p.id_categoria || ""),
              brandId: String(p.id_marca || "")
            };
          });
          setProducts(mappedProducts);
        } else {
          const fallbackRes = await FetchData(`${API_ENDPOINTS.CATALOG.PRODUCTS}?limit=3`, "GET");
          const fallbackData = fallbackRes.data || [];
          const fillers = fallbackData.map((p) => ({
            id: String(p.id_producto),
            name: p.nombre,
            price: Number(p.min_price) || Number(p.precio) || 0,
            image: p.imagen_principal || "https://placehold.co/400x400/261633/FFF5F7?text=Perfume",
            description: p.descripcion || "",
            category: p.categoria || "",
            brand: p.marca || "",
            categoryId: String(p.id_categoria),
            brandId: String(p.id_marca)
          }));
          setProducts(fillers);
        }
      } catch (error) {
        console.error("Failed to fetch top products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20 animate-pulse text-muted-foreground", children: "Cargando perfumes destacados..." });
  }
  if (products.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-16 text-center", children: [
      /* @__PURE__ */ jsx(Trophy, { className: "w-10 h-10 text-secondary mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "font-display italic text-4xl md:text-5xl text-foreground font-light mb-4", children: "Perfumes Destacados" }),
      /* @__PURE__ */ jsxs("p", { className: "text-secondary text-base md:text-lg max-w-lg font-light", children: [
        "El Top 3 de nuestras fragancias ",
        /* @__PURE__ */ jsx("span", { className: "font-bold italic", children: "más vendidas" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto px-4", children: products.map((product, index) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute -top-4 -left-4 w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-md", children: [
        "#",
        index + 1
      ] }),
      /* @__PURE__ */ jsx(
        ProductCard,
        {
          product,
          settings,
          onSelect: (p) => {
            setSelectedProductId(Number(p.id));
            setDetailOpen(true);
          }
        }
      )
    ] }, product.id)) }),
    /* @__PURE__ */ jsx(
      ProductDetailDialog,
      {
        isOpen: detailOpen,
        onClose: () => setDetailOpen(false),
        productId: selectedProductId,
        settings
      }
    )
  ] });
};

const CartWidget = () => {
  const $cartItems = useStore(cartItems);
  const totalItems = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-cart"));
  };
  if (totalItems === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-6 right-6 z-50 animate-bounce", children: /* @__PURE__ */ jsxs(
    Button,
    {
      onClick: handleClick,
      className: "rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 relative",
      children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "h-8 w-8" }),
        /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background", children: totalItems })
      ]
    }
  ) });
};

const CartDrawer = () => {
  const { settings } = useSettings();
  const $cartItems = useStore(cartItems);
  const items = Object.values($cartItems);
  const dialogRef = useRef(null);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [customerCedula, setCustomerCedula] = React__default.useState("V-");
  const [customerName, setCustomerName] = React__default.useState("");
  const [customerEmail, setCustomerEmail] = React__default.useState("");
  const [customerPhone, setCustomerPhone] = React__default.useState("");
  const [isSubmitting, setIsSubmitting] = React__default.useState(false);
  const [isSearchingClient, setIsSearchingClient] = React__default.useState(false);
  const [errorMessage, setErrorMessage] = React__default.useState(null);
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.cedula) setCustomerCedula(user.cedula);
        if (user.nombre) setCustomerName(user.nombre);
        if (user.email) setCustomerEmail(user.email);
        if (user.telefono) setCustomerPhone(user.telefono);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
    const openListener = () => dialogRef.current?.showModal();
    window.addEventListener("open-cart", openListener);
    return () => window.removeEventListener("open-cart", openListener);
  }, []);
  useEffect(() => {
    if (customerCedula.length < 9) return;
    const timeout = setTimeout(async () => {
      setIsSearchingClient(true);
      try {
        let res = await fetch(`/api/guest/client/${encodeURIComponent(customerCedula)}`);
        if (res.status === 404) {
          const numbersOnly = customerCedula.replace(/[^0-9]/g, "");
          if (numbersOnly.length >= 6) {
            console.log(`CartDrawer: Falling back to numeric-only search for: ${numbersOnly}`);
            res = await fetch(`/api/guest/client/${numbersOnly}`);
          }
        }
        if (res.ok) {
          const result = await res.json();
          if (result.status === "success" && result.data) {
            const { nombre, email, telefono, cedula_cliente, id_cliente } = result.data;
            if (nombre) setCustomerName(nombre);
            if (email) setCustomerEmail(email);
            if (telefono) setCustomerPhone(formatPhoneNumber(telefono));
            if (cedula_cliente && cedula_cliente !== customerCedula) {
              console.log(`CartDrawer: Auto-adjusting cedula from ${customerCedula} to ${cedula_cliente}`);
              setCustomerCedula(cedula_cliente);
            }
          }
        }
      } catch (error) {
        console.error("Error searching client:", error);
      } finally {
        setIsSearchingClient(false);
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [customerCedula]);
  const handleCedulaChange = (val) => {
    let clean = val.toUpperCase();
    if (!clean.startsWith("V-")) {
      clean = "V-" + clean.replace(/^V-?/, "");
    }
    const prefix = clean.substring(0, 2);
    const rest = clean.substring(2).replace(/[^0-9]/g, "");
    const newValue = prefix + rest;
    if (newValue !== customerCedula) {
      setCustomerCedula(newValue);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setErrorMessage(null);
    }
  };
  const formatPhoneNumber = (val) => {
    const digits = val.replace(/\D/g, "");
    let formatted = "";
    if (digits.length > 0) {
      formatted += digits.substring(0, 4);
      if (digits.length > 4) {
        formatted += " " + digits.substring(4, 7);
      }
      if (digits.length > 7) {
        formatted += " " + digits.substring(7, 11);
      }
    }
    return formatted.trim();
  };
  const handlePhoneChange = (val) => {
    setCustomerPhone(formatPhoneNumber(val));
  };
  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const orderData = {
      cliente_cedula: customerCedula.trim(),
      cliente_nombre: customerName.trim(),
      cliente_email: customerEmail.trim(),
      cliente_telefono: customerPhone.replace(/\s/g, "").trim(),
      items: items.map((item) => {
        if (item.variantId === void 0) {
          console.error("CartDrawer: ERROR - Item sin variantId detectado:", item);
        }
        return {
          id_variante: item.variantId,
          cantidad: item.quantity
        };
      }),
      nota: ""
    };
    let backendWaUrl = null;
    try {
      const jsonPayload = JSON.stringify(orderData);
      console.log("CartDrawer: Enviando JSON al proxy:", jsonPayload);
      const res = await fetch("/api/guest/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload
      });
      if (res.ok) {
        const data = await res.json();
        backendWaUrl = data.waUrl;
        console.log("Order registered successfully in backend");
        localStorage.setItem("user", JSON.stringify({
          cedula: customerCedula.trim(),
          nombre: customerName.trim(),
          email: customerEmail.trim(),
          telefono: customerPhone.trim()
        }));
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409 || res.status === 500 && (errorData.message?.toLowerCase().includes("registrado") || errorData.message?.toLowerCase().includes("existe"))) {
          setErrorMessage(errorData.message || "La cédula, email o teléfono ya están asociados a otro cliente.");
        } else {
          setErrorMessage(errorData.message || "Error al procesar el pedido. Por favor intenta de nuevo.");
        }
        console.error("Failed to register order in backend:", res.status, errorData);
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Network error trying to register order:", error);
      setErrorMessage("Error de conexión con el servidor.");
      setIsSubmitting(false);
      return;
    }
    try {
      const mod = await Promise.resolve().then(() => cartStore);
      mod.clearCart();
    } catch (e) {
      console.error("Error clearing cart", e);
    }
    if (backendWaUrl) {
      window.location.href = backendWaUrl;
    } else {
      const phoneNumber = settings?.whatsapp?.numero || "584147334567";
      const name = customerName.trim() || "Cliente";
      const currency = settings?.catalogo?.simbolo_moneda || "$";
      const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
      const formatPrice = (p) => showDecimals ? p.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(p).toLocaleString();
      const itemsList = items.map((item) => `   - ${item.name} (x${item.quantity}): ${currency}${formatPrice(item.price * item.quantity)}`).join("\n");
      const message = settings?.whatsapp?.mensaje_bienvenida ? `${settings.whatsapp.mensaje_bienvenida}

${itemsList}

*Total: ${currency}${formatPrice(total)}*` : `*Hola!* 

Mi nombre es *${name}* e hice un pedido:

${itemsList}

*Total: ${currency}${formatPrice(total)}*

¿Cómo procedo con el pago?`;
      const url = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
      window.location.href = url;
    }
    setIsSubmitting(false);
    dialogRef.current?.close();
  };
  const closeCart = () => dialogRef.current?.close();
  return /* @__PURE__ */ jsx(
    "dialog",
    {
      id: "cart-dialog",
      ref: dialogRef,
      className: "backdrop:bg-black/50 bg-transparent p-0 w-full md:max-w-md h-full max-h-screen m-0 ml-auto shadow-2xl open:animate-in open:slide-in-from-right-full backdrop:animate-in backdrop:fade-in",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-card border-l border-border text-card-foreground h-full flex flex-col w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-border flex justify-between items-center bg-primary/5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-primary", children: "Tu Canasta" })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: closeCart, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { className: "w-12 h-12 mx-auto mb-4 opacity-20" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "Tu carrito está vacío." }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "¡Explora el catálogo y agrega productos!" })
        ] }) : items.map((item) => {
          const key = item.variantId ? `${item.id}-${item.variantId}` : item.id;
          const attrString = item.attributes ? Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(", ") : "";
          return /* @__PURE__ */ jsxs("div", { className: "flex gap-4 bg-secondary/20 p-3 rounded-lg border border-transparent hover:border-border transition-colors group", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, className: "w-20 h-20 object-cover rounded-md shadow-sm" }),
              /* @__PURE__ */ jsxs("span", { className: "absolute -top-2 -left-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm", children: [
                "x",
                item.quantity
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm truncate pr-2", children: item.name }),
                attrString && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: attrString }),
                item.sku && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground/80 mt-0.5", children: [
                  "SKU: ",
                  item.sku
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-primary text-sm font-bold", children: (() => {
                  const itemTotal = item.price * item.quantity;
                  const currency = settings?.catalogo?.simbolo_moneda || "$";
                  const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
                  const formatted = showDecimals ? itemTotal.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(itemTotal).toLocaleString();
                  return `${currency}${formatted}`;
                })() }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-input rounded-md bg-background shadow-sm h-7 overflow-hidden", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-full w-7 rounded-none hover:bg-muted p-0",
                      onClick: () => Promise.resolve().then(() => cartStore).then((mod) => mod.updateItemQuantity(String(key), -1)),
                      children: item.quantity === 1 ? /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3 text-destructive" }) : /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "w-8 text-center text-xs font-semibold select-none", children: item.quantity }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-full w-7 rounded-none hover:bg-muted p-0",
                      onClick: () => Promise.resolve().then(() => cartStore).then((mod) => mod.updateItemQuantity(String(key), 1)),
                      disabled: item.maxStock !== void 0 && item.quantity >= item.maxStock,
                      children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                    }
                  )
                ] })
              ] })
            ] })
          ] }, key);
        }) }),
        items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border bg-card space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Hash, { className: `absolute left-3 top-2.5 h-4 w-4 transition-colors ${isSearchingClient ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"}` }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: customerCedula,
                  onChange: (e) => handleCedulaChange(e.target.value),
                  placeholder: "V-12345678",
                  className: "w-full bg-background border border-input rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                }
              ),
              isSearchingClient && /* @__PURE__ */ jsx(Loader2, { className: "absolute right-3 top-2.5 h-4 w-4 text-primary animate-spin" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: customerName,
                  onChange: (e) => setCustomerName(e.target.value),
                  placeholder: "Tu Nombre Completo",
                  className: "w-full bg-background border border-input rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: customerEmail,
                  onChange: (e) => setCustomerEmail(e.target.value),
                  placeholder: "Tu Email",
                  className: "w-full bg-background border border-input rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx(Phone, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: customerPhone,
                  onChange: (e) => handlePhoneChange(e.target.value),
                  placeholder: "Tu Teléfono",
                  className: "w-full bg-background border border-input rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                }
              )
            ] }),
            errorMessage && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive font-medium bg-destructive/10 p-2 rounded border border-destructive/20 animate-in fade-in slide-in-from-top-1", children: errorMessage })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-medium", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-primary", children: (() => {
              const currency = settings?.catalogo?.simbolo_moneda || "$";
              const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
              const formatted = showDecimals ? total.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(total).toLocaleString();
              return `${currency}${formatted}`;
            })() })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleCheckout,
              disabled: isSubmitting || !customerName.trim() || customerCedula.length < 5 || !customerEmail.trim() || !customerPhone.trim(),
              className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all",
              children: [
                isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsx("img", { src: "/icons/whatsapp-white.svg", className: "w-5 h-5 mr-2", alt: "", onError: (e) => e.currentTarget.style.display = "none" }),
                "Pedir por WhatsApp ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
              ]
            }
          ),
          (!customerName.trim() || customerCedula.length < 5 || !customerEmail.trim() || !customerPhone.trim()) && /* @__PURE__ */ jsx("p", { className: "text-[14px] text-center text-red-700 font-bold mt-2", children: "Por favor completa todos los campos para continuar." })
        ] })
      ] })
    }
  );
};

const $$ImageCollage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" data-astro-cid-no26qjt2> <!-- Solid Dark Overlay for Text Readability: Focused on the left third --> <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" data-astro-cid-no26qjt2></div> <!-- Image Grid: Sharp and Original Quality --> <div class="grid grid-cols-2 md:grid-cols-4 gap-0 h-full w-full" data-astro-cid-no26qjt2> <div class="relative h-full overflow-hidden" data-astro-cid-no26qjt2> <img src="/collage/collage_5.jpg" alt="" class="absolute inset-0 w-full h-full object-cover object-center" loading="eager" data-astro-cid-no26qjt2> </div> <div class="relative h-full overflow-hidden" data-astro-cid-no26qjt2> <img src="/collage/collage_2.jpg" alt="" class="absolute inset-0 w-full h-full object-cover" loading="eager" data-astro-cid-no26qjt2> </div> <div class="relative h-full overflow-hidden" data-astro-cid-no26qjt2> <img src="/collage/collage_1.jpg" alt="" class="absolute inset-0 w-full h-full object-cover" loading="eager" data-astro-cid-no26qjt2> </div> <div class="relative h-full overflow-hidden" data-astro-cid-no26qjt2> <img src="/collage/collage_4.jpg" alt="" class="absolute inset-0 w-full h-full object-cover" loading="eager" data-astro-cid-no26qjt2> </div> </div> <!-- Bottom Fade: More subtle transition --> <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-20" data-astro-cid-no26qjt2></div> </div> `;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Shop/ImageCollage.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const externalApiBase = "http://localhost:3001/api";
  let settings = {};
  try {
    const response = await fetch(`${externalApiBase}/public/settings`);
    if (response.ok) {
      settings = await response.json();
    }
  } catch (e) {
    console.error("Error fetching settings for index.astro:", e);
  }
  const tienda = settings.tienda || {};
  const title = tienda.nombre || "Tu Tienda";
  const iconPath = tienda.icono_url;
  let iconUrl = "/logo_original.png";
  if (iconPath) {
    if (iconPath.startsWith("http")) {
      iconUrl = iconPath;
    } else {
      iconUrl = iconPath.startsWith("/") ? iconPath : `/${iconPath}`;
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "CartWidget", CartWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Shop/CartWidget", "client:component-export": "CartWidget" })} ${renderComponent($$result2, "CartDrawer", CartDrawer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Shop/CartDrawer", "client:component-export": "CartDrawer" })} ${maybeRenderHead()}<main class="min-h-screen bg-background text-foreground flex flex-col selection:bg-secondary/20 selection:text-secondary font-sans"> <!-- Minimalist Editorial Header --> <header class="container px-8 py-8 flex justify-between items-center max-w-7xl mx-auto border-b border-foreground/5"> <div class="flex items-center gap-4"> <img${addAttribute(iconUrl, "src")} class="h-10 w-auto" alt="Logo"> </div> <!-- Nav links with terracotta hover animation --> <nav class="hidden md:flex items-center gap-10 text-[10px] tracking-[0.25em] uppercase font-semibold text-foreground/60"> <a href="#" class="relative group py-1">
Inicio
<span class="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary origin-left scale-x-100 transition-transform"></span> </a> <a href="#top-perfumes" class="relative group py-1 hover:text-foreground transition-colors">
Destacados
<span class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-secondary group-hover:w-full transition-all duration-300"></span> </a> <a href="#productos" class="relative group py-1 hover:text-foreground transition-colors">
Catálogo
<span class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-secondary group-hover:w-full transition-all duration-300"></span> </a> </nav> <a href="/login" class="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold border border-secondary text-secondary px-5 py-2.5 rounded-full hover:bg-secondary hover:text-white transition-all duration-300">
Login
</a> </header> <!-- Editorial Hero with Terracotta accents --> <section class="relative flex flex-col justify-center container px-8 py-24 lg:py-40 max-w-6xl mx-auto overflow-hidden"> <!-- Decorative ghost text (store name, faded, xl+ only) --> <span class="absolute -right-4 top-1/2 -translate-y-1/2 font-black text-secondary/5 select-none pointer-events-none leading-none hidden xl:block" style="font-size: clamp(6rem, 18vw, 20rem);"> ${tienda.nombre || "OLA"} </span> <!-- Category label --> <div class="flex items-center gap-3 mb-6"> <span class="w-10 h-[2px] bg-secondary"></span> <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-secondary"> ${tienda.categoria || "Perfumes & Fragancias"} </span> </div> <!-- Store name — THE HERO --> <h1 class="font-display font-light leading-[0.88] tracking-tight text-white mb-8 relative z-10 drop-shadow-2xl" style="font-size: clamp(4rem, 12vw, 10.5rem);"> ${tienda.nombre || "Tu Tienda"}<span class="text-secondary">.</span> </h1> <!-- Description --> <p class="text-sm md:text-base text-white/90 font-light italic max-w-md leading-relaxed mb-14 ml-1 relative z-10 drop-shadow-lg"> ${tienda.hero_descripcion || "Fragancias que definen momentos. Cada aroma, una historia distinta."} </p> <div class="flex items-center gap-8 flex-wrap relative z-10"> <a href="#top-perfumes" class="group inline-flex items-center gap-3 bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-secondary/90 transition-all duration-300 shadow-lg shadow-secondary/25">
Ver Destacados
<span class="group-hover:translate-x-1 transition-transform duration-200 text-base">&rarr;</span> </a> <a href="#productos" class="text-[10px] uppercase tracking-[0.25em] font-bold text-white/80 border-b border-white/40 pb-0.5 hover:text-secondary hover:border-secondary transition-colors duration-300 relative z-10">
Todo el Catálogo
</a> </div> <!-- Image Collage Background --> ${renderComponent($$result2, "ImageCollage", $$ImageCollage, {})} </section> <!-- Terracotta decorative band --> <div class="bg-secondary text-secondary-foreground py-5 overflow-hidden"> <div class="flex animate-marquee-ltr gap-16 whitespace-nowrap text-[10px] tracking-[0.3em] font-bold uppercase"> ${["Exclusivo", "Edición Limitada", "✶ Perfumes Destacados", "Fragancias", "Premium", "Exclusivo", "Edición Limitada", "✶ Perfumes Destacados", "Fragancias", "Premium"].map((label, i) => renderTemplate`<span${addAttribute(i, "key")}>${label} &mdash; </span>`)} </div> </div> <!-- Top Perfumes Section --> <section class="container px-8 py-28 max-w-6xl mx-auto" id="top-perfumes"> <div class="flex items-center gap-4 mb-16"> <span class="w-12 h-[2px] bg-secondary"></span> <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-secondary">Top 3 más solicitados</span> </div> ${renderComponent($$result2, "TopPerfumes", TopPerfumes, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Shop/TopPerfumes", "client:component-export": "TopPerfumes" })} </section> <!-- Editorial Product Grid --> <section class="container px-8 py-20 max-w-6xl mx-auto" id="productos"> <div class="flex items-center gap-4 mb-16"> <span class="w-12 h-[2px] bg-secondary"></span> <h3 class="font-display italic text-5xl md:text-6xl text-foreground font-light">Colección</h3> </div> ${renderComponent($$result2, "ProductGrid", ProductGrid, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Shop/ProductGrid", "client:component-export": "ProductGrid" })} </section> <!-- Editorial Minimalist Footer --> <footer class="mt-32 border-t border-foreground/10 bg-background pt-24 pb-12"> <div class="container px-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16"> <div class="max-w-sm"> <h4 class="font-display italic text-4xl mb-6 text-foreground font-light">${title}</h4> <p class="text-foreground/70 text-sm font-light leading-relaxed">
Inspirando calma, balance y confort en cada rincón de tu hogar, con atención meticulosa a la simplicidad.
</p> </div> <div class="flex flex-col gap-5 text-sm font-light text-foreground/80"> <a href="#" class="hover:text-secondary transition-colors">Catálogo</a> <a href="#" class="hover:text-secondary transition-colors">Colecciones</a> <a href="#" class="hover:text-secondary transition-colors">Filosofía</a> </div> ${tienda.mostrar_info && renderTemplate`<div class="flex flex-col gap-4 text-sm font-light text-foreground/80"> ${tienda.telefono && renderTemplate`<p>Tel. ${tienda.telefono}</p>`} ${tienda.email_contacto && renderTemplate`<p>M. <a${addAttribute(`mailto:${tienda.email_contacto}`, "href")} class="hover:text-secondary transition-colors">${tienda.email_contacto}</a></p>`} ${tienda.direccion && renderTemplate`<p class="max-w-[200px] leading-relaxed">${tienda.direccion}</p>`} </div>`} </div> <div class="container px-8 max-w-6xl mx-auto mt-32 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-light text-foreground/50 tracking-[0.2em] uppercase"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} ${title}</p> <p>Diseño Editorial</p> </div> </footer> </main> ` })}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/index.astro", void 0);
const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
