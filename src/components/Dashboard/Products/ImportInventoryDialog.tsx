import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    FileSpreadsheet, 
    UploadCloud, 
    Download, 
    CheckCircle2, 
    AlertTriangle, 
    Loader2, 
    FileIcon,
    X
} from 'lucide-react';
import { FetchData, HttpError } from '@/services/fetch';
import { API_ENDPOINTS } from '@/services/api';

interface ImportSummary {
    filas_procesadas: number;
    variantes_creadas: number;
    unidades_stock_inicial: number;
}

interface ImportError {
    fila: number;
    columna?: string;
    error: string;
}

export const ImportInventoryDialog = ({ onImportSuccess }: { onImportSuccess: () => void }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<ImportSummary | null>(null);
    const [errors, setErrors] = useState<ImportError[]>([]);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setFile(null);
        setSummary(null);
        setErrors([]);
        setGeneralError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.xlsx')) {
                setGeneralError('Solo se permiten archivos .xlsx');
                return;
            }
            setFile(selectedFile);
            setGeneralError(null);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await FetchData<Blob>(API_ENDPOINTS.INVENTORY.IMPORT_TEMPLATE, 'GET', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'plantilla_inventario.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Failed to download template', err);
            setGeneralError('No se pudo descargar la plantilla.');
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setLoading(true);
        setSummary(null);
        setErrors([]);
        setGeneralError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await FetchData<any>(API_ENDPOINTS.INVENTORY.IMPORT_EXCEL, 'POST', {
                body: formData
            });

            // If we are here, it's 201 Created (Success)
            setSummary(response.summary);
            setFile(null);
            onImportSuccess();
        } catch (err: any) {
            if (err instanceof HttpError) {
                if (err.status === 400 && err.data?.errors) {
                    setErrors(err.data.errors);
                } else {
                    setGeneralError(err.message || 'Ocurrió un error inesperado.');
                }
            } else {
                setGeneralError('Error de conexión con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) reset();
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5">
                    <FileSpreadsheet className="h-4 w-4" />
                    Importar Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UploadCloud className="h-5 w-5 text-primary" />
                        Importar desde Excel
                    </DialogTitle>
                    <DialogDescription>
                        Crea productos y variantes de forma masiva. Los nombres de marca y categoría deben existir previamente.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Step 1: Template */}
                    <div className="p-4 rounded-lg bg-muted/50 border flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">1. Descargar Plantilla</p>
                            <p className="text-xs text-muted-foreground">Usa el formato oficial para evitar errores de validación.</p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleDownloadTemplate} className="shrink-0 gap-2">
                            <Download className="h-3.5 w-3.5" />
                            Plantilla
                        </Button>
                    </div>

                    {/* Step 2: Upload */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold">2. Subir Archivo</p>
                        {!file ? (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-200">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground/50" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-bold">Click para seleccionar</span> puerto (.xlsx)</p>
                                    <p className="text-xs text-muted-foreground/60">Tamaño máximo 5MB</p>
                                </div>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    className="hidden" 
                                    accept=".xlsx"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </label>
                        ) : (
                            <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={loading}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Results / Feedback */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium animate-pulse">Procesando registros...</p>
                        </div>
                    )}

                    {summary && (
                        <div className="p-5 rounded-xl bg-green-500/10 border-2 border-green-500/20 space-y-3 animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle2 className="h-5 w-5" />
                                <h4 className="font-bold">¡Importación Exitosa!</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 bg-background rounded-lg text-center border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Procesadas</p>
                                    <p className="text-xl font-black">{summary.filas_procesadas}</p>
                                </div>
                                <div className="p-3 bg-background rounded-lg text-center border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Variantes</p>
                                    <p className="text-xl font-black text-primary">{summary.variantes_creadas}</p>
                                </div>
                                <div className="p-3 bg-background rounded-lg text-center border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Unidades</p>
                                    <p className="text-xl font-black text-green-600">{summary.unidades_stock_inicial}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            <div className="flex items-center gap-2 text-amber-500 mb-3 sticky top-0 bg-background py-1">
                                <AlertTriangle className="h-4 w-4" />
                                <h4 className="text-sm font-bold">Se encontraron errores en el archivo</h4>
                            </div>
                            {errors.map((err, i) => (
                                <div key={i} className="text-xs p-2.5 rounded border border-red-500/20 bg-red-500/5 flex gap-3">
                                    <span className="font-bold text-red-500 w-12 shrink-0">Fila {err.fila}</span>
                                    <span className="text-foreground/80">{err.error}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {generalError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            {generalError}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)} disabled={loading}>
                            Cerrar
                        </Button>
                        <Button 
                            className="flex-3 font-bold gap-2" 
                            disabled={!file || loading}
                            onClick={handleImport}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                            Iniciar Importación
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
