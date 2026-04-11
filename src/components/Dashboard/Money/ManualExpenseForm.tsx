import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Receipt, Trash2 } from 'lucide-react';

interface ManualExpenseFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ManualExpenseForm: React.FC<ManualExpenseFormProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [boxes, setBoxes] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({
        monto: '',
        id_expense_category: '',
        metodo: 'efectivo',
        id_cash_box: '',
        nota: '',
        referencia_tipo: 'gasto_manual',
        referencia_id: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadCatalogs();
        }
    }, [isOpen]);

    const loadCatalogs = async () => {
        try {
            const [catRes, boxRes] = await Promise.all([
                fetch('/api/money/expense-categories'),
                fetch('/api/money/boxes')
            ]);
            
            const [cats, bxs] = await Promise.all([catRes.json(), boxRes.json()]);
            setCategories(cats.data || []);
            setBoxes(bxs.data || []);
            
            // Set first box if exists
            if (bxs.data?.length > 0) {
                setFormData(prev => ({ ...prev, id_cash_box: String(bxs.data[0].id_expense_category || bxs.data[0].id_cash_box) }));
            }
        } catch (e) {
            console.error("Failed to load catalogs", e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.monto || !formData.id_expense_category) return;

        setLoading(true);
        try {
            const response = await fetch('/api/money/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    monto: Number(formData.monto),
                    id_expense_category: Number(formData.id_expense_category),
                    id_cash_box: formData.id_cash_box ? Number(formData.id_cash_box) : undefined
                })
            });

            if (response.ok) {
                onSuccess();
                onClose();
                setFormData({
                    monto: '',
                    id_expense_category: '',
                    metodo: 'efectivo',
                    id_cash_box: '',
                    nota: '',
                    referencia_tipo: 'gasto_manual',
                    referencia_id: ''
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border-border/40 text-card-foreground">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 pb-0">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">
                            <PlusCircle className="w-3 h-3" />
                            Nuevo Registro
                        </div>
                        <DialogTitle className="text-2xl font-black">Registrar Gasto Manual</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground/80">
                            Esto restará dinero de la caja seleccionada inmediatamente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monto del Gasto</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        className="pl-7 font-black text-lg focus:ring-primary/20"
                                        value={formData.monto}
                                        required
                                        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoría</Label>
                                <Select 
                                    value={formData.id_expense_category} 
                                    onValueChange={(val) => setFormData({ ...formData, id_expense_category: val })}
                                    required
                                >
                                    <SelectTrigger className="font-bold">
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id_expense_category} value={String(cat.id_expense_category)} className="font-medium">
                                                {cat.nombre.replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Método de Pago</Label>
                                <Select 
                                    value={formData.metodo} 
                                    onValueChange={(val) => setFormData({ ...formData, metodo: val })}
                                >
                                    <SelectTrigger className="font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="efectivo">Efectivo</SelectItem>
                                        <SelectItem value="transferencia">Transferencia</SelectItem>
                                        <SelectItem value="punto">Punto de Venta</SelectItem>
                                        <SelectItem value="zelle">Zelle / Digital</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Caja / Origen</Label>
                                <Select 
                                    value={formData.id_cash_box} 
                                    onValueChange={(val) => setFormData({ ...formData, id_cash_box: val })}
                                >
                                    <SelectTrigger className="font-bold">
                                        <SelectValue placeholder="Buscando cajas..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {boxes.map(box => (
                                            <SelectItem key={box.id_cash_box} value={String(box.id_cash_box)}>
                                                {box.nombre.replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Referencia / Factura (Opcional)</Label>
                            <Input 
                                placeholder="Ej: FAC-00123" 
                                className="font-medium"
                                value={formData.referencia_id}
                                onChange={(e) => setFormData({ ...formData, referencia_id: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nota / Comentario</Label>
                            <Textarea 
                                placeholder="Escribe el motivo del gasto o detalles adicionales..." 
                                className="resize-none h-20 font-medium"
                                value={formData.nota}
                                onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-0">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            disabled={loading}
                            className="font-bold border-border/40"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading || !formData.monto || !formData.id_expense_category}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Receipt className="h-4 w-4 mr-2" />}
                            Registrar Gasto
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
