import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Search, ChevronLeft, ChevronRight, Eye, Loader2, X,
    Calendar, Filter, Ban, AlertTriangle, CheckCircle2,
    CreditCard, Plus, Package, ShoppingCart, Minus, Trash2,
    ReceiptText, ClipboardList, ArrowLeft, ImageOff
} from 'lucide-react';

// ─────────────────────────────── Types ───────────────────────────────────

interface VariantAttr { [key: string]: string; }

interface CatalogVariant {
    id_variante_producto: number;
    nombre_producto: string;
    sku: string;
    atributos_json?: VariantAttr | string | null;
    precio_lista: number;
    stock: number;
    imagen_url?: string | null;
}

interface CartItem {
    variant: CatalogVariant;
    cantidad: number;
}

interface VentaItem {
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface Venta {
    id_venta: number;
    estado: 'completada' | 'anulada';
    total: number;
    metodo_pago: string;
    referencia_pago?: string;
    observacion?: string;
    motivo_anulacion?: string;
    created_at: string;
    cliente_cedula?: string;
    cliente_nombre?: string;
    cliente_email?: string;
    cliente_telefono?: string;
    id_pedido_origen?: number;
    items?: VentaItem[];
}

const METODOS_PAGO: [string, string][] = [
    ['efectivo', 'Efectivo'],
    ['transferencia', 'Transferencia'],
    ['pago_movil', 'Pago Móvil'],
    ['tarjeta', 'Tarjeta'],
    ['dolares', 'Dólares'],
    ['credito', 'Crédito'],
];

// ─────────────────────────────── Helpers ─────────────────────────────────

function parseAttrs(raw?: VariantAttr | string | null): string {
    if (!raw) return '';
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return Object.values(parsed).join(' · ');
        } catch { return raw; }
    }
    return Object.values(raw).join(' · ');
}

function variantImageSrc(url?: string | null): string | null {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return url; // relative `/uploads/...` works directly via frontend proxy
}

// ─────────────────────────────── Sub-components ───────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { cls: string; label: string }> = {
        completada: { cls: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400', label: 'Completada' },
        anulada: { cls: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Anulada' },
    };
    const cfg = map[status] || { cls: 'bg-muted text-foreground border-border', label: status };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>{cfg.label}</span>;
};

const PaymentBadge = ({ method }: { method: string }) => {
    const label = METODOS_PAGO.find(([k]) => k === method)?.[1] || method;
    return (
        <span className="inline-flex items-center gap-1 text-xs bg-accent/50 text-accent-foreground px-2 py-0.5 rounded-full border border-border font-medium">
            <CreditCard className="h-3 w-3" /> {label}
        </span>
    );
};

// ─────────────────────────────── Anular Dialog ───────────────────────────

const AnularDialog = ({ venta, onClose, onSuccess }: {
    venta: Venta; onClose: () => void; onSuccess: () => void;
}) => {
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnular = async () => {
        if (!motivo.trim()) { setError('El motivo es requerido.'); return; }
        setLoading(true); setError('');
        try {
            const res = await fetch(`/api/ventas/${venta.id_venta}/anular`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motivo }),
            });
            if (res.ok) { onSuccess(); }
            else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || data.error || `Error ${res.status}`);
            }
        } catch { setError('Error de conexión.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-md border p-6 space-y-4">
                <div className="flex items-center gap-3 text-destructive">
                    <Ban className="h-6 w-6" />
                    <h3 className="text-lg font-bold">Anular Venta #{venta.id_venta}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Esta acción revertirá el stock automáticamente. No se puede deshacer.
                </p>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Motivo de anulación *</label>
                    <textarea
                        className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={3} placeholder="Ej: Cliente canceló compra..."
                        value={motivo} onChange={e => setMotivo(e.target.value)}
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">Cancelar</button>
                    <button onClick={handleAnular} disabled={loading}
                        className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                        Confirmar Anulación
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────── Detail Modal ─────────────────────────────

const VentaDetailModal = ({ venta, onClose, onAnular, userRole }: {
    venta: Venta; onClose: () => void; onAnular: () => void; userRole: string;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border">
            <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">Venta #{venta.id_venta}</h3>
                    <StatusBadge status={venta.estado} />
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Cliente</p>
                        <p className="font-semibold">{venta.cliente_nombre || 'Sin nombre'}</p>
                        {venta.cliente_cedula && <p className="text-xs text-muted-foreground">C.I. {venta.cliente_cedula}</p>}
                        {venta.cliente_email && <p className="text-xs text-muted-foreground">{venta.cliente_email}</p>}
                        {venta.cliente_telefono && <p className="text-xs text-muted-foreground">{venta.cliente_telefono}</p>}
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Pago</p>
                        <PaymentBadge method={venta.metodo_pago} />
                        {venta.referencia_pago && <p className="text-xs text-muted-foreground mt-1">Ref: {venta.referencia_pago}</p>}
                        {venta.id_pedido_origen && <p className="text-xs text-primary mt-1 font-medium">Desde Pedido #{venta.id_pedido_origen}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                            {venta.created_at ? format(new Date(venta.created_at), "d MMM yyyy, HH:mm", { locale: es }) : ''}
                        </p>
                    </div>
                </div>

                {venta.observacion && (
                    <div className="p-3 bg-muted/30 rounded-md text-sm border">
                        <strong>Observación:</strong> {venta.observacion}
                    </div>
                )}
                {venta.motivo_anulacion && (
                    <div className="p-3 bg-destructive/10 rounded-md text-sm text-destructive border border-destructive/30">
                        <strong>Motivo de anulación:</strong> {venta.motivo_anulacion}
                    </div>
                )}

                <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Productos</p>
                    <div className="rounded-md border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs">
                                <tr>
                                    <th className="p-2.5 text-left font-medium">Producto</th>
                                    <th className="p-2.5 text-center font-medium">Cant.</th>
                                    <th className="p-2.5 text-right font-medium">Precio</th>
                                    <th className="p-2.5 text-right font-medium">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(venta.items || []).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-muted/10">
                                        <td className="p-2.5">{item.nombre_producto}</td>
                                        <td className="p-2.5 text-center">{item.cantidad}</td>
                                        <td className="p-2.5 text-right">${(item.precio_unitario || 0).toFixed(2)}</td>
                                        <td className="p-2.5 text-right font-medium">${(item.subtotal || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-muted/30">
                                    <td colSpan={3} className="p-2.5 text-right font-bold">Total</td>
                                    <td className="p-2.5 text-right font-bold text-primary text-base">${(venta.total || 0).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {(userRole === 'admin' || userRole === 'manager') && venta.estado === 'completada' && (
                <div className="p-5 border-t bg-muted/10 flex justify-end">
                    <button onClick={onAnular}
                        className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2">
                        <Ban className="h-4 w-4" /> Anular Venta
                    </button>
                </div>
            )}
        </div>
    </div>
);

// ─────────────────────────────── Catalog Card ─────────────────────────────

const VariantCard = ({ variant, onAdd }: { variant: CatalogVariant; onAdd: (v: CatalogVariant) => void; }) => {
    const attrs = parseAttrs(variant.atributos_json);
    const imgSrc = variantImageSrc(variant.imagen_url);
    const outOfStock = variant.stock <= 0;

    return (
        <div className={`group relative flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 ${outOfStock ? 'opacity-60' : ''}`}>
            {/* Image */}
            <div className="relative aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                {imgSrc ? (
                    <img src={imgSrc} alt={variant.nombre_producto}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                )}
                {/* Stock indicator */}
                <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${outOfStock ? 'bg-destructive text-destructive-foreground' : variant.stock <= 5 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                    {outOfStock ? 'Sin stock' : `${variant.stock} uds`}
                </div>
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">{variant.nombre_producto}</p>
                {attrs && <p className="text-xs text-secondary font-medium">{attrs}</p>}
                <p className="text-[10px] text-muted-foreground font-mono">{variant.sku}</p>
                <p className="text-base font-bold text-primary mt-auto pt-2">${(variant.precio_lista || 0).toFixed(2)}</p>
            </div>

            {/* Add button */}
            <button
                onClick={() => onAdd(variant)}
                disabled={outOfStock}
                className="m-3 mt-0 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
            >
                <Plus className="h-3.5 w-3.5" /> Agregar
            </button>
        </div>
    );
};

// ─────────────────────────────── POS Form ────────────────────────────────

const RegistrarVentaView = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void; }) => {
    const [search, setSearch] = useState('');
    const [includeNoStock, setIncludeNoStock] = useState(false);
    const [variants, setVariants] = useState<CatalogVariant[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Form state
    const [clienteCedula, setClienteCedula] = useState('');
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteEmail, setClienteEmail] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [referenciaPago, setReferenciaPago] = useState('');
    const [observacion, setObservacion] = useState('');

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSearchingClient, setIsSearchingClient] = useState(false);
    const lastLookupRef = useRef('');

    const normalizeCedula = (raw: string) =>
        String(raw || '').toUpperCase().replace(/[^0-9A-Z]/g, '');

    // Fetch catalog
    const fetchCatalog = useCallback(async () => {
        setCatalogLoading(true); setCatalogError('');
        try {
            const params = new URLSearchParams({ limit: '100' });
            if (search) params.append('q', search);
            if (includeNoStock) params.append('include_no_stock', 'true');
            const res = await fetch(`/api/ventas/catalogo?${params}`);
            if (!res.ok) { setCatalogError('Error al cargar catálogo'); return; }
            const data = await res.json();
            const list: CatalogVariant[] = Array.isArray(data) ? data : (data.data || data.items || []);
            setVariants(list);
        } catch { setCatalogError('Error de conexión.'); }
        finally { setCatalogLoading(false); }
    }, [search, includeNoStock]);

    useEffect(() => {
        const t = setTimeout(fetchCatalog, 300);
        return () => clearTimeout(t);
    }, [fetchCatalog]);

    // Auto-completa datos del cliente cuando se ingresa cédula (igual que checkout/cart)
    useEffect(() => {
        const cedulaNorm = normalizeCedula(clienteCedula);
        if (cedulaNorm.length < 5) {
            setIsSearchingClient(false);
            lastLookupRef.current = '';
            return;
        }

        const timeout = setTimeout(async () => {
            if (lastLookupRef.current === cedulaNorm) return;
            lastLookupRef.current = cedulaNorm;
            setIsSearchingClient(true);
            try {
                const res = await fetch(`/api/guest/client/${encodeURIComponent(cedulaNorm)}`);
                if (!res.ok) return;
                const result = await res.json().catch(() => null);
                if (result?.status === 'success' && result?.data) {
                    const { nombre, email, telefono } = result.data;
                    if (nombre) setClienteNombre(nombre);
                    if (email) setClienteEmail(email);
                    if (telefono) setClienteTelefono(telefono);
                }
            } catch {
                // noop
            } finally {
                setIsSearchingClient(false);
            }
        }, 700);

        return () => clearTimeout(timeout);
    }, [clienteCedula]);

    const addToCart = (variant: CatalogVariant) => {
        setCart(prev => {
            const existing = prev.find(ci => ci.variant.id_variante_producto === variant.id_variante_producto);
            if (existing) {
                if (existing.cantidad >= variant.stock) return prev; // Respect stock
                return prev.map(ci => ci.variant.id_variante_producto === variant.id_variante_producto
                    ? { ...ci, cantidad: ci.cantidad + 1 } : ci);
            }
            return [...prev, { variant, cantidad: 1 }];
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart(prev => prev.map(ci => {
            if (ci.variant.id_variante_producto !== id) return ci;
            const newQty = ci.cantidad + delta;
            if (newQty <= 0) return ci; // handled by remove
            if (newQty > ci.variant.stock) return ci;
            return { ...ci, cantidad: newQty };
        }));
    };

    const removeFromCart = (id: number) => setCart(prev => prev.filter(ci => ci.variant.id_variante_producto !== id));

    const handleCedulaChange = (value: string) => {
        const cleaned = value.toUpperCase().replace(/[^0-9A-Z-]/g, '');
        if (cleaned !== clienteCedula) {
            setClienteCedula(cleaned);
            setClienteNombre('');
            setClienteEmail('');
            setClienteTelefono('');
        }
    };

    const total = useMemo(() => cart.reduce((s, ci) => s + ci.variant.precio_lista * ci.cantidad, 0), [cart]);

    const handleSubmit = async () => {
        if (cart.length === 0) { setSubmitError('Agrega al menos un producto al carrito.'); return; }
        setSubmitLoading(true); setSubmitError('');
        try {
            const res = await fetch('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cliente_cedula: clienteCedula || undefined,
                    cliente_nombre: clienteNombre || undefined,
                    cliente_email: clienteEmail || undefined,
                    cliente_telefono: clienteTelefono || undefined,
                    metodo_pago: metodoPago,
                    referencia_pago: referenciaPago || undefined,
                    observacion: observacion || undefined,
                    items: cart.map(ci => ({
                        id_variante_producto: ci.variant.id_variante_producto,
                        cantidad: ci.cantidad,
                    })),
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setCart([]);
                onSuccess();
            } else if (res.status === 409) {
                setSubmitError(`âš  ${data.message || 'Stock insuficiente o venta ya registrada.'}`);
            } else {
                setSubmitError(data.message || data.error || `Error ${res.status}: solicitud invÃ¡lida.`);
            }
        } catch { setSubmitError('Error de conexión.'); }
        finally { setSubmitLoading(false); }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Title */}
            <div className="flex items-center gap-4">
                <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors border border-border">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-primary">Registrar Venta</h2>
                    <p className="text-sm text-muted-foreground">Selecciona variantes del catálogo.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* â”€â”€ LEFT: Catalog â”€â”€ */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Catalog search */}
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text" placeholder="Buscar producto, SKU, atributo..."
                                className="w-full h-10 rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={search} onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer whitespace-nowrap">
                            <input type="checkbox" checked={includeNoStock} onChange={e => setIncludeNoStock(e.target.checked)} className="rounded" />
                            Ver sin stock
                        </label>
                    </div>

                    {/* Catalog grid */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        {catalogLoading ? (
                            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" /> Cargando catálogo...
                            </div>
                        ) : catalogError ? (
                            <div className="text-center text-destructive py-10 text-sm">{catalogError}</div>
                        ) : variants.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10 text-sm">Sin resultados.</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                                {variants.map(v => (
                                    <VariantCard key={v.id_variante_producto} variant={v} onAdd={addToCart} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* â”€â”€ RIGHT: Cart + Form â”€â”€ */}
                <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4">
                    {/* Cart */}
                    <div className="rounded-xl border bg-card shadow-sm flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                                <ShoppingCart className="h-4 w-4 text-primary" /> Carrito
                            </h3>
                            {cart.length > 0 && (
                                <button onClick={() => setCart([])} className="text-xs text-destructive hover:underline">Vaciar</button>
                            )}
                        </div>

                        <div className="overflow-y-auto max-h-[260px] divide-y">
                            {cart.length === 0 ? (
                                <p className="text-center text-xs text-muted-foreground py-8">Agrega productos desde el catálogo.</p>
                            ) : cart.map(ci => (
                                <div key={ci.variant.id_variante_producto} className="flex items-center gap-3 px-4 py-2.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">{ci.variant.nombre_producto}</p>
                                        <p className="text-[10px] text-secondary">{parseAttrs(ci.variant.atributos_json)}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono">{ci.variant.sku}</p>
                                    </div>
                                    {/* Qty controls */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => ci.cantidad === 1 ? removeFromCart(ci.variant.id_variante_producto) : updateQty(ci.variant.id_variante_producto, -1)}
                                            className="w-6 h-6 rounded border border-border hover:bg-muted flex items-center justify-center">
                                            {ci.cantidad === 1 ? <Trash2 className="h-3 w-3 text-destructive" /> : <Minus className="h-3 w-3" />}
                                        </button>
                                        <span className="w-7 text-center text-xs font-bold">{ci.cantidad}</span>
                                        <button onClick={() => updateQty(ci.variant.id_variante_producto, 1)}
                                            disabled={ci.cantidad >= ci.variant.stock}
                                            className="w-6 h-6 rounded border border-border hover:bg-muted flex items-center justify-center disabled:opacity-40">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <p className="text-xs font-bold text-primary min-w-[52px] text-right">
                                        ${(ci.variant.precio_lista * ci.cantidad).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {cart.length > 0 && (
                            <div className="px-4 py-3 border-t bg-muted/20 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">{cart.reduce((s, ci) => s + ci.cantidad, 0)} artículo(s)</span>
                                <span className="font-bold text-primary">${total.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* Client + Payment form */}
                    <div className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <ReceiptText className="h-4 w-4 text-primary" /> Datos de la Venta
                        </h3>

                                                {/* Client fields */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                    Cédula
                                    {isSearchingClient && <Loader2 className="h-3 w-3 animate-spin" />}
                                </label>
                                <input
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="V12345678"
                                    value={clienteCedula}
                                    onChange={e => handleCedulaChange(e.target.value)}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">Nombre</label>
                                <input
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Juan Pérez"
                                    value={clienteNombre}
                                    onChange={e => setClienteNombre(e.target.value)}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">Email</label>
                                <input
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="juan@mail.com"
                                    value={clienteEmail}
                                    onChange={e => setClienteEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">Teléfono</label>
                                <input
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="584121234567"
                                    value={clienteTelefono}
                                    onChange={e => setClienteTelefono(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Payment */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">Método *</label>
                                <select
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={metodoPago} onChange={e => setMetodoPago(e.target.value)}
                                >
                                    {METODOS_PAGO.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">Referencia</label>
                                <input
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="REF-001" value={referenciaPago} onChange={e => setReferenciaPago(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] font-medium text-muted-foreground">Observación</label>
                            <input
                                className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Ej: Mostrador" value={observacion} onChange={e => setObservacion(e.target.value)}
                            />
                        </div>

                        {submitError && (
                            <div className="flex items-start gap-2 p-2.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {submitError}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitLoading || cart.length === 0}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-md shadow-primary/20"
                        >
                            {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Confirmar Venta · ${total.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────── Main Manager ─────────────────────────────

type View = 'list' | 'new';

const VentasManagerContent: React.FC = () => {
    const [view, setView] = useState<View>('list');
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 12;
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
    const [ventaToAnular, setVentaToAnular] = useState<Venta | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [userRole, setUserRole] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        const meta = document.querySelector<HTMLMetaElement>('meta[name="user-role"]');
        if (meta) setUserRole(meta.content);
    }, []);

    const fetchVentas = useCallback(async () => {
        setLoading(true); setErrorMsg(null);
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) });
            if (search) params.append('search', search);
            if (statusFilter) params.append('estado', statusFilter);
            if (dateFrom) params.append('from', dateFrom);
            if (dateTo) params.append('to', dateTo);
            const res = await fetch(`/api/ventas?${params}`);
            if (!res.ok) { setErrorMsg('Error al cargar ventas'); return; }
            const data = await res.json();
            setVentas(Array.isArray(data) ? data : (data.data || []));
        } catch (e: any) { setErrorMsg(e.message); }
        finally { setLoading(false); }
    }, [page, search, statusFilter, dateFrom, dateTo]);

    useEffect(() => {
        if (view === 'list') {
            const t = setTimeout(fetchVentas, 300);
            return () => clearTimeout(t);
        }
    }, [fetchVentas, view]);

    const fetchDetail = async (id: number) => {
        const res = await fetch(`/api/ventas/${id}`);
        if (res.ok) setSelectedVenta(await res.json());
    };

    const handleAnularSuccess = () => {
        setVentaToAnular(null); setSelectedVenta(null);
        setSuccessMsg('Venta anulada. El stock ha sido revertido.');
        fetchVentas(); setTimeout(() => setSuccessMsg(''), 5000);
    };

    const handleSaleSuccess = () => {
        setView('list');
        setSuccessMsg('¡Venta registrada exitosamente! El stock fue actualizado.');
        fetchVentas(); setTimeout(() => setSuccessMsg(''), 5000);
    };

    if (view === 'new') {
        return <RegistrarVentaView onSuccess={handleSaleSuccess} onCancel={() => setView('list')} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Ventas</h2>
                    <p className="text-muted-foreground text-sm">Historial y gestión de ventas concretadas.</p>
                </div>
                <button
                    onClick={() => setView('new')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                    <Plus className="h-4 w-4" /> Registrar Venta
                </button>
            </div>

            {/* Success Banner */}
            {successMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
                </div>
            )}

            {/* Filters */}
            <div className="rounded-lg border bg-card shadow-sm p-4 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="text" placeholder="Buscar por cliente, cédula..."
                            className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                    </div>
                    <select
                        className="h-10 w-full md:w-44 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="completada">Completadas</option>
                        <option value="anulada">Anuladas</option>
                    </select>
                    <button onClick={() => setShowFilters(!showFilters)}
                        className={`h-10 px-4 rounded-md border text-sm font-medium flex items-center gap-2 transition-colors ${showFilters ? 'bg-secondary text-secondary-foreground border-secondary' : 'bg-background hover:bg-accent border-input'}`}>
                        <Filter className="h-4 w-4" /> Fechas
                    </button>
                    <button onClick={() => { setSearch(''); setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }}
                        className="h-10 px-4 rounded-md border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">
                        Limpiar
                    </button>
                </div>
                {showFilters && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div className="space-y-1">
                            <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Desde</label>
                            <input type="date" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Hasta</label>
                            <input type="date" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/40">
                            <tr className="border-b">
                                {['ID', 'Cliente', 'Fecha', 'Método', 'Estado', 'Total', ''].map((h, i) => (
                                    <th key={i} className={`h-12 px-4 font-medium text-muted-foreground ${h === 'Total' ? 'text-right' : h === '' ? 'text-center' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="h-24 text-center text-muted-foreground">
                                    <div className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Cargando ventas...</div>
                                </td></tr>
                            ) : errorMsg ? (
                                <tr><td colSpan={7} className="h-24 text-center text-destructive">{errorMsg}</td></tr>
                            ) : ventas.length === 0 ? (
                                <tr><td colSpan={7} className="h-24 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-3">
                                        <ClipboardList className="h-8 w-8 text-muted-foreground/30" />
                                        No se encontraron ventas.
                                    </div>
                                </td></tr>
                            ) : ventas.map(v => (
                                <tr key={v.id_venta} className={`border-b hover:bg-muted/30 transition-colors ${v.estado === 'anulada' ? 'opacity-60' : ''}`}>
                                    <td className="p-4 font-bold text-primary">#{v.id_venta}</td>
                                    <td className="p-4">
                                        <p className="font-medium">{v.cliente_nombre || 'Sin nombre'}</p>
                                        {v.cliente_cedula && <p className="text-xs text-muted-foreground">{v.cliente_cedula}</p>}
                                    </td>
                                    <td className="p-4 text-xs text-muted-foreground">
                                        {v.created_at ? format(new Date(v.created_at), "d MMM yyyy, HH:mm", { locale: es }) : 'â€”'}
                                    </td>
                                    <td className="p-4"><PaymentBadge method={v.metodo_pago} /></td>
                                    <td className="p-4"><StatusBadge status={v.estado} /></td>
                                    <td className="p-4 text-right font-semibold">
                                        ${(Number(v.total) || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => fetchDetail(v.id_venta)}
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}
                    className="h-9 px-4 border border-input rounded-md text-sm hover:bg-accent disabled:opacity-50 flex items-center gap-1 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Anterior
                </button>
                <span className="text-sm font-medium px-2">PÃ¡gina {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={ventas.length < limit || loading}
                    className="h-9 px-4 border border-input rounded-md text-sm hover:bg-accent disabled:opacity-50 flex items-center gap-1 transition-colors">
                    Siguiente <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Modals */}
            {selectedVenta && (
                <VentaDetailModal venta={selectedVenta} onClose={() => setSelectedVenta(null)}
                    onAnular={() => setVentaToAnular(selectedVenta)} userRole={userRole} />
            )}
            {ventaToAnular && (
                <AnularDialog venta={ventaToAnular} onClose={() => setVentaToAnular(null)} onSuccess={handleAnularSuccess} />
            )}
        </div>
    );
};

// ErrorBoundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return (
            <div className="p-6 border border-destructive bg-destructive/10 text-destructive rounded-lg m-4">
                <h2 className="text-xl font-bold mb-2">Error en el mÃ³dulo de ventas.</h2>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 text-sm">
                    Recargar
                </button>
            </div>
        );
        return this.props.children;
    }
}

export const VentasManager: React.FC = () => <ErrorBoundary><VentasManagerContent /></ErrorBoundary>;

