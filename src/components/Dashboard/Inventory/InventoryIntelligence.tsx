import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, AlertTriangle, DollarSign, Package, Skull, BarChart3, RefreshCw } from 'lucide-react';

interface DashboardStats {
    productos_totales: number;
    unidades_totales: number;
    valor_total: number;
    stock_bajo_count: number;
    estancados_count: number;
    alta_rotacion_count: number;
}

export const InventoryIntelligence = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [estancados, setEstancados] = useState<any[]>([]);
    const [valorData, setValorData] = useState<any[]>([]);
    const [reposicion, setReposicion] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, estRes, valRes, repRes] = await Promise.all([
                fetch('/api/reports/inventario/dashboard'),
                fetch('/api/reports/inventario/estancados'),
                fetch('/api/reports/inventario/valor'),
                fetch('/api/reports/inventario/reposicion')
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
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Analizando inteligencia de inventario...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Dashboard Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/40 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unidades Totales</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.unidades_totales || 0}</div>
                        <p className="text-xs text-muted-foreground">En {stats?.productos_totales || 0} productos</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(stats?.valor_total || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground italic">Capital inmovilizado</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.stock_bajo_count || 0}</div>
                        <p className="text-xs text-muted-foreground">Requieren reposición</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estancados</CardTitle>
                        <Skull className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.estancados_count || 0}</div>
                        <p className="text-xs text-muted-foreground">Sin ventas {'>'} 60 días</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Dead Stock Table */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Skull className="h-5 w-5" /> Productos Estancados
                        </CardTitle>
                        <CardDescription>Mercancía con nula rotación. Sugerencia: Promociones o Liquidación.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Días</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estancados.slice(0, 5).map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium text-xs">{item.producto || item.nombre}</TableCell>
                                        <TableCell>{item.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                                                {item.dias_sin_vender || 0}d
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Replenishment Table */}
                <Card className="shadow-md border-blue-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                            <RefreshCw className="h-5 w-5" /> Reposición Sugerida
                        </CardTitle>
                        <CardDescription>Basado en rotación de los últimos 30 días.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Ventas</TableHead>
                                    <TableHead>Pedir</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reposicion.slice(0, 5).map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium text-xs">{item.producto}</TableCell>
                                        <TableCell>{item.total_salidas_periodo || item.ventas}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-blue-500">
                                                +{item.cantidad_sugerida || item.reponer}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Value Table (Full Width) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" /> Distribución de Valor en Inventario
                    </CardTitle>
                    <CardDescription>Desglose de capital invertido por producto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto / Variante</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Costo Unit.</TableHead>
                                <TableHead className="text-right">Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {valorData.slice(0, 10).map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{item.producto} - {item.sku}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>${(item.costo || 0).toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-bold text-green-600">
                                        ${(item.valor || (item.stock * item.costo)).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
