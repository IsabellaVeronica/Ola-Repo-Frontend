import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, LayoutGrid, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ColumnDefinition {
    key: string;
    label: string;
    type: string;
    format?: string;
}

interface ReportPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    reportType: string;
    reportTitle: string;
    additionalParams?: Record<string, any>;
}

export const ReportPreviewDialog: React.FC<ReportPreviewProps> = ({ 
    isOpen, 
    onClose, 
    reportType, 
    reportTitle,
    additionalParams = {} 
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<ColumnDefinition[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    useEffect(() => {
        if (isOpen) {
            fetchPreview(1);
        }
    }, [isOpen, reportType]);

    const fetchPreview = async (page: number) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                report: reportType,
                page: String(page),
                limit: String(pagination.limit),
                ...additionalParams
            });
            
            const response = await fetch(`/api/reports/inventario/preview?${params.toString()}`);
            const result = await response.json();
            
            if (result) {
                setColumns(result.columns || []);
                setData(result.data || []);
                setSummary(result.summary || null);
                setPagination({
                    page: result.page || page,
                    limit: result.limit || 20,
                    total: result.total || 0,
                    pages: result.pages || 1
                });
            }
        } catch (error) {
            console.error("Error fetching preview", error);
        } finally {
            setLoading(false);
        }
    };

    const renderCell = (row: any, col: ColumnDefinition) => {
        const value = row[col.key];
        
        if (value === null || value === undefined) return '-';

        switch (col.type) {
            case 'currency':
                return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(value));
            case 'date':
                return new Date(value).toLocaleDateString('es-CO');
            case 'number':
                return Number(value).toLocaleString('es-CO');
            case 'badge':
                return <Badge variant="outline">{value}</Badge>;
            default:
                return String(value);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutGrid className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{reportTitle}</DialogTitle>
                            <DialogDescription>
                                Vista previa de los datos actuales antes de exportar.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Quick Summary Bar */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-xl border border-border">
                        {Object.entries(summary).map(([key, val]: [string, any]) => (
                            <div key={key}>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">{key.replace(/_/g, ' ')}</p>
                                <p className="text-lg font-bold text-foreground">
                                    {typeof val === 'number' && key.includes('valor') 
                                        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val) 
                                        : val}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-auto rounded-lg border border-border bg-card/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-muted-foreground font-medium animate-pulse text-sm">Generando vista previa dinámica...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-muted/80 sticky top-0 z-10">
                                <TableRow>
                                    {columns.map(col => (
                                        <TableHead key={col.key} className="whitespace-nowrap font-bold text-foreground py-4">
                                            {col.label}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-20 text-muted-foreground italic">
                                            No se encontraron resultados para este reporte.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((row, i) => (
                                        <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                                            {columns.map(col => (
                                                <TableCell key={col.key} className="py-4 text-sm">
                                                    {renderCell(row, col)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium">
                        Mostrando <span className="text-foreground">{data.length}</span> de <span className="text-foreground">{pagination.total}</span> registros
                    </p>
                    <div className="flex items-center gap-4">
                        <p className="text-xs font-medium">Página {pagination.page} de {pagination.pages}</p>
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fetchPreview(pagination.page - 1)}
                                disabled={pagination.page <= 1 || loading}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fetchPreview(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages || loading}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
