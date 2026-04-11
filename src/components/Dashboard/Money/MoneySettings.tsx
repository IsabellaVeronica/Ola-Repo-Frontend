import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Loader2, Plus, Tag, Monitor, Box, Wallet, 
    Truck, Zap, Home, Megaphone, Users, ArrowRightLeft, 
    ShoppingBag, Coffee, Settings, Shield, Briefcase, Heart,
    Utensils, Plane, Car, Gift, Smartphone, Globe
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    Truck, Zap, Home, Megaphone, Users, ArrowRightLeft, 
    ShoppingBag, Coffee, Settings, Shield, Briefcase, Heart,
    Utensils, Plane, Car, Gift, Smartphone, Globe, Tag
};

export const MoneySettings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [boxes, setBoxes] = useState<any[]>([]);
    
    const [newCategory, setNewCategory] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Tag');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState('Tag');
    const [newBox, setNewBox] = useState('');

    const handleUpdateCategory = async (id: number) => {
        setLoading(true);
        try {
            await fetch(`/api/money/expense-categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre: editName,
                    metadata: { icon: editIcon },
                    activo: true
                })
            });
            setEditingId(null);
            loadData();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [catRes, boxRes] = await Promise.all([
                fetch('/api/money/expense-categories'),
                fetch('/api/money/boxes')
            ]);
            const [cats, bxs] = await Promise.all([catRes.json(), boxRes.json()]);
            setCategories(cats.data || []);
            setBoxes(bxs.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;
        setLoading(true);
        try {
            await fetch('/api/money/expense-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre: newCategory,
                    metadata: { icon: selectedIcon }
                })
            });
            setNewCategory('');
            setSelectedIcon('Tag');
            loadData();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBox = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBox) return;
        setLoading(true);
        try {
            await fetch('/api/money/boxes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: newBox })
            });
            setNewBox('');
            loadData();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Expense Categories */}
            <Card className="bg-card/40 dark:bg-slate-900/40 border-border/40 rounded-3xl overflow-hidden shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" /> Categorías de Gasto
                    </CardTitle>
                    <CardDescription>Define conceptos para clasificar tus desembolsos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 p-3 bg-muted/10 rounded-xl border border-border/20">
                            {Object.keys(ICON_MAP).map(iconName => {
                                const Icon = ICON_MAP[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setSelectedIcon(iconName)}
                                        className={`p-2 rounded-lg transition-all ${selectedIcon === iconName ? 'bg-primary text-white scale-110 shadow-md' : 'hover:bg-muted/40 text-muted-foreground'}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </button>
                                );
                            })}
                        </div>
                        <form onSubmit={handleCreateCategory} className="flex gap-2">
                            <Input 
                                placeholder="Nueva categoría (ej: Alquiler)" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                disabled={loading}
                                className="bg-background/50 border-border/40 font-medium"
                            />
                            <Button type="submit" disabled={loading || !newCategory} className="bg-primary hover:bg-primary/90">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>

                    <div className="grid gap-2">
                        {categories.map(cat => {
                            // Priorizar category.icon, luego fallback a metadata.icon
                            const iconName = cat.icon || cat.metadata?.icon || 'Tag';
                            const IconComponent = ICON_MAP[iconName] || Tag;

                            const isEditing = editingId === cat.id_expense_category;

                            return (
                                <div key={cat.id_expense_category} className="flex flex-col gap-3 p-3 rounded-xl bg-muted/20 border border-border/20 group hover:border-primary/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <IconComponent className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-bold text-sm uppercase tracking-tight text-foreground/80">{cat.nombre.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0" 
                                                onClick={() => {
                                                    if (isEditing) {
                                                        setEditingId(null);
                                                    } else {
                                                        setEditingId(cat.id_expense_category);
                                                        setEditName(cat.nombre);
                                                        setEditIcon(cat.icon || cat.metadata?.icon || 'Tag');
                                                    }
                                                }}
                                            >
                                                <Monitor className="h-3.5 w-3.5" />
                                            </Button>
                                            {!cat.activo && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-2">Inactiva</span>}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="pt-3 border-t border-border/20 space-y-3 animate-in slide-in-from-top-2">
                                            <div className="flex flex-wrap gap-1.5 p-2 bg-background/50 rounded-lg">
                                                {Object.keys(ICON_MAP).map(iconName => {
                                                    const Icon = ICON_MAP[iconName];
                                                    return (
                                                        <button
                                                            key={iconName}
                                                            type="button"
                                                            onClick={() => setEditIcon(iconName)}
                                                            className={`p-1.5 rounded-md transition-all ${editIcon === iconName ? 'bg-primary text-white' : 'hover:bg-muted/40 text-muted-foreground'}`}
                                                        >
                                                            <Icon className="h-3.5 w-3.5" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input 
                                                    value={editName} 
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="h-8 text-xs font-bold"
                                                />
                                                <Button 
                                                    size="sm" 
                                                    className="h-8 px-3 text-[10px] font-black uppercase"
                                                    onClick={() => handleUpdateCategory(cat.id_expense_category)}
                                                    disabled={loading}
                                                >
                                                    Guardar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Cash Boxes */}
            <Card className="bg-card/40 border-border/40 rounded-3xl overflow-hidden shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" /> Cajas y Cuentas
                    </CardTitle>
                    <CardDescription>Cajas físicas o cuentas bancarias donde guardas dinero.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleCreateBox} className="flex gap-2">
                        <Input 
                            placeholder="Nombre de caja (ej: Banesco)" 
                            value={newBox}
                            onChange={(e) => setNewBox(e.target.value)}
                            disabled={loading}
                            className="bg-background/50 border-border/40 font-medium"
                        />
                        <Button type="submit" disabled={loading || !newBox} className="bg-primary hover:bg-primary/90">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        </Button>
                    </form>

                    <div className="grid gap-2">
                        {boxes.map(box => (
                            <div key={box.id_cash_box} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20 group hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Box className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-tight text-foreground/80">{box.nombre.replace(/_/g, ' ')}</span>
                                </div>
                                {!box.activo && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Inactiva</span>}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
