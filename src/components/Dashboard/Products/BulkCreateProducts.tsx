import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
    Plus, Trash2, CheckCircle2, Package, Layers, 
    ArrowRight, ArrowLeft, Loader2, UploadCloud, 
    X, ImageIcon, SkipForward, LayoutPanelTop,
    AlertCircle, Save
} from 'lucide-react';
import type { Product, Category, Brand } from '@/types';

const PREDEFINED_ATTRIBUTES = [
    "Talla",
    "Tamaño",
    "Color",
    "Material",
    "Peso",
    "Dimensiones",
    "Sabor",
    "Estilo",
    "Género"
];

import { FetchData, HttpError } from '@/services/fetch';
import { API_ENDPOINTS } from '@/services/api';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = 'productosCola';

interface BulkProductInput {
    nombre: string;
    descripcion: string;
}

interface SessionData {
    sessionId: string;
    productosIds: number[];
    indiceActual: number;
    productosCargados: any[];
    createdAt: string;
}

export const BulkCreateProducts = () => {
    const [step, setStep] = useState<'input' | 'summary' | 'editor' | 'fin'>('input');
    const [loading, setLoading] = useState(false);
    
    // Step 1: Input state
    const [inputs, setInputs] = useState<BulkProductInput[]>([{ nombre: '', descripcion: '' }]);
    
    // Step 2 & 3: Session state
    const [session, setSession] = useState<SessionData | null>(null);
    const [currentProductData, setCurrentProductData] = useState<any>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Editor state
    const [selectedCategoria, setSelectedCategoria] = useState<string>("");
    const [selectedMarca, setSelectedMarca] = useState<string>("");
    const [variantes, setVariantes] = useState<any[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    // Quick Add Taxonomy State
    const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
    const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [newBrandName, setNewBrandName] = useState("");
    
    // Alias para el usuario
    const agregarFila = () => setInputs([...inputs, { nombre: '', descripcion: '' }]);

    // Navigation logic
    useEffect(() => {
        const handleEnterNavigation = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                const target = e.target;
                
                // BULK INPUT STEP
                if (target.classList.contains('nombre') || target.classList.contains('descripcion')) {
                    e.preventDefault();
                    const row = target.closest('.bulk-row');
                    if (!row) return;

                    if (target.classList.contains('nombre')) {
                        const next = row.querySelector('.descripcion') as HTMLInputElement;
                        next?.focus();
                    } else if (target.classList.contains('descripcion')) {
                        const rows = document.querySelectorAll('.bulk-row');
                        const currentIndex = Array.from(rows).indexOf(row);
                        
                        if (currentIndex === rows.length - 1) {
                            agregarFila();
                            setTimeout(() => {
                                const newRow = document.querySelector('.bulk-row:last-child');
                                const nextNombre = newRow?.querySelector('.nombre') as HTMLInputElement;
                                nextNombre?.focus();
                            }, 50);
                        } else {
                            const nextRow = rows[currentIndex + 1];
                            const nextNombre = nextRow.querySelector('.nombre') as HTMLInputElement;
                            nextNombre?.focus();
                        }
                    }
                }

                // QUEUE EDITOR STEP
                const editClasses = ['precio-lista', 'codigo-barras', 'stock-inicial'];
                const currentClass = editClasses.find(c => target.classList.contains(c));
                
                if (currentClass) {
                    e.preventDefault();
                    const card = target.closest('.variant-card');
                    if (!card) return;

                    if (currentClass === 'precio-lista') {
                        (card.querySelector('.codigo-barras') as HTMLInputElement)?.focus();
                    } else if (currentClass === 'codigo-barras') {
                        (card.querySelector('.stock-inicial') as HTMLInputElement)?.focus();
                    } else if (currentClass === 'stock-inicial') {
                        const cards = document.querySelectorAll('.variant-card');
                        const currentIndex = Array.from(cards).indexOf(card);
                        
                        if (currentIndex < cards.length - 1) {
                            const nextCard = cards[currentIndex + 1];
                            (nextCard.querySelector('.precio-lista') as HTMLInputElement)?.focus();
                        } else {
                            (document.getElementById('btn-guardar-sig') as HTMLButtonElement)?.focus();
                        }
                    }
                }
            }
        };

        document.addEventListener('keydown', handleEnterNavigation);
        return () => document.removeEventListener('keydown', handleEnterNavigation);
    }, [inputs, step]); 
    
    // New variant form
    const [showNewVariantForm, setShowNewVariantForm] = useState(false);
    const [newVariant, setNewVariant] = useState({
        nombre: '',
        precio: '',
        costo: '',
        atributos: [] as { key: string; value: string }[],
        stock: '0',
        barcode: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setSession(data);
                setStep('summary');
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const addRow = agregarFila;
    const removeRow = (index: number) => {
        if (inputs.length > 1) {
            setInputs(inputs.filter((_, i) => i !== index));
        }
    };

    const handleInputChange = (index: number, field: keyof BulkProductInput, value: string) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value;
        setInputs(newInputs);
    };

    const handleVariantFieldChange = (index: number, field: string, value: string) => {
        const newVariants = [...variantes];
        if (field === 'precio_lista' || field === 'stock_inicial' || field === 'costo') {
            newVariants[index][field] = value === '' ? '' : parseFloat(value);
        } else {
            newVariants[index][field] = value;
        }
        setVariantes(newVariants);
    };

    const handleAttributeChange = (variantIdx: number, attrIdx: number, field: 'key' | 'value', value: string) => {
        const newVariants = [...variantes];
        if (!newVariants[variantIdx].atributos) newVariants[variantIdx].atributos = [];
        newVariants[variantIdx].atributos[attrIdx][field] = value;
        setVariantes(newVariants);
    };

    const addAttribute = (variantIdx: number) => {
        const newVariants = [...variantes];
        if (!newVariants[variantIdx].atributos) newVariants[variantIdx].atributos = [];
        newVariants[variantIdx].atributos.push({ key: '', value: '' });
        setVariantes(newVariants);
    };

    const removeAttribute = (variantIdx: number, attrIdx: number) => {
        const newVariants = [...variantes];
        newVariants[variantIdx].atributos = newVariants[variantIdx].atributos.filter((_: any, i: number) => i !== attrIdx);
        setVariantes(newVariants);
    };

    const handleBulkCreate = async () => {
        const validProducts = inputs.filter(i => i.nombre.trim() !== "");
        if (validProducts.length === 0) return;

        setLoading(true);
        try {
            const data = await FetchData<any>(API_ENDPOINTS.INVENTORY.BULK_CREATE, 'POST', {
                body: { productos: validProducts }
            });

            const sessionData: SessionData = {
                sessionId: data.session_id,
                productosIds: data.productos.map((p: any) => p.id_producto),
                indiceActual: 0,
                productosCargados: data.productos,
                createdAt: new Date().toISOString()
            };

            setSession(sessionData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
            setStep('summary');
        } catch (e: any) {
            alert(e.message || "Error al crear productos");
        } finally {
            setLoading(false);
        }
    };

    const startQueueEditor = async () => {
        if (!session) return;
        setStep('editor');
        await loadProductForEditor(0);
    };

    const loadProductForEditor = async (index: number, preserveLocalSelection: boolean = false) => {
        if (!session) return;
        setLoading(true);
        setLoadError(null);
        setSelectedImages([]);
        setImagePreviews([]);
        setShowNewVariantForm(false);

        try {
            const id = session.productosIds[index];
            const data = await FetchData<any>(API_ENDPOINTS.INVENTORY.SETUP_PRODUCT(id), 'GET');
            
            setCurrentProductData(data);
            
            // Solo sobrescribir si no se indica preservar la selección local
            if (!preserveLocalSelection) {
                setSelectedCategoria(String(data.producto.id_categoria || ""));
                setSelectedMarca(String(data.producto.id_marca || ""));
            }
            
            const variantsWithAttrs = (data.variantes || []).map((v: any) => ({
                ...v,
                stock_inicial: v.stock_actual || 0,
                atributos: v.atributos_json ? Object.entries(v.atributos_json).map(([key, value]) => ({ key, value })) : []
            }));
            
            setVariantes(variantsWithAttrs);
            
            const newSession = { ...session, indiceActual: index };
            setSession(newSession);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        } catch (e: any) {
            setLoadError(e.message || "Error al cargar producto");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedImages(prev => [...prev, ...files]);
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) {
                        setImagePreviews(prev => [...prev, ev.target!.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const saveCurrentProduct = async () => {
        if (!session || !currentProductData) return false;
        
        if (!selectedCategoria || !selectedMarca) {
            alert("Selecciona categoría y marca");
            return false;
        }

        setLoading(true);
        try {
            const id = session.productosIds[session.indiceActual];
            
            await FetchData(API_ENDPOINTS.INVENTORY.UPDATE_SETUP(id), 'PUT', {
                body: {
                    id_categoria: parseInt(selectedCategoria),
                    id_marca: parseInt(selectedMarca)
                }
            });

            if (selectedImages.length > 0) {
                const formData = new FormData();
                selectedImages.forEach(file => formData.append('images', file));
                
                await FetchData(API_ENDPOINTS.INVENTORY.BULK_IMAGES(id), 'POST', {
                    body: formData
                });
            }

            const variantPromises = variantes.map(async (v) => {
                // 1. Actualizar información básica
                await FetchData(API_ENDPOINTS.VARIANTS.ITEM(v.id_variante_producto), 'PATCH', {
                    body: {
                        precio_lista: parseFloat(v.precio_lista) || 0,
                        costo: parseFloat(v.costo) || 0,
                        codigo_barras: v.codigo_barras,
                        atributos_json: (v.atributos || []).reduce((acc: any, curr: any) => {
                            if (curr.key) acc[curr.key] = curr.value;
                            return acc;
                        }, { Tipo: v.nombre_tipo || 'Variante' })
                    }
                });

                // 2. Registrar movimiento de stock si hay cambios
                const currentStock = v.stock_actual || 0;
                const targetStock = parseInt(v.stock_inicial) || 0;
                const diff = targetStock - currentStock;
                
                if (diff !== 0) {
                    await FetchData(API_ENDPOINTS.INVENTORY.MOVEMENTS, 'POST', {
                        body: {
                            id_variante_producto: v.id_variante_producto,
                            tipo: diff > 0 ? 'entrada' : 'salida',
                            cantidad: Math.abs(diff),
                            motivo: 'Ajuste inicial desde Carga Masiva'
                        }
                    });
                }
            });
            await Promise.all(variantPromises);
            
            return true;
        } catch (e: any) {
            alert("Error al guardar: " + e.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const nextProduct = async () => {
        const ok = await saveCurrentProduct();
        if (!ok) return;

        if (session && session.indiceActual + 1 < session.productosIds.length) {
            await loadProductForEditor(session.indiceActual + 1);
        } else {
            setStep('fin');
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const prevProduct = async () => {
        if (session && session.indiceActual > 0) {
            await loadProductForEditor(session.indiceActual - 1);
        }
    };

    const skipProduct = async () => {
        if (session && session.indiceActual + 1 < session.productosIds.length) {
            await loadProductForEditor(session.indiceActual + 1);
        } else {
            setStep('fin');
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const createNewVariant = async () => {
        if (!session || !newVariant.nombre || !newVariant.precio) {
            alert("Nombre y precio son obligatorios");
            return;
        }

        setLoading(true);
        try {
            const id = session.productosIds[session.indiceActual];
            await FetchData(API_ENDPOINTS.INVENTORY.ADD_VARIANT(id), 'POST', {
                body: {
                    nombre_variante: newVariant.nombre || 'Nueva Variante',
                    precio_lista: parseFloat(newVariant.precio),
                    costo: parseFloat(newVariant.costo) || 0,
                    codigo_barras: newVariant.barcode,
                    atributos: newVariant.atributos.reduce((acc: any, curr: any) => {
                        if (curr.key) acc[curr.key] = curr.value;
                        return acc;
                    }, { Tipo: newVariant.nombre || 'Variante' }),
                    stock_inicial: parseInt(newVariant.stock)
                }
            });

            await loadProductForEditor(session.indiceActual);
            setNewVariant({ nombre: '', precio: '', costo: '', atributos: [], stock: '0', barcode: '' });
            setShowNewVariantForm(false);
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickCreateCategory = async () => {
        if (!newCatName) return;
        setLoading(true);
        try {
            const resp = await FetchData<any>(API_ENDPOINTS.CATALOG.CATEGORIES, 'POST', { body: { nombre: newCatName } });
            setNewCatName("");
            setIsCatDialogOpen(false);
            if (session) {
                await loadProductForEditor(session.indiceActual, true);
                if (resp && resp.id_categoria) {
                    setSelectedCategoria(String(resp.id_categoria));
                }
            }
        } catch (e: any) {
            alert("Error al crear categoría: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickCreateBrand = async () => {
        if (!newBrandName) return;
        setLoading(true);
        try {
            const resp = await FetchData<any>(API_ENDPOINTS.CATALOG.BRANDS, 'POST', { body: { nombre: newBrandName } });
            setNewBrandName("");
            setIsBrandDialogOpen(false);
            if (session) {
                await loadProductForEditor(session.indiceActual, true);
                if (resp && resp.id_marca) {
                    setSelectedMarca(String(resp.id_marca));
                }
            }
        } catch (e: any) {
            alert("Error al crear marca: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper p/ renderizado de pasos
    const renderStepContent = () => {
        if (step === 'input') return (
            <div className="max-w-4xl mx-auto p-6 space-y-8 bg-card rounded-2xl border shadow-sm">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Carga Rápida de Productos</h2>
                    <p className="text-muted-foreground">Ingresa los nombres y descripciones. Completaremos los detalles en el siguiente paso.</p>
                </div>

                <div className="space-y-4">
                    {inputs.map((input, idx) => (
                        <div key={idx} className="flex gap-4 items-start group">
                            <div className="flex-none pt-2">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                    {idx + 1}
                                </span>
                            </div>
                            <div className="flex-1 space-y-3 bulk-row">
                                <Input 
                                    placeholder="Nombre del producto (obligatorio)" 
                                    value={input.nombre}
                                    onChange={(e) => handleInputChange(idx, 'nombre', e.target.value)}
                                    className="font-semibold nombre"
                                />
                                <Input 
                                    placeholder="Descripción corta (opcional)" 
                                    value={input.descripcion}
                                    onChange={(e) => handleInputChange(idx, 'descripcion', e.target.value)}
                                    className="text-sm descripcion"
                                />
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeRow(idx)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="outline" onClick={addRow} className="flex-1 gap-2 border-dashed">
                        <Plus className="h-4 w-4" /> Agregar otro producto
                    </Button>
                    <div className="flex gap-2 flex-1">
                        <Button variant="ghost" className="flex-1" onClick={() => setInputs([{ nombre: '', descripcion: '' }])}>
                            Limpiar
                        </Button>
                        <Button className="flex-1 gap-2 font-bold" onClick={handleBulkCreate} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Iniciar Carga
                        </Button>
                    </div>
                </div>
            </div>
        );

        if (step === 'summary') return (
            <div className="max-w-2xl mx-auto p-12 text-center space-y-8 bg-card rounded-2xl border shadow-lg animate-in zoom-in-95">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-3xl font-black">¡Productos Creados!</h2>
                    <p className="text-muted-foreground">Se han registrado {session?.productosIds.length} productos base.</p>
                </div>

                <div className="bg-muted/30 rounded-xl p-6 text-left max-h-[300px] overflow-y-auto space-y-2 border">
                    {session?.productosCargados.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-background rounded-lg border border-border/50">
                            <span className="text-xs font-bold text-muted-foreground w-6">#{i+1}</span>
                            <span className="font-semibold text-sm">{p.nombre}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep('input')}>
                        Cargar más
                    </Button>
                    <Button className="flex-1 gap-2 font-bold text-lg h-12" onClick={startQueueEditor}>
                        Editar en Cola <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );

        if (step === 'editor') {
            const currentIdx = session ? session.indiceActual : 0;
            const total = session ? session.productosIds.length : 0;
            const progress = ((currentIdx + 1) / total) * 100;

            return (
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">Completar Producto {currentIdx + 1} de {total}</h3>
                                <p className="text-2xl font-black text-primary truncate max-w-md">
                                    {currentProductData?.producto?.nombre || "Cargando..."}
                                </p>
                            </div>
                            <span className="text-sm font-black text-muted-foreground">{currentIdx + 1} / {total}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {loading && !currentProductData ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="font-bold text-muted-foreground">Cargando datos del producto...</p>
                        </div>
                    ) : loadError ? (
                        <div className="bg-destructive/10 p-10 rounded-2xl border border-destructive/20 text-center space-y-4">
                            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
                            <p className="font-bold text-destructive">{loadError}</p>
                            <Button variant="outline" onClick={() => loadProductForEditor(currentIdx)}>Reintentar</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                                    <h4 className="flex items-center gap-2 font-bold mb-4">
                                        <LayoutPanelTop className="h-4 w-4 text-primary" /> Clasificación
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categoría</label>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-primary hover:bg-primary/10 rounded-full"
                                                    onClick={() => setIsCatDialogOpen(true)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar Categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currentProductData?.opciones?.categorias.map((c: any) => (
                                                        <SelectItem key={c.id_categoria} value={String(c.id_categoria)}>{c.nombre}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Marca</label>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-primary hover:bg-primary/10 rounded-full"
                                                    onClick={() => setIsBrandDialogOpen(true)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Select value={selectedMarca} onValueChange={setSelectedMarca}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar Marca" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currentProductData?.opciones?.marcas.map((m: any) => (
                                                        <SelectItem key={m.id_marca} value={String(m.id_marca)}>{m.nombre}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="flex items-center gap-2 font-bold">
                                            <Layers className="h-4 w-4 text-primary" /> Variantes y Precios
                                        </h4>
                                        <Button size="sm" variant="ghost" className="text-primary font-bold" onClick={() => setShowNewVariantForm(true)}>
                                            + Agregar Variante
                                        </Button>
                                    </div>

                                    {showNewVariantForm && (
                                        <div className="p-4 bg-muted/30 border rounded-xl space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold ml-1">Nombre Variante</Label>
                                                    <Input placeholder="Ej: Rojo-M" value={newVariant.nombre} onChange={e => setNewVariant({...newVariant, nombre: e.target.value})} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold ml-1">Cód. Barras</Label>
                                                    <Input placeholder="Opcional" value={newVariant.barcode} onChange={e => setNewVariant({...newVariant, barcode: e.target.value})} />
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold ml-1">Costo ($)</Label>
                                                    <Input type="number" placeholder="0.00" value={newVariant.costo} onChange={e => setNewVariant({...newVariant, costo: e.target.value})} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold ml-1">Precio ($)</Label>
                                                    <Input type="number" placeholder="0.00" value={newVariant.precio} onChange={e => setNewVariant({...newVariant, precio: e.target.value})} />
                                                </div>

                                                <div className="col-span-2 space-y-2 border-t pt-2 mt-2">
                                                    <Label className="flex justify-between items-center text-[10px] uppercase font-bold">
                                                        Características
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-6 text-[9px] px-2"
                                                            onClick={() => setNewVariant({
                                                                ...newVariant, 
                                                                atributos: [...newVariant.atributos, { key: '', value: '' }]
                                                            })}
                                                        >
                                                            + Añadir
                                                        </Button>
                                                    </Label>
                                                    {newVariant.atributos.map((attr, idx) => (
                                                        <div key={idx} className="flex gap-2 items-center">
                                                            <Select 
                                                                value={attr.key} 
                                                                onValueChange={(val) => {
                                                                    const newAttrs = [...newVariant.atributos];
                                                                    newAttrs[idx].key = val;
                                                                    setNewVariant({...newVariant, atributos: newAttrs});
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8 text-xs flex-1">
                                                                    <SelectValue placeholder="Tipo" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {PREDEFINED_ATTRIBUTES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            <Input 
                                                                placeholder="Valor" 
                                                                className="h-8 text-xs flex-1" 
                                                                value={attr.value}
                                                                onChange={(e) => {
                                                                    const newAttrs = [...newVariant.atributos];
                                                                    newAttrs[idx].value = e.target.value;
                                                                    setNewVariant({...newVariant, atributos: newAttrs});
                                                                }}
                                                            />
                                                            <Button 
                                                                size="icon" 
                                                                variant="ghost" 
                                                                className="h-8 w-8 text-destructive"
                                                                onClick={() => {
                                                                    setNewVariant({
                                                                        ...newVariant,
                                                                        atributos: newVariant.atributos.filter((_, i) => i !== idx)
                                                                    });
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="col-span-2 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold ml-1">Stock Inicial</Label>
                                                    <Input type="number" value={newVariant.stock} onChange={e => setNewVariant({...newVariant, stock: e.target.value})} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setShowNewVariantForm(false)}>Cancelar</Button>
                                                <Button size="sm" onClick={createNewVariant}>Crear Variante</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {variantes.map((v: any, i: number) => (
                                            <div key={v.id_variante_producto || i} className="p-6 border-2 rounded-2xl bg-muted/5 variant-card space-y-6 shadow-sm border-border">
                                                <div className="flex justify-between items-center -mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                                        <span className="font-black text-xs uppercase tracking-tighter text-muted-foreground">Variante {i + 1}</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border">{v.sku}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Nombre / Tipo</Label>
                                                        <Input 
                                                            placeholder="Ej: Estándar, Pack x3" 
                                                            value={v.nombre_tipo || v.atributos_json?.Tipo || ''} 
                                                            onChange={(e) => {
                                                                const newVariants = [...variantes];
                                                                newVariants[i].nombre_tipo = e.target.value;
                                                                setVariantes(newVariants);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Cód. Barras</Label>
                                                        <Input 
                                                            placeholder="Opcional" 
                                                            value={v.codigo_barras || ''} 
                                                            onChange={(e) => handleVariantFieldChange(i, 'codigo_barras', e.target.value)}
                                                            className="codigo-barras"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Costo ($)</Label>
                                                        <Input 
                                                            type="number" 
                                                            className="h-10 bg-background" 
                                                            value={v.costo ?? 0} 
                                                            onChange={(e) => handleVariantFieldChange(i, 'costo', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Precio ($)</Label>
                                                        <Input 
                                                            type="number" 
                                                            className="precio-lista h-10 bg-background font-bold text-primary border-primary/20" 
                                                            value={v.precio_lista} 
                                                            onChange={(e) => handleVariantFieldChange(i, 'precio_lista', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* DYNAMIC ATTRIBUTES BAR */}
                                                <div className="space-y-2 pt-2 border-t border-dashed">
                                                    <Label className="flex justify-between items-center text-[10px] uppercase font-black text-muted-foreground">
                                                        Características
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="h-6 text-[9px] hover:bg-primary/10 text-primary"
                                                            onClick={() => addAttribute(i)}
                                                        >
                                                            + Añadir Atributo
                                                        </Button>
                                                    </Label>
                                                    <div className="space-y-2">
                                                        {v.atributos?.map((attr: any, attrIdx: number) => (
                                                            <div key={attrIdx} className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                                                                <Select 
                                                                    value={attr.key} 
                                                                    onValueChange={(val) => handleAttributeChange(i, attrIdx, 'key', val)}
                                                                >
                                                                    <SelectTrigger className="h-8 text-xs flex-[0.7]">
                                                                        <SelectValue placeholder="Tipo" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {PREDEFINED_ATTRIBUTES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Input 
                                                                    placeholder="Valor" 
                                                                    className="h-8 text-xs flex-1" 
                                                                    value={attr.value}
                                                                    onChange={(e) => handleAttributeChange(i, attrIdx, 'value', e.target.value)}
                                                                />
                                                                <Button 
                                                                    size="icon" 
                                                                    variant="ghost" 
                                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                    onClick={() => removeAttribute(i, attrIdx)}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        {(!v.atributos || v.atributos.length === 0) && (
                                                            <p className="text-[10px] text-muted-foreground italic ml-1">Sin características adicionales.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 pt-2 border-t border-dashed">
                                                    <Label className="text-[10px] uppercase font-black text-primary ml-1">Stock Actual</Label>
                                                    <Input 
                                                        type="number" 
                                                        className="stock-inicial h-11 bg-primary/5 font-black text-lg text-center" 
                                                        value={v.stock_inicial ?? v.stock_actual ?? 0} 
                                                        onChange={(e) => handleVariantFieldChange(i, 'stock_inicial', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                                    <h4 className="flex items-center gap-2 font-bold mb-4">
                                        <ImageIcon className="h-4 w-4 text-primary" /> Imágenes
                                    </h4>
                                    
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-primary/5 transition-colors border-border hover:border-primary/50">
                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Click p/ subir</span>
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageSelect} />
                                    </label>

                                    <div className="grid grid-cols-2 gap-2">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                                                <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                                <Button 
                                                    size="icon" 
                                                    variant="destructive" 
                                                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                                    onClick={() => removeImage(i)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4 sticky top-6">
                                    <Button className="w-full h-12 font-bold gap-2 text-lg shadow-lg shadow-primary/20" onClick={nextProduct} disabled={loading} id="btn-guardar-sig">
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                        Guardar y Sig.
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="gap-2" onClick={prevProduct} disabled={currentIdx === 0}>
                                            <ArrowLeft className="h-4 w-4" /> Ant.
                                        </Button>
                                        <Button variant="ghost" className="gap-2 group" onClick={skipProduct}>
                                            Saltar <SkipForward className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (step === 'fin') return (
            <div className="max-w-md mx-auto p-12 text-center space-y-8 bg-card rounded-2xl border shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="text-8xl">🎉</div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-green-500">¡Todo listo!</h2>
                    <p className="text-muted-foreground text-lg">Has completado la configuración de todos los productos en la cola.</p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <Button className="w-full h-12 font-bold" onClick={() => window.location.href = '/dashboard/products'}>
                        Ver en Inventario
                    </Button>
                    <Button variant="outline" onClick={() => setStep('input')}>
                        Cargar más productos
                    </Button>
                </div>
            </div>
        );

        return null;
    };

    return (
        <>
            {renderStepContent()}

            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nueva Categoría</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nombre de la Categoría</Label>
                            <Input 
                                placeholder="Ej: Calzado, Accesorios..." 
                                value={newCatName} 
                                onChange={e => setNewCatName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleQuickCreateCategory()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCatDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleQuickCreateCategory} disabled={loading || !newCatName}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            Crear Categoría
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nueva Marca</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nombre de la Marca</Label>
                            <Input 
                                placeholder="Ej: Nike, Adidas..." 
                                value={newBrandName} 
                                onChange={e => setNewBrandName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleQuickCreateBrand()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsBrandDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleQuickCreateBrand} disabled={loading || !newBrandName}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            Crear Marca
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
