import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Wallet2, PieChart, Info, Calendar } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";

interface DashboardData {
    ingresos: number;
    gastos: number;
    dinero_caja: number;
    ventas_registradas: number;
    cogs: number;
    utilidad_bruta: number;
    ganancia_real: number;
    diferencia_ventas_vs_ingresos: number;
}

export const MoneyDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [range, setRange] = useState({ 
        from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd') 
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/money/dashboard?from=${range.from}&to=${range.to}`);
            const result = await res.json();
            if (result.data) {
                setData(result.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener('money-updated', handler);
        return () => window.removeEventListener('money-updated', handler);
    }, [range]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { 
            style: 'currency', 
            currency: 'COP', 
            maximumFractionDigits: 0 
        }).format(val);
    };

    if (loading && !data) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4 bg-card/40 p-4 rounded-2xl border border-border/40 w-fit">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Filtrar Período
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] ml-1">Desde</label>
                        <input 
                            type="date" 
                            value={range.from}
                            onChange={(e) => setRange({ ...range, from: e.target.value })}
                            className="bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-slate-950"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] ml-1">Hasta</label>
                        <input 
                            type="date" 
                            value={range.to}
                            onChange={(e) => setRange({ ...range, to: e.target.value })}
                            className="bg-background border border-border/40 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:bg-slate-950"
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-4 hover:bg-primary/10 text-primary font-bold h-9 px-3 rounded-lg"
                        onClick={() => fetchData()}
                    >
                        Actualizar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Ingresos Totales */}
                <Card className="bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/20 shadow-none rounded-3xl overflow-hidden relative group transition-all hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowUpRight className="h-16 w-16 text-emerald-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-emerald-600/70 tracking-widest flex items-center gap-2">
                            <TrendingUp className="h-3.5 w-3.5" /> Ingresos Directos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-emerald-700">
                            {formatCurrency(data?.ingresos || 0)}
                        </div>
                        <p className="text-[10px] text-emerald-600/60 mt-2 font-bold uppercase tracking-tight">Ventas efectivas y abonos</p>
                    </CardContent>
                </Card>

                {/* Gastos Totales */}
                <Card className="bg-rose-50/40 dark:bg-rose-950/20 border-rose-500/20 shadow-none rounded-3xl overflow-hidden relative group transition-all hover:bg-rose-50/60 dark:hover:bg-rose-950/30">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <ArrowDownRight className="h-16 w-16 text-rose-600" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-rose-600/70 tracking-widest flex items-center gap-2">
                            <ArrowDownRight className="h-3.5 w-3.5" /> Gastos Totales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-rose-700">
                            {formatCurrency(data?.gastos || 0)}
                        </div>
                        <p className="text-[10px] text-rose-600/60 mt-2 font-bold uppercase tracking-tight">Manuales, compras y reversos</p>
                    </CardContent>
                </Card>

                {/* Ganancia Real */}
                <Card className="bg-primary/5 border-primary/20 shadow-none rounded-3xl overflow-hidden relative group transition-all hover:bg-primary/10">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <PieChart className="h-16 w-16 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-primary/70 tracking-widest flex items-center gap-2">
                            <DollarSign className="h-3.5 w-3.5" /> Ganancia Real
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">
                            {formatCurrency(data?.ganancia_real || 0)}
                        </div>
                        <p className="text-[10px] text-primary/60 mt-2 font-bold uppercase tracking-tight">Utilidad final (Ingresos - Gastos)</p>
                    </CardContent>
                </Card>

                {/* Dinero en Caja */}
                <Card className="bg-slate-900 border-slate-700 shadow-2xl rounded-3xl overflow-hidden relative group text-white">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <Wallet2 className="h-16 w-16 text-white" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-white/50 tracking-widest flex items-center gap-2">
                            <Wallet2 className="h-3.5 w-3.5" /> Dinero en Caja
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">
                            {formatCurrency(data?.dinero_caja || 0)}
                        </div>
                        <p className="text-[10px] text-white/40 mt-2 font-bold uppercase tracking-tight">Total acumulado en cajas activas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/40 dark:bg-slate-900/40 backdrop-blur-sm border-border/40 rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Info className="h-4 w-4" />
                            </div>
                            Métricas de Operación
                        </CardTitle>
                        <CardDescription>Análisis de ventas vs inversión de stock.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-border/40">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Ventas Brutas Marcadas</span>
                            <span className="text-lg font-black text-foreground">{formatCurrency(data?.ventas_registradas || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border/40">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Costo de Ventas (COGS)</span>
                            <span className="text-lg font-black text-rose-600/80">-{formatCurrency(data?.cogs || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Utilidad sobre Ventas</span>
                            <span className="text-lg font-black text-emerald-600">{formatCurrency(data?.utilidad_bruta || 0)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 dark:bg-slate-900/40 backdrop-blur-sm border-border/40 rounded-3xl overflow-hidden border-dashed">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Resumen de Auditoría</CardTitle>
                        <CardDescription>Conciliación de pagos pendientes.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
                        <div className={`text-5xl font-black ${ (data?.diferencia_ventas_vs_ingresos || 0) > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {formatCurrency(data?.diferencia_ventas_vs_ingresos || 0)}
                        </div>
                        <p className="text-center text-xs text-muted-foreground font-medium max-w-[280px]">
                            { (data?.diferencia_ventas_vs_ingresos || 0) > 0 
                                ? "Existe una diferencia entre las ventas registradas y el dinero que realmente ingresó a caja (pagos pendientes)." 
                                : "Tu caja está perfectamente cuadrada con las ventas registradas."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
