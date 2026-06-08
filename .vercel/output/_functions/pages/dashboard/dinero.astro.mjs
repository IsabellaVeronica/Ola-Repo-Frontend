/* empty css                                    */
import { e as createComponent, p as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D_CbgPK6.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/utils_DY3iklJy.mjs';
import { $ as $$Header, a as $$Sidebar } from '../../chunks/Header_CSh91x7o.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BGa3uP_K.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { B as Badge, F as FetchData, A as API_ENDPOINTS } from '../../chunks/api_CUvdBGU1.mjs';
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, c as CardDescription } from '../../chunks/card_BjP27i0i.mjs';
import { I as Input } from '../../chunks/input_VyVQ34R2.mjs';
import { B as Button } from '../../chunks/button_D3TXvS4A.mjs';
import { AlertTriangle, X, Coins, Wallet, PlusCircle, Banknote, Trash, Filter, RefreshCw, Loader2, ArrowUpRight, ArrowDownLeft, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from '../../chunks/alert-dialog_D0p8C7NC.mjs';
import { A as AuthGuard } from '../../chunks/AuthGuard_By6cWR9G.mjs';
export { renderers } from '../../renderers.mjs';

const MoneyManager = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [cuentas, setCuentas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [filterCuenta, setFilterCuenta] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showCreateMovementModal, setShowCreateMovementModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    nombre: "",
    moneda: "USD",
    saldo_inicial: "0.00"
  });
  const [newMovementData, setNewMovementData] = useState({
    id_cuenta: "",
    tipo: "ingreso",
    monto_usd: "",
    tasa_cambio: "1.00",
    concepto: ""
  });
  const fetchAllData = async () => {
    try {
      const [resCuentas, resResumen] = await Promise.all([
        FetchData(API_ENDPOINTS.MONEY.CUENTAS, "GET"),
        FetchData(API_ENDPOINTS.MONEY.RESUMEN, "GET")
      ]);
      const listC = Array.isArray(resCuentas) ? resCuentas : resCuentas.data || [];
      setCuentas(listC);
      setResumen(resResumen);
      if (listC.length > 0 && !newMovementData.id_cuenta) {
        setNewMovementData((prev) => ({ ...prev, id_cuenta: String(listC[0].id_cuenta) }));
      }
    } catch (e) {
      console.error("Error loading money management data:", e);
    }
  };
  const fetchTransactions = async () => {
    setLoadingMovimientos(true);
    try {
      let query = `?page=${page}&limit=8`;
      if (filterCuenta) query += `&id_cuenta=${filterCuenta}`;
      if (filterTipo) query += `&tipo=${filterTipo}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await FetchData(`${API_ENDPOINTS.MONEY.MOVIMIENTOS}${query}`, "GET");
      if (res) {
        setMovimientos(res.data || []);
        setTotalItems(res.total || 0);
        setTotalPageCount(Math.ceil((res.total || 0) / (res.limit || 8)));
      }
    } catch (e) {
      console.error("Error fetching transactions:", e);
    } finally {
      setLoadingMovimientos(false);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);
  useEffect(() => {
    fetchTransactions();
  }, [page, filterCuenta, filterTipo, searchTerm]);
  useEffect(() => {
    if (!newMovementData.id_cuenta) return;
    const acc = cuentas.find((c) => String(c.id_cuenta) === newMovementData.id_cuenta);
    if (acc) {
      if (acc.moneda === "USD") {
        setNewMovementData((prev) => ({ ...prev, tasa_cambio: "1.00" }));
      } else if (acc.moneda === "COP") {
        setNewMovementData((prev) => ({ ...prev, tasa_cambio: "4000" }));
      } else if (acc.moneda === "VES") {
        setNewMovementData((prev) => ({ ...prev, tasa_cambio: "36" }));
      }
    }
  }, [newMovementData.id_cuenta, cuentas]);
  const handleOpenCreateAccount = () => {
    setError(null);
    setSuccess(null);
    setShowCreateAccountModal(true);
  };
  const handleOpenCreateMovement = () => {
    setError(null);
    setSuccess(null);
    setShowCreateMovementModal(true);
  };
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!newAccountData.nombre.trim()) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(API_ENDPOINTS.MONEY.CUENTAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: newAccountData.nombre.trim(),
          moneda: newAccountData.moneda,
          saldo_inicial: parseFloat(newAccountData.saldo_inicial || "0")
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al crear la cuenta");
      }
      setSuccess("Cuenta creada exitosamente!");
      setShowCreateAccountModal(false);
      setNewAccountData({
        nombre: "",
        moneda: "USD",
        saldo_inicial: "0.00"
      });
      await fetchAllData();
    } catch (err) {
      setError(err.message || "Error al crear cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCreateMovement = async (e) => {
    e.preventDefault();
    const { id_cuenta, tipo, monto_usd, tasa_cambio, concepto } = newMovementData;
    if (!id_cuenta || !monto_usd || !concepto.trim()) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(API_ENDPOINTS.MONEY.MOVIMIENTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cuenta: parseInt(id_cuenta, 10),
          tipo,
          monto_usd: parseFloat(monto_usd),
          tasa_cambio: parseFloat(tasa_cambio || "1"),
          concepto: concepto.trim()
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al registrar el movimiento");
      }
      setSuccess("Movimiento registrado exitosamente!");
      setShowCreateMovementModal(false);
      setNewMovementData({
        id_cuenta: cuentas[0] ? String(cuentas[0].id_cuenta) : "",
        tipo: "ingreso",
        monto_usd: "",
        tasa_cambio: "1.00",
        concepto: ""
      });
      await fetchAllData();
      await fetchTransactions();
    } catch (err) {
      setError(err.message || "Error al registrar movimiento");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteAccountClick = (cuenta) => {
    setError(null);
    setSuccess(null);
    setAccountToDelete(cuenta);
  };
  const handleDeleteAccountConfirm = async () => {
    if (!accountToDelete) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_ENDPOINTS.MONEY.CUENTAS}/${accountToDelete.id_cuenta}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al eliminar la cuenta");
      }
      setSuccess("Cuenta eliminada exitosamente.");
      await fetchAllData();
    } catch (err) {
      setError(err.message || "Error al eliminar cuenta");
    } finally {
      setAccountToDelete(null);
    }
  };
  const getCurrencySymbol = (moneda) => {
    switch (moneda) {
      case "USD":
        return "$";
      case "COP":
        return "COP ";
      case "VES":
        return "Bs ";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-foreground pb-12", children: [
    error && /* @__PURE__ */ jsxs("div", { className: "bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl flex justify-between items-center animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4.5 w-4.5 animate-pulse flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: error })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => setError(null), className: "h-6 w-6 text-red-500 hover:bg-red-500/10 flex-shrink-0", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    success && /* @__PURE__ */ jsxs("div", { className: "bg-green-500/10 border border-green-500/20 text-green-500 p-3.5 rounded-xl flex justify-between items-center animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Coins, { className: "h-4.5 w-4.5 text-green-500 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: success })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSuccess(null), className: "h-6 w-6 text-green-500 hover:bg-green-500/10 flex-shrink-0", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold tracking-tight text-foreground", children: "Dinero y Caja" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-medium", children: "Administra tus cuentas bancarias, ingresos, egresos y tasas de cambio." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs h-11",
            onClick: handleOpenCreateAccount,
            children: [
              /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }),
              " Crear Cuenta"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "flex-1 sm:flex-none bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all text-xs h-11",
            onClick: handleOpenCreateMovement,
            children: [
              /* @__PURE__ */ jsx(PlusCircle, { className: "h-4 w-4" }),
              " Registrar Ajuste"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: ["USD", "COP", "VES"].map((moneda) => {
      const totalVal = resumen?.saldos?.find((s) => s.moneda === moneda)?.total || 0;
      let colorClass = "from-fuchsia-500/10 to-pink-500/5 border-fuchsia-500/20 text-fuchsia-400";
      if (moneda === "COP") colorClass = "from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400";
      if (moneda === "VES") colorClass = "from-blue-500/10 to-cyan-500/5 border-blue-500/20 text-blue-400";
      return /* @__PURE__ */ jsxs(Card, { className: `bg-gradient-to-br ${colorClass} border backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02]`, children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-sm font-bold tracking-wider uppercase text-muted-foreground", children: [
            "Saldo Total ",
            moneda
          ] }),
          /* @__PURE__ */ jsx(Coins, { className: "h-5 w-5 opacity-70" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-3xl font-black text-foreground", children: [
            getCurrencySymbol(moneda),
            totalVal.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1.5 font-medium", children: [
            "Disponible en cuentas ",
            moneda
          ] })
        ] })
      ] }, moneda);
    }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center gap-2 text-foreground", children: [
        /* @__PURE__ */ jsx(Banknote, { className: "h-5 w-5 text-primary" }),
        " Cuentas Activas"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: cuentas.length === 0 ? /* @__PURE__ */ jsxs(Card, { className: "col-span-full border-dashed p-8 text-center text-muted-foreground bg-card/40 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsx(Wallet, { className: "h-10 w-10 mx-auto text-muted-foreground/30 mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No hay cuentas bancarias registradas en el sistema." })
      ] }) : cuentas.map((c) => /* @__PURE__ */ jsxs(Card, { className: "bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm lg:text-base group-hover:text-primary transition-colors leading-snug", children: c.nombre }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mt-1.5", children: /* @__PURE__ */ jsx(Badge, { className: "bg-primary/10 text-primary hover:bg-primary/20 border-none text-[9px] font-bold uppercase py-0.5 px-1.5", children: c.moneda }) })
          ] }),
          c.nombre !== "Caja Efectivo USD" && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0",
              onClick: () => handleDeleteAccountClick(c),
              children: /* @__PURE__ */ jsx(Trash, { className: "h-4 w-4" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-black text-foreground mt-2", children: [
          getCurrencySymbol(c.moneda),
          Number(c.saldo).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ] }) })
      ] }, c.id_cuenta)) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border border-border bg-card/85 backdrop-blur-sm shadow-xl overflow-hidden text-foreground", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-md lg:text-lg font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Coins, { className: "h-5 w-5 text-primary" }),
            " Historial de Movimientos"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs text-muted-foreground mt-1", children: "Registros detallados de ingresos y egresos de efectivo y bancos." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 w-full md:w-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-48", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "h-9 text-xs pl-8 bg-background border-border text-foreground focus-visible:ring-primary",
                placeholder: "Buscar concepto...",
                value: searchTerm,
                onChange: (e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }
              }
            ),
            /* @__PURE__ */ jsx(Filter, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/75" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "h-9 border border-border rounded-md px-2.5 text-xs bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none",
              value: filterCuenta,
              onChange: (e) => {
                setFilterCuenta(e.target.value);
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Todas las Cuentas" }),
                cuentas.map((c) => /* @__PURE__ */ jsx("option", { value: c.id_cuenta, children: c.nombre }, c.id_cuenta))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "h-9 border border-border rounded-md px-2.5 text-xs bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none",
              value: filterTipo,
              onChange: (e) => {
                setFilterTipo(e.target.value);
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Todos los Tipos" }),
                /* @__PURE__ */ jsx("option", { value: "ingreso", children: "Ingresos" }),
                /* @__PURE__ */ jsx("option", { value: "egreso", children: "Egresos" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "h-9 w-9 border-border text-foreground hover:bg-muted",
              onClick: () => {
                fetchTransactions();
                fetchAllData();
              },
              children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-muted/20 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]", children: [
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Concepto" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Cuenta" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Monto USD" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Tasa" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Monto Real" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Usuario" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-right", children: "Fecha" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: loadingMovimientos ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "p-12 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin mx-auto text-primary mb-2" }),
            "Cargando transacciones..."
          ] }) }) : movimientos.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-12 text-center text-muted-foreground italic", children: "No hay transacciones registradas." }) }) : movimientos.map((m) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/10 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "p-4 font-medium max-w-[240px] truncate", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: `p-1 rounded-full flex-shrink-0 ${m.tipo === "ingreso" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`, children: m.tipo === "ingreso" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDownLeft, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-foreground truncate", children: m.concepto }),
                m.id_pedido && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-primary/80 font-semibold font-mono", children: [
                  "Pedido #",
                  m.id_pedido
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: m.cuenta_nombre }),
              /* @__PURE__ */ jsx(Badge, { className: "bg-muted text-muted-foreground border-none text-[9px] font-bold py-0 px-1 mt-0.5 uppercase", children: m.cuenta_moneda })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { className: "p-4 font-mono font-bold text-foreground", children: [
              "$",
              m.monto_usd.toFixed(2)
            ] }),
            /* @__PURE__ */ jsx("td", { className: "p-4 font-mono text-muted-foreground", children: m.tasa_cambio.toFixed(2) }),
            /* @__PURE__ */ jsxs("td", { className: `p-4 font-mono font-bold ${m.tipo === "ingreso" ? "text-green-500" : "text-red-500"}`, children: [
              m.tipo === "ingreso" ? "+" : "-",
              getCurrencySymbol(m.cuenta_moneda),
              m.monto_real.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "p-4 font-medium text-muted-foreground", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
              " ",
              m.usuario_nombre || "Sistema"
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "p-4 text-right text-muted-foreground font-mono", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              " ",
              new Date(m.created_at).toLocaleString()
            ] }) })
          ] }, m.id_transaccion)) })
        ] }) }),
        totalPageCount > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-t border-border bg-muted/10 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground font-medium", children: [
            "Mostrando ",
            movimientos.length,
            " de ",
            totalItems,
            " movimientos"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "h-8 w-8 border-border text-foreground hover:bg-muted",
                disabled: page === 1,
                onClick: () => setPage((p) => Math.max(1, p - 1)),
                children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "h-8 px-3 flex items-center justify-center font-bold border border-border rounded-md bg-background text-foreground", children: [
              "Página ",
              page,
              " de ",
              totalPageCount
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                className: "h-8 w-8 border-border text-foreground hover:bg-muted",
                disabled: page === totalPageCount,
                onClick: () => setPage((p) => Math.min(totalPageCount, p + 1)),
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    showCreateAccountModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-card/95 border border-border shadow-2xl animate-in zoom-in duration-200", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between border-b border-border pb-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-base lg:text-lg font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5 text-primary" }),
            " Crear Nueva Cuenta"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs text-muted-foreground mt-0.5", children: "Registra un banco o caja física para el negocio." })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-full text-foreground hover:bg-muted",
            onClick: () => setShowCreateAccountModal(false),
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateAccount, children: [
        /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-4", children: [
          error && /* @__PURE__ */ jsxs("div", { className: "bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex justify-between items-center animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 animate-pulse flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: error })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setError(null), className: "h-5 w-5 text-red-500 hover:bg-red-500/10 flex-shrink-0", children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Nombre de la Cuenta *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "h-10 bg-background border-border text-foreground text-sm focus-visible:ring-primary font-medium",
                placeholder: "Ej: Banesco Bolívares, Caja Chica COP",
                value: newAccountData.nombre,
                onChange: (e) => setNewAccountData({ ...newAccountData, nombre: e.target.value }),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Moneda *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "w-full h-10 border border-border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium",
                  value: newAccountData.moneda,
                  onChange: (e) => setNewAccountData({ ...newAccountData, moneda: e.target.value }),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "USD", children: "USD ($)" }),
                    /* @__PURE__ */ jsx("option", { value: "COP", children: "COP (Pesos)" }),
                    /* @__PURE__ */ jsx("option", { value: "VES", children: "VES (Bolívares)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Saldo Inicial" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "any",
                  className: "h-10 bg-background border-border text-foreground text-sm focus-visible:ring-primary font-medium",
                  placeholder: "0.00",
                  value: newAccountData.saldo_inicial,
                  onChange: (e) => setNewAccountData({ ...newAccountData, saldo_inicial: e.target.value })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border flex gap-2 justify-end bg-muted/20", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "border-border text-foreground hover:bg-muted",
              onClick: () => setShowCreateAccountModal(false),
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold",
              disabled: isSubmitting,
              children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Crear Cuenta"
            }
          )
        ] })
      ] })
    ] }) }),
    showCreateMovementModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md bg-card/95 border border-border shadow-2xl animate-in zoom-in duration-200", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between border-b border-border pb-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "text-base lg:text-lg font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "h-5 w-5 text-green-600" }),
            " Registrar Ajuste de Caja"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-xs text-muted-foreground mt-0.5", children: "Ingresa o retira dinero manualmente de una cuenta." })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-full text-foreground hover:bg-muted",
            onClick: () => setShowCreateMovementModal(false),
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateMovement, children: [
        /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-4 text-foreground", children: [
          error && /* @__PURE__ */ jsxs("div", { className: "bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex justify-between items-center animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 animate-pulse flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: error })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setError(null), className: "h-5 w-5 text-red-500 hover:bg-red-500/10 flex-shrink-0", children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Cuenta de Caja *" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  className: "w-full h-10 border border-border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium",
                  value: newMovementData.id_cuenta,
                  onChange: (e) => setNewMovementData({ ...newMovementData, id_cuenta: e.target.value }),
                  required: true,
                  children: cuentas.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id_cuenta, children: [
                    c.nombre,
                    " (",
                    c.moneda,
                    ")"
                  ] }, c.id_cuenta))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Tipo de Movimiento *" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "w-full h-10 border border-border rounded-md px-3 text-sm bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium",
                  value: newMovementData.tipo,
                  onChange: (e) => setNewMovementData({ ...newMovementData, tipo: e.target.value }),
                  required: true,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "ingreso", children: "Ingreso (+)" }),
                    /* @__PURE__ */ jsx("option", { value: "egreso", children: "Egreso (-)" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Monto en USD ($) *" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "any",
                  className: "h-10 bg-background border-border text-foreground text-sm focus-visible:ring-primary font-medium",
                  placeholder: "0.00",
                  value: newMovementData.monto_usd,
                  onChange: (e) => setNewMovementData({ ...newMovementData, monto_usd: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Tasa de Cambio *" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  step: "any",
                  className: "h-10 bg-background border-border text-foreground text-sm focus-visible:ring-primary font-medium",
                  placeholder: "1.00",
                  value: newMovementData.tasa_cambio,
                  onChange: (e) => setNewMovementData({ ...newMovementData, tasa_cambio: e.target.value }),
                  required: true
                }
              )
            ] })
          ] }),
          (() => {
            const activeAcc = cuentas.find((c) => String(c.id_cuenta) === newMovementData.id_cuenta);
            if (activeAcc && activeAcc.moneda !== "USD") {
              const calculated = parseFloat(newMovementData.monto_usd || "0") * parseFloat(newMovementData.tasa_cambio || "1");
              return /* @__PURE__ */ jsxs("div", { className: "p-2.5 bg-primary/5 rounded-lg border border-primary/10 text-xs font-bold text-primary animate-in fade-in duration-200", children: [
                "Se registrarán ",
                getCurrencySymbol(activeAcc.moneda),
                calculated.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                " en ",
                activeAcc.nombre,
                "."
              ] });
            }
            return null;
          })(),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Concepto / Motivo *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "h-10 bg-background border-border text-foreground text-sm focus-visible:ring-primary font-medium",
                placeholder: "Ej: Depósito semanal, Ajuste por descuadre",
                value: newMovementData.concepto,
                onChange: (e) => setNewMovementData({ ...newMovementData, concepto: e.target.value }),
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border flex gap-2 justify-end bg-muted/20", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "border-border text-foreground hover:bg-muted",
              onClick: () => setShowCreateMovementModal(false),
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "bg-green-600 hover:bg-green-500 text-white font-semibold",
              disabled: isSubmitting,
              children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Registrar Movimiento"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!accountToDelete, onOpenChange: (open) => !open && setAccountToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "bg-card/95 border border-border backdrop-blur-md shadow-2xl", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { className: "text-foreground font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-500 animate-pulse" }),
          " ¿Eliminar cuenta bancaria?"
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "text-muted-foreground text-xs", children: [
          "¿Estás seguro de que deseas eliminar la cuenta bancaria ",
          /* @__PURE__ */ jsx("strong", { children: accountToDelete?.nombre }),
          "? El saldo y los movimientos históricos se conservarán para auditoría."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { className: "border-t pt-3 mt-2", children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "border-border text-foreground hover:bg-muted text-xs h-9 px-4 rounded-lg font-semibold", children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDeleteAccountConfirm,
            className: "bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 px-4 rounded-lg active:scale-95 transition-all",
            children: "Eliminar Cuenta"
          }
        )
      ] })
    ] }) })
  ] });
};

const $$Dinero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dinero & Finanzas | Panel de Control" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col min-h-screen bg-background bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"> ${renderComponent($$result2, "Header", $$Header, {})} <div class="flex flex-1"> ${renderComponent($$result2, "Sidebar", $$Sidebar, {})} <main class="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden"> ${renderComponent($$result2, "AuthGuard", AuthGuard, { "client:load": true, "allowedRoles": ["admin", "manager"], "panelName": "Dinero & Finanzas", "client:component-hydration": "load", "client:component-path": "@/components/Dashboard/AuthGuard", "client:component-export": "AuthGuard" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "MoneyManager", MoneyManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Dashboard/Money/MoneyManager", "client:component-export": "MoneyManager" })} ` })} </main> </div> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> ` })}`;
}, "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/dinero.astro", void 0);

const $$file = "C:/Users/aniba/Downloads/OLA WEB OFICIAL/OLA FRONTEND/src/pages/dashboard/dinero.astro";
const $$url = "/dashboard/dinero";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dinero,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
