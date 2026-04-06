import React, { useState, useEffect } from 'react';
import { ShoppingCart, RefreshCw, TrendingDown, AlertTriangle, PackageX, ArrowRight, Info } from 'lucide-react';

interface ReplenishmentItem {
    id: number | string;
    producto: string;
    sku: string;
    stock_actual: number;
    min_stock?: number;
    variante?: string;
    total_salidas_periodo: number;
    periodo_dias: number;
}

interface ComputedItem extends ReplenishmentItem {
    ventas_por_semana: number;
    semanas_restantes: number | null;
    cantidad_recomendada: number;
    urgency: 'critical' | 'high' | 'medium';
}

// Core prediction logic
function computeReplenishment(item: ReplenishmentItem): ComputedItem {
    const ventas_por_dia = item.total_salidas_periodo > 0
        ? item.total_salidas_periodo / item.periodo_dias
        : 0;
    const ventas_por_semana = Math.round(ventas_por_dia * 7 * 10) / 10;

    // Weeks of stock remaining
    const semanas_restantes = ventas_por_semana > 0
        ? Math.round((item.stock_actual / ventas_por_semana) * 10) / 10
        : null;

    // Recommended: cover 4 weeks of demand + safety buffer (min_stock)
    const targetWeeks = 4;
    const safetyBuffer = item.min_stock || 0;
    const cantidad_recomendada = ventas_por_semana > 0
        ? Math.max(0, Math.ceil(ventas_por_semana * targetWeeks + safetyBuffer - item.stock_actual))
        : Math.max(0, safetyBuffer - item.stock_actual);

    // Urgency level
    let urgency: 'critical' | 'high' | 'medium' = 'medium';
    if (item.stock_actual === 0 || (semanas_restantes !== null && semanas_restantes < 1)) {
        urgency = 'critical';
    } else if (semanas_restantes !== null && semanas_restantes < 2) {
        urgency = 'high';
    }

    return { ...item, ventas_por_semana, semanas_restantes, cantidad_recomendada, urgency };
}

const urgencyConfig = {
    critical: {
        border: 'border-destructive/50',
        bg: 'bg-destructive/5',
        badge: 'bg-destructive text-white',
        label: 'CRÍTICO',
        icon: PackageX,
        dotColor: 'bg-destructive',
    },
    high: {
        border: 'border-orange-400/50',
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        badge: 'bg-orange-500 text-white',
        label: 'URGENTE',
        icon: AlertTriangle,
        dotColor: 'bg-orange-500',
    },
    medium: {
        border: 'border-yellow-400/40',
        bg: 'bg-yellow-50/50 dark:bg-yellow-950/20',
        badge: 'bg-yellow-500 text-white',
        label: 'ATENCIÓN',
        icon: TrendingDown,
        dotColor: 'bg-yellow-500',
    },
};

export const StockAlerts: React.FC = () => {
    const [items, setItems] = useState<ComputedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [threshold, setThreshold] = useState(10);
    const [days, setDays] = useState(30);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Try to get threshold from settings
            const settingsRes = await fetch('/api/settings');
            let currentThreshold = threshold;
            if (settingsRes.ok) {
                const settings = await settingsRes.json();
                if (settings.stock?.umbral_minimo !== undefined) {
                    currentThreshold = settings.stock.umbral_minimo;
                    setThreshold(currentThreshold);
                }
            }

            const res = await fetch(`/api/reports/reposicion?threshold=${currentThreshold}&days=${days}`);
            if (!res.ok) { setError('Error al cargar datos'); return; }

            const json = await res.json();
            const raw: ReplenishmentItem[] = Array.isArray(json) ? json : (json.data || []);

            const computed = raw
                .map(computeReplenishment)
                .sort((a, b) => {
                    const order = { critical: 0, high: 1, medium: 2 };
                    return order[a.urgency] - order[b.urgency];
                });

            setItems(computed);
            setError(null);
        } catch (e) {
            console.error(e);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [days]);

    const counts = {
        critical: items.filter(i => i.urgency === 'critical').length,
        high: items.filter(i => i.urgency === 'high').length,
        medium: items.filter(i => i.urgency === 'medium').length,
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col space-y-3 p-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-foreground">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Predicción de Reposición
                    </h3>
                    <div className="flex items-center gap-2">
                        {/* Period selector */}
                        <select
                            value={days}
                            onChange={e => setDays(Number(e.target.value))}
                            className="text-xs bg-muted border border-border rounded-md px-2 py-1 text-muted-foreground focus:outline-none"
                        >
                            <option value={7}>7 días</option>
                            <option value={14}>14 días</option>
                            <option value={30}>30 días</option>
                            <option value={60}>60 días</option>
                        </select>
                        <button onClick={fetchData} className="text-muted-foreground hover:text-primary transition-colors p-1">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Basado en el movimiento de los últimos <strong>{days} días</strong>. Umbral: &lt; {threshold} uds.
                </p>

                {/* Summary chips */}
                {!loading && items.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {counts.critical > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/30 px-2 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
                                {counts.critical} Crítico{counts.critical > 1 ? 's' : ''}
                            </span>
                        )}
                        {counts.high > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-300 px-2 py-1 rounded-full dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                                {counts.high} Urgente{counts.high > 1 ? 's' : ''}
                            </span>
                        )}
                        {counts.medium > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-1 rounded-full dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
                                {counts.medium} Atención
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* List */}
            <div className="p-4 flex-1 overflow-hidden flex flex-col">
                {loading && items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                        Calculando predicciones...
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-sm text-destructive">{error}</div>
                ) : items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Todo en orden. No hay productos que requieran reposición.</p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                        {items.map((item) => {
                            const cfg = urgencyConfig[item.urgency];
                            return (
                                <div
                                    key={item.id}
                                    className={`rounded-lg border p-3.5 ${cfg.border} ${cfg.bg} transition-colors`}
                                >
                                    {/* Top row: name + badge */}
                                    <div className="flex items-start justify-between gap-2 mb-2.5">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-foreground truncate">{item.producto}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <code className="text-[10px] text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded border">
                                                    {item.sku}
                                                </code>
                                                {item.variante && (
                                                    <span className="text-[10px] text-muted-foreground">• {item.variante}</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold tracking-wider px-2 py-1 rounded-full shrink-0 ${cfg.badge}`}>
                                            {cfg.label}
                                        </span>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div className="bg-background/60 rounded-md p-2 text-center">
                                            <p className={`text-lg font-bold ${item.stock_actual === 0 ? 'text-destructive' : 'text-foreground'}`}>
                                                {item.stock_actual}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Stock actual</p>
                                        </div>
                                        <div className="bg-background/60 rounded-md p-2 text-center">
                                            <p className="text-lg font-bold text-foreground">
                                                {item.ventas_por_semana > 0 ? item.ventas_por_semana : '—'}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Uds/semana</p>
                                        </div>
                                        <div className="bg-background/60 rounded-md p-2 text-center">
                                            <p className="text-lg font-bold text-foreground">
                                                {item.semanas_restantes !== null ? `${item.semanas_restantes}s` : '∞'}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Duración</p>
                                        </div>
                                    </div>

                                    {/* Recommendation box */}
                                    {item.cantidad_recomendada > 0 && (
                                        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-md px-3 py-2">
                                            <div className="flex items-center gap-1.5">
                                                <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-xs text-primary font-medium">
                                                    Comprar <strong>{item.cantidad_recomendada} unidades</strong>
                                                </span>
                                            </div>
                                            <span className="text-[9px] text-muted-foreground">
                                                ~4 semanas cobertura
                                            </span>
                                        </div>
                                    )}

                                    {/* No movement note */}
                                    {item.ventas_por_semana === 0 && (
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                                            <Info className="h-3 w-3 shrink-0" />
                                            Sin movimiento en los últimos {item.periodo_dias} días
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="pt-3 border-t mt-3">
                    <a href="/dashboard/products" className="text-xs text-primary hover:underline flex items-center justify-center gap-1 w-full">
                        Gestionar Inventario <ArrowRight className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};
