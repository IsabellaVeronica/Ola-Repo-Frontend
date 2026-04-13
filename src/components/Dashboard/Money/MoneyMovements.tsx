import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    Loader2, ArrowUpRight, ArrowDownRight, Search, FileDown, Calendar, FilterX,
    Truck, Zap, Home, Megaphone, Users, ArrowRightLeft, 
    ShoppingBag, Coffee, Settings, Shield, Briefcase, Heart,
    Utensils, Plane, Car, Gift, Smartphone, Globe, Tag
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    Truck, Zap, Home, Megaphone, Users, ArrowRightLeft, 
    ShoppingBag, Coffee, Settings, Shield, Briefcase, Heart,
    Utensils, Plane, Car, Gift, Smartphone, Globe, Tag
};

interface Movement {
    id_cash_movement: number;
    tipo: 'ingreso' | 'gasto';
    monto: number;
    metodo: string;
    expense_category_nombre?: string;
    expense_category_icon?: string;
    expense_category_metadata?: { icon?: string };
    cash_box_nombre: string;
    nota: string;
    usuario_nombre: string;
    created_at: string;
    referencia_id?: string;
}

export const MoneyMovements: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [movements, setMovements] = useState<Movement[]>([]);
    const [filters, setFilters] = useState({
        tipo: 'all',
        metodo: 'all',
        from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd'),
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    const fetchMovements = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(filters.page),
                limit: String(filters.limit),
                from: filters.from,
                to: filters.to
            });
            if (filters.tipo !== 'all') params.append('tipo', filters.tipo);
            if (filters.metodo !== 'all') params.append('metodo', filters.metodo);

            const res = await fetch(`/api/money/movements?${params.toString()}`);
            const result = await res.json();
            setMovements(result.data || []);
            setPagination({ total: result.total, pages: result.pages || Math.ceil(result.total / filters.limit) });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();
        const handler = () => fetchMovements();
        window.addEventListener('money-updated', handler);
        return () => window.removeEventListener('money-updated', handler);
    }, [filters]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { 
            style: 'currency', 
            currency: 'COP', 
            maximumFractionDigits: 0 
        }).format(val);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card/40 p-4 rounded-2xl border border-border/40">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <Select value={filters.tipo} onValueChange={(v) => setFilters({...filters, tipo: v, page: 1})}>
                        <SelectTrigger className="flex-1 sm:w-[140px] font-bold h-10 rounded-xl">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="ingreso">Ingresos</SelectItem>
                            <SelectItem value="gasto">Gastos</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={filters.metodo} onValueChange={(v) => setFilters({...filters, metodo: v, page: 1})}>
                        <SelectTrigger className="flex-1 sm:w-[160px] font-bold h-10 rounded-xl">
                            <SelectValue placeholder="Método" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Cualquier método</SelectItem>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="transferencia">Transferencia</SelectItem>
                            <SelectItem value="punto">Punto de Venta</SelectItem>
                            <SelectItem value="zelle">Zelle / Digital</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full sm:w-auto text-muted-foreground hover:text-primary font-bold text-xs uppercase tracking-widest gap-2"
                        onClick={() => setFilters({ 
                            tipo: 'all', 
                            metodo: 'all', 
                            from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
                            to: format(new Date(), 'yyyy-MM-dd'),
                            page: 1, 
                            limit: 20 
                        })}
                    >
                        <FilterX className="h-4 w-4" /> Limpiar
                    </Button>
                </div>

                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-4 w-full sm:w-auto overflow-x-auto whitespace-nowrap">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mr-1">Rango:</span>
                        <input 
                            type="date" 
                            className="bg-transparent border-none text-[11px] font-bold focus:ring-0 w-[110px]"
                            value={filters.from}
                            onChange={(e) => setFilters({...filters, from: e.target.value, page: 1})}
                        />
                        <span className="text-muted-foreground/30">-</span>
                        <input 
                            type="date" 
                            className="bg-transparent border-none text-[11px] font-bold focus:ring-0 w-[110px]"
                            value={filters.to}
                            onChange={(e) => setFilters({...filters, to: e.target.value, page: 1})}
                        />
                    </div>
                </div>

                <Button variant="outline" size="sm" className="font-bold gap-2 rounded-xl w-full sm:w-auto">
                    <FileDown className="h-4 w-4" /> Exportar CSV
                </Button>
            </div>

            <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/50 dark:bg-slate-900/40 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Fecha</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Tipo</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Concepto / Responsable</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Método / Caja</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 text-right">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20" />
                                </TableCell>
                            </TableRow>
                        ) : movements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">
                                    No se encontraron movimientos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            movements.map((move) => (
                                <TableRow key={move.id_cash_movement} className="hover:bg-muted/20 transition-colors border-border/40 group">
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm text-foreground/80">{format(new Date(move.created_at), 'dd/MM/yyyy')}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground">{format(new Date(move.created_at), 'HH:mm')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`uppercase text-[10px] font-black tracking-widest h-6 px-2 shadow-none rounded-md ${
                                            move.tipo === 'ingreso' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                                        }`}>
                                            {move.tipo === 'ingreso' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                            {move.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                {(() => {
                                                    const iconName = move.expense_category_icon || move.expense_category_metadata?.icon || 'Tag';
                                                    const IconComponent = ICON_MAP[iconName] || Tag;
                                                    return <IconComponent className="h-3 w-3 text-muted-foreground" />;
                                                })()}
                                                <span className="font-bold text-sm truncate">
                                                    {move.expense_category_nombre || (move.tipo === 'ingreso' ? 'Venta de Productos' : 'Sin categoría')}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-foreground transition-colors italic">
                                                {move.nota || move.usuario_nombre}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase text-foreground/70">{move.metodo}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/60">{move.cash_box_nombre}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`text-base font-black ${
                                            move.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                            {move.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(move.monto)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Simple Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={filters.page === 1}
                        onClick={() => setFilters({...filters, page: filters.page - 1})}
                        className="font-bold"
                    >
                        Anterior
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground">Página {filters.page} de {pagination.pages}</span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={filters.page === pagination.pages}
                        onClick={() => setFilters({...filters, page: filters.page + 1})}
                        className="font-bold"
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
};
