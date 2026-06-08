/* empty css                                 */
import { e as createComponent, m as maybeRenderHead, p as renderComponent, r as renderTemplate } from '../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/utils_DY3iklJy.mjs';
import { $ as $$Header, a as $$Sidebar } from '../chunks/Header_CSh91x7o.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ShoppingCart, RefreshCw, TrendingDown, AlertTriangle, PackageX, Info, ArrowRight, ArrowDownRight, Package, User, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from '../chunks/dialog_C_p9J4uV.mjs';
import { $ as $$Footer } from '../chunks/Footer_BGa3uP_K.mjs';
export { renderers } from '../renderers.mjs';

function computeReplenishment(item) {
  const ventas_por_dia = item.total_salidas_periodo > 0 ? item.total_salidas_periodo / item.periodo_dias : 0;
  const ventas_por_semana = Math.round(ventas_por_dia * 7 * 10) / 10;
  const semanas_restantes = ventas_por_semana > 0 ? Math.round(item.stock_actual / ventas_por_semana * 10) / 10 : null;
  const targetWeeks = 4;
  const safetyBuffer = item.min_stock || 0;
  const cantidad_recomendada = ventas_por_semana > 0 ? Math.max(0, Math.ceil(ventas_por_semana * targetWeeks + safetyBuffer - item.stock_actual)) : Math.max(0, safetyBuffer - item.stock_actual);
  let urgency = "medium";
  if (item.stock_actual === 0 || semanas_restantes !== null && semanas_restantes < 1) {
    urgency = "critical";
  } else if (semanas_restantes !== null && semanas_restantes < 2) {
    urgency = "high";
  }
  return { ...item, ventas_por_semana, semanas_restantes, cantidad_recomendada, urgency };
}
const urgencyConfig = {
  critical: {
    border: "border-destructive/50",
    bg: "bg-destructive/5",
    badge: "bg-destructive text-white",
    label: "CRÍTICO",
    icon: PackageX,
    dotColor: "bg-destructive"
  },
  high: {
    border: "border-orange-400/50",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    badge: "bg-orange-500 text-white",
    label: "URGENTE",
    icon: AlertTriangle,
    dotColor: "bg-orange-500"
  },
  medium: {
    border: "border-yellow-400/40",
    bg: "bg-yellow-50/50 dark:bg-yellow-950/20",
    badge: "bg-yellow-500 text-white",
    label: "ATENCIÓN",
    icon: TrendingDown,
    dotColor: "bg-yellow-500"
  }
};
const StockAlerts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(10);
  const [days, setDays] = useState(30);
  const fetchData = async () => {
    setLoading(true);
    try {
      const settingsRes = await fetch("/api/settings");
      let currentThreshold = threshold;
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.stock?.umbral_minimo !== void 0) {
          currentThreshold = settings.stock.umbral_minimo;
          setThreshold(currentThreshold);
        }
      }
      const res = await fetch(`/api/reports/reposicion?threshold=${currentThreshold}&days=${days}`);
      if (!res.ok) {
        setError("Error al cargar datos");
        return;
      }
      const json = await res.json();
      const raw = Array.isArray(json) ? json : json.data || [];
      const computed = raw.map(computeReplenishment).sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2 };
        return order[a.urgency] - order[b.urgency];
      });
      setItems(computed);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [days]);
  const counts = {
    critical: items.filter((i) => i.urgency === "critical").length,
    high: items.filter((i) => i.urgency === "high").length,
    medium: items.filter((i) => i.urgency === "medium").length
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-3 p-6 pb-4 border-b border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-semibold leading-none tracking-tight flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "h-5 w-5 text-primary" }),
          "Predicción de Reposición"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: days,
              onChange: (e) => setDays(Number(e.target.value)),
              className: "text-xs bg-muted border border-border rounded-md px-2 py-1 text-muted-foreground focus:outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: 7, children: "7 días" }),
                /* @__PURE__ */ jsx("option", { value: 14, children: "14 días" }),
                /* @__PURE__ */ jsx("option", { value: 30, children: "30 días" }),
                /* @__PURE__ */ jsx("option", { value: 60, children: "60 días" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: fetchData, className: "text-muted-foreground hover:text-primary transition-colors p-1", children: /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Basado en el movimiento de los últimos ",
        /* @__PURE__ */ jsxs("strong", { children: [
          days,
          " días"
        ] }),
        ". Umbral: < ",
        threshold,
        " uds."
      ] }),
      !loading && items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        counts.critical > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/30 px-2 py-1 rounded-full", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-destructive inline-block" }),
          counts.critical,
          " Crítico",
          counts.critical > 1 ? "s" : ""
        ] }),
        counts.high > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-300 px-2 py-1 rounded-full dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" }),
          counts.high,
          " Urgente",
          counts.high > 1 ? "s" : ""
        ] }),
        counts.medium > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-1 rounded-full dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" }),
          counts.medium,
          " Atención"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 flex-1 overflow-hidden flex flex-col", children: [
      loading && items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center text-sm text-muted-foreground animate-pulse", children: "Calculando predicciones..." }) : error ? /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-sm text-destructive", children: error }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center py-8 text-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "✅" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Todo en orden. No hay productos que requieran reposición." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3 overflow-y-auto max-h-[400px] pr-1", children: items.map((item) => {
        const cfg = urgencyConfig[item.urgency];
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `rounded-lg border p-3.5 ${cfg.border} ${cfg.bg} transition-colors`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: item.producto }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                    /* @__PURE__ */ jsx("code", { className: "text-[10px] text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded border", children: item.sku }),
                    item.variante && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                      "• ",
                      item.variante
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: `text-[9px] font-bold tracking-wider px-2 py-1 rounded-full shrink-0 ${cfg.badge}`, children: cfg.label })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-background/60 rounded-md p-2 text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: `text-lg font-bold ${item.stock_actual === 0 ? "text-destructive" : "text-foreground"}`, children: item.stock_actual }),
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wide", children: "Stock actual" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-background/60 rounded-md p-2 text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-foreground", children: item.ventas_por_semana > 0 ? item.ventas_por_semana : "—" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wide", children: "Uds/semana" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-background/60 rounded-md p-2 text-center", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-foreground", children: item.semanas_restantes !== null ? `${item.semanas_restantes}s` : "∞" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wide", children: "Duración" })
                ] })
              ] }),
              item.cantidad_recomendada > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-primary/10 border border-primary/20 rounded-md px-3 py-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(ShoppingCart, { className: "h-3.5 w-3.5 text-primary" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-primary font-medium", children: [
                    "Comprar ",
                    /* @__PURE__ */ jsxs("strong", { children: [
                      item.cantidad_recomendada,
                      " unidades"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground", children: "~4 semanas cobertura" })
              ] }),
              item.ventas_por_semana === 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1", children: [
                /* @__PURE__ */ jsx(Info, { className: "h-3 w-3 shrink-0" }),
                "Sin movimiento en los últimos ",
                item.periodo_dias,
                " días"
              ] })
            ]
          },
          item.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "pt-3 border-t mt-3", children: /* @__PURE__ */ jsxs("a", { href: "/dashboard/products", className: "text-xs text-primary hover:underline flex items-center justify-center gap-1 w-full", children: [
        "Gestionar Inventario ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
      ] }) })
    ] })
  ] });
};

const RecentOutlets = () => {
  const [outlets, setOutlets] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users?limit=1000");
      if (res.ok) {
        const responseData = await res.json();
        let usersList = [];
        if (Array.isArray(responseData)) usersList = responseData;
        else if (responseData.data) usersList = responseData.data;
        const map = {};
        usersList.forEach((u) => {
          map[String(u.id)] = u.nombre || u.email;
        });
        setUsersMap(map);
      }
    } catch (e) {
      console.error("Failed to load users for mapping", e);
    }
  };
  const fetchOutlets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auditoria?limit=20");
      if (res.ok) {
        const response = await res.json();
        const allLogs = response.data || [];
        const relevantOutlets = allLogs.filter(
          (log) => log.action === "INV_SALIDA" || log.action === "VENTA_CREAR" || log.action === "Creó venta" || log.target_tipo === "venta"
        ).slice(0, 5);
        setOutlets(relevantOutlets);
        setError(null);
      } else {
        setError("Error al cargar movimientos");
      }
    } catch (e) {
      console.error(e);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
    fetchOutlets();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1.5 p-6 pb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold leading-none tracking-tight flex items-center gap-2 text-primary", children: [
          /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-5 w-5" }),
          "Salidas Recientes"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: fetchOutlets, className: "text-muted-foreground hover:text-primary transition-colors", children: /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "Últimos movimientos de salida registrados." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 pt-0 flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: loading && outlets.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-sm text-muted-foreground animate-pulse", children: "Sincronizando..." }) : error ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-sm text-destructive font-medium bg-destructive/5 rounded-lg border border-destructive/10", children: error }) : outlets.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-10 text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60", children: "No se han registrado salidas recientemente." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: outlets.map((item) => {
        const payload = typeof item.payload === "string" ? JSON.parse(item.payload || "{}") : item.payload || {};
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedOutlet(item),
            className: "flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all group cursor-pointer",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0 group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ jsx(Package, { className: "w-4 h-4 text-primary opacity-70" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-sm truncate text-foreground/90", children: item.target_label || item.target_variante_sku || "Producto" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest", children: format(new Date(item.created_at), "dd MMM, HH:mm") })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0 ml-3", children: [
                /* @__PURE__ */ jsxs("span", { className: "block font-black text-rose-500 text-base", children: [
                  "-",
                  payload.cantidad || 0
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter", children: "unidades" })
              ] })
            ]
          },
          item.id
        );
      }) }) }),
      !loading && outlets.length > 0 && /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-border/20 mt-4", children: /* @__PURE__ */ jsxs("a", { href: "/dashboard/audit?target_tipo=inventario", className: "text-xs font-black text-primary hover:underline flex items-center justify-center gap-1.5 uppercase tracking-widest group", children: [
        "Ver todo el historial",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selectedOutlet, onOpenChange: (open) => !open && setSelectedOutlet(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-md bg-white/95 backdrop-blur-xl border border-border/40 shadow-2xl p-0 overflow-hidden", children: selectedOutlet && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 pb-4", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1", children: [
            /* @__PURE__ */ jsx(Info, { className: "w-3 h-3" }),
            "Detalle de Movimiento"
          ] }),
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-extrabold tracking-tight", children: "Salida de Inventario" }),
          /* @__PURE__ */ jsx(DialogDescription, { className: "text-sm font-medium text-muted-foreground", children: "Información detallada sobre este registro de auditoría." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-primary/20 shrink-0", children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-primary/60 uppercase tracking-widest leading-none mb-1", children: "Producto / Variante" }),
              /* @__PURE__ */ jsx("div", { className: "text-lg font-black text-foreground truncate leading-tight", children: (() => {
                const p = typeof selectedOutlet.payload === "string" ? JSON.parse(selectedOutlet.payload) : selectedOutlet.payload || {};
                const rawName = p.nombre_producto || p.producto_nombre || p.nombre_variante || p.variante_nombre || p.nombre || selectedOutlet.target_producto_nombre;
                const sku = p.sku || p.variante_sku || selectedOutlet.target_variante_sku;
                const cleanLabel = (text) => {
                  if (!text) return "";
                  return text.split(" #")[0].split("#")[0];
                };
                const displayName = cleanLabel(rawName || selectedOutlet.target_label);
                if (displayName) {
                  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: displayName }),
                    sku && /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground mt-0.5", children: [
                      "SKU: ",
                      sku
                    ] })
                  ] });
                }
                return /* @__PURE__ */ jsx("span", { children: sku || "Sin nombre" });
              })() })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg border border-border/40 bg-muted/5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1.5 grayscale opacity-60", children: [
                /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-wider", children: "Registrado por" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-foreground/90", children: selectedOutlet.actor_name || selectedOutlet.actor?.nombre || (selectedOutlet.actor_id ? usersMap[String(selectedOutlet.actor_id)] : null) || "Sistema" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg border border-border/40 bg-muted/5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1.5 grayscale opacity-60", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-wider", children: "Fecha y Hora" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-foreground/90", children: format(new Date(selectedOutlet.created_at), "dd/MM/yyyy HH:mm") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border-2 border-rose-500/10 bg-rose-500/[0.02] flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-rose-600/60 uppercase tracking-widest block mb-0.5", children: "Cantidad Extraída" }),
              /* @__PURE__ */ jsxs("span", { className: "text-2xl font-black text-rose-500 leading-none", children: [
                "-",
                typeof selectedOutlet.payload === "string" ? JSON.parse(selectedOutlet.payload).cantidad : selectedOutlet.payload?.cantidad || 0
              ] }),
              /* @__PURE__ */ jsx("span", { className: "ml-1.5 text-xs font-bold text-rose-400 uppercase tracking-tighter", children: "unidades" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(ArrowDownRight, { className: "w-6 h-6 text-rose-500" }) })
          ] }),
          (() => {
            const p = typeof selectedOutlet.payload === "string" ? JSON.parse(selectedOutlet.payload) : selectedOutlet.payload || {};
            const fieldOrder = [
              "tipo",
              "motivo",
              "ref_externa",
              "costo_unitario",
              "stock_antes",
              "stock_despues"
            ];
            const extraFields = Object.entries(p).filter(
              ([key]) => !["cantidad", "id", "producto_id", "variante_id", "nombre", "sku", "nombre_producto", "producto_nombre", "nombre_variante", "variante_nombre", "variante_sku", "id_variante_producto", "id_movimiento_inventario"].includes(key)
            ).sort(([a], [b]) => {
              const indexA = fieldOrder.indexOf(a);
              const indexB = fieldOrder.indexOf(b);
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              return a.localeCompare(b);
            });
            if (extraFields.length === 0) return null;
            return /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-2 border-t border-border/20", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest block mb-2", children: "Detalles Adicionales" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1.5", children: extraFields.map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-muted-foreground/60 capitalize", children: key.replace(/_/g, " ") }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-foreground/80 truncate", children: key.includes("costo") ? `$${Number(value).toLocaleString()}` : String(value) })
              ] }, key)) })
            ] });
          })()
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-muted/30 border-t border-border/40 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest", children: [
          "Movimiento ID: #",
          selectedOutlet.id
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/dashboard/audit?search=${selectedOutlet.id}`,
            className: "text-[10px] font-black text-primary uppercase tracking-[0.15em] hover:underline flex items-center gap-1.5",
            children: [
              "Ver en auditoría",
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
            ]
          }
        )
      ] })
    ] }) }) })
  ] });
};

const $$MainContent = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<main class="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden"> <div class="mb-8"> <h2 class="text-3xl font-bold text-foreground tracking-tight">Vista Principal</h2> <p class="mt-2 text-muted-foreground">Bienvenido de nuevo al panel de control.</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8">  <div class="col-span-1"> ${renderComponent($$result, "StockAlerts", StockAlerts, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Home/StockAlerts", "client:component-export": "StockAlerts" })} </div>  <div class="col-span-1"> ${renderComponent($$result, "RecentOutlets", RecentOutlets, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/Home/RecentOutlets", "client:component-export": "RecentOutlets" })} </div> </div> </main>`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/components/Dashboard/MainContent.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panel Principal | Tu Tienda" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col min-h-screen bg-background bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"> ${renderComponent($$result2, "Header", $$Header, {})} <div class="flex flex-1"> ${renderComponent($$result2, "Sidebar", $$Sidebar, {})} ${renderComponent($$result2, "MainContent", $$MainContent, {})} </div> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/index.astro", void 0);

const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
