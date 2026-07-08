import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Search, ChevronLeft, ChevronRight, Eye, Loader2, X,
    Calendar, Filter, Ban, AlertTriangle, CheckCircle2,
    CreditCard, Plus, Package, ShoppingCart, Minus, Trash2,
    ReceiptText, ClipboardList, ArrowLeft, ImageOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    tipo_venta?: 'contado' | 'credito' | 'apartado';
    total_pagado?: number;
    estado_pago?: 'pagado' | 'parcial';
    estado_entrega?: 'entregado' | 'pendiente';
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
    return url;
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

// ─────────────────────────────── Abonar Dialog ─────────────────────────────

const AbonarDialog = ({ venta, onClose, onSuccess }: {
    venta: Venta; onClose: () => void; onSuccess: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [accounts, setAccounts] = useState<Account[]>([]);
    
    const [pagoMoneda, setPagoMoneda] = useState<string>('USD');
    const [pagoCuentaId, setPagoCuentaId] = useState<number>(0);
    const [pagoTasaCambio, setPagoTasaCambio] = useState<string>('1');
    const [pagoMontoUsd, setPagoMontoUsd] = useState<string>('');
    const [pagoReferencia, setPagoReferencia] = useState<string>('');

    const pending = (venta.total || 0) - (venta.total_pagado || 0);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch('/api/money/cuentas');
                if (res.ok) {
                    const data = await res.json();
                    const activeList = (Array.isArray(data) ? data : data.data || []).filter((a: any) => a.activo && !a.eliminado);
                    setAccounts(activeList);
                    if (activeList.length > 0) {
                        const usdAcc = activeList.find((a: any) => a.moneda === 'USD') || activeList[0];
                        setPagoCuentaId(usdAcc.id_cuenta);
                        setPagoMoneda(usdAcc.moneda);
                    }
                }
            } catch (e) { console.error(e); }
        };
        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(a => a.moneda === pagoMoneda);

    const handleMonedaChange = (moneda: string) => {
        setPagoMoneda(moneda);
        let defaultRate = '1';
        if (moneda === 'VES') defaultRate = '36';
        else if (moneda === 'COP') defaultRate = '4000';
        setPagoTasaCambio(defaultRate);
        const filtered = accounts.filter(a => a.moneda === moneda);
        setPagoCuentaId(filtered.length > 0 ? filtered[0].id_cuenta : 0);
    };

    const calculatedMontoReal = () => {
        const usd = parseFloat(pagoMontoUsd);
        const rate = parseFloat(pagoTasaCambio);
        if (isNaN(usd) || usd <= 0 || isNaN(rate) || rate <= 0) return 0;
        return +(usd * rate).toFixed(2);
    };

    const handleAbonar = async () => {
        const acc = accounts.find(a => a.id_cuenta === pagoCuentaId);
        if (!acc) { setError('Selecciona una cuenta'); return; }
        
        const valUsd = parseFloat(pagoMontoUsd);
        const rate = parseFloat(pagoTasaCambio);
        if (isNaN(valUsd) || valUsd <= 0) { setError('Monto USD inválido'); return; }
        if (isNaN(rate) || rate <= 0) { setError('Tasa inválida'); return; }

        if (valUsd > pending + 0.01) { setError('El abono excede el saldo pendiente'); return; }

        const valReal = +(valUsd * rate).toFixed(2);
        setLoading(true); setError('');
        
        try {
            const res = await fetch(`/api/ventas/${venta.id_venta}/abonos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pagos: [{
                        id_cuenta: pagoCuentaId,
                        moneda_pago: acc.moneda,
                        tasa_cambio: rate,
                        monto_real: valReal,
                        monto_usd: valUsd,
                        referencia_pago: pagoReferencia.trim() || undefined
                    }]
                }),
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
                <div className="flex items-center gap-3 text-primary">
                    <Plus className="h-6 w-6" />
                    <h3 className="text-lg font-bold">Registrar Abono</h3>
                </div>
                
                <div className="p-3 bg-muted/40 rounded-md border text-sm text-center">
                    <p className="text-muted-foreground uppercase text-[10px] font-bold">Saldo Pendiente</p>
                    <p className="font-bold text-xl text-orange-500">${pending.toFixed(2)}</p>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Moneda</label>
                            <select className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={pagoMoneda} onChange={e => handleMonedaChange(e.target.value)}>
                                <option value="USD">USD ($)</option>
                                <option value="VES">VES (Bs)</option>
                                <option value="COP">COP ($)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Monto Abono (USD)</label>
                            <input className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder={`Ej: ${pending.toFixed(2)}`} value={pagoMontoUsd} onChange={e => setPagoMontoUsd(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Cuenta destino</label>
                        <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={pagoCuentaId} onChange={e => setPagoCuentaId(parseInt(e.target.value, 10))}>
                            <option value={0}>Selecciona una cuenta</option>
                            {filteredAccounts.map(acc => (
                                <option key={acc.id_cuenta} value={acc.id_cuenta}>{acc.nombre} ({acc.moneda})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Tasa de cambio</label>
                            <input className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="36.00" value={pagoTasaCambio} onChange={e => setPagoTasaCambio(e.target.value)} disabled={pagoMoneda === 'USD'} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Referencia</label>
                            <input className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Opcional" value={pagoReferencia} onChange={e => setPagoReferencia(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="p-2 bg-primary/10 rounded-md text-center text-primary text-sm font-bold border border-primary/20">
                        Equivalente: {calculatedMontoReal().toLocaleString('es-CO', { minimumFractionDigits: 2 })} {pagoMoneda}
                    </div>

                    {error && <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
                </div>
                
                <div className="flex gap-3 justify-end pt-2 border-t">
                    <button onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">Cancelar</button>
                    <button onClick={handleAbonar} disabled={loading || !pagoMontoUsd}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    );
};


// ─────────────────────────────── Detail Modal ─────────────────────────────

const VentaDetailModal = ({ venta, onClose, onAnular, onAbonar, onEntregar, userRole }: {
    venta: Venta; onClose: () => void; onAnular: () => void; onAbonar?: () => void; onEntregar?: () => void; userRole: string;
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
                        <div className="flex flex-wrap gap-2 items-center">
                            <PaymentBadge method={venta.metodo_pago} />
                            {venta.tipo_venta === 'credito' && <span className="inline-flex text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">Crédito</span>}
                            {venta.tipo_venta === 'apartado' && <span className="inline-flex text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">Apartado</span>}
                        </div>
                        {venta.referencia_pago && <p className="text-xs text-muted-foreground mt-1">Ref: {venta.referencia_pago}</p>}
                        {venta.id_pedido_origen && <p className="text-xs text-primary mt-1 font-medium">Desde Pedido #{venta.id_pedido_origen}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                            {venta.created_at ? format(new Date(venta.created_at), "d MMM yyyy, HH:mm", { locale: es }) : ''}
                        </p>
                        
                        {(venta.tipo_venta === 'credito' || venta.tipo_venta === 'apartado') && (
                            <div className="mt-3 p-2 bg-muted/40 rounded-md border text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="text-muted-foreground">Total Pagado:</span>
                                    <span className="font-bold text-green-600">${(venta.total_pagado || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pendiente:</span>
                                    <span className={`font-bold ${venta.estado_pago === 'pagado' ? 'text-green-600' : 'text-orange-500'}`}>
                                        ${((venta.total || 0) - (venta.total_pagado || 0)).toFixed(2)}
                                    </span>
                                </div>
                                {venta.tipo_venta === 'apartado' && (
                                    <div className="mt-2 pt-2 border-t flex justify-between">
                                        <span className="text-muted-foreground">Entrega:</span>
                                        <span className={`font-bold ${venta.estado_entrega === 'entregado' ? 'text-green-600' : 'text-orange-500'}`}>
                                            {venta.estado_entrega === 'entregado' ? 'Entregado' : 'Pendiente (En tienda)'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
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

                {venta.pagos && venta.pagos.length > 0 && (
                    <div className="pt-2 border-t">
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Historial de Pagos</p>
                        <div className="rounded-md border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs">
                                    <tr>
                                        <th className="p-2.5 text-left font-medium">Fecha</th>
                                        <th className="p-2.5 text-left font-medium">Cuenta</th>
                                        <th className="p-2.5 text-right font-medium">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {venta.pagos.map((p: any) => (
                                        <tr key={p.id_transaccion} className="hover:bg-muted/10">
                                            <td className="p-2.5 text-xs text-muted-foreground">
                                                {p.created_at ? format(new Date(p.created_at), "d MMM yyyy, HH:mm", { locale: es }) : '—'}
                                            </td>
                                            <td className="p-2.5">
                                                {p.cuenta_nombre} <span className="text-xs text-muted-foreground">({p.moneda_pago})</span>
                                            </td>
                                            <td className="p-2.5 text-right font-medium text-green-600">
                                                +${Number(p.monto_usd).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
            {(userRole === 'admin' || userRole === 'manager' || userRole === 'vendedor') && venta.estado === 'concretada' && (
                <div className="p-5 border-t bg-muted/10 flex justify-end gap-3 flex-wrap">
                    {onAbonar && (venta.tipo_venta === 'credito' || venta.tipo_venta === 'apartado') && venta.estado_pago !== 'pagado' && (
                        <button onClick={onAbonar} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Añadir Abono
                        </button>
                    )}
                    {onEntregar && venta.tipo_venta === 'apartado' && venta.estado_entrega !== 'entregado' && venta.estado_pago === 'pagado' && (
                        <button onClick={onEntregar} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
                            <Package className="h-4 w-4" /> Entregar Producto
                        </button>
                    )}
                    {(userRole === 'admin' || userRole === 'manager') && (
                        <button onClick={onAnular}
                            className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2">
                            <Ban className="h-4 w-4" /> Anular Venta
                        </button>
                    )}
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

interface Account {
    id_cuenta: number;
    nombre: string;
    moneda: string;
    saldo: number;
}

interface PagoItem {
    id_cuenta: number;
    cuenta_nombre: string;
    moneda_pago: string;
    tasa_cambio: number;
    monto_real: number;
    monto_usd: number;
    referencia_pago?: string;
}

const RegistrarVentaView = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void; }) => {
    const [search, setSearch] = useState('');
    const [includeNoStock, setIncludeNoStock] = useState(false);
    const [variants, setVariants] = useState<CatalogVariant[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Empaque / Consumibles quick add
    const [consumables, setConsumables] = useState<CatalogVariant[]>([]);

    // Form state
    const [clienteCedula, setClienteCedula] = useState('');
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteEmail, setClienteEmail] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');
    const [observacion, setObservacion] = useState('');
    const [fechaVenta, setFechaVenta] = useState('');

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSearchingClient, setIsSearchingClient] = useState(false);
    const lastLookupRef = useRef('');

    // Multidivisa split payments state
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [pagos, setPagos] = useState<PagoItem[]>([]);

    const [pagoMoneda, setPagoMoneda] = useState<string>('USD');
    const [pagoCuentaId, setPagoCuentaId] = useState<number>(0);
    const [pagoTasaCambio, setPagoTasaCambio] = useState<string>('1');
    const [pagoMontoUsd, setPagoMontoUsd] = useState<string>('');
    const [pagoReferencia, setPagoReferencia] = useState<string>('');

    const [tipoVenta, setTipoVenta] = useState<'contado' | 'credito' | 'apartado'>('contado');

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

    // Fetch consumables (bags, gift boxes, packaging) on mount
    useEffect(() => {
        const fetchConsumables = async () => {
            try {
                const res = await fetch('/api/ventas/catalogo?limit=100&include_no_stock=true');
                if (res.ok) {
                    const data = await res.json();
                    const list: CatalogVariant[] = Array.isArray(data) ? data : (data.data || data.items || []);
                    const filtered = list.filter(v => {
                        const name = (v.nombre_producto || '').toLowerCase();
                        const sku = (v.sku || '').toLowerCase();
                        return name.includes('bolsa') || name.includes('caja') || name.includes('empaque') || name.includes('embalaje') ||
                               sku.includes('bolsa') || sku.includes('caja') || sku.includes('empaque') || sku.includes('embalaje');
                    });
                    setConsumables(filtered);
                }
            } catch (e) {
                console.error("Error fetching consumables:", e);
            }
        };
        fetchConsumables();
    }, []);

    // Load accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch('/api/money/cuentas');
                if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data) ? data : (data.data || []);
                    const activeList = list.filter((a: any) => a.activo && !a.eliminado);
                    setAccounts(activeList);
                    if (activeList.length > 0) {
                        const usdAcc = activeList.find((a: any) => a.nombre.toLowerCase().includes('efectivo') || a.moneda === 'USD') || activeList[0];
                        setPagoCuentaId(usdAcc.id_cuenta);
                        setPagoMoneda(usdAcc.moneda);
                    }
                }
            } catch (e) {
                console.error("Error loading accounts:", e);
            }
        };
        fetchAccounts();
    }, []);

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
                if (existing.cantidad >= variant.stock) return prev;
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
            if (newQty <= 0) return ci;
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
    const totalPaid = useMemo(() => pagos.reduce((sum, p) => sum + p.monto_usd, 0), [pagos]);
    const pending = total - totalPaid;

    const filteredAccounts = useMemo(() => {
        return accounts.filter(a => a.moneda === pagoMoneda);
    }, [accounts, pagoMoneda]);

    const calculatedMontoReal = useMemo(() => {
        const usd = parseFloat(pagoMontoUsd);
        const rate = parseFloat(pagoTasaCambio);
        if (isNaN(usd) || usd <= 0 || isNaN(rate) || rate <= 0) return 0;
        return +(usd * rate).toFixed(2);
    }, [pagoMontoUsd, pagoTasaCambio]);

    // Auto-populate full payment when pending amount changes
    useEffect(() => {
        if (pending > 0) {
            setPagoMontoUsd(pending.toFixed(2));
        } else {
            setPagoMontoUsd('');
        }
    }, [pending]);

    const handleMonedaChange = (moneda: string) => {
        setPagoMoneda(moneda);
        let defaultRate = '1';
        if (moneda === 'VES') defaultRate = '36';
        else if (moneda === 'COP') defaultRate = '4000';
        setPagoTasaCambio(defaultRate);

        const filtered = accounts.filter(a => a.moneda === moneda);
        if (filtered.length > 0) {
            setPagoCuentaId(filtered[0].id_cuenta);
        } else {
            setPagoCuentaId(0);
        }
    };

    const handleAddPago = () => {
        const acc = accounts.find(a => a.id_cuenta === pagoCuentaId);
        if (!acc) return;
        const valUsd = parseFloat(pagoMontoUsd);
        const rate = parseFloat(pagoTasaCambio);
        if (isNaN(valUsd) || valUsd <= 0) return;
        if (isNaN(rate) || rate <= 0) return;

        const valReal = +(valUsd * rate).toFixed(2);

        // Limitar a máximo el saldo pendiente para evitar sobrepago por centavos
        const cleanUsd = valUsd > pending ? pending : valUsd;
        const cleanReal = valUsd > pending ? parseFloat((pending * rate).toFixed(2)) : valReal;

        const newPago: PagoItem = {
            id_cuenta: pagoCuentaId,
            cuenta_nombre: acc.nombre,
            moneda_pago: acc.moneda,
            tasa_cambio: rate,
            monto_real: cleanReal,
            monto_usd: cleanUsd,
            referencia_pago: pagoReferencia.trim() || undefined
        };

        setPagos(prev => [...prev, newPago]);
        setPagoMontoUsd('');
        setPagoReferencia('');
    };

    const handleRemovePago = (idx: number) => {
        setPagos(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        if (cart.length === 0) { setSubmitError('Agrega al menos un producto al carrito.'); return; }
        if (Number(pagoMontoUsd) > 0) { setSubmitError('Tienes un monto escrito pero no le has dado al botón "Agregar Pago". Por favor agrégalo antes de registrar la venta.'); return; }
        if (tipoVenta === 'contado' && Math.abs(pending) > 0.01) { setSubmitError('Para ventas de contado, el monto pagado debe ser igual al total.'); return; }
        if (tipoVenta !== 'contado' && pending < -0.01) { setSubmitError('El abono no puede ser mayor al total de la venta.'); return; }
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
                    observacion: observacion || undefined,
                    items: cart.map(ci => ({
                        id_variante_producto: ci.variant.id_variante_producto,
                        cantidad: ci.cantidad,
                    })),
                    pagos: pagos.map(p => ({
                        id_cuenta: p.id_cuenta,
                        moneda_pago: p.moneda_pago,
                        tasa_cambio: p.tasa_cambio,
                        monto_real: p.monto_real,
                        monto_usd: p.monto_usd,
                        referencia_pago: p.referencia_pago
                    })),
                    tipo_venta: tipoVenta,
                    fecha: fechaVenta ? new Date(fechaVenta).toISOString() : undefined
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setCart([]);
                setPagos([]);
                setFechaVenta('');
                onSuccess();
            } else if (res.status === 409) {
                setSubmitError(`⚠️ ${data.message || 'Stock insuficiente o venta ya registrada.'}`);
            } else {
                setSubmitError(data.message || data.error || `Error ${res.status}: solicitud inválida.`);
            }
        } catch { setSubmitError('Error de conexión.'); }
        finally { setSubmitLoading(false); }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Title */}
            <div className="flex items-center gap-3">
                <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors border border-border shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-primary truncate">Registrar Venta</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Selecciona variantes del catálogo.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* ── LEFT: Catalog ── */}
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

                {/* ── RIGHT: Cart + Form ── */}
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

                        <div className="overflow-y-auto max-h-[200px] divide-y">
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

                    {/* Material de Empaque / Consumibles */}
                    {consumables.length > 0 && (
                        <div className="rounded-xl border bg-card shadow-sm p-4 space-y-3">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" /> Material de Empaque / Consumibles
                            </h3>
                            <div className="space-y-2">
                                {consumables.map(v => {
                                    const cartItem = cart.find(ci => ci.variant.id_variante_producto === v.id_variante_producto);
                                    const qty = cartItem ? cartItem.cantidad : 0;
                                    const outOfStock = v.stock <= 0;
                                    
                                    return (
                                        <div key={v.id_variante_producto} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-secondary/25 border border-border hover:bg-secondary/40 transition-colors">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <p className="font-medium truncate">{v.nombre_producto}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Stock: {v.stock} uds {v.precio_lista > 0 ? `· $${v.precio_lista.toFixed(2)}` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {qty === 0 ? (
                                                    <button
                                                        onClick={() => addToCart(v)}
                                                        disabled={outOfStock}
                                                        className="h-7 px-3 rounded bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 font-bold transition-all flex items-center gap-1"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" /> Agregar
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => qty === 1 ? removeFromCart(v.id_variante_producto) : updateQty(v.id_variante_producto, -1)}
                                                            className="w-7 h-7 rounded border border-border hover:bg-muted flex items-center justify-center transition-colors"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-6 text-center font-bold text-xs">{qty}</span>
                                                        <button
                                                            onClick={() => updateQty(v.id_variante_producto, 1)}
                                                            disabled={qty >= v.stock}
                                                            className="w-7 h-7 rounded border border-border hover:bg-muted flex items-center justify-center disabled:opacity-40 transition-colors"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
                                <label className="text-[10px] font-medium text-muted-foreground">Tipo de Venta</label>
                                <select
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring font-medium text-primary"
                                    value={tipoVenta}
                                    onChange={e => setTipoVenta(e.target.value as any)}
                                >
                                    <option value="contado">Al Contado</option>
                                    <option value="credito">A Crédito (Lleva el producto)</option>
                                    <option value="apartado">Apartado (Producto en tienda)</option>
                                </select>
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-medium text-muted-foreground">Fecha (Opcional - Ventas pasadas)</label>
                                <input
                                    type="datetime-local"
                                    className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={fechaVenta}
                                    onChange={e => setFechaVenta(e.target.value)}
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

                        <div className="space-y-0.5">
                            <label className="text-[10px] font-medium text-muted-foreground">Observación</label>
                            <input
                                className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Ej: Mostrador" value={observacion} onChange={e => setObservacion(e.target.value)}
                            />
                        </div>

                        {/* Pagos Realizados */}
                        <div className="space-y-2 pt-2 border-t">
                            <label className="text-xs font-bold text-muted-foreground">Pagos Registrados</label>
                            {pagos.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-2 bg-muted/20 rounded-md">No hay pagos agregados aún.</p>
                            ) : (
                                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                    {pagos.map((p, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-secondary/30 rounded-md border border-border">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold truncate text-[11px]">{p.cuenta_nombre}</p>
                                                <p className="text-[9px] text-muted-foreground font-mono">
                                                    {p.monto_real} {p.moneda_pago} (Tasa: {p.tasa_cambio}) {p.referencia_pago ? `[Ref: ${p.referencia_pago}]` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="font-bold text-primary">${p.monto_usd.toFixed(2)}</span>
                                                <button onClick={() => handleRemovePago(idx)} className="p-1 hover:bg-muted text-destructive rounded transition-colors">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Balance indicator */}
                            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-muted/40 p-2 rounded-md border">
                                <div>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Total</p>
                                    <p className="font-bold text-foreground">${total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">
                                        {tipoVenta === 'contado' ? 'Pagado' : 'Abonado'}
                                    </p>
                                    <p className="font-bold text-green-600 dark:text-green-400">${totalPaid.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Pendiente</p>
                                    <p className={`font-bold ${Math.abs(pending) < 0.01 ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>
                                        ${pending.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Add Payment Form */}
                        {(pending > 0.01 || tipoVenta !== 'contado') && (
                            <div className="space-y-2.5 p-3 bg-muted/20 rounded-lg border">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                                    {tipoVenta === 'contado' ? 'Agregar Pago Parcial' : (pagos.length === 0 ? 'Abono Inicial (Opcional)' : 'Agregar Abono')}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-medium text-muted-foreground">Moneda de pago</label>
                                        <select
                                            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring font-medium"
                                            value={pagoMoneda}
                                            onChange={e => handleMonedaChange(e.target.value)}
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="VES">VES (Bs)</option>
                                            <option value="COP">COP ($)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-medium text-muted-foreground">Monto USD ($)</label>
                                        <input
                                            className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring font-semibold"
                                            placeholder="10.00"
                                            value={pagoMontoUsd}
                                            onChange={e => setPagoMontoUsd(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-0.5 col-span-2">
                                        <label className="text-[9px] font-medium text-muted-foreground">Cuenta destino</label>
                                        <select
                                            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={pagoCuentaId}
                                            onChange={e => setPagoCuentaId(parseInt(e.target.value, 10))}
                                        >
                                            <option value={0}>Selecciona una cuenta</option>
                                            {filteredAccounts.map(acc => (
                                                <option key={acc.id_cuenta} value={acc.id_cuenta}>
                                                    {acc.nombre} ({acc.moneda})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-medium text-muted-foreground">Tasa de cambio</label>
                                        <input
                                            className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="36.00"
                                            value={pagoTasaCambio}
                                            onChange={e => setPagoTasaCambio(e.target.value)}
                                            disabled={pagoMoneda === 'USD'}
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-medium text-muted-foreground">Referencia</label>
                                        <input
                                            className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Opcional"
                                            value={pagoReferencia}
                                            onChange={e => setPagoReferencia(e.target.value)}
                                        />
                                    </div>
                                    
                                    {/* Monto Equivalente Calculado */}
                                    <div className="col-span-2 px-2.5 py-1.5 bg-primary/5 rounded-md border border-primary/10 text-center">
                                        <p className="text-[9px] text-muted-foreground uppercase font-bold">Monto equivalente a cobrar</p>
                                        <p className="font-bold text-sm text-primary">
                                            {calculatedMontoReal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {pagoMoneda}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddPago}
                                    className="w-full py-1.5 bg-secondary text-secondary-foreground rounded text-xs font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Añadir Pago
                                </button>
                            </div>
                        )}

                        {submitError && (
                            <div className="flex items-start gap-2 p-2.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {submitError}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitLoading || cart.length === 0 || (tipoVenta === 'contado' && Math.abs(pending) > 0.01) || (tipoVenta !== 'contado' && pending < -0.01)}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-md shadow-primary/20"
                        >
                            {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            {tipoVenta === 'contado' ? 'Confirmar Venta' : (tipoVenta === 'credito' ? 'Registrar Crédito' : 'Crear Apartado')} · ${total.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────── Main Manager ─────────────────────────────

const VentasManagerContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('new');
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
    
    // Action states
    const [ventaToAbonar, setVentaToAbonar] = useState<Venta | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const rawRoles = user.roles ?? user.role;
                const role = Array.isArray(rawRoles) ? rawRoles[0] : rawRoles;
                setUserRole(role || '');
                return;
            } catch (e) {}
        }
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
            
            // Tab filtering for tipo_venta
            if (activeTab === 'creditos') params.append('tipo_venta', 'credito');
            else if (activeTab === 'apartados') params.append('tipo_venta', 'apartado');
            else if (activeTab === 'list') params.append('tipo_venta', 'contado');

            const res = await fetch(`/api/ventas?${params}`);
            if (!res.ok) { setErrorMsg('Error al cargar ventas'); return; }
            const data = await res.json();
            setVentas(Array.isArray(data) ? data : (data.data || []));
        } catch (e: any) { setErrorMsg(e.message); }
        finally { setLoading(false); }
    }, [page, search, statusFilter, dateFrom, dateTo, activeTab]);

    useEffect(() => {
        if (activeTab === 'list' || activeTab === 'creditos' || activeTab === 'apartados') {
            const t = setTimeout(fetchVentas, 300);
            return () => clearTimeout(t);
        }
    }, [fetchVentas, activeTab]);

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
        setActiveTab('list');
        setSuccessMsg('¡Venta registrada exitosamente! El stock fue actualizado.');
        fetchVentas(); setTimeout(() => setSuccessMsg(''), 5000);
    };

    const handleAbonarSuccess = () => {
        setVentaToAbonar(null);
        if (selectedVenta) fetchDetail(selectedVenta.id_venta);
        setSuccessMsg('Abono registrado exitosamente.');
        fetchVentas(); setTimeout(() => setSuccessMsg(''), 5000);
    };

    const handleEntregar = async (idVenta: number) => {
        if (!confirm('¿Estás seguro de marcar este apartado como entregado?')) return;
        try {
            const res = await fetch(`/api/ventas/${idVenta}/entregar`, { method: 'POST' });
            if (res.ok) {
                setSuccessMsg('Producto entregado exitosamente.');
                if (selectedVenta) fetchDetail(selectedVenta.id_venta);
                fetchVentas(); setTimeout(() => setSuccessMsg(''), 5000);
            } else {
                const data = await res.json();
                alert(data.message || 'Error al entregar producto');
            }
        } catch { alert('Error de red'); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">Ventas</h1>
                    <p className="text-foreground/70 font-medium hidden sm:block">Historial y registro de ventas.</p>
                </div>
            </div>

            {/* Success Banner */}
            {successMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
                </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="overflow-x-auto w-full pb-2">
                    <TabsList className="bg-card/60 backdrop-blur-md border border-foreground/10 p-1 shadow-sm w-fit sm:w-full justify-start whitespace-nowrap">
                        <TabsTrigger value="new" className="flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
                            <Plus className="h-4 w-4" /> Registrar
                        </TabsTrigger>
                        <TabsTrigger value="list" onClick={() => setPage(1)} className="flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
                            <ClipboardList className="h-4 w-4" /> Ventas (Contado)
                        </TabsTrigger>
                        <TabsTrigger value="creditos" onClick={() => setPage(1)} className="flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
                            <ClipboardList className="h-4 w-4" /> Créditos
                        </TabsTrigger>
                        <TabsTrigger value="apartados" onClick={() => setPage(1)} className="flex items-center gap-2 text-foreground/60 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold">
                            <Package className="h-4 w-4" /> Apartados
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="new" className="mt-6">
                    <RegistrarVentaView onSuccess={handleSaleSuccess} onCancel={() => setActiveTab('list')} />
                </TabsContent>

                {(activeTab === 'list' || activeTab === 'creditos' || activeTab === 'apartados') && (
                    <div className="mt-6 space-y-6">
                    {/* Filters */}
                    <div className="rounded-lg border bg-card shadow-sm p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="text" placeholder="Buscar por cliente, cédula..."
                                    className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                            </div>
                            <select
                                className="h-10 w-full sm:w-44 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todos los estados</option>
                                <option value="completada">Completadas</option>
                                <option value="anulada">Anuladas</option>
                            </select>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => setShowFilters(!showFilters)}
                                    className={`flex-1 sm:flex-none h-10 px-4 rounded-md border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${showFilters ? 'bg-secondary text-secondary-foreground border-secondary' : 'bg-background hover:bg-accent border-input'}`}>
                                    <Filter className="h-4 w-4" /> Fechas
                                </button>
                                <button onClick={() => { setSearch(''); setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }}
                                    className="flex-1 sm:flex-none h-10 px-4 rounded-md border border-input text-sm text-muted-foreground hover:bg-muted transition-colors">
                                    Limpiar
                                </button>
                            </div>
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
                                            <th key={i} className={`h-12 px-4 font-medium text-muted-foreground whitespace-nowrap ${h === 'Total' ? 'text-right' : h === '' ? 'text-center' : ''}`}>{h}</th>
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
                                                {v.created_at ? format(new Date(v.created_at), "d MMM yyyy, HH:mm", { locale: es }) : '—'}
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
                        <span className="text-sm font-medium px-2">Página {page}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={ventas.length < limit || loading}
                            className="h-9 px-4 border border-input rounded-md text-sm hover:bg-accent disabled:opacity-50 flex items-center gap-1 transition-colors">
                            Siguiente <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Modals */}
                    {selectedVenta && (
                        <VentaDetailModal 
                            venta={selectedVenta} 
                            onClose={() => setSelectedVenta(null)}
                            onAnular={() => setVentaToAnular(selectedVenta)} 
                            onAbonar={() => setVentaToAbonar(selectedVenta)}
                            onEntregar={() => handleEntregar(selectedVenta.id_venta)}
                            userRole={userRole} 
                        />
                    )}
                    {ventaToAnular && (
                        <AnularDialog venta={ventaToAnular} onClose={() => setVentaToAnular(null)} onSuccess={handleAnularSuccess} />
                    )}
                    {ventaToAbonar && (
                        <AbonarDialog venta={ventaToAbonar} onClose={() => setVentaToAbonar(null)} onSuccess={handleAbonarSuccess} />
                    )}
                </div>
                )}
            </Tabs>
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
                <h2 className="text-xl font-bold mb-2">Error en el módulo de ventas.</h2>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 text-sm">
                    Recargar
                </button>
            </div>
        );
        return this.props.children;
    }
}

export const VentasManager: React.FC = () => <ErrorBoundary><VentasManagerContent /></ErrorBoundary>;
