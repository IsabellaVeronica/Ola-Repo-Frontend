import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search, Plus, Edit, Ban, CheckCircle, ChevronLeft, ChevronRight, Trash, Trash2,
    CheckCircle2, AlertCircle, Layers, Loader2
} from 'lucide-react';
import { FetchData } from '@/services/fetch';
import { API_ENDPOINTS } from '@/services/api';
import { CreateProductDialog } from './CreateProductDialog';
import { EditProductDialog } from './EditProductDialog';
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Product } from '@/types';

export const ProductList = ({ onSwitchToBulk }: { onSwitchToBulk?: () => void }) => {
    // Scaffold state
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // For Edit
    const [productToToggle, setProductToToggle] = useState<Product | null>(null); // For Deactivate/Activate
    const [productToDelete, setProductToDelete] = useState<Product | null>(null); // For permanent deletion
    const [statusLoading, setStatusLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Queue edit selection states
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isRecargoDialogOpen, setIsRecargoDialogOpen] = useState(false);
    const [recargoPercentage, setRecargoPercentage] = useState<string>('');
    const [bulkEditLoading, setBulkEditLoading] = useState(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Logic similar to UserList
            const queryParams = new URLSearchParams();
            // queryParams.append('page', page.toString()); // If API supports it
            if (searchTerm) queryParams.append('search', searchTerm);
            queryParams.append('_t', Date.now().toString());

            const url = `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`;
            const data = await FetchData<Product[]>(url); // API GET /products returns array directly or paginated object? 
            // "lista todos los productos ordenados por fecha_creacion desc." implying array?
            // UserList had specific structure. I'll assume array for now based on "lista todos".

            if (Array.isArray(data)) {
                setProducts(data);
                setTotalPages(1); // No pagination mentioned?
            } else {
                setProducts([]);
            }

        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleStatus = async () => {
        if (!productToToggle) return;
        setStatusLoading(true);
        try {
            // Se usa PUT para cambiar el estado (activar o desactivar)
            await FetchData(API_ENDPOINTS.PRODUCTS.UPDATE(productToToggle.id_producto), 'PUT', {
                body: { activo: !productToToggle.activo }
            });

            await fetchProducts();
            setMessage({
                type: 'success',
                text: `Producto ${productToToggle.activo ? 'desactivado' : 'activado'} correctamente.`
            });
            setProductToToggle(null);
        } catch (error) {
            console.error('Error toggling product status:', error);
        } finally {
            setStatusLoading(false);
        }
    };

    const handleHardDelete = async () => {
        if (!productToDelete) return;
        setStatusLoading(true);
        try {
            await FetchData(API_ENDPOINTS.PRODUCTS.DELETE(productToDelete.id_producto), 'DELETE');
            setMessage({ type: 'success', text: 'Producto eliminado permanentemente.' });
            await fetchProducts();
            setProductToDelete(null);
        } catch (error: any) {
            console.error('Error deleting product:', error);
            setMessage({ type: 'error', text: error.message || 'No se pudo eliminar el producto. Puede que tenga pedidos asociados.' });
        } finally {
            setStatusLoading(false);
        }
    };

    const handleStartBulkQueue = async () => {
        setBulkEditLoading(true);
        try {
            const pct = parseFloat(recargoPercentage);
            if (!isNaN(pct) && pct > 0) {
                // Llama al endpoint para ajustar el costo
                await FetchData(API_ENDPOINTS.INVENTORY.AJUSTAR_COSTO, 'POST', {
                    body: {
                        ids_producto: selectedIds,
                        cost_percentage: pct
                    }
                });
            }

            // Inicializar sesión en cola de edición masiva
            const sessionData = {
                sessionId: `bulk_edit_${Date.now()}`,
                productosIds: selectedIds,
                indiceActual: 0,
                productosCargados: [],
                createdAt: new Date().toISOString(),
                autoStart: true
            };

            localStorage.setItem('productosCola', JSON.stringify(sessionData));

            // Limpiar selección local y cerrar modal
            setSelectedIds([]);
            setRecargoPercentage('');
            setIsRecargoDialogOpen(false);

            // Cambiar a la pestaña de carga masiva
            if (onSwitchToBulk) {
                onSwitchToBulk();
            }
        } catch (error: any) {
            console.error('Error starting bulk queue editor:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Error al ajustar costos o iniciar la cola.'
            });
        } finally {
            setBulkEditLoading(false);
        }
    };

    return (
        <div className="space-y-4">
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
                            className="flex items-center gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-lg h-10 px-4 rounded-md"
                        >
                            <Layers className="h-4 w-4" />
                            Editar en Cola ({selectedIds.length})
                        </Button>
                    )}
                </div>
                <div className="w-full sm:w-auto">
                    <CreateProductDialog onProductCreated={fetchProducts} />
                </div>
            </div>
            <Card>
                <CardHeader className="py-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-lg">Inventario de Productos</CardTitle>
                    {message && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border animate-in fade-in slide-in-from-right-1 ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                            <span className="text-xs font-medium">{message.text}</span>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto w-full">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={products.length > 0 && selectedIds.length === products.length}
                                        onCheckedChange={(checked) => {
                                            setSelectedIds(checked ? products.map(p => p.id_producto) : []);
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="whitespace-nowrap">Nombre</TableHead>
                                <TableHead className="whitespace-nowrap">Categoría</TableHead>
                                <TableHead className="whitespace-nowrap">Marca</TableHead>
                                <TableHead className="text-center whitespace-nowrap">Variantes</TableHead>
                                <TableHead className="text-center whitespace-nowrap">Stock Total</TableHead>
                                <TableHead className="whitespace-nowrap">Estado</TableHead>
                                <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                        Cargando productos...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                        No se encontraron productos.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id_producto}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(product.id_producto)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedIds(prev => [...prev, product.id_producto]);
                                                    } else {
                                                        setSelectedIds(prev => prev.filter(id => id !== product.id_producto));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.nombre}</TableCell>
                                        <TableCell>{product.category_name || product.Categoria?.nombre || '-'}</TableCell>
                                        <TableCell>{product.brand_name || product.Marca?.nombre || '-'}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-mono">
                                                {product.variants_count ?? 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">
                                            {product.total_stock ?? 0}
                                        </TableCell>
                                        <TableCell>
                                            {product.activo ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactivo</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 h-8"
                                                    onClick={() => setSelectedProduct(product)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Ver / Gestionar
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    title={product.activo ? "Desactivar" : "Activar"}
                                                    onClick={() => setProductToToggle(product)}
                                                >
                                                    {product.activo ? (
                                                        <Ban className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    title="Eliminar permanentemente"
                                                    onClick={() => setProductToDelete(product)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <EditProductDialog
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onProductUpdated={fetchProducts}
                product={selectedProduct}
            />

            <Dialog open={isRecargoDialogOpen} onOpenChange={setIsRecargoDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Recargo de Envío (Opcional)</DialogTitle>
                        <DialogDescription>
                            ¿Deseas agregar un porcentaje de recargo de envío al costo de los productos seleccionados antes de ingresar a la cola de edición?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="percentage" className="text-right">
                                Porcentaje %
                            </Label>
                            <Input
                                id="percentage"
                                type="number"
                                placeholder="Ej: 5"
                                value={recargoPercentage}
                                onChange={(e) => setRecargoPercentage(e.target.value)}
                                className="col-span-3"
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
                            disabled={bulkEditLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleStartBulkQueue}
                            disabled={bulkEditLoading}
                            className="bg-primary text-primary-foreground font-semibold"
                        >
                            {bulkEditLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Procesando...
                                </>
                            ) : (
                                "Continuar a Cola"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!productToToggle} onOpenChange={() => setProductToToggle(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {productToToggle?.activo ? '¿Desactivar producto?' : '¿Activar producto?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro que deseas {productToToggle?.activo ? 'desactivar' : 'activar'} el producto <strong>{productToToggle?.nombre}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={statusLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleStatus} disabled={statusLoading} className={productToToggle?.activo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}>
                            {statusLoading ? 'Procesando...' : (productToToggle?.activo ? 'Desactivar' : 'Activar')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={!!productToDelete} onOpenChange={(val) => !val && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto de forma permanente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el producto <strong>{productToDelete?.nombre}</strong> del sistema. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={statusLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleHardDelete} disabled={statusLoading} className="bg-red-600 hover:bg-red-700">
                            {statusLoading ? 'Eliminando...' : 'Eliminar permanentemente'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
