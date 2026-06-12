import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Search, Layers, Loader2, AlertCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { FetchData } from '@/services/fetch';
import { API_ENDPOINTS } from '@/services/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Product } from '@/types';

const STORAGE_KEY = 'productosCola';

export const QueueEditSelector = ({ onSwitchToBulk }: { onSwitchToBulk: () => void }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isRecargoDialogOpen, setIsRecargoDialogOpen] = useState(false);
    const [recargoPercentage, setRecargoPercentage] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            queryParams.append('_t', Date.now().toString());

            const url = `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`;
            const data = await FetchData<Product[]>(url);

            if (Array.isArray(data)) {
                // Solo mostrar productos activos para la edición en cola
                const activeProducts = data.filter(p => p.activo);
                setProducts(activeProducts);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch products for queue selector', error);
            setMessage({ type: 'error', text: 'Error al cargar los productos.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrado en el cliente basado en la búsqueda
    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category_name || p.Categoria?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand_name || p.Marca?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredProducts.map(p => p.id_producto));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectProduct = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleStartBulkQueue = () => {
        if (selectedIds.length === 0) return;

        // Validar porcentaje si se digitó algo
        const pctStr = recargoPercentage.trim();
        if (pctStr !== "") {
            const pct = parseFloat(pctStr);
            if (isNaN(pct) || pct < 0) {
                alert("Porcentaje inválido. Debe ser un número mayor o igual a 0.");
                return;
            }
        }

        // Configurar sesión en localStorage sin actualizar la BD inmediatamente
        const sessionData = {
            sessionId: `bulk_edit_${Date.now()}`,
            productosIds: selectedIds,
            indiceActual: 0,
            productosCargados: [],
            createdAt: new Date().toISOString(),
            autoStart: true,
            cost_percentage: pctStr || undefined,
            savedProductIds: []
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

        // Limpiar selección y cerrar modal
        setSelectedIds([]);
        setRecargoPercentage('');
        setIsRecargoDialogOpen(false);

        // Cambiar a la pestaña de carga masiva (cola de edición)
        onSwitchToBulk();
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="flex flex-1 flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-full"
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <Button
                            variant="secondary"
                            onClick={() => setIsRecargoDialogOpen(true)}
                            className="flex items-center gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-lg h-10 px-4 rounded-md animate-in zoom-in-95"
                        >
                            <Layers className="h-4 w-4" />
                            Editar Selección en Cola ({selectedIds.length})
                        </Button>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={fetchProducts} className="h-10 gap-1" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar Lista
                </Button>
            </div>

            <Card>
                <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0 border-b">
                    <div>
                        <CardTitle className="text-lg">Selector de Productos para Edición en Cola</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            Selecciona los productos que deseas editar secuencialmente. Puedes aplicar un recargo temporal al costo de todos antes de iniciar.
                        </p>
                    </div>
                    {message && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border animate-in fade-in slide-in-from-right-1 ${
                            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{message.text}</span>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                                            onCheckedChange={handleSelectAll}
                                            aria-label="Seleccionar todos los productos"
                                        />
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">Nombre</TableHead>
                                    <TableHead className="whitespace-nowrap">Categoría</TableHead>
                                    <TableHead className="whitespace-nowrap">Marca</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Variantes</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Stock Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                <span>Cargando productos del catálogo...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No se encontraron productos activos.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id_producto} className="hover:bg-muted/40 transition-colors">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(product.id_producto)}
                                                    onCheckedChange={(checked) => handleSelectProduct(product.id_producto, !!checked)}
                                                    aria-label={`Seleccionar ${product.nombre}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-semibold text-foreground">{product.nombre}</TableCell>
                                            <TableCell>{product.category_name || product.Categoria?.nombre || '-'}</TableCell>
                                            <TableCell>{product.brand_name || product.Marca?.nombre || '-'}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="font-mono bg-card">
                                                    {product.variants_count ?? 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-foreground">
                                                {product.total_stock ?? 0}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isRecargoDialogOpen} onOpenChange={setIsRecargoDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Recargo de Envío / Costo (Opcional)</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            ¿Deseas agregar un porcentaje de recargo al costo de los productos seleccionados? Se aplicará de forma temporal en la vista de edición para que puedas revisarlo y modificarlo antes de guardar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="percentage" className="text-right text-xs font-semibold">
                                Porcentaje %
                            </Label>
                            <Input
                                id="percentage"
                                type="number"
                                placeholder="Ej: 10 para aumentar 10%"
                                value={recargoPercentage}
                                onChange={(e) => setRecargoPercentage(e.target.value)}
                                className="col-span-3 text-sm h-10"
                                min="0"
                                step="any"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsRecargoDialogOpen(false);
                                setRecargoPercentage('');
                            }}
                            className="text-xs font-semibold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleStartBulkQueue}
                            className="bg-primary text-primary-foreground font-semibold text-xs h-10 px-4"
                        >
                            Iniciar Edición en Cola
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
