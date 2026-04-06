import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, AlertTriangle, Loader2, FileDown, Box, History, BarChart3, TrendingUp, DollarSign, Skull, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryIntelligence } from './InventoryIntelligence';
import { ReportPreviewDialog } from './ReportPreviewDialog';
import { Eye, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLUMN_NAMES: Record<string, string> = {
    'id_producto': 'ID Prod',
    'producto': 'Producto',
    'id_variante_producto': 'ID Var',
    'sku': 'SKU',
    'stock': 'Stock',
    'total_salidas': 'Salidas',
    'variante': 'Variante',
    'id_salida': 'ID Salida',
    'fecha': 'Fecha',
    'cantidad': 'Cant',
    'motivo': 'Motivo',
    'referencia': 'Ref/Pedido',
    'autorizado_por': 'Autorizado',
    'costo_unit': 'Costo U.',
    'subtotal': 'Subtotal',
    'total_movimientos': 'Total Movs',
    'total_unidades': 'Total Unids',
    'valor_estimado_despachado': 'Valor Est. Despacho'
};

export const InventoryReports = () => {
    const [loading, setLoading] = useState<string | null>(null);
    const [preview, setPreview] = useState<{ open: boolean; type: string; title: string; params?: any }>({
        open: false,
        type: '',
        title: ''
    });

    const openPreview = (type: string, title: string, params: any = {}) => {
        // Map local types to API report types
        const typeMap: Record<string, string> = {
            'stock': 'stock-actual',
            'low-stock': 'alertas-stock',
            'valor': 'valor-inventario',
            'estancados': 'estancados',
            'reposicion': 'reposicion',
            'mov-detalle': 'historial-salidas'
        };
        setPreview({ 
            open: true, 
            type: typeMap[type] || type, 
            title, 
            params: { ...params } 
        });
    };

    const formatHeaders = (headers: string[]) => {
        return headers.map(h => COLUMN_NAMES[h] || h.toUpperCase());
    };

    const downloadCSV = (data: any[], fileName: string) => {
        if (!data || data.length === 0) return;

        const rawHeaders = Object.keys(data[0]);
        const translatedHeaders = formatHeaders(rawHeaders);

        const csvContent = [
            translatedHeaders.join(';'),
            ...data.map(row =>
                rawHeaders.map(header => {
                    const value = row[header] ?? '';
                    if (header === 'fecha') return new Date(value as string).toLocaleString();
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(';')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = (data: any[], title: string, fileName: string) => {
        if (!data || data.length === 0) return;

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(18);
        doc.text(title, 14, 22);

        // Add Date
        doc.setFontSize(11);
        doc.setTextColor(100);
        const date = new Date().toLocaleDateString();
        doc.text(`Fecha de generación: ${date}`, 14, 30);

        // Prepare data for autoTable
        const rawHeaders = Object.keys(data[0]);
        const translatedHeaders = formatHeaders(rawHeaders);
        const body = data.map(row => rawHeaders.map(header => {
            const val = row[header];
            if (header === 'fecha') return new Date(val as string).toLocaleDateString();
            if (header.includes('valor') || header === 'subtotal' || header === 'costo_unit') {
                return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val as number);
            }
            return val;
        }));

        autoTable(doc, {
            startY: 35,
            head: [translatedHeaders],
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }, // Indigo style
            styles: { fontSize: 7, cellPadding: 2 },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        });

        doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleDownloadReport = async (type: string, format: 'csv' | 'pdf') => {
        const loadingKey = `${type}-${format}`;
        setLoading(loadingKey);
        try {
            let endpoint = '';
            let fileName = '';
            let title = '';

            switch (type) {
                case 'stock':
                    endpoint = '/api/reports/stock-actual';
                    fileName = 'reporte_stock_actual';
                    title = 'Reporte de Stock Actual';
                    break;
                case 'low-stock':
                    endpoint = '/api/reports/stock-bajo';
                    fileName = 'alertas_stock_bajo';
                    title = 'Alertas de Stock Bajo';
                    break;
                case 'top-sales':
                    endpoint = '/api/reports/top-salidas';
                    fileName = 'ranking_productos_salidas';
                    title = 'Ranking de Productos (Top Salidas)';
                    break;
                case 'mov-kpis':
                    endpoint = '/api/reports/movimientos-kpis';
                    fileName = 'kpis_despachos';
                    title = 'KPIs de Despachos y Salidas';
                    break;
                case 'mov-detalle':
                    endpoint = '/api/reports/movimientos-detalle';
                    fileName = 'historial_detallado_salidas';
                    title = 'Historial Detallado de Salidas';
                    break;
                case 'estancados':
                    endpoint = '/api/reports/inventario/estancados';
                    fileName = 'productos_estancados';
                    title = 'Reporte de Productos Estancados';
                    break;
                case 'valor':
                    endpoint = '/api/reports/inventario/valor';
                    fileName = 'valor_inventario';
                    title = 'Valorización del Inventario';
                    break;
                case 'reposicion':
                    endpoint = '/api/reports/inventario/reposicion';
                    fileName = 'reposicion_sugerida';
                    title = 'Plan de Reposición Inteligente';
                    break;
            }

            const response = await fetch(endpoint);
            const result = await response.json();

            // Normalize result to an array
            let rawData: any[] = [];
            if (Array.isArray(result)) {
                rawData = result;
            } else if (result && result.data && Array.isArray(result.data)) {
                rawData = result.data;
            } else if (result && typeof result === 'object') {
                // If it's a single object (like KPIs), wrap it in an array
                rawData = [result];
            }

            // Filter out internal columns and empty objects
            const cleanData = rawData
                .filter(item => item && typeof item === 'object' && Object.keys(item).length > 0)
                .map((item: any) => {
                    const { producto_activo, variante_activa, data, ...rest } = item;
                    return rest;
                });

            if (format === 'csv') {
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

    return (
        <>
            <Tabs defaultValue="intelligence" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="intelligence" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" /> Inteligencia & Salud
                    </TabsTrigger>
                    <TabsTrigger value="downloads" className="flex items-center gap-2">
                        <FileDown className="h-4 w-4" /> Formatos Descargables
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="intelligence">
                    <InventoryIntelligence />
                </TabsContent>

                <TabsContent value="downloads" className="space-y-10">
                    {/* Section 1: Inventario Operativo */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Box className="h-5 w-5 text-primary" /> Inventario Operativo
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Stock Actual Card */}
                            <Card className="bg-card/60 backdrop-blur-md border border-foreground/10 shadow-lg hover:border-primary/30 transition-all group">
                                <CardHeader>
                                    <div className="p-3 w-fit rounded-xl bg-muted text-foreground mb-2 group-hover:scale-110 transition-transform">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl text-foreground">Stock Actual</CardTitle>
                                    <CardDescription className="text-foreground/70 font-medium">
                                        Listado completo de variantes **activas** con sus cantidades. (Las inactivas se omiten del reporte).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleDownloadReport('stock', 'pdf')}
                                            disabled={loading !== null}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                        >
                                            {loading === 'stock-pdf' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                                            PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => openPreview('stock', 'Stock Actual')}
                                            className="border-primary/20 text-primary hover:bg-primary/5 px-3"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => handleDownloadReport('stock', 'csv')}
                                        disabled={loading !== null}
                                        variant="ghost"
                                        className="w-full text-foreground hover:bg-muted border border-border"
                                    >
                                        {loading === 'stock-csv' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                        CSV
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Alertas de Stock Card */}
                            <Card className="bg-card/60 backdrop-blur-md border border-foreground/10 shadow-lg hover:border-red-500/30 transition-all group">
                                <CardHeader>
                                    <div className="p-3 w-fit rounded-xl bg-destructive/10 text-destructive mb-2 group-hover:scale-110 transition-transform">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl text-foreground">Alertas de Stock</CardTitle>
                                    <CardDescription className="text-foreground/70 font-medium">
                                        Variantes activas con stock bajo (crítico) que requieren reposición.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleDownloadReport('low-stock', 'pdf')}
                                            disabled={loading !== null}
                                            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
                                        >
                                            {loading === 'low-stock-pdf' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                                            PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => openPreview('low-stock', 'Stock Bajo (Alertas)')}
                                            className="border-destructive/20 text-destructive hover:bg-destructive/5 px-3"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => handleDownloadReport('low-stock', 'csv')}
                                        disabled={loading !== null}
                                        variant="ghost"
                                        className="w-full text-destructive hover:bg-destructive/10 border border-destructive/20"
                                    >
                                        {loading === 'low-stock-csv' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                        CSV
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    {/* Section 2: Inteligencia y Valorización (Custom Reports) */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" /> Inteligencia Económica
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Valor del Inventario Card */}
                            <Card className="bg-card/60 border border-foreground/10 shadow-lg hover:border-green-500/30 transition-all group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 rounded-lg bg-green-100 text-green-700">
                                            <DollarSign className="h-5 w-5" />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDownloadReport('valor', 'csv')}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg mt-3">Valor de Inventario</CardTitle>
                                    <CardDescription className="text-xs">Exporta el capital total inmovilizado en mercancía.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleDownloadReport('valor', 'pdf')}>
                                        Generar PDF
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => openPreview('valor', 'Valor de Inventario')}>
                                        <Eye className="h-4 w-4 text-green-600" />
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Productos Estancados Card */}
                            <Card className="bg-card/60 border border-foreground/10 shadow-lg hover:border-red-500/30 transition-all group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 rounded-lg bg-red-100 text-red-700">
                                            <Skull className="h-5 w-5" />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDownloadReport('estancados', 'csv')}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg mt-3">Riesgo: Estancados</CardTitle>
                                    <CardDescription className="text-xs">Detecta perfumes sin movimiento en los últimos 60 días.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleDownloadReport('estancados', 'pdf')}>
                                        Generar PDF
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => openPreview('estancados', 'Productos Estancados', { days: 60 })}>
                                        <Eye className="h-4 w-4 text-red-600" />
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Reposición Card */}
                            <Card className="bg-card/60 border border-foreground/10 shadow-lg hover:border-blue-500/30 transition-all group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                                            <RefreshCw className="h-5 w-5" />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDownloadReport('reposicion', 'csv')}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg mt-3">Asistente de Compra</CardTitle>
                                    <CardDescription className="text-xs">Sugerencias de reposición basadas en ventas (Smart Buy).</CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleDownloadReport('reposicion', 'pdf')}>
                                        Generar PDF
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => openPreview('reposicion', 'Reposición Inteligente')}>
                                        <Eye className="h-4 w-4 text-blue-600" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Section 3: Despachos y Movimientos */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" /> Despachos y Movimientos
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Historial de Salidas Card */}
                            <Card className="bg-card/60 backdrop-blur-md border border-foreground/10 shadow-lg hover:border-purple-500/30 transition-all group">
                                <CardHeader>
                                    <div className="p-3 w-fit rounded-xl bg-muted text-foreground mb-2 group-hover:scale-110 transition-transform">
                                        <History className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl text-foreground">Historial de Salidas</CardTitle>
                                    <CardDescription className="text-foreground/70 font-medium">
                                        Log detallado de cada despacho, quién lo autorizó y con qué referencia.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Button
                                        onClick={() => handleDownloadReport('mov-detalle', 'pdf')}
                                        disabled={loading !== null}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                    >
                                        {loading === 'mov-detalle-pdf' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                                        PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => openPreview('mov-detalle', 'Historial de Salidas')}
                                        className="border-primary/20 text-primary hover:bg-muted px-4"
                                    >
                                        <Eye className="h-4 w-4 mr-2" /> Visualizar
                                    </Button>
                                    <Button
                                        onClick={() => handleDownloadReport('mov-detalle', 'csv')}
                                        disabled={loading !== null}
                                        variant="outline"
                                        className="border border-border text-foreground hover:bg-muted px-3"
                                    >
                                        {loading === 'mov-detalle-csv' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <ReportPreviewDialog 
                isOpen={preview.open}
                onClose={() => setPreview({ ...preview, open: false })}
                reportType={preview.type}
                reportTitle={preview.title}
                additionalParams={preview.params}
            />
        </>
    );
};
