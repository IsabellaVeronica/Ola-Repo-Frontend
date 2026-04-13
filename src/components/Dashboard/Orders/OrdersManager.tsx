import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Search, ChevronLeft, ChevronRight, Eye,
    Loader2, Package, User, ShoppingBag, X,
    Calendar, DollarSign, Filter, Hash,
    ShoppingCart, CheckCircle2, CreditCard, AlertTriangle
} from 'lucide-react';

// Interfaces
interface OrderItem {
    id_pedido_item?: number;
    id_variante_producto?: number;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface Order {
    id?: number;
    id_pedido: number;
    estado: 'nuevo' | 'contactado' | 'concretado' | 'cancelado';
    total?: number;
    total_estimado: number;
    created_at: string;
    cliente_nombre?: string;
    cliente_email?: string;
    cliente_telefono?: string;
    cedula_cliente?: string;
    usuario?: {
        nombre: string;
        email: string;
        telefono?: string;
    };
    items?: OrderItem[];
}

// Simple Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
    componentDidCatch(error: any, errorInfo: any) { console.error("OrdersManager Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 border border-red-500 bg-red-50 text-red-900 rounded-lg shadow-md m-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-2">🚨 Algo salió mal.</h2>
                    <p className="mb-4">Se produjo un error al mostrar este componente.</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                        Recargar Página
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        nuevo: "bg-muted text-foreground border-border",
        contactado: "bg-accent text-accent-foreground border-border",
        concretado: "bg-primary text-primary-foreground border-primary",
        cancelado: "bg-destructive text-destructive-foreground border-destructive"
    };
    const labels: Record<string, string> = {
        nuevo: "Nuevo",
        contactado: "Contactado",
        concretado: "Concretado",
        cancelado: "Cancelado"
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {labels[status] || status}
        </span>
    );
};

const OrdersManagerContent: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Concretar venta state
    const [concretandoId, setConcretandoId] = useState<number | null>(null);
    const [concretarMetodo, setConcretarMetodo] = useState('efectivo');
    const [concretarRef, setConcretarRef] = useState('');
    const [concretarObs, setConcretarObs] = useState('');
    const [concretarLoading, setConcretarLoading] = useState(false);
    const [concretarError, setConcretarError] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [orderIdFilter, setOrderIdFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            // If we have an ID filter, we might want to prioritize it
            if (orderIdFilter) params.append('id', orderIdFilter);
            if (search) params.append('search', search);
            if (statusFilter) params.append('estado', statusFilter);
            if (dateFrom) params.append('from', dateFrom);
            if (dateTo) params.append('to', dateTo);
            if (minAmount) params.append('min_amount', minAmount);
            if (maxAmount) params.append('max_amount', maxAmount);

            const res = await fetch(`/api/pedidos?${params.toString()}`);
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Respuesta inválida del servidor (No es JSON).");
            }

            const data = await res.json();
            if (res.ok) {
                let list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);

                // CLIENT-SIDE FILTER FALLBACK: 
                // In case the backend ignores query params, we filter the results here.
                if (orderIdFilter) {
                    list = list.filter((o: Order) =>
                        String(o.id) === orderIdFilter ||
                        String(o.id_pedido) === orderIdFilter ||
                        String(o.id).includes(orderIdFilter)
                    );
                }
                if (search) {
                    const s = search.toLowerCase();
                    list = list.filter((o: Order) =>
                        o.usuario?.nombre?.toLowerCase().includes(s) ||
                        o.usuario?.email?.toLowerCase().includes(s)
                    );
                }
                if (statusFilter) {
                    list = list.filter((o: Order) => o.estado === statusFilter);
                }

                setOrders(list);
            } else {
                setErrorMsg(data.error || "Error al cargar pedidos");
            }
        } catch (error: any) {
            console.error("Fetch Error:", error);
            setErrorMsg(error.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, [page, limit, orderIdFilter, search, statusFilter, dateFrom, dateTo, minAmount, maxAmount]);

    // Auto-fetch when filters change (with small delay for text inputs could be added, but here reactive is fine)
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOrders();
        }, 300); // Small debounce for typing
        return () => clearTimeout(timeout);
    }, [fetchOrders]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    const clearFilters = () => {
        setSearch('');
        setOrderIdFilter('');
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        setMinAmount('');
        setMaxAmount('');
        setPage(1);
    };

    const fetchOrderDetails = async (id: number) => {
        try {
            const res = await fetch(`/api/pedidos/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedOrder(data);
            }
        } catch (error) { console.error(error); }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/pedidos/${id}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: newStatus })
            });
            if (res.ok) {
                fetchOrders();
                if (selectedOrder && (selectedOrder.id === id || selectedOrder.id_pedido === id)) {
                    setSelectedOrder(prev => prev ? { ...prev, estado: newStatus as any } : null);
                }
            } else { alert("Error al actualizar estado"); }
        } catch (e) { console.error(e); alert("Error de conexión"); }
    };

    const handleConcretarVenta = async () => {
        if (!concretandoId) return;
        setConcretarLoading(true); setConcretarError('');
        try {
            const res = await fetch(`/api/ventas/from-pedido/${concretandoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metodo_pago: concretarMetodo,
                    referencia_pago: concretarRef || undefined,
                    observacion: concretarObs || undefined,
                })
            });
            const data = await res.json();
            if (res.ok) {
                setConcretandoId(null);
                setSelectedOrder(null);
                setSuccessMsg(`✅ Venta #${data.id_venta || ''} creada exitosamente desde el pedido.`);
                fetchOrders();
                setTimeout(() => setSuccessMsg(''), 5000);
            } else if (res.status === 409) {
                setConcretarError('⚠ Stock insuficiente o venta ya registrada para este pedido.');
            } else {
                setConcretarError(data.message || data.error || `Error ${res.status}`);
            }
        } catch { setConcretarError('Error de conexión.'); }
        finally { setConcretarLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">Gestión de Pedidos</h2>
                        <p className="text-muted-foreground text-sm hidden sm:block">Administra y da seguimiento a los pedidos de clientes.</p>
                    </div>
                </div>

                {/* Success message */}
                {successMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
                    </div>
                )}

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                            {/* Order ID Filter */}
                            <div className="w-full sm:w-24 relative">
                                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="ID"
                                    className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={orderIdFilter}
                                    onChange={(e) => { setOrderIdFilter(e.target.value); setPage(1); }}
                                />
                            </div>
RA:
                            {/* Search Name/Email */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar por cliente..."
                                    className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                />
                            </div>

                            <div className="w-full sm:w-44">
                                <select
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">Estados</option>
                                    <option value="nuevo">Nuevos</option>
                                    <option value="contactado">Contactados</option>
                                    <option value="concretado">Concretados</option>
                                    <option value="cancelado">Cancelados</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex-1 sm:w-auto h-10 px-4 rounded-md border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showFilters ? 'bg-secondary text-secondary-foreground font-bold border-secondary' : 'bg-background hover:bg-accent'}`}
                                >
                                    <Filter className="h-4 w-4" /> <span className="sm:hidden lg:inline">Filtros</span>
                                </button>

                                <button type="submit" className="flex-1 sm:w-auto h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors">
                                    IR
                                </button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-md animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Fecha Desde</label>
                                    <input type="date" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Fecha Hasta</label>
                                    <input type="date" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3" /> Monto Mín.</label>
                                    <input type="number" min="0" placeholder="0.00" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={minAmount} onChange={(e) => { setMinAmount(e.target.value); setPage(1); }} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><DollarSign className="h-3 w-3" /> Monto Máx.</label>
                                    <input type="number" min="0" placeholder="Sin límite" className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={maxAmount} onChange={(e) => { setMaxAmount(e.target.value); setPage(1); }} />
                                </div>
                                <div className="md:col-span-4 flex justify-end">
                                    <button type="button" onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground underline">Limpiar Filtros</button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b bg-muted/40">
                            <tr className="border-b">
                                <th className="h-12 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">ID</th>
                                <th className="h-12 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Cliente</th>
                                <th className="h-12 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Fecha</th>
                                <th className="h-12 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Estado</th>
                                <th className="h-12 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right whitespace-nowrap">Total</th>
                                <th className="h-12 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr><td colSpan={6} className="h-24 text-center text-muted-foreground"><div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando pedidos...</div></td></tr>
                            ) : errorMsg ? (
                                <tr><td colSpan={6} className="h-24 text-center text-destructive font-medium">Error: {errorMsg}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="h-24 text-center text-muted-foreground">No se encontraron pedidos.</td></tr>
                            ) : (
                                orders.map((order) => {
                                    const displayId = order.id || order.id_pedido || '?';
                                    const nombre = order.usuario?.nombre || (order as any).cliente_nombre || 'Desconocido';
                                    const email = order.usuario?.email || (order as any).cliente_email;
                                    const total = Number(order.total || (order as any).total_estimado || 0);

                                    return (
                                        <tr key={displayId} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-bold text-primary">#{displayId}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{nombre}</span>
                                                    <div className="flex flex-col text-xs text-muted-foreground">
                                                        {order.cedula_cliente && <span>CID: {order.cedula_cliente}</span>}
                                                        {email && <span>{email}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {order.created_at ? format(new Date(order.created_at), "d 'de' MMM, yyyy", { locale: es }) : '-'}
                                            </td>
                                            <td className="p-4 align-middle"><StatusBadge status={order.estado} /></td>
                                            <td className="p-4 align-middle text-right font-medium">
                                                ${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <button onClick={() => fetchOrderDetails(Number(displayId))} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent h-9 w-9"><Eye className="h-4 w-4" /></button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pb-4">
                <button className="h-9 px-4 py-2 border border-input bg-background hover:bg-accent inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}><ChevronLeft className="h-4 w-4 mr-2" /> Anterior</button>
                <span className="text-sm font-medium">Página {page}</span>
                <button className="h-9 px-4 py-2 border border-input bg-background hover:bg-accent inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50" onClick={() => setPage(p => p + 1)} disabled={orders.length < limit || loading}>Siguiente <ChevronRight className="h-4 w-4 ml-2" /></button>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col border">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Pedido #{selectedOrder.id || selectedOrder.id_pedido}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground font-bold uppercase">Cliente</p>
                                    <p className="font-medium text-lg">{selectedOrder.usuario?.nombre || (selectedOrder as any).cliente_nombre || 'Desconocido'}</p>
                                    <p className="text-sm font-bold text-primary mb-1">{selectedOrder.cedula_cliente ? `C.I. ${selectedOrder.cedula_cliente}` : 'Sin Cédula'}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.usuario?.email || (selectedOrder as any).cliente_email}</p>
                                    {(selectedOrder.usuario?.telefono || (selectedOrder as any).cliente_telefono) && (
                                        <p className="text-sm text-muted-foreground mt-1">{selectedOrder.usuario?.telefono || (selectedOrder as any).cliente_telefono}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-bold uppercase mb-2">Estado</p>
                                    <StatusBadge status={selectedOrder.estado} />
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        {['nuevo', 'contactado', 'concretado', 'cancelado'].map(s => (
                                            <button
                                                key={s}
                                                className={`text-xs px-2 py-1.5 rounded-md border transition-colors ${selectedOrder.estado === s ? 'bg-primary text-primary-foreground border-primary opacity-50 cursor-default' : 'hover:bg-accent hover:border-primary/50'}`}
                                                onClick={() => updateStatus(Number(selectedOrder.id || selectedOrder.id_pedido), s)}
                                                disabled={selectedOrder.estado === s}
                                            >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                                        ))}
                                    </div>
                                    {/* Concretar Venta CTA */}
                                    {selectedOrder.estado !== 'cancelado' && selectedOrder.estado !== 'concretado' && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <button
                                                onClick={() => {
                                                    const id = selectedOrder.id || selectedOrder.id_pedido;
                                                    setConcretandoId(Number(id));
                                                    setConcretarMetodo('efectivo');
                                                    setConcretarRef('');
                                                    setConcretarObs('');
                                                    setConcretarError('');
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                                            >
                                                <ShoppingCart className="h-4 w-4" /> Concretar Venta
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h4 className="font-bold mb-3 flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Productos</h4>
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr><th className="p-3 text-left font-medium">Producto</th><th className="p-3 text-center font-medium">Cant</th><th className="p-3 text-right font-medium">Precio Unit.</th><th className="p-3 text-right font-medium">Total</th></tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-muted/10">
                                                <td className="p-3">{item.nombre_producto}</td>
                                                <td className="p-3 text-center">{item.cantidad}</td>
                                                <td className="p-3 text-right">${(item.precio_unitario || 0).toLocaleString('es-CO')}</td>
                                                <td className="p-3 text-right font-medium">${(item.subtotal || 0).toLocaleString('es-CO')}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-muted/20">
                                            <td colSpan={3} className="p-3 text-right font-bold">Total General</td>
                                            <td className="p-3 text-right font-bold text-primary text-lg">${(Number(selectedOrder.total || (selectedOrder as any).total_estimado) || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Concretar Venta Modal */}
            {concretandoId !== null && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-md border border-border p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            <h3 className="text-lg font-bold">Concretar Venta — Pedido #{concretandoId}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Completa el pago para convertir este pedido en una venta. El stock se descontará automáticamente.</p>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Método de Pago *</label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={concretarMetodo} onChange={e => setConcretarMetodo(e.target.value)}
                                >
                                    {[['efectivo','Efectivo'],['transferencia','Transferencia'],['pago_movil','Pago Móvil'],['tarjeta','Tarjeta'],['dolares','Dólares'],['credito','Crédito']]
                                        .map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Referencia</label>
                                <input
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Ej: TRX-001"
                                    value={concretarRef} onChange={e => setConcretarRef(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Observación</label>
                                <input
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Ej: Pagado completo"
                                    value={concretarObs} onChange={e => setConcretarObs(e.target.value)}
                                />
                            </div>
                            {concretarError && (
                                <div className="flex items-center gap-2 p-2.5 rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{concretarError}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setConcretandoId(null)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={handleConcretarVenta}
                                disabled={concretarLoading}
                                className="px-5 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 font-semibold"
                            >
                                {concretarLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Confirmar Venta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const OrdersManager: React.FC = () => { return <ErrorBoundary><OrdersManagerContent /></ErrorBoundary>; };
