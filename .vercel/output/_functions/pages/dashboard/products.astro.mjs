/* empty css                                    */
import { e as createComponent, p as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { c as cn, $ as $$Layout } from '../../chunks/utils_DY3iklJy.mjs';
import { $ as $$Header, a as $$Sidebar } from '../../chunks/Header_CSh91x7o.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BGa3uP_K.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../chunks/table_BNtKfnwL.mjs';
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, c as CardDescription } from '../../chunks/card_BjP27i0i.mjs';
import { B as Button } from '../../chunks/button_D3TXvS4A.mjs';
import { I as Input } from '../../chunks/input_VyVQ34R2.mjs';
import { F as FetchData, A as API_ENDPOINTS, B as Badge, H as HttpError } from '../../chunks/api_CUvdBGU1.mjs';
import { Plus, Info, Edit, Copy, Ban, CheckCircle, Trash, Loader2, ArrowRightLeft, RefreshCw, Upload, Star, Search, CheckCircle2, AlertCircle, Trash2, Tags, Power, Package, DollarSign, AlertTriangle, Skull, BarChart3, LayoutGrid, ChevronLeft, ChevronRight, TrendingUp, FileDown, Box, FileText, Eye, Download, History, ArrowRight, ArrowLeft, FileSpreadsheet, UploadCloud, FileIcon, X, LayoutPanelTop, Layers, ImageIcon, Save, SkipForward } from 'lucide-react';
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from '../../chunks/dialog_C_p9J4uV.mjs';
import { L as Label } from '../../chunks/label_BcFE407i.mjs';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from '../../chunks/select_B_QFL7NP.mjs';
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from '../../chunks/alert-dialog_D0p8C7NC.mjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { A as AuthGuard } from '../../chunks/AuthGuard_By6cWR9G.mjs';
export { renderers } from '../../renderers.mjs';

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";

const CreateProductDialog = ({
  onProductCreated
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3e3);
      return () => clearTimeout(timer);
    }
  }, [success]);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5e3);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  useEffect(() => {
    if (open) {
      fetchDependencies();
    }
  }, [open]);
  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const cats = await FetchData(API_ENDPOINTS.CATALOG.CATEGORIES);
      const brs = await FetchData(API_ENDPOINTS.CATALOG.BRANDS);
      setCategories(Array.isArray(cats) ? cats : cats.data || []);
      setBrands(Array.isArray(brs) ? brs : brs.data || []);
    } catch (err) {
      console.error("Error fetching dependencies", err);
    } finally {
      setLoading(false);
    }
  };
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const handleSaveNewCategory = async () => {
    if (!newCategoryName || newCategoryName.trim() === "") return;
    setLoading(true);
    try {
      const res = await FetchData(API_ENDPOINTS.CATALOG.CATEGORIES, "POST", {
        body: { nombre: newCategoryName.trim() }
      });
      const catId = res.id_categoria || res.category?.id_categoria;
      if (res && catId) {
        await fetchDependencies();
        setCategoryId(catId.toString());
        setIsAddingCategory(false);
        setNewCategoryName("");
      }
    } catch (err) {
      setError(err.message || "Error al crear categoría");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveNewBrand = async () => {
    if (!newBrandName || newBrandName.trim() === "") return;
    setLoading(true);
    try {
      const res = await FetchData(API_ENDPOINTS.CATALOG.BRANDS, "POST", {
        body: { nombre: newBrandName.trim() }
      });
      const brId = res.id_marca || res.brand?.id_marca;
      if (res && brId) {
        await fetchDependencies();
        setBrandId(brId.toString());
        setIsAddingBrand(false);
        setNewBrandName("");
      }
    } catch (err) {
      setError(err.message || "Error al crear marca");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!nombre || !categoryId || !brandId) {
      setError("Nombre, Categoría y Marca son obligatorios.");
      setLoading(false);
      return;
    }
    try {
      await FetchData(API_ENDPOINTS.PRODUCTS.CREATE, "POST", {
        body: {
          nombre,
          descripcion,
          id_categoria: parseInt(categoryId),
          id_marca: parseInt(brandId),
          activo: true
        }
      });
      setSuccess("Producto creado correctamente");
      setTimeout(() => {
        onProductCreated();
        setOpen(false);
        setNombre("");
        setDescripcion("");
        setCategoryId("");
        setBrandId("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { type: "button", children: [
      /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Nuevo Producto"
    ] }) }),
    /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[550px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Crear Producto" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Agrega un nuevo producto al catálogo." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "nombre", children: "Nombre *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "nombre",
              value: nombre,
              onChange: (e) => setNombre(e.target.value),
              placeholder: "Ej. Producto de Ejemplo"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(Label, { children: "Categoría *" }) }),
            !isAddingCategory ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Select, { value: categoryId, onValueChange: setCategoryId, disabled: loading, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loading ? "Cargando..." : "Seleccionar" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: categories.filter((c) => c.id_categoria != null).map((c) => /* @__PURE__ */ jsx(
                  SelectItem,
                  {
                    value: c.id_categoria.toString(),
                    children: c.nombre || "Sin nombre"
                  },
                  c.id_categoria
                )) })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "link",
                  size: "sm",
                  className: "px-0 h-auto text-xs",
                  onClick: () => setIsAddingCategory(true),
                  children: "+ Agregar categoría"
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2 border p-2 rounded-md bg-muted/30", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Nueva categoría...",
                  className: "h-8 text-xs",
                  value: newCategoryName,
                  onChange: (e) => setNewCategoryName(e.target.value),
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", className: "h-7 text-[10px] flex-1", onClick: handleSaveNewCategory, disabled: loading, children: "Aceptar" }),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", className: "h-7 text-[10px] flex-1", onClick: () => setIsAddingCategory(false), children: "Cancelar" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(Label, { children: "Marca *" }) }),
            !isAddingBrand ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Select, { value: brandId, onValueChange: setBrandId, disabled: loading, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loading ? "Cargando..." : "Seleccionar" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: brands.filter((b) => b.id_marca != null).map((b) => /* @__PURE__ */ jsx(
                  SelectItem,
                  {
                    value: b.id_marca.toString(),
                    children: b.nombre || "Sin nombre"
                  },
                  b.id_marca
                )) })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "link",
                  size: "sm",
                  className: "px-0 h-auto text-xs",
                  onClick: () => setIsAddingBrand(true),
                  children: "+ Agregar marca"
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2 border p-2 rounded-md bg-muted/30", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Nueva marca...",
                  className: "h-8 text-xs",
                  value: newBrandName,
                  onChange: (e) => setNewBrandName(e.target.value),
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", className: "h-7 text-[10px] flex-1", onClick: handleSaveNewBrand, disabled: loading, children: "Aceptar" }),
                /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", className: "h-7 text-[10px] flex-1", onClick: () => setIsAddingBrand(false), children: "Cancelar" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "descripcion", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "descripcion",
              value: descripcion,
              onChange: (e) => setDescripcion(e.target.value),
              placeholder: "Detalles del producto..."
            }
          )
        ] }),
        success && /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300", children: success }),
        error && /* @__PURE__ */ jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300", children: error })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => setOpen(false),
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Creando..." : "Crear Producto" })
      ] })
    ] }) })
  ] });
};

const PREDEFINED_ATTRIBUTES$1 = [
  "Talla",
  "Tamaño",
  "Color",
  "Material",
  "Peso",
  "Dimensiones",
  "Sabor",
  "Estilo",
  "Género"
];
const ProductVariantsTab = ({ product }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCloneMode, setIsCloneMode] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    precio_lista: "",
    costo: "",
    codigo_barras: "",
    atributos: []
  });
  const [saving, setSaving] = useState(false);
  const [registeringStock, setRegisteringStock] = useState(false);
  const [quickStock, setQuickStock] = useState({
    cantidad: "",
    tipo: "entrada",
    motivo: ""
  });
  const handleRegisterQuickStock = async () => {
    if (!editingVariant || !quickStock.cantidad) return;
    const cantNum = parseInt(quickStock.cantidad);
    if (isNaN(cantNum) || cantNum <= 0) {
      alert("La cantidad debe ser un número mayor a cero.");
      return;
    }
    setRegisteringStock(true);
    try {
      await FetchData(API_ENDPOINTS.INVENTORY.MOVEMENTS, "POST", {
        body: {
          id_variante_producto: editingVariant.id_variante_producto,
          tipo: quickStock.tipo,
          cantidad: parseInt(quickStock.cantidad),
          motivo: quickStock.motivo || "Ajuste rápido desde edición"
        }
      });
      setQuickStock({ cantidad: "", tipo: "entrada", motivo: "" });
      await fetchVariants();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error registering quick stock", error);
    } finally {
      setRegisteringStock(false);
    }
  };
  const fetchVariants = async () => {
    if (!product?.id_producto) return;
    setLoading(true);
    try {
      const response = await FetchData(API_ENDPOINTS.PRODUCTS.VARIANTS(product.id_producto));
      const data = response.data || [];
      setVariants(data);
    } catch (error) {
      console.error("Error fetching variants", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVariants();
  }, [product]);
  const handleOpenDialog = (variant, isClone = false) => {
    setIsCloneMode(isClone);
    if (variant) {
      setEditingVariant(isClone ? null : variant);
      setFormData({
        sku: isClone ? "[ GENERACIÓN AUTOMÁTICA ]" : variant.sku || "",
        precio_lista: (variant.precio_lista ?? "").toString(),
        costo: (variant.costo ?? "").toString(),
        codigo_barras: variant.codigo_barras || "",
        atributos: variant.atributos_json && typeof variant.atributos_json === "object" ? Object.entries(variant.atributos_json).map(([key, value]) => ({ key, value: String(value) })) : []
      });
    } else {
      setEditingVariant(null);
      setFormData({ sku: "[ GENERACIÓN AUTOMÁTICA ]", precio_lista: "", costo: "", codigo_barras: "", atributos: [] });
    }
    setIsDialogOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        sku: formData.sku === "[ GENERACIÓN AUTOMÁTICA ]" ? void 0 : formData.sku,
        precio_lista: parseFloat(formData.precio_lista) || 0,
        costo: parseFloat(formData.costo) || 0,
        codigo_barras: formData.codigo_barras,
        atributos_json: formData.atributos.reduce((acc, curr) => {
          if (curr.key) acc[curr.key] = curr.value;
          return acc;
        }, {})
      };
      if (editingVariant) {
        await FetchData(API_ENDPOINTS.VARIANTS.ITEM(editingVariant.id_variante_producto), "PATCH", { body: payload });
      } else {
        await FetchData(API_ENDPOINTS.PRODUCTS.VARIANTS(product.id_producto), "POST", { body: payload });
      }
      setIsDialogOpen(false);
      fetchVariants();
    } catch (error) {
      alert(error.message || "Error al guardar variante");
      console.error("Error saving variant", error);
    } finally {
      setSaving(false);
    }
  };
  const handleToggleStatus = async (variant) => {
    if (!confirm(`¿Seguro que deseas ${variant.activo ? "desactivar" : "activar"} esta variante?`)) return;
    try {
      await FetchData(API_ENDPOINTS.VARIANTS.ITEM(variant.id_variante_producto), "PATCH", {
        body: { activo: !variant.activo }
      });
      fetchVariants();
    } catch (error) {
      console.error("Error toggling variant", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium", children: "Variantes del Producto" }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => handleOpenDialog(), size: "sm", className: "w-full sm:w-auto", children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        " Agregar Variante"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 p-3 rounded-md flex items-start gap-3 text-sm text-blue-700", children: [
      /* @__PURE__ */ jsx(Info, { className: "h-5 w-5 mt-0.5 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Nota:" }),
        " Solo las variantes ",
        /* @__PURE__ */ jsx("strong", { children: "Activas" }),
        ' aparecerán en el "Reporte de Stock Actual" y en el catálogo de la tienda. Si acabas de importar desde Excel, asegúrate de que tus variantes estén encendidas.'
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border rounded-md overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Precio" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Costo" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground", children: "Cargando..." }) }) : variants.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground", children: "No hay variantes registradas." }) }) : variants.map((variant) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: variant.sku }),
        /* @__PURE__ */ jsxs(TableCell, { children: [
          "$",
          (variant.precio_lista || 0).toLocaleString("es-CO")
        ] }),
        /* @__PURE__ */ jsxs(TableCell, { children: [
          "$",
          (variant.costo || 0).toLocaleString("es-CO")
        ] }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: `font-bold ${(variant.stock_actual ?? 0) <= 5 ? "text-destructive" : ""}`, children: variant.stock_actual ?? 0 }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Badge,
          {
            variant: variant.activo ? "default" : "outline",
            className: variant.activo ? "bg-green-500 hover:bg-green-600" : "text-red-500 border-red-500 bg-red-50",
            children: variant.activo ? "Activo" : "Inactivo"
          }
        ) }),
        /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-1", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleOpenDialog(variant), title: "Editar", children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleOpenDialog(variant, true), title: "Duplicar", className: "text-primary hover:text-primary/80", children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => handleToggleStatus(variant),
              className: variant.activo ? "text-amber-500 hover:text-amber-600" : "text-green-500 hover:text-green-600",
              title: variant.activo ? "Desactivar variante" : "Activar variante",
              children: variant.activo ? /* @__PURE__ */ jsx(Ban, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }, variant.id_variante_producto)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editingVariant ? "Editar Variante" : isCloneMode ? "Duplicar Variante" : "Nueva Variante" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-h-[70vh] overflow-y-auto pr-2", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
          editingVariant && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "sku", children: "SKU (Código de Referencia)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "sku",
                value: formData.sku,
                readOnly: true,
                className: "bg-muted font-mono cursor-not-allowed opacity-80"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground font-medium italic", children: "Código asignado por el sistema. No editable para mantener la secuencia." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Precio Lista" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: formData.precio_lista,
                  onChange: (e) => setFormData({ ...formData, precio_lista: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Costo Unitario" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: formData.costo,
                  onChange: (e) => setFormData({ ...formData, costo: e.target.value }),
                  required: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Código de Barras (Opcional)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: formData.codigo_barras,
                onChange: (e) => setFormData({ ...formData, codigo_barras: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2 border-t pt-4", children: [
            /* @__PURE__ */ jsxs(Label, { className: "flex justify-between items-center", children: [
              "Características / Atributos",
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setFormData((prev) => ({
                    ...prev,
                    atributos: [...prev.atributos, { key: "", value: "" }]
                  })),
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 mr-1" }),
                    " Agregar"
                  ]
                }
              )
            ] }),
            formData.atributos.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic", children: "No hay atributos definidos (ej: Talla, Color)." }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto pr-1", children: formData.atributos.map((input, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-[140px]", children: /* @__PURE__ */ jsxs(
                Select,
                {
                  value: PREDEFINED_ATTRIBUTES$1.includes(input.key) ? input.key : input.key ? "otro" : "",
                  onValueChange: (val) => {
                    const newAttrs = [...formData.atributos];
                    newAttrs[index].key = val;
                    setFormData({ ...formData, atributos: newAttrs });
                  },
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Atributo" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: PREDEFINED_ATTRIBUTES$1.map((attr) => /* @__PURE__ */ jsx(SelectItem, { value: attr, children: attr }, attr)) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Valor (ej: Rojo)",
                  value: input.value,
                  onChange: (e) => {
                    const newAttrs = [...formData.atributos];
                    newAttrs[index].value = e.target.value;
                    setFormData({ ...formData, atributos: newAttrs });
                  },
                  className: "h-8 text-xs flex-1"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    const newAttrs = formData.atributos.filter((_, i) => i !== index);
                    setFormData({ ...formData, atributos: newAttrs });
                  },
                  className: "h-8 w-8 text-destructive hover:text-destructive/80 p-0",
                  children: /* @__PURE__ */ jsx(Trash, { className: "h-4 w-4" })
                }
              )
            ] }, index)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: saving, className: "w-full", children: [
            saving && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            editingVariant ? "Guardar Cambios" : "Crear Variante"
          ] }) })
        ] }),
        editingVariant && /* @__PURE__ */ jsxs("div", { className: "border-t pt-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold flex items-center gap-2 text-primary", children: [
              /* @__PURE__ */ jsx(ArrowRightLeft, { className: "h-4 w-4" }),
              " Gestión Rápida de Stock"
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "font-mono", children: [
              "Actual: ",
              editingVariant.stock_actual ?? 0
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Tipo" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: quickStock.tipo,
                  onValueChange: (val) => setQuickStock({ ...quickStock, tipo: val }),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "entrada", children: "Entrada (+)" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "salida", children: "Salida (-)" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "ajuste", children: "Ajuste (Manual)" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Cantidad" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  min: "1",
                  className: "h-8 text-xs",
                  value: quickStock.cantidad,
                  onChange: (e) => setQuickStock({ ...quickStock, cantidad: e.target.value }),
                  placeholder: "Ej: 10"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Motivo / Referencia" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "h-8 text-xs",
                value: quickStock.motivo,
                onChange: (e) => setQuickStock({ ...quickStock, motivo: e.target.value }),
                placeholder: "Ej: Ajuste inicial, Entrada pedido..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "secondary",
              className: "w-full h-8 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20",
              disabled: registeringStock || !quickStock.cantidad,
              onClick: handleRegisterQuickStock,
              children: [
                registeringStock ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-3 w-3" }),
                "Registrar Stock"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { className: "border-t pt-4", children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setIsDialogOpen(false), className: "text-xs", children: "Cerrar" }) })
    ] }) })
  ] });
};

const ProductImagesTab = ({ product }) => {
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("all");
  const [uploadVariantId, setUploadVariantId] = useState("generic");
  const [imageToDelete, setImageToDelete] = useState(null);
  const fetchRes = async () => {
    if (!product?.id_producto) return;
    setLoading(true);
    try {
      const imgRes = await FetchData(API_ENDPOINTS.PRODUCTS.IMAGES(product.id_producto));
      setImages(imgRes.data || []);
      const varRes = await FetchData(API_ENDPOINTS.PRODUCTS.VARIANTS(product.id_producto));
      setVariants(varRes.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRes();
  }, [product]);
  const handleUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    if (uploadVariantId && uploadVariantId !== "generic") {
      formData.append("id_variante_producto", uploadVariantId);
    }
    try {
      await FetchData(
        API_ENDPOINTS.PRODUCTS.IMAGES(product.id_producto),
        "POST",
        { body: formData }
      );
      fetchRes();
    } catch (error) {
      console.error("Error uploading image", error);
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const confirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      await FetchData(API_ENDPOINTS.IMAGES.ITEM(product.id_producto, imageToDelete), "DELETE");
      fetchRes();
    } catch (error) {
      console.error("Error deleting image", error);
      alert("No se pudo eliminar la imagen. Verifique la consola.");
    } finally {
      setImageToDelete(null);
    }
  };
  const handleSetPrincipal = async (imgId) => {
    try {
      await FetchData(
        `${API_ENDPOINTS.IMAGES.ITEM(product.id_producto, imgId)}?principal=true`,
        "PATCH"
      );
      fetchRes();
    } catch (error) {
      console.error("Error setting principal image", error);
    }
  };
  const filteredImages = images.filter((img) => {
    if (selectedVariantId === "all") return true;
    if (selectedVariantId === "generic") return img.id_variante_producto == null;
    return img.id_variante_producto?.toString() === selectedVariantId;
  });
  const getVariantName = (vId) => {
    if (!vId) return "General";
    const v = variants.find((x) => x.id_variante_producto === vId);
    return v ? `${v.sku}` : "Desconocido";
  };
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return url;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: selectedVariantId, onValueChange: setSelectedVariantId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filtrar por..." }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas las Imágenes" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "generic", children: "Generales (Producto)" }),
            variants.map((v) => /* @__PURE__ */ jsxs(SelectItem, { value: v.id_variante_producto.toString(), children: [
              "Var: ",
              v.sku
            ] }, v.id_variante_producto))
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: fetchRes, children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-muted/50 p-2 rounded-lg", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium mr-2", children: "Subir a:" }),
        /* @__PURE__ */ jsxs(Select, { value: uploadVariantId, onValueChange: setUploadVariantId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px] h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "generic", children: "General" }),
            variants.map((v) => /* @__PURE__ */ jsx(SelectItem, { value: v.id_variante_producto.toString(), children: v.sku }, v.id_variante_producto))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              className: "hidden",
              id: "image-upload",
              onChange: handleUpload,
              disabled: uploading
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "image-upload", children: /* @__PURE__ */ jsx(Button, { variant: "default", size: "sm", asChild: true, disabled: uploading, className: "cursor-pointer h-8", children: /* @__PURE__ */ jsxs("span", { children: [
            uploading ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-3 w-3" }),
            "Subir"
          ] }) }) })
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-10 text-muted-foreground", children: "Cargando galería..." }) : filteredImages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20", children: "No hay imágenes para esta vista." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: filteredImages.map((img) => /* @__PURE__ */ jsxs(Card, { className: "relative group overflow-hidden border-2 transition-all hover:border-primary/50", children: [
      img.es_principal && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-sm flex items-center", children: [
        /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 mr-1 fill-current" }),
        " Principal"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 z-10 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm", children: getVariantName(img.id_variante_producto ?? null) }),
      /* @__PURE__ */ jsx("div", { className: "aspect-square bg-muted", children: /* @__PURE__ */ jsx("img", { src: getImageUrl(img.url), alt: "Product", className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 text-white hover:text-destructive hover:bg-transparent",
            onClick: () => setImageToDelete(img.id_imagen_producto),
            children: /* @__PURE__ */ jsx(Trash, { className: "h-4 w-4" })
          }
        ),
        !img.es_principal && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            className: "h-6 text-white hover:text-foreground hover:bg-transparent text-xs px-2",
            onClick: () => handleSetPrincipal(img.id_imagen_producto),
            children: "Principal"
          }
        )
      ] })
    ] }, img.id_imagen_producto)) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!imageToDelete, onOpenChange: (open) => !open && setImageToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Está seguro?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Esta acción eliminará la imagen de forma permanente." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground", children: "Eliminar" })
      ] })
    ] }) })
  ] });
};

const ProductInventoryTab = ({ product }) => {
  const [variants, setVariants] = useState([]);
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [moveType, setMoveType] = useState("entrada");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [refExt, setRefExt] = useState("");
  const [costUnit, setCostUnit] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fetchVariantsAndStock = async () => {
    if (!product?.id_producto) return;
    setLoading(true);
    try {
      const vResponse = await FetchData(API_ENDPOINTS.PRODUCTS.VARIANTS(product.id_producto));
      const vData = vResponse.data || [];
      setVariants(vData);
      const stockMap = {};
      vData.forEach((v) => {
        stockMap[v.id_variante_producto] = v.stock_actual || 0;
      });
      setStocks(stockMap);
    } catch (error) {
      console.error("Error fetching inventory", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVariantsAndStock();
  }, [product]);
  const handleMovement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        id_variante_producto: parseInt(selectedVariantId),
        tipo: moveType,
        cantidad: parseInt(amount),
        motivo: reason,
        ref_externa: refExt,
        costo_unitario: costUnit ? parseFloat(costUnit) : void 0
      };
      await FetchData(API_ENDPOINTS.INVENTORY.MOVEMENTS, "POST", { body: payload });
      setIsDialogOpen(false);
      fetchVariantsAndStock();
      setAmount("");
      setReason("");
      setRefExt("");
      setCostUnit("");
    } catch (error) {
      alert(error.message || "Error registrando movimiento");
      console.error("Movement error", error);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pt-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium", children: "Control de Inventario" }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setIsDialogOpen(true), disabled: variants.length === 0, children: [
        /* @__PURE__ */ jsx(ArrowRightLeft, { className: "mr-2 h-4 w-4" }),
        " Registrar Movimiento"
      ] })
    ] }),
    variants.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground bg-muted/20 rounded-lg", children: "No hay variantes configuradas. Crea variantes primero para gestionar inventario." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: variants.map((v) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: [
        "SKU: ",
        v.sku
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stocks[v.id_variante_producto] ?? "-" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Unidades Disponibles" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs flex gap-2", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
            "Cost: $",
            v.costo
          ] }),
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
            "Price: $",
            v.precio_lista
          ] })
        ] })
      ] })
    ] }, v.id_variante_producto)) }),
    /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Registrar Movimiento de Stock" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleMovement, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Variante" }),
          /* @__PURE__ */ jsxs(Select, { value: selectedVariantId, onValueChange: setSelectedVariantId, required: true, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona variante" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: variants.map((v) => /* @__PURE__ */ jsxs(SelectItem, { value: v.id_variante_producto.toString(), children: [
              v.sku,
              " (Actual: ",
              stocks[v.id_variante_producto],
              ")"
            ] }, v.id_variante_producto)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tipo Movimiento" }),
            /* @__PURE__ */ jsxs(Select, { value: moveType, onValueChange: setMoveType, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "entrada", children: "Entrada (+)" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "salida", children: "Salida (-)" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "ajuste", children: "Ajuste (Manual)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Cantidad" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: "1",
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Motivo / Descripción" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: reason,
              onChange: (e) => setReason(e.target.value),
              placeholder: "Ej: Compra proveedor, merma..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Ref. Externa" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: refExt,
                onChange: (e) => setRefExt(e.target.value),
                placeholder: "Fac-123"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Costo Unitario (Opcional)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: costUnit,
                onChange: (e) => setCostUnit(e.target.value),
                placeholder: "Auto"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setIsDialogOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: submitting, children: [
            submitting && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Registrar"
          ] })
        ] })
      ] })
    ] }) })
  ] });
};

const EditProductDialog = ({
  open,
  onClose,
  onProductUpdated,
  product
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3e3);
      return () => clearTimeout(timer);
    }
  }, [success]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  useEffect(() => {
    if (open) {
      fetchDependencies();
      if (product) {
        setNombre(product.nombre);
        setDescripcion(product.descripcion || "");
        if (product.id_producto) {
          fetchProductDetail(product.id_producto);
        }
      }
    }
  }, [open, product]);
  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const cats = await FetchData(API_ENDPOINTS.CATALOG.CATEGORIES);
      const brs = await FetchData(API_ENDPOINTS.CATALOG.BRANDS);
      setCategories(Array.isArray(cats) ? cats : cats.data || []);
      setBrands(Array.isArray(brs) ? brs : brs.data || []);
    } catch (err) {
      console.error("Error fetching dependencies", err);
    } finally {
      setLoading(false);
    }
  };
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const handleSaveNewCategory = async () => {
    if (!newCategoryName || newCategoryName.trim() === "") return;
    setLoading(true);
    try {
      const res = await FetchData(API_ENDPOINTS.CATALOG.CATEGORIES, "POST", {
        body: { nombre: newCategoryName.trim() }
      });
      const catId = res.id_categoria || res.category?.id_categoria;
      if (res && catId) {
        await fetchDependencies();
        setCategoryId(catId.toString());
        setIsAddingCategory(false);
        setNewCategoryName("");
      }
    } catch (err) {
      setError(err.message || "Error al crear categoría");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveNewBrand = async () => {
    if (!newBrandName || newBrandName.trim() === "") return;
    setLoading(true);
    try {
      const res = await FetchData(API_ENDPOINTS.CATALOG.BRANDS, "POST", {
        body: { nombre: newBrandName.trim() }
      });
      const brId = res.id_marca || res.brand?.id_marca;
      if (res && brId) {
        await fetchDependencies();
        setBrandId(brId.toString());
        setIsAddingBrand(false);
        setNewBrandName("");
      }
    } catch (err) {
      setError(err.message || "Error al crear marca");
    } finally {
      setLoading(false);
    }
  };
  const fetchProductDetail = async (id) => {
    try {
      const data = await FetchData(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      if (data) {
        setNombre(data.nombre);
        setDescripcion(data.descripcion || "");
        setCategoryId(data.id_categoria?.toString() || "");
        setBrandId(data.id_marca?.toString() || "");
      }
    } catch (err) {
      console.error("Error fetching product details", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!product) return;
    try {
      await FetchData(
        API_ENDPOINTS.PRODUCTS.UPDATE(product.id_producto),
        "PUT",
        {
          body: {
            nombre,
            descripcion,
            id_categoria: parseInt(categoryId),
            id_marca: parseInt(brandId),
            activo: product.activo
          }
        }
      );
      onProductUpdated();
      setSuccess("Producto actualizado correctamente");
    } catch (err) {
      setError(err.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };
  if (!product) return null;
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (val) => !val && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 bg-background", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 pb-2", children: [
      /* @__PURE__ */ jsxs(DialogTitle, { children: [
        "Gestionar Producto: ",
        product.nombre
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Edita información general, variantes, imágenes e inventario." })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "general", className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 border-b", children: /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "general", children: "General" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "variants", children: "Variantes" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "images", children: "Imágenes" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "inventory", children: "Inventario" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [
        /* @__PURE__ */ jsx(TabsContent, { value: "general", className: "mt-0 h-full", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "edit-nombre", children: "Nombre" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "edit-nombre",
                value: nombre,
                onChange: (e) => setNombre(e.target.value),
                placeholder: "Nombre del producto"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(Label, { children: "Categoría" }) }),
              !isAddingCategory ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Select, { value: categoryId, onValueChange: setCategoryId, disabled: loading, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loading ? "Cargando..." : "Seleccionar" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: categories.filter((c) => c.id_categoria != null).map((c) => /* @__PURE__ */ jsx(
                    SelectItem,
                    {
                      value: c.id_categoria.toString(),
                      children: c.nombre || "Sin nombre"
                    },
                    c.id_categoria
                  )) })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "link",
                    size: "sm",
                    className: "px-0 h-auto text-xs",
                    onClick: () => setIsAddingCategory(true),
                    children: "+ Agregar categoría"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2 border p-2 rounded-md bg-muted/30", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Nueva categoría...",
                    className: "h-8 text-xs",
                    value: newCategoryName,
                    onChange: (e) => setNewCategoryName(e.target.value),
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", className: "h-7 text-[10px] flex-1", onClick: handleSaveNewCategory, disabled: loading, children: "Aceptar" }),
                  /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", className: "h-7 text-[10px] flex-1", onClick: () => setIsAddingCategory(false), children: "Cancelar" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(Label, { children: "Marca" }) }),
              !isAddingBrand ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Select, { value: brandId, onValueChange: setBrandId, disabled: loading, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: loading ? "Cargando..." : "Seleccionar" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: brands.filter((b) => b.id_marca != null).map((b) => /* @__PURE__ */ jsx(
                    SelectItem,
                    {
                      value: b.id_marca.toString(),
                      children: b.nombre || "Sin nombre"
                    },
                    b.id_marca
                  )) })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "link",
                    size: "sm",
                    className: "px-0 h-auto text-xs",
                    onClick: () => setIsAddingBrand(true),
                    children: "+ Agregar marca"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2 border p-2 rounded-md bg-muted/30", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Nueva marca...",
                    className: "h-8 text-xs",
                    value: newBrandName,
                    onChange: (e) => setNewBrandName(e.target.value),
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", className: "h-7 text-[10px] flex-1", onClick: handleSaveNewBrand, disabled: loading, children: "Aceptar" }),
                  /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", className: "h-7 text-[10px] flex-1", onClick: () => setIsAddingBrand(false), children: "Cancelar" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "edit-descripcion", children: "Descripción" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "edit-descripcion",
                value: descripcion,
                onChange: (e) => setDescripcion(e.target.value),
                placeholder: "Detalles..."
              }
            )
          ] }),
          success && /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300", children: success }),
          error && /* @__PURE__ */ jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300", children: error }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cerrar" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, children: loading ? "Guardando..." : "Guardar Información General" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "variants", className: "mt-0", children: /* @__PURE__ */ jsx(ProductVariantsTab, { product }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "images", className: "mt-0", children: /* @__PURE__ */ jsx(ProductImagesTab, { product }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "inventory", className: "mt-0", children: /* @__PURE__ */ jsx(ProductInventoryTab, { product }) })
      ] })
    ] })
  ] }) });
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToToggle, setProductToToggle] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5e3);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      queryParams.append("_t", Date.now().toString());
      const url = `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`;
      const data = await FetchData(url);
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleToggleStatus = async () => {
    if (!productToToggle) return;
    setStatusLoading(true);
    try {
      await FetchData(API_ENDPOINTS.PRODUCTS.UPDATE(productToToggle.id_producto), "PUT", {
        body: { activo: !productToToggle.activo }
      });
      await fetchProducts();
      setMessage({
        type: "success",
        text: `Producto ${productToToggle.activo ? "desactivado" : "activado"} correctamente.`
      });
      setProductToToggle(null);
    } catch (error) {
      console.error("Error toggling product status:", error);
    } finally {
      setStatusLoading(false);
    }
  };
  const handleHardDelete = async () => {
    if (!productToDelete) return;
    setStatusLoading(true);
    try {
      await FetchData(API_ENDPOINTS.PRODUCTS.DELETE(productToDelete.id_producto), "DELETE");
      setMessage({ type: "success", text: "Producto eliminado permanentemente." });
      await fetchProducts();
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({ type: "error", text: error.message || "No se pudo eliminar el producto. Puede que tenga pedidos asociados." });
    } finally {
      setStatusLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-72", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Buscar productos...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-9 w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(CreateProductDialog, { onProductCreated: fetchProducts }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "py-4 flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Inventario de Productos" }),
        message && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 px-3 py-1 rounded-full border animate-in fade-in slide-in-from-right-1 ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`, children: [
          message.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: message.text })
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0 sm:p-6", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Nombre" }),
          /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Categoría" }),
          /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Marca" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center whitespace-nowrap", children: "Variantes" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-center whitespace-nowrap", children: "Stock Total" }),
          /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap", children: "Estado" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right whitespace-nowrap", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center h-24 text-muted-foreground", children: "Cargando productos..." }) }) : products.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center h-24 text-muted-foreground", children: "No se encontraron productos." }) }) : products.map((product) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: product.nombre }),
          /* @__PURE__ */ jsx(TableCell, { children: product.category_name || product.Categoria?.nombre || "-" }),
          /* @__PURE__ */ jsx(TableCell, { children: product.brand_name || product.Marca?.nombre || "-" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-mono", children: product.variants_count ?? 0 }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center font-bold", children: product.total_stock ?? 0 }),
          /* @__PURE__ */ jsx(TableCell, { children: product.activo ? /* @__PURE__ */ jsx(Badge, { className: "bg-green-500 hover:bg-green-600", children: "Activo" }) : /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Inactivo" }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "flex items-center gap-1 h-8",
                onClick: () => setSelectedProduct(product),
                children: [
                  /* @__PURE__ */ jsx(Edit, { className: "h-3.5 w-3.5" }),
                  "Ver / Gestionar"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                title: product.activo ? "Desactivar" : "Activar",
                onClick: () => setProductToToggle(product),
                children: product.activo ? /* @__PURE__ */ jsx(Ban, { className: "h-4 w-4 text-red-500" }) : /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                title: "Eliminar permanentemente",
                onClick: () => setProductToDelete(product),
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-600" })
              }
            )
          ] }) })
        ] }, product.id_producto)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(
      EditProductDialog,
      {
        open: !!selectedProduct,
        onClose: () => setSelectedProduct(null),
        onProductUpdated: fetchProducts,
        product: selectedProduct
      }
    ),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!productToToggle, onOpenChange: () => setProductToToggle(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: productToToggle?.activo ? "¿Desactivar producto?" : "¿Activar producto?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "¿Estás seguro que deseas ",
          productToToggle?.activo ? "desactivar" : "activar",
          " el producto ",
          /* @__PURE__ */ jsx("strong", { children: productToToggle?.nombre }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: statusLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleToggleStatus, disabled: statusLoading, className: productToToggle?.activo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700", children: statusLoading ? "Procesando..." : productToToggle?.activo ? "Desactivar" : "Activar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!productToDelete, onOpenChange: (val) => !val && setProductToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar producto de forma permanente?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
          "Esta acción eliminará el producto ",
          /* @__PURE__ */ jsx("strong", { children: productToDelete?.nombre }),
          " del sistema. Esta acción no se puede deshacer."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: statusLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleHardDelete, disabled: statusLoading, className: "bg-red-600 hover:bg-red-700", children: statusLoading ? "Eliminando..." : "Eliminar permanentemente" })
      ] })
    ] }) })
  ] });
};

const ManageTaxonomies = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("brands");
  const [message, setMessage] = useState(null);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", id_padre: "" });
  const [brandToToggle, setBrandToToggle] = useState(null);
  const [categoryToToggle, setCategoryToToggle] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [brandsRes, categoriesRes] = await Promise.all([
        fetch(API_ENDPOINTS.CATALOG.BRANDS),
        fetch(API_ENDPOINTS.CATALOG.CATEGORIES)
      ]);
      if (brandsRes.ok) {
        const bData = await brandsRes.json();
        setBrands(bData.data || []);
      }
      if (categoriesRes.ok) {
        const cData = await categoriesRes.json();
        setCategories(cData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch taxonomies", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveBrand = async (e) => {
    e.preventDefault();
    try {
      const method = editingBrand ? "PATCH" : "POST";
      const url = editingBrand ? `${API_ENDPOINTS.CATALOG.BRANDS}/${editingBrand.id_marca}` : API_ENDPOINTS.CATALOG.BRANDS;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: formData.nombre })
      });
      if (response.ok) {
        setMessage({ type: "success", text: `Marca ${editingBrand ? "actualizada" : "creada"} correctamente.` });
        setIsBrandDialogOpen(false);
        setEditingBrand(null);
        setFormData({ nombre: "", id_padre: "" });
        fetchData();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar la marca." });
    }
  };
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const method = editingCategory ? "PATCH" : "POST";
      const url = editingCategory ? `${API_ENDPOINTS.CATALOG.CATEGORIES}/${editingCategory.id_categoria}` : API_ENDPOINTS.CATALOG.CATEGORIES;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          id_padre: formData.id_padre ? parseInt(formData.id_padre) : null
        })
      });
      if (response.ok) {
        setMessage({ type: "success", text: `Categoría ${editingCategory ? "actualizada" : "creada"} correctamente.` });
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
        setFormData({ nombre: "", id_padre: "" });
        fetchData();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar la categoría." });
    }
  };
  const handleToggleBrandStatus = async () => {
    if (!brandToToggle) return;
    setStatusLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.CATALOG.BRANDS}/${brandToToggle.id_marca}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !brandToToggle.activo })
      });
      if (response.ok) {
        setMessage({ type: "success", text: `Marca ${brandToToggle.activo ? "desactivada" : "activada"} correctamente.` });
        fetchData();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al cambiar el estado de la marca." });
    } finally {
      setStatusLoading(false);
      setBrandToToggle(null);
    }
  };
  const handleToggleCategoryStatus = async () => {
    if (!categoryToToggle) return;
    setStatusLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.CATALOG.CATEGORIES}/${categoryToToggle.id_categoria}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !categoryToToggle.activo })
      });
      if (response.ok) {
        setMessage({ type: "success", text: `Categoría ${categoryToToggle.activo ? "desactivada" : "activada"} correctamente.` });
        fetchData();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al cambiar el estado de la categoría." });
    } finally {
      setStatusLoading(false);
      setCategoryToToggle(null);
    }
  };
  const filteredBrands = brands.filter((b) => b.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCategories = categories.filter((c) => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: "", id_padre: "" });
    if (activeTab === "brands") {
      setEditingBrand(null);
      setIsBrandDialogOpen(true);
    } else {
      setEditingCategory(null);
      setIsCategoryDialogOpen(true);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    message && /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-md flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`, children: [
      message.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5" }),
      message.text
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "bg-card/40 backdrop-blur-md border-white/10 shadow-xl overflow-hidden", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 border-b border-white/5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Tags, { className: "h-5 w-5 text-primary" }),
          "Listado General"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Buscar...",
                className: "pl-9 bg-background/50 border-white/10 w-full",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              onClick: handleOpenCreateDialog,
              className: "bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 w-full sm:w-auto shrink-0",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Nueva ",
                activeTab === "brands" ? "Marca" : "Categoría"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full border-b border-white/5", children: /* @__PURE__ */ jsxs(TabsList, { className: "w-full justify-start rounded-none bg-transparent p-0 h-12", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "brands", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-6 h-full whitespace-nowrap", children: "Marcas" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "categories", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 px-6 h-full whitespace-nowrap", children: "Categorías" })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "brands", className: "m-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent border-white/5", children: [
            /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "ID" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Nombre" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right text-muted-foreground", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-32 text-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin mx-auto text-primary" }) }) }) : filteredBrands.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-32 text-center text-muted-foreground", children: "No se encontraron marcas." }) }) : filteredBrands.map((brand) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-white/5 border-white/5 transition-colors", children: [
            /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs opacity-50", children: [
              "#",
              brand.id_marca
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: brand.nombre }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: brand.activo ? "default" : "secondary", className: brand.activo ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "", children: brand.activo ? "Activo" : "Inactivo" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-primary hover:text-primary hover:bg-primary/10",
                  onClick: () => {
                    setEditingBrand(brand);
                    setFormData({ nombre: brand.nombre, id_padre: "" });
                    setIsBrandDialogOpen(true);
                  },
                  children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: `h-8 w-8 ${brand.activo ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-green-500 hover:text-green-600 hover:bg-green-500/10"}`,
                  title: brand.activo ? "Desactivar" : "Activar",
                  onClick: () => setBrandToToggle(brand),
                  children: brand.activo ? /* @__PURE__ */ jsx(Ban, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" })
                }
              )
            ] }) })
          ] }, brand.id_marca)) })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "categories", className: "m-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent border-white/5", children: [
            /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "ID" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Nombre" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Estado" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right text-muted-foreground", children: "Acciones" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-32 text-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin mx-auto text-primary" }) }) }) : filteredCategories.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-32 text-center text-muted-foreground", children: "No se encontraron categorías." }) }) : filteredCategories.map((cat) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-white/5 border-white/5 transition-colors", children: [
            /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs opacity-50", children: [
              "#",
              cat.id_categoria
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: cat.nombre }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: cat.activo ? "default" : "secondary", className: cat.activo ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "", children: cat.activo ? "Activo" : "Inactivo" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-primary hover:text-primary hover:bg-primary/10",
                  onClick: () => {
                    setEditingCategory(cat);
                    setFormData({ nombre: cat.nombre, id_padre: cat.id_padre?.toString() || "" });
                    setIsCategoryDialogOpen(true);
                  },
                  children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: `h-8 w-8 ${cat.activo ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-green-500 hover:text-green-600 hover:bg-green-500/10"}`,
                  title: cat.activo ? "Desactivar" : "Activar",
                  onClick: () => setCategoryToToggle(cat),
                  children: cat.activo ? /* @__PURE__ */ jsx(Ban, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" })
                }
              )
            ] }) })
          ] }, cat.id_categoria)) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isBrandDialogOpen, onOpenChange: setIsBrandDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "bg-card border-border sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-foreground text-xl font-bold", children: editingBrand ? "Editar Marca" : "Nueva Marca" }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-muted-foreground", children: editingBrand ? "Modifica los detalles de la marca." : "Agrega una nueva marca para tus productos." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveBrand, children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-right font-semibold text-foreground", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              className: "col-span-3 bg-background border-border text-foreground focus:ring-primary",
              value: formData.nombre,
              onChange: (e) => setFormData({ ...formData, nombre: e.target.value }),
              required: true,
              placeholder: "Inserte nombre de marca"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full sm:w-auto font-bold shadow-md", children: editingBrand ? "Guardar Cambios" : "Crear Marca" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isCategoryDialogOpen, onOpenChange: setIsCategoryDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "bg-card border-border sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-foreground text-xl font-bold", children: editingCategory ? "Editar Categoría" : "Nueva Categoría" }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-muted-foreground", children: editingCategory ? "Modifica los detalles de la categoría." : "Agrega una nueva categoría para tus productos." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveCategory, children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 py-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "catName", className: "font-semibold text-foreground text-right", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "catName",
              className: "col-span-3 bg-background border-border text-foreground focus:ring-primary",
              value: formData.nombre,
              onChange: (e) => setFormData({ ...formData, nombre: e.target.value }),
              required: true,
              placeholder: "Inserte nombre de categoría"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full sm:w-auto font-bold shadow-md", children: editingCategory ? "Guardar Cambios" : "Crear Categoría" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!brandToToggle, onOpenChange: () => !statusLoading && setBrandToToggle(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "bg-card border-white/10 text-white", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Confirmar cambio de estado?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
          "¿Estás seguro de que deseas ",
          brandToToggle?.activo ? "desactivar" : "activar",
          " la marca ",
          /* @__PURE__ */ jsx("strong", { children: brandToToggle?.nombre }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: statusLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsxs(
          AlertDialogAction,
          {
            onClick: (e) => {
              e.preventDefault();
              handleToggleBrandStatus();
            },
            className: brandToToggle?.activo ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90",
            disabled: statusLoading,
            children: [
              statusLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null,
              brandToToggle?.activo ? "Desactivar" : "Activar"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!categoryToToggle, onOpenChange: () => !statusLoading && setCategoryToToggle(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "bg-card border-white/10 text-white", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Confirmar cambio de estado?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
          "¿Estás seguro de que deseas ",
          categoryToToggle?.activo ? "desactivar" : "activar",
          " la categoría ",
          /* @__PURE__ */ jsx("strong", { children: categoryToToggle?.nombre }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: statusLoading, children: "Cancelar" }),
        /* @__PURE__ */ jsxs(
          AlertDialogAction,
          {
            onClick: (e) => {
              e.preventDefault();
              handleToggleCategoryStatus();
            },
            className: categoryToToggle?.activo ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90",
            disabled: statusLoading,
            children: [
              statusLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null,
              categoryToToggle?.activo ? "Desactivar" : "Activar"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};

const InventoryIntelligence = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estancados, setEstancados] = useState([]);
  const [valorData, setValorData] = useState([]);
  const [reposicion, setReposicion] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, estRes, valRes, repRes] = await Promise.all([
        fetch("/api/reports/inventario/dashboard"),
        fetch("/api/reports/inventario/estancados"),
        fetch("/api/reports/inventario/valor"),
        fetch("/api/reports/inventario/reposicion")
      ]);
      const statsData = await statsRes.json();
      const estData = await estRes.json();
      const valData = await valRes.json();
      const repData = await repRes.json();
      setStats(statsData.data || statsData);
      setEstancados(estData.data || estData || []);
      setValorData(valData.data || valData || []);
      setReposicion(repData.data || repData || []);
    } catch (error) {
      console.error("Error fetching intelligence data", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground animate-pulse", children: "Analizando inteligencia de inventario..." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/40 backdrop-blur-sm border-primary/10", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Unidades Totales" }),
          /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stats?.unidades_totales || 0 }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "En ",
            stats?.productos_totales || 0,
            " productos"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/40 backdrop-blur-sm border-primary/10", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Valor Inventario" }),
          /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-green-500" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(stats?.valor_total || 0) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic", children: "Capital inmovilizado" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/40 backdrop-blur-sm border-primary/10", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Alertas Críticas" }),
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-500" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stats?.stock_bajo_count || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Requieren reposición" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "bg-card/40 backdrop-blur-sm border-primary/10", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Estancados" }),
          /* @__PURE__ */ jsx(Skull, { className: "h-4 w-4 text-red-500" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stats?.estancados_count || 0 }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Sin ventas ",
            ">",
            " 60 días"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "shadow-md", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-red-600", children: [
            /* @__PURE__ */ jsx(Skull, { className: "h-5 w-5" }),
            " Productos Estancados"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Mercancía con nula rotación. Sugerencia: Promociones o Liquidación." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Producto" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Días" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: estancados.slice(0, 5).map((item, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-xs", children: item.producto || item.nombre }),
            /* @__PURE__ */ jsx(TableCell, { children: item.stock }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-red-500 border-red-200 bg-red-50", children: [
              item.dias_sin_vender || 0,
              "d"
            ] }) })
          ] }, i)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "shadow-md border-blue-100", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-blue-600", children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "h-5 w-5" }),
            " Reposición Sugerida"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Basado en rotación de los últimos 30 días." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Producto" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Ventas" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Pedir" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: reposicion.slice(0, 5).map((item, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-xs", children: item.producto }),
            /* @__PURE__ */ jsx(TableCell, { children: item.total_salidas_periodo || item.ventas }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { className: "bg-blue-500", children: [
              "+",
              item.cantidad_sugerida || item.reponer
            ] }) })
          ] }, i)) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5 text-primary" }),
          " Distribución de Valor en Inventario"
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Desglose de capital invertido por producto." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Producto / Variante" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Costo Unit." }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Valor Total" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: valorData.slice(0, 10).map((item, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
            item.producto,
            " - ",
            item.sku
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: item.stock }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            "$",
            (item.costo || 0).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right font-bold text-green-600", children: [
            "$",
            (item.valor || item.stock * item.costo).toLocaleString()
          ] })
        ] }, i)) })
      ] }) })
    ] })
  ] });
};

const ReportPreviewDialog = ({
  isOpen,
  onClose,
  reportType,
  reportTitle,
  additionalParams = {}
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  useEffect(() => {
    if (isOpen) {
      fetchPreview(1);
    }
  }, [isOpen, reportType]);
  const fetchPreview = async (page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        report: reportType,
        page: String(page),
        limit: String(pagination.limit),
        ...additionalParams
      });
      const response = await fetch(`/api/reports/inventario/preview?${params.toString()}`);
      const result = await response.json();
      if (result) {
        setColumns(result.columns || []);
        setData(result.data || []);
        setSummary(result.summary || null);
        setPagination({
          page: result.page || page,
          limit: result.limit || 20,
          total: result.total || 0,
          pages: result.pages || 1
        });
      }
    } catch (error) {
      console.error("Error fetching preview", error);
    } finally {
      setLoading(false);
    }
  };
  const renderCell = (row, col) => {
    const value = row[col.key];
    if (value === null || value === void 0) return "-";
    switch (col.type) {
      case "currency":
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value));
      case "date":
        return new Date(value).toLocaleDateString("es-CO");
      case "number":
        return Number(value).toLocaleString("es-CO");
      case "badge":
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: value });
      default:
        return String(value);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-6xl max-h-[90vh] flex flex-col p-6 overflow-hidden", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-bold", children: reportTitle }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Vista previa de los datos actuales antes de exportar." })
      ] })
    ] }) }),
    summary && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-xl border border-border", children: Object.entries(summary).map(([key, val]) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1", children: key.replace(/_/g, " ") }),
      /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-foreground", children: typeof val === "number" && key.includes("valor") ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val) : val })
    ] }, key)) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto rounded-lg border border-border bg-card/50", children: loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full py-20 gap-4", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium animate-pulse text-sm", children: "Generando vista previa dinámica..." })
    ] }) : /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/80 sticky top-0 z-10", children: /* @__PURE__ */ jsx(TableRow, { children: columns.map((col) => /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap font-bold text-foreground py-4", children: col.label }, col.key)) }) }),
      /* @__PURE__ */ jsx(TableBody, { children: data.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: columns.length, className: "text-center py-20 text-muted-foreground italic", children: "No se encontraron resultados para este reporte." }) }) : data.map((row, i) => /* @__PURE__ */ jsx(TableRow, { className: "hover:bg-muted/30 transition-colors", children: columns.map((col) => /* @__PURE__ */ jsx(TableCell, { className: "py-4 text-sm", children: renderCell(row, col) }, col.key)) }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-border", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground font-medium", children: [
        "Mostrando ",
        /* @__PURE__ */ jsx("span", { className: "text-foreground", children: data.length }),
        " de ",
        /* @__PURE__ */ jsx("span", { className: "text-foreground", children: pagination.total }),
        " registros"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium", children: [
          "Página ",
          pagination.page,
          " de ",
          pagination.pages
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => fetchPreview(pagination.page - 1),
              disabled: pagination.page <= 1 || loading,
              className: "h-8 w-8 p-0",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => fetchPreview(pagination.page + 1),
              disabled: pagination.page >= pagination.pages || loading,
              className: "h-8 w-8 p-0",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};

const COLUMN_NAMES = {
  "id_producto": "ID Prod",
  "producto": "Producto",
  "id_variante_producto": "ID Var",
  "sku": "SKU",
  "stock": "Stock",
  "total_salidas": "Salidas",
  "variante": "Variante",
  "id_salida": "ID Salida",
  "fecha": "Fecha",
  "cantidad": "Cant",
  "motivo": "Motivo",
  "referencia": "Ref/Pedido",
  "autorizado_por": "Autorizado",
  "costo_unit": "Costo U.",
  "subtotal": "Subtotal",
  "total_movimientos": "Total Movs",
  "total_unidades": "Total Unids",
  "valor_estimado_despachado": "Valor Est. Despacho"
};
const InventoryReports = () => {
  const [loading, setLoading] = useState(null);
  const [preview, setPreview] = useState({
    open: false,
    type: "",
    title: ""
  });
  const openPreview = (type, title, params = {}) => {
    const typeMap = {
      "stock": "stock-actual",
      "low-stock": "alertas-stock",
      "valor": "valor-inventario",
      "estancados": "estancados",
      "reposicion": "reposicion",
      "mov-detalle": "historial-salidas"
    };
    setPreview({
      open: true,
      type: typeMap[type] || type,
      title,
      params: { ...params }
    });
  };
  const formatHeaders = (headers) => {
    return headers.map((h) => COLUMN_NAMES[h] || h.toUpperCase());
  };
  const downloadCSV = (data, fileName) => {
    if (!data || data.length === 0) return;
    const rawHeaders = Object.keys(data[0]);
    const translatedHeaders = formatHeaders(rawHeaders);
    const csvContent = [
      translatedHeaders.join(";"),
      ...data.map(
        (row) => rawHeaders.map((header) => {
          const value = row[header] ?? "";
          if (header === "fecha") return new Date(value).toLocaleString();
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(";")
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadPDF = (data, title, fileName) => {
    if (!data || data.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const date = (/* @__PURE__ */ new Date()).toLocaleDateString();
    doc.text(`Fecha de generación: ${date}`, 14, 30);
    const rawHeaders = Object.keys(data[0]);
    const translatedHeaders = formatHeaders(rawHeaders);
    const body = data.map((row) => rawHeaders.map((header) => {
      const val = row[header];
      if (header === "fecha") return new Date(val).toLocaleDateString();
      if (header.includes("valor") || header === "subtotal" || header === "costo_unit") {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(val);
      }
      return val;
    }));
    autoTable(doc, {
      startY: 35,
      head: [translatedHeaders],
      body,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      // Indigo style
      styles: { fontSize: 7, cellPadding: 2 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });
    doc.save(`${fileName}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`);
  };
  const handleDownloadReport = async (type, format) => {
    const loadingKey = `${type}-${format}`;
    setLoading(loadingKey);
    try {
      let endpoint = "";
      let fileName = "";
      let title = "";
      switch (type) {
        case "stock":
          endpoint = "/api/reports/stock-actual";
          fileName = "reporte_stock_actual";
          title = "Reporte de Stock Actual";
          break;
        case "low-stock":
          endpoint = "/api/reports/stock-bajo";
          fileName = "alertas_stock_bajo";
          title = "Alertas de Stock Bajo";
          break;
        case "top-sales":
          endpoint = "/api/reports/top-salidas";
          fileName = "ranking_productos_salidas";
          title = "Ranking de Productos (Top Salidas)";
          break;
        case "mov-kpis":
          endpoint = "/api/reports/movimientos-kpis";
          fileName = "kpis_despachos";
          title = "KPIs de Despachos y Salidas";
          break;
        case "mov-detalle":
          endpoint = "/api/reports/movimientos-detalle";
          fileName = "historial_detallado_salidas";
          title = "Historial Detallado de Salidas";
          break;
        case "estancados":
          endpoint = "/api/reports/inventario/estancados";
          fileName = "productos_estancados";
          title = "Reporte de Productos Estancados";
          break;
        case "valor":
          endpoint = "/api/reports/inventario/valor";
          fileName = "valor_inventario";
          title = "Valorización del Inventario";
          break;
        case "reposicion":
          endpoint = "/api/reports/inventario/reposicion";
          fileName = "reposicion_sugerida";
          title = "Plan de Reposición Inteligente";
          break;
      }
      const response = await fetch(endpoint);
      const result = await response.json();
      let rawData = [];
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result && result.data && Array.isArray(result.data)) {
        rawData = result.data;
      } else if (result && typeof result === "object") {
        rawData = [result];
      }
      const cleanData = rawData.filter((item) => item && typeof item === "object" && Object.keys(item).length > 0).map((item) => {
        const { producto_activo, variante_activa, data, ...rest } = item;
        return rest;
      });
      if (format === "csv") {
        downloadCSV(cleanData, fileName);
      } else {
        downloadPDF(cleanData, title, fileName);
      }
    } catch (error) {
      console.error(`Error downloading ${type} ${format} report:`, error);
    } finally {
      setLoading(null);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "intelligence", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "intelligence", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
          " Inteligencia & Salud"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "downloads", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileDown, { className: "h-4 w-4" }),
          " Formatos Descargables"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "intelligence", children: /* @__PURE__ */ jsx(InventoryIntelligence, {}) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "downloads", className: "space-y-10", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Box, { className: "h-5 w-5 text-primary" }),
            " Inventario Operativo"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs(Card, { className: "bg-card/60 backdrop-blur-md border border-foreground/10 shadow-lg hover:border-primary/30 transition-all group", children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 w-fit rounded-xl bg-muted text-foreground mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }) }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-xl text-foreground", children: "Stock Actual" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-foreground/70 font-medium", children: "Listado completo de variantes **activas** con sus cantidades. (Las inactivas se omiten del reporte)." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      onClick: () => handleDownloadReport("stock", "pdf"),
                      disabled: loading !== null,
                      className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm",
                      children: [
                        loading === "stock-pdf" ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(FileDown, { className: "mr-2 h-4 w-4" }),
                        "PDF"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: () => openPreview("stock", "Stock Actual"),
                      className: "border-primary/20 text-primary hover:bg-primary/5 px-3",
                      children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: () => handleDownloadReport("stock", "csv"),
                    disabled: loading !== null,
                    variant: "ghost",
                    className: "w-full text-foreground hover:bg-muted border border-border",
                    children: [
                      loading === "stock-csv" ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
                      "CSV"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "bg-card/60 backdrop-blur-md border border-foreground/10 shadow-lg hover:border-red-500/30 transition-all group", children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 w-fit rounded-xl bg-destructive/10 text-destructive mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6" }) }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-xl text-foreground", children: "Alertas de Stock" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-foreground/70 font-medium", children: "Variantes activas con stock bajo (crítico) que requieren reposición." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      onClick: () => handleDownloadReport("low-stock", "pdf"),
                      disabled: loading !== null,
                      className: "flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm",
                      children: [
                        loading === "low-stock-pdf" ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(FileDown, { className: "mr-2 h-4 w-4" }),
                        "PDF"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: () => openPreview("low-stock", "Stock Bajo (Alertas)"),
                      className: "border-destructive/20 text-destructive hover:bg-destructive/5 px-3",
                      children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: () => handleDownloadReport("low-stock", "csv"),
                    disabled: loading !== null,
                    variant: "ghost",
                    className: "w-full text-destructive hover:bg-destructive/10 border border-destructive/20",
                    children: [
                      loading === "low-stock-csv" ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
                      "CSV"
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5 text-primary" }),
            " Inteligencia Económica"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [
            /* @__PURE__ */ jsxs(Card, { className: "bg-card/60 border border-foreground/10 shadow-lg hover:border-green-500/30 transition-all group", children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-green-100 text-green-700", children: /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5" }) }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDownloadReport("valor", "csv"), children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-lg mt-3", children: "Valor de Inventario" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Exporta el capital total inmovilizado en mercancía." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { className: "flex-1 bg-green-600 hover:bg-green-700", onClick: () => handleDownloadReport("valor", "pdf"), children: "Generar PDF" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openPreview("valor", "Valor de Inventario"), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-green-600" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "bg-card/60 border border-foreground/10 shadow-lg hover:border-red-500/30 transition-all group", children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-red-100 text-red-700", children: /* @__PURE__ */ jsx(Skull, { className: "h-5 w-5" }) }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDownloadReport("estancados", "csv"), children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-lg mt-3", children: "Riesgo: Estancados" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Detecta perfumes sin movimiento en los últimos 60 días." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { className: "flex-1 bg-red-600 hover:bg-red-700", onClick: () => handleDownloadReport("estancados", "pdf"), children: "Generar PDF" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openPreview("estancados", "Productos Estancados", { days: 60 }), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-red-600" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "bg-card/60 border border-foreground/10 shadow-lg hover:border-blue-500/30 transition-all group", children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-blue-100 text-blue-700", children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-5 w-5" }) }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDownloadReport("reposicion", "csv"), children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-lg mt-3", children: "Asistente de Compra" }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Sugerencias de reposición basadas en ventas (Smart Buy)." })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Button, { className: "flex-1 bg-blue-600 hover:bg-blue-700", onClick: () => handleDownloadReport("reposicion", "pdf"), children: "Generar PDF" }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => openPreview("reposicion", "Reposición Inteligente"), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 text-blue-600" }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(History, { className: "h-5 w-5 text-primary" }),
            " Despachos y Movimientos"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2", children: /* @__PURE__ */ jsxs(Card, { className: "bg-card/60 backdrop-blur-md border border-foreground/10 shadow-lg hover:border-purple-500/30 transition-all group", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx("div", { className: "p-3 w-fit rounded-xl bg-muted text-foreground mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(History, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-xl text-foreground", children: "Historial de Salidas" }),
              /* @__PURE__ */ jsx(CardDescription, { className: "text-foreground/70 font-medium", children: "Log detallado de cada despacho, quién lo autorizó y con qué referencia." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => handleDownloadReport("mov-detalle", "pdf"),
                  disabled: loading !== null,
                  className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm",
                  children: [
                    loading === "mov-detalle-pdf" ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(FileDown, { className: "mr-2 h-4 w-4" }),
                    "PDF"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: () => openPreview("mov-detalle", "Historial de Salidas"),
                  className: "border-primary/20 text-primary hover:bg-muted px-4",
                  children: [
                    /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
                    " Visualizar"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => handleDownloadReport("mov-detalle", "csv"),
                  disabled: loading !== null,
                  variant: "outline",
                  className: "border border-border text-foreground hover:bg-muted px-3",
                  children: loading === "mov-detalle-csv" ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" })
                }
              )
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ReportPreviewDialog,
      {
        isOpen: preview.open,
        onClose: () => setPreview({ ...preview, open: false }),
        reportType: preview.type,
        reportTitle: preview.title,
        additionalParams: preview.params
      }
    )
  ] });
};

const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full w-full flex-1 bg-primary transition-all duration-300",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = "Progress";

const PREDEFINED_ATTRIBUTES = [
  "Talla",
  "Tamaño",
  "Color",
  "Material",
  "Peso",
  "Dimensiones",
  "Sabor",
  "Estilo",
  "Género"
];
const STORAGE_KEY = "productosCola";
const BulkCreateProducts = ({ onImportSuccess }) => {
  const [step, setStep] = useState("input");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [generalError, setGeneralError] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  useRef(null);
  const [useManualLoad, setUseManualLoad] = useState(false);
  const [inputs, setInputs] = useState([{ nombre: "", descripcion: "" }]);
  const [session, setSession] = useState(null);
  const [currentProductData, setCurrentProductData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [variantes, setVariantes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const agregarFila = () => setInputs([...inputs, { nombre: "", descripcion: "" }]);
  useEffect(() => {
    const handleEnterNavigation = (e) => {
      if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
        const target = e.target;
        if (target.classList.contains("nombre") || target.classList.contains("descripcion")) {
          e.preventDefault();
          const row = target.closest(".bulk-row");
          if (!row) return;
          if (target.classList.contains("nombre")) {
            const next = row.querySelector(".descripcion");
            next?.focus();
          } else if (target.classList.contains("descripcion")) {
            const rows = document.querySelectorAll(".bulk-row");
            const currentIndex = Array.from(rows).indexOf(row);
            if (currentIndex === rows.length - 1) {
              agregarFila();
              setTimeout(() => {
                const newRow = document.querySelector(".bulk-row:last-child");
                const nextNombre = newRow?.querySelector(".nombre");
                nextNombre?.focus();
              }, 50);
            } else {
              const nextRow = rows[currentIndex + 1];
              const nextNombre = nextRow.querySelector(".nombre");
              nextNombre?.focus();
            }
          }
        }
        const editClasses = ["precio-lista", "codigo-barras", "stock-inicial"];
        const currentClass = editClasses.find((c) => target.classList.contains(c));
        if (currentClass) {
          e.preventDefault();
          const card = target.closest(".variant-card");
          if (!card) return;
          if (currentClass === "precio-lista") {
            card.querySelector(".codigo-barras")?.focus();
          } else if (currentClass === "codigo-barras") {
            card.querySelector(".stock-inicial")?.focus();
          } else if (currentClass === "stock-inicial") {
            const cards = document.querySelectorAll(".variant-card");
            const currentIndex = Array.from(cards).indexOf(card);
            if (currentIndex < cards.length - 1) {
              const nextCard = cards[currentIndex + 1];
              nextCard.querySelector(".precio-lista")?.focus();
            } else {
              document.getElementById("btn-guardar-sig")?.focus();
            }
          }
        }
      }
    };
    document.addEventListener("keydown", handleEnterNavigation);
    return () => document.removeEventListener("keydown", handleEnterNavigation);
  }, [inputs, step]);
  const [showNewVariantForm, setShowNewVariantForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    nombre: "",
    precio: "",
    costo: "",
    atributos: [],
    stock: "0",
    barcode: ""
  });
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSession(data);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);
  const addRow = agregarFila;
  const removeRow = (index) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };
  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };
  const handleVariantFieldChange = (index, field, value) => {
    const newVariants = [...variantes];
    if (field === "precio_lista" || field === "stock_inicial" || field === "costo") {
      newVariants[index][field] = value === "" ? "" : parseFloat(value);
    } else {
      newVariants[index][field] = value;
    }
    setVariantes(newVariants);
  };
  const handleAttributeChange = (variantIdx, attrIdx, field, value) => {
    const newVariants = [...variantes];
    if (!newVariants[variantIdx].atributos) newVariants[variantIdx].atributos = [];
    newVariants[variantIdx].atributos[attrIdx][field] = value;
    setVariantes(newVariants);
  };
  const addAttribute = (variantIdx) => {
    const newVariants = [...variantes];
    if (!newVariants[variantIdx].atributos) newVariants[variantIdx].atributos = [];
    newVariants[variantIdx].atributos.push({ key: "", value: "" });
    setVariantes(newVariants);
  };
  const removeAttribute = (variantIdx, attrIdx) => {
    const newVariants = [...variantes];
    newVariants[variantIdx].atributos = newVariants[variantIdx].atributos.filter((_, i) => i !== attrIdx);
    setVariantes(newVariants);
  };
  const handleBulkCreate = async () => {
    const validProducts = inputs.filter((i) => i.nombre.trim() !== "");
    if (validProducts.length === 0) return;
    setLoading(true);
    try {
      const data = await FetchData(API_ENDPOINTS.INVENTORY.BULK_CREATE, "POST", {
        body: { productos: validProducts }
      });
      const sessionData = {
        sessionId: data.session_id,
        productosIds: data.productos.map((p) => p.id_producto),
        indiceActual: 0,
        productosCargados: data.productos,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      setSession(sessionData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setStep("summary");
    } catch (e) {
      alert(e.message || "Error al crear productos");
    } finally {
      setLoading(false);
    }
  };
  const startQueueEditor = async () => {
    if (!session) return;
    setStep("editor");
    await loadProductForEditor(0);
  };
  const loadProductForEditor = async (index, preserveLocalSelection = false) => {
    if (!session) return;
    setLoading(true);
    setLoadError(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setShowNewVariantForm(false);
    try {
      const id = session.productosIds[index];
      const data = await FetchData(API_ENDPOINTS.INVENTORY.SETUP_PRODUCT(id), "GET");
      setCurrentProductData(data);
      if (!preserveLocalSelection) {
        setSelectedCategoria(String(data.producto.id_categoria || ""));
        setSelectedMarca(String(data.producto.id_marca || ""));
      }
      const variantsWithAttrs = (data.variantes || []).map((v) => ({
        ...v,
        stock_inicial: v.stock_actual || 0,
        atributos: v.atributos_json ? Object.entries(v.atributos_json).map(([key, value]) => ({ key, value })) : []
      }));
      setVariantes(variantsWithAttrs);
      const newSession = { ...session, indiceActual: index };
      setSession(newSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } catch (e) {
      setLoadError(e.message || "Error al cargar producto");
    } finally {
      setLoading(false);
    }
  };
  const handleImageSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
      files.forEach((file2) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImagePreviews((prev) => [...prev, ev.target.result]);
          }
        };
        reader.readAsDataURL(file2);
      });
    }
  };
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const saveCurrentProduct = async () => {
    if (!session || !currentProductData) return false;
    if (!selectedCategoria || !selectedMarca) {
      alert("Selecciona categoría y marca");
      return false;
    }
    setLoading(true);
    try {
      const id = session.productosIds[session.indiceActual];
      await FetchData(API_ENDPOINTS.INVENTORY.UPDATE_SETUP(id), "PUT", {
        body: {
          id_categoria: parseInt(selectedCategoria),
          id_marca: parseInt(selectedMarca)
        }
      });
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach((file2) => formData.append("images", file2));
        await FetchData(API_ENDPOINTS.INVENTORY.BULK_IMAGES(id), "POST", {
          body: formData
        });
      }
      const variantPromises = variantes.map(async (v) => {
        await FetchData(API_ENDPOINTS.VARIANTS.ITEM(v.id_variante_producto), "PATCH", {
          body: {
            precio_lista: parseFloat(v.precio_lista) || 0,
            costo: parseFloat(v.costo) || 0,
            codigo_barras: v.codigo_barras,
            atributos_json: (v.atributos || []).reduce((acc, curr) => {
              if (curr.key) acc[curr.key] = curr.value;
              return acc;
            }, { Tipo: v.nombre_tipo || "Variante" })
          }
        });
        const currentStock = v.stock_actual || 0;
        const targetStock = parseInt(v.stock_inicial) || 0;
        const diff = targetStock - currentStock;
        if (diff !== 0) {
          await FetchData(API_ENDPOINTS.INVENTORY.MOVEMENTS, "POST", {
            body: {
              id_variante_producto: v.id_variante_producto,
              tipo: diff > 0 ? "entrada" : "salida",
              cantidad: Math.abs(diff),
              motivo: "Ajuste inicial desde Carga Masiva"
            }
          });
        }
      });
      await Promise.all(variantPromises);
      return true;
    } catch (e) {
      alert("Error al guardar: " + e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const nextProduct = async () => {
    const ok = await saveCurrentProduct();
    if (!ok) return;
    if (session && session.indiceActual + 1 < session.productosIds.length) {
      await loadProductForEditor(session.indiceActual + 1);
    } else {
      setStep("fin");
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  const prevProduct = async () => {
    if (session && session.indiceActual > 0) {
      await loadProductForEditor(session.indiceActual - 1);
    }
  };
  const skipProduct = async () => {
    if (session && session.indiceActual + 1 < session.productosIds.length) {
      await loadProductForEditor(session.indiceActual + 1);
    } else {
      setStep("fin");
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  const createNewVariant = async () => {
    if (!session || !newVariant.nombre || !newVariant.precio) {
      alert("Nombre y precio son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const id = session.productosIds[session.indiceActual];
      await FetchData(API_ENDPOINTS.INVENTORY.ADD_VARIANT(id), "POST", {
        body: {
          nombre_variante: newVariant.nombre || "Nueva Variante",
          precio_lista: parseFloat(newVariant.precio),
          costo: parseFloat(newVariant.costo) || 0,
          codigo_barras: newVariant.barcode,
          atributos: newVariant.atributos.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
          }, { Tipo: newVariant.nombre || "Variante" }),
          stock_inicial: parseInt(newVariant.stock)
        }
      });
      await loadProductForEditor(session.indiceActual);
      setNewVariant({ nombre: "", precio: "", costo: "", atributos: [], stock: "0", barcode: "" });
      setShowNewVariantForm(false);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleQuickCreateCategory = async () => {
    if (!newCatName) return;
    setLoading(true);
    try {
      const resp = await FetchData(API_ENDPOINTS.CATALOG.CATEGORIES, "POST", { body: { nombre: newCatName } });
      setNewCatName("");
      setIsCatDialogOpen(false);
      if (session) {
        await loadProductForEditor(session.indiceActual, true);
        if (resp && resp.id_categoria) {
          setSelectedCategoria(String(resp.id_categoria));
        }
      }
    } catch (e) {
      alert("Error al crear categoría: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleQuickCreateBrand = async () => {
    if (!newBrandName) return;
    setLoading(true);
    try {
      const resp = await FetchData(API_ENDPOINTS.CATALOG.BRANDS, "POST", { body: { nombre: newBrandName } });
      setNewBrandName("");
      setIsBrandDialogOpen(false);
      if (session) {
        await loadProductForEditor(session.indiceActual, true);
        if (resp && resp.id_marca) {
          setSelectedMarca(String(resp.id_marca));
        }
      }
    } catch (e) {
      alert("Error al crear marca: " + e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadTemplate = async () => {
    try {
      const blob = await FetchData(API_ENDPOINTS.INVENTORY.IMPORT_TEMPLATE, "GET", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla_inventario.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download template", err);
      setGeneralError("No se pudo descargar la plantilla.");
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const name = selectedFile.name.toLowerCase();
      if (!name.endsWith(".xlsx") && !name.endsWith(".xls") && !name.endsWith(".csv")) {
        setGeneralError("Formatos soportados: .xlsx, .xls, .csv");
        return;
      }
      setFile(selectedFile);
      setGeneralError(null);
      setImportSummary(null);
      setImportErrors([]);
    }
  };
  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setImportSummary(null);
    setImportErrors([]);
    setGeneralError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await FetchData(API_ENDPOINTS.INVENTORY.IMPORT_EXCEL, "POST", {
        body: formData
      });
      setImportSummary(response.summary);
      setFile(null);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 400 && err.data?.errors) {
          setImportErrors(err.data.errors);
        } else {
          setGeneralError(err.message || "Ocurrió un error inesperado al procesar.");
        }
      } else {
        setGeneralError("Error de conexión con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleDiscardQueue = async () => {
    if (!session) return;
    if (!confirm("¿Estás seguro que deseas descartar esta carga? Los productos creados en esta sesión serán eliminados permanentemente y no se ingresarán al catálogo.")) {
      return;
    }
    setLoading(true);
    try {
      const deletePromises = session.productosIds.map(
        (id) => FetchData(API_ENDPOINTS.PRODUCTS.DELETE(id), "DELETE")
      );
      await Promise.all(deletePromises);
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setStep("input");
    } catch (e) {
      alert("Error al descartar la carga: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };
  const renderStepContent = () => {
    if (step === "input") {
      return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300", children: [
        session && /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl border border-amber-500/20 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-card to-amber-500/5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-amber-500/10 text-amber-600 rounded-xl mt-0.5 shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Carga Pendiente Detectada" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed font-medium", children: [
                "Tienes una sesión de carga masiva anterior con ",
                session.productosIds.length,
                " productos pendientes de configurar en la cola."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full md:w-auto", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                onClick: handleDiscardQueue,
                className: "flex-1 md:flex-none text-destructive hover:bg-destructive/10 border-destructive/20 text-xs font-semibold h-9 px-3",
                disabled: loading,
                children: [
                  loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin mr-1.5" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Descartar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: startQueueEditor,
                className: "flex-1 md:flex-none gap-1.5 text-xs font-bold h-9 px-4",
                disabled: loading,
                children: [
                  "Continuar Edición",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                ]
              }
            )
          ] })
        ] }),
        importSummary ? /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto p-12 text-center space-y-8 bg-card rounded-2xl border shadow-lg animate-in zoom-in-95", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8 text-green-500" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black", children: "¡Importación Exitosa!" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Los productos y variantes se cargaron correctamente en el sistema." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 bg-muted/40 rounded-xl text-center border", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-tighter", children: "Procesadas" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-black", children: importSummary.filas_procesadas })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 bg-muted/40 rounded-xl text-center border", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-tighter", children: "Variantes" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-primary", children: importSummary.variantes_creadas })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 bg-muted/40 rounded-xl text-center border", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-tighter", children: "Unidades" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-emerald-600", children: importSummary.unidades_stock_inicial })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setImportSummary(null), children: "Cargar otro archivo" }),
            /* @__PURE__ */ jsx(Button, { className: "flex-1 font-bold text-base h-11", onClick: onImportSuccess, children: "Ver en Inventario" })
          ] })
        ] }) : useManualLoad ? (
          /* CASE 3: Quick Manual Load Form (Toggleable) */
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-card p-4 rounded-xl border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Estás en modo de carga manual rápida" }),
              /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setUseManualLoad(false), className: "gap-2 font-bold text-primary hover:bg-primary/10", children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
                " Volver a Carga Jerárquica"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-8 bg-card rounded-2xl border shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Carga Rápida Manual" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Ingresa los nombres y descripciones. Completaremos los detalles de cada uno en la cola de edición." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-4", children: inputs.map((input, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start group", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-none pt-2", children: /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold", children: idx + 1 }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3 bulk-row", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: "Nombre del producto (obligatorio)",
                      value: input.nombre,
                      onChange: (e) => handleInputChange(idx, "nombre", e.target.value),
                      className: "font-semibold nombre"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: "Descripción corta (opcional)",
                      value: input.descripcion,
                      onChange: (e) => handleInputChange(idx, "descripcion", e.target.value),
                      className: "text-sm descripcion"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity",
                    onClick: () => removeRow(idx),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] }, idx)) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4", children: [
                /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: addRow, className: "flex-1 gap-2 border-dashed", children: [
                  /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                  " Agregar otro producto"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-1", children: [
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "flex-1", onClick: () => setInputs([{ nombre: "", descripcion: "" }]), children: "Limpiar" }),
                  /* @__PURE__ */ jsxs(Button, { className: "flex-1 gap-2 font-bold", onClick: handleBulkCreate, disabled: loading, children: [
                    loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                    "Iniciar Carga"
                  ] })
                ] })
              ] })
            ] })
          ] })
        ) : (
          /* CASE 4: Custom Hierarchical Excel Uploader (Main Screen) */
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-card p-10 rounded-3xl border shadow-lg flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center text-secondary", children: /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-8 w-8 text-secondary" }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-3xl font-extrabold tracking-tight text-foreground", children: "Carga Masiva Jerárquica" }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm max-w-md mx-auto leading-relaxed", children: "Sube tu inventario para procesar jerarquías. Si dejas la celda de nombre vacía, el sistema asumirá que es otra variante del producto anterior." })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleDownloadTemplate,
                  className: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 border-emerald-500/30 hover:bg-emerald-50/50 gap-2 font-medium rounded-xl h-9",
                  children: [
                    /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
                    "Descargar Plantilla Excel"
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-full", children: !file ? /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-card hover:bg-secondary/5 hover:border-secondary/50 transition-all duration-200", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center pt-5 pb-6", children: [
                  /* @__PURE__ */ jsx(UploadCloud, { className: "w-12 h-12 mb-3 text-secondary" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-base text-foreground font-semibold", children: "Haz clic para seleccionar o arrastra un archivo" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Formatos soportados: .xlsx, .xls, .csv" })
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    className: "hidden",
                    accept: ".xlsx,.xls,.csv",
                    onChange: handleFileChange,
                    disabled: loading
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl border-2 border-secondary/20 bg-secondary/5 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-secondary/15 text-secondary rounded-xl", children: /* @__PURE__ */ jsx(FileIcon, { className: "h-8 w-8 text-secondary" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold truncate", children: file.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    (file.size / 1024).toFixed(1),
                    " KB"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "hover:bg-secondary/25 text-muted-foreground", onClick: () => setFile(null), disabled: loading, children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
              ] }) }),
              importErrors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "w-full space-y-2 max-h-40 overflow-y-auto pr-2 text-left", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-amber-500 mb-2 sticky top-0 bg-card py-1", children: [
                  /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold", children: "Errores en el archivo" })
                ] }),
                importErrors.map((err, i) => /* @__PURE__ */ jsxs("div", { className: "text-[11px] p-2 rounded border border-red-500/10 bg-red-500/5 flex gap-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-500 shrink-0", children: [
                    "Fila ",
                    err.fila
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground/80", children: err.error })
                ] }, i))
              ] }),
              generalError && /* @__PURE__ */ jsxs("div", { className: "w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-left flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
                generalError
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: handleImport,
                  disabled: !file || loading,
                  className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-12 text-base rounded-2xl shadow-lg shadow-secondary/15 transition-all duration-200 flex items-center justify-center gap-2",
                  children: [
                    loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" }),
                    "Procesar Archivo"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t max-w-4xl mx-auto", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-xs text-secondary uppercase tracking-wider", children: "Columnas Requeridas" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: "codigo (opcional), nombre, descripcion (atributo variante), costo, precio_lista, stock_inicial, categoria_nombre, marca_nombre (opcional)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-xs text-secondary uppercase tracking-wider", children: "Mapeo Completo" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: "Deberás asociar la Marca y la Categoría antes de registrar finalmente." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-left", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-xs text-secondary uppercase tracking-wider", children: "Cero Redundancia" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: "Deja en blanco la celda de nombre para agregar otra variante al perfume anterior." })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsx(Button, { variant: "link", className: "text-primary font-medium hover:underline text-xs", onClick: () => setUseManualLoad(true), children: "¿Prefieres ingresar productos manualmente? Usar Carga Rápida Manual" }) })
          ] })
        )
      ] });
    }
    if (step === "summary") return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto p-12 text-center space-y-8 bg-card rounded-2xl border shadow-lg animate-in zoom-in-95", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-10 w-10 text-green-500" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black", children: "¡Productos Creados!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
          "Se han registrado ",
          session?.productosIds.length,
          " productos base."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-muted/30 rounded-xl p-6 text-left max-h-[300px] overflow-y-auto space-y-2 border", children: session?.productosCargados.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 bg-background rounded-lg border border-border/50", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground w-6", children: [
          "#",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: p.nombre })
      ] }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setStep("input"), children: "Cargar más" }),
        /* @__PURE__ */ jsxs(Button, { className: "flex-1 gap-2 font-bold text-lg h-12", onClick: startQueueEditor, children: [
          "Editar en Cola ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ] })
      ] })
    ] });
    if (step === "editor") {
      const currentIdx = session ? session.indiceActual : 0;
      const total = session ? session.productosIds.length : 0;
      const progress = (currentIdx + 1) / total * 100;
      return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl border shadow-sm space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold", children: [
                "Completar Producto ",
                currentIdx + 1,
                " de ",
                total
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-primary truncate max-w-md", children: currentProductData?.producto?.nombre || "Cargando..." })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-muted-foreground", children: [
              currentIdx + 1,
              " / ",
              total
            ] })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: progress, className: "h-2" })
        ] }),
        loading && !currentProductData ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-20 gap-4", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin text-primary" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-muted-foreground", children: "Cargando datos del producto..." })
        ] }) : loadError ? /* @__PURE__ */ jsxs("div", { className: "bg-destructive/10 p-10 rounded-2xl border border-destructive/20 text-center space-y-4", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-10 w-10 text-destructive mx-auto" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-destructive", children: loadError }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => loadProductForEditor(currentIdx), children: "Reintentar" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl border shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-2 font-bold mb-4", children: [
                /* @__PURE__ */ jsx(LayoutPanelTop, { className: "h-4 w-4 text-primary" }),
                " Clasificación"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Categoría" }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-6 w-6 text-primary hover:bg-primary/10 rounded-full",
                        onClick: () => setIsCatDialogOpen(true),
                        children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(Select, { value: selectedCategoria, onValueChange: setSelectedCategoria, children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar Categoría" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: currentProductData?.opciones?.categorias.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: String(c.id_categoria), children: c.nombre }, c.id_categoria)) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Marca" }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-6 w-6 text-primary hover:bg-primary/10 rounded-full",
                        onClick: () => setIsBrandDialogOpen(true),
                        children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(Select, { value: selectedMarca, onValueChange: setSelectedMarca, children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar Marca" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: currentProductData?.opciones?.marcas.map((m) => /* @__PURE__ */ jsx(SelectItem, { value: String(m.id_marca), children: m.nombre }, m.id_marca)) })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl border shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-2 font-bold", children: [
                  /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-primary" }),
                  " Variantes y Precios"
                ] }),
                /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "text-primary font-bold", onClick: () => setShowNewVariantForm(true), children: "+ Agregar Variante" })
              ] }),
              showNewVariantForm && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-muted/30 border rounded-xl space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-bold ml-1", children: "Nombre Variante" }),
                    /* @__PURE__ */ jsx(Input, { placeholder: "Ej: Rojo-M", value: newVariant.nombre, onChange: (e) => setNewVariant({ ...newVariant, nombre: e.target.value }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-bold ml-1", children: "Cód. Barras" }),
                    /* @__PURE__ */ jsx(Input, { placeholder: "Opcional", value: newVariant.barcode, onChange: (e) => setNewVariant({ ...newVariant, barcode: e.target.value }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-bold ml-1", children: "Costo ($)" }),
                    /* @__PURE__ */ jsx(Input, { type: "number", placeholder: "0.00", value: newVariant.costo, onChange: (e) => setNewVariant({ ...newVariant, costo: e.target.value }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-bold ml-1", children: "Precio ($)" }),
                    /* @__PURE__ */ jsx(Input, { type: "number", placeholder: "0.00", value: newVariant.precio, onChange: (e) => setNewVariant({ ...newVariant, precio: e.target.value }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-2 border-t pt-2 mt-2", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "flex justify-between items-center text-[10px] uppercase font-bold", children: [
                      "Características",
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "h-6 text-[9px] px-2",
                          onClick: () => setNewVariant({
                            ...newVariant,
                            atributos: [...newVariant.atributos, { key: "", value: "" }]
                          }),
                          children: "+ Añadir"
                        }
                      )
                    ] }),
                    newVariant.atributos.map((attr, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
                      /* @__PURE__ */ jsxs(
                        Select,
                        {
                          value: attr.key,
                          onValueChange: (val) => {
                            const newAttrs = [...newVariant.atributos];
                            newAttrs[idx].key = val;
                            setNewVariant({ ...newVariant, atributos: newAttrs });
                          },
                          children: [
                            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs flex-1", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipo" }) }),
                            /* @__PURE__ */ jsx(SelectContent, { children: PREDEFINED_ATTRIBUTES.map((a) => /* @__PURE__ */ jsx(SelectItem, { value: a, children: a }, a)) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: "Valor",
                          className: "h-8 text-xs flex-1",
                          value: attr.value,
                          onChange: (e) => {
                            const newAttrs = [...newVariant.atributos];
                            newAttrs[idx].value = e.target.value;
                            setNewVariant({ ...newVariant, atributos: newAttrs });
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-8 w-8 text-destructive",
                          onClick: () => {
                            setNewVariant({
                              ...newVariant,
                              atributos: newVariant.atributos.filter((_, i) => i !== idx)
                            });
                          },
                          children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                        }
                      )
                    ] }, idx))
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-bold ml-1", children: "Stock Inicial" }),
                    /* @__PURE__ */ jsx(Input, { type: "number", value: newVariant.stock, onChange: (e) => setNewVariant({ ...newVariant, stock: e.target.value }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => setShowNewVariantForm(false), children: "Cancelar" }),
                  /* @__PURE__ */ jsx(Button, { size: "sm", onClick: createNewVariant, children: "Crear Variante" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-6", children: variantes.map((v, i) => /* @__PURE__ */ jsxs("div", { className: "p-6 border-2 rounded-2xl bg-muted/5 variant-card space-y-6 shadow-sm border-border", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center -mb-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-primary animate-pulse" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-black text-xs uppercase tracking-tighter text-muted-foreground", children: [
                      "Variante ",
                      i + 1
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border", children: v.sku })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-black text-muted-foreground ml-1", children: "Nombre / Tipo" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: "Ej: Estándar, Pack x3",
                        value: v.nombre_tipo || v.atributos_json?.Tipo || "",
                        onChange: (e) => {
                          const newVariants = [...variantes];
                          newVariants[i].nombre_tipo = e.target.value;
                          setVariantes(newVariants);
                        }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-black text-muted-foreground ml-1", children: "Cód. Barras" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: "Opcional",
                        value: v.codigo_barras || "",
                        onChange: (e) => handleVariantFieldChange(i, "codigo_barras", e.target.value),
                        className: "codigo-barras"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-black text-muted-foreground ml-1", children: "Costo ($)" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        className: "h-10 bg-background",
                        value: v.costo ?? 0,
                        onChange: (e) => handleVariantFieldChange(i, "costo", e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-black text-muted-foreground ml-1", children: "Precio ($)" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        className: "precio-lista h-10 bg-background font-bold text-primary border-primary/20",
                        value: v.precio_lista,
                        onChange: (e) => handleVariantFieldChange(i, "precio_lista", e.target.value)
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-dashed", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "flex justify-between items-center text-[10px] uppercase font-black text-muted-foreground", children: [
                    "Características",
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "h-6 text-[9px] hover:bg-primary/10 text-primary",
                        onClick: () => addAttribute(i),
                        children: "+ Añadir Atributo"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    v.atributos?.map((attr, attrIdx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center animate-in slide-in-from-left-2 duration-200", children: [
                      /* @__PURE__ */ jsxs(
                        Select,
                        {
                          value: attr.key,
                          onValueChange: (val) => handleAttributeChange(i, attrIdx, "key", val),
                          children: [
                            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs flex-[0.7]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipo" }) }),
                            /* @__PURE__ */ jsx(SelectContent, { children: PREDEFINED_ATTRIBUTES.map((a) => /* @__PURE__ */ jsx(SelectItem, { value: a, children: a }, a)) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          placeholder: "Valor",
                          className: "h-8 text-xs flex-1",
                          value: attr.value,
                          onChange: (e) => handleAttributeChange(i, attrIdx, "value", e.target.value)
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-8 w-8 text-destructive hover:bg-destructive/10",
                          onClick: () => removeAttribute(i, attrIdx),
                          children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ] }, attrIdx)),
                    (!v.atributos || v.atributos.length === 0) && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic ml-1", children: "Sin características adicionales." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pt-2 border-t border-dashed", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-[10px] uppercase font-black text-primary ml-1", children: "Stock Actual" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      className: "stock-inicial h-11 bg-primary/5 font-black text-lg text-center",
                      value: v.stock_inicial ?? v.stock_actual ?? 0,
                      onChange: (e) => handleVariantFieldChange(i, "stock_inicial", e.target.value)
                    }
                  )
                ] })
              ] }, v.id_variante_producto || i)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl border shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-2 font-bold mb-4", children: [
                /* @__PURE__ */ jsx(ImageIcon, { className: "h-4 w-4 text-primary" }),
                " Imágenes"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-primary/5 transition-colors border-border hover:border-primary/50", children: [
                /* @__PURE__ */ jsx(UploadCloud, { className: "h-10 w-10 text-muted-foreground mb-2" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Click p/ subir" }),
                /* @__PURE__ */ jsx("input", { type: "file", multiple: true, className: "hidden", accept: "image/*", onChange: handleImageSelect })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: imagePreviews.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square rounded-lg overflow-hidden border", children: [
                /* @__PURE__ */ jsx("img", { src, className: "w-full h-full object-cover", alt: "Preview" }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "destructive",
                    className: "absolute top-1 right-1 h-6 w-6 rounded-full",
                    onClick: () => removeImage(i),
                    children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                  }
                )
              ] }, i)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-card p-6 rounded-2xl border shadow-sm space-y-4 sticky top-6", children: [
              /* @__PURE__ */ jsxs(Button, { className: "w-full h-12 font-bold gap-2 text-lg shadow-lg shadow-primary/20", onClick: nextProduct, disabled: loading, id: "btn-guardar-sig", children: [
                loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-5 w-5" }),
                "Guardar y Sig."
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", onClick: prevProduct, disabled: currentIdx === 0, children: [
                  /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
                  " Ant."
                ] }),
                /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "gap-2 group", onClick: skipProduct, children: [
                  "Saltar ",
                  /* @__PURE__ */ jsx(SkipForward, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] });
    }
    if (step === "fin") return /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto p-12 text-center space-y-8 bg-card rounded-2xl border shadow-xl animate-in fade-in slide-in-from-bottom-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-8xl", children: "🎉" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-green-500", children: "¡Todo listo!" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "Has completado la configuración de todos los productos en la cola." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx(Button, { className: "w-full h-12 font-bold", onClick: () => window.location.href = "/dashboard/products", children: "Ver en Inventario" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setStep("input"), children: "Cargar más productos" })
      ] })
    ] });
    return null;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    renderStepContent(),
    /* @__PURE__ */ jsx(Dialog, { open: isCatDialogOpen, onOpenChange: setIsCatDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Nueva Categoría" }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Nombre de la Categoría" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Ej: Calzado, Accesorios...",
            value: newCatName,
            onChange: (e) => setNewCatName(e.target.value),
            autoFocus: true,
            onKeyDown: (e) => e.key === "Enter" && handleQuickCreateCategory()
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setIsCatDialogOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleQuickCreateCategory, disabled: loading || !newCatName, children: [
          loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Crear Categoría"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isBrandDialogOpen, onOpenChange: setIsBrandDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Nueva Marca" }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Nombre de la Marca" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Ej: Nike, Adidas...",
            value: newBrandName,
            onChange: (e) => setNewBrandName(e.target.value),
            autoFocus: true,
            onKeyDown: (e) => e.key === "Enter" && handleQuickCreateBrand()
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => setIsBrandDialogOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleQuickCreateBrand, disabled: loading || !newBrandName, children: [
          loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Crear Marca"
        ] })
      ] })
    ] }) })
  ] });
};

const ProductsManagement = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground drop-shadow-sm", children: "Gestión de Inventario" }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground/70 font-medium hidden sm:block", children: "Administra tu inventario, marcas y categorías en un solo lugar." })
    ] }) }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full pb-2", children: /* @__PURE__ */ jsxs(TabsList, { className: "bg-card/60 backdrop-blur-md border border-foreground/10 p-1 shadow-sm w-fit sm:w-full justify-start whitespace-nowrap", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "inventory", className: "flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold", children: [
          /* @__PURE__ */ jsx(Box, { className: "h-4 w-4" }),
          " Productos"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "bulk", className: "flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold", children: [
          /* @__PURE__ */ jsx(UploadCloud, { className: "h-4 w-4" }),
          " Carga Masiva"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "taxonomies", className: "flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold", children: [
          /* @__PURE__ */ jsx(Tags, { className: "h-4 w-4" }),
          " Categorías y Marcas"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "reports", className: "flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
          " Reportes"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "inventory", className: "mt-6", children: /* @__PURE__ */ jsx(ProductList, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bulk", className: "mt-6", children: /* @__PURE__ */ jsx(BulkCreateProducts, { onImportSuccess: () => setActiveTab("inventory") }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "taxonomies", className: "mt-6", children: /* @__PURE__ */ jsx(ManageTaxonomies, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "reports", className: "mt-6", children: /* @__PURE__ */ jsx(InventoryReports, {}) })
    ] })
  ] });
};

const $$Products = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Inventario - Panel Administrativo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col min-h-screen bg-background bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"> ${renderComponent($$result2, "Header", $$Header, {})} <div class="flex flex-1"> ${renderComponent($$result2, "Sidebar", $$Sidebar, {})} <main class="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden"> ${renderComponent($$result2, "AuthGuard", AuthGuard, { "client:load": true, "allowedRoles": ["admin", "manager", "vendedor", "viewer"], "panelName": "Inventario", "client:component-hydration": "load", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/AuthGuard", "client:component-export": "AuthGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "ProductsManagement", ProductsManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Products/ProductsManagement", "client:component-export": "ProductsManagement" })} ` })} </main> </div> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/products.astro", void 0);

const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/products.astro";
const $$url = "/dashboard/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Products,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
