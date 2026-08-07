import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FetchData } from '@/services/fetch';
import { API_ENDPOINTS } from '@/services/api';
import type { Product, ProductImage, Variant } from '@/types';
import { Loader2, Upload, Trash, Star, RefreshCw, Crop } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropUtils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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

interface ProductImagesTabProps {
    product: Product;
}

export const ProductImagesTab: React.FC<ProductImagesTabProps> = ({ product }) => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<string>("all");

    // "all" = show all images (gallery view)
    // "generic" = show images with id_variante_producto === null
    // "123" = show images for variant 123

    // For Upload: 
    // If viewing "all", we default to "generic" or ask? 
    // Let's add a robust selector for upload.

    const [uploadVariantId, setUploadVariantId] = useState<string>("generic");
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [editingImageId, setEditingImageId] = useState<number | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const fetchRes = async () => {
        if (!product?.id_producto) return;
        setLoading(true);
        try {
            // Fetch Images
            const imgRes = await FetchData<any>(API_ENDPOINTS.PRODUCTS.IMAGES(product.id_producto));
            setImages(imgRes.data || []);

            // Fetch Variants for filter
            const varRes = await FetchData<any>(API_ENDPOINTS.PRODUCTS.VARIANTS(product.id_producto));
            setVariants(varRes.data || []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRes();
    }, [product]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setEditingImageId(null);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleUploadCropped = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            setUploading(true);
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Step 1: Get a signed upload signature from backend (tiny request, no file)
            const sigRes = await fetch(`/api/products/${product.id_producto}/images/signature`, {
                method: 'POST',
            });
            if (!sigRes.ok) throw new Error('No se pudo obtener la firma de subida');
            const { signature, timestamp, folder, public_id, cloud_name, api_key } = await sigRes.json();

            // Step 2: Upload DIRECTLY to Cloudinary from the browser (bypasses Vercel limit)
            const formData = new FormData();
            formData.append('file', croppedFile);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('folder', folder);
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                { method: 'POST', body: formData }
            );
            if (!cloudinaryRes.ok) throw new Error('Error al subir la imagen a Cloudinary');
            const cloudinaryData = await cloudinaryRes.json();

            if (editingImageId) {
                // PATCH to update existing image url
                const updateRes = await fetch(`/api/products/${product.id_producto}/images/${editingImageId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cloudinaryData.secure_url }),
                });
                if (!updateRes.ok) throw new Error('Error al actualizar la imagen');
            } else {
                // Step 3: Register the Cloudinary URL in the backend DB (tiny JSON request)
                const registerBody: any = { url: cloudinaryData.secure_url };
                if (uploadVariantId && uploadVariantId !== "generic") {
                    registerBody.id_variante_producto = uploadVariantId;
                }
                const registerRes = await fetch(`/api/products/${product.id_producto}/images/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerBody),
                });
                if (!registerRes.ok) throw new Error('Error al registrar la imagen en el sistema');
            }

            setImageSrc(null);
            setEditingImageId(null);
            fetchRes();
        } catch (error: any) {
            console.error("Error uploading image", error);
            alert(`Error al subir imagen: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };


    const confirmDelete = async () => {
        if (!imageToDelete) return;
        try {
            await FetchData(API_ENDPOINTS.IMAGES.ITEM(product.id_producto, imageToDelete), 'DELETE');
            fetchRes();
        } catch (error) {
            console.error("Error deleting image", error);
            alert("No se pudo eliminar la imagen. Verifique la consola.");
        } finally {
            setImageToDelete(null);
        }
    };

    const handleSetPrincipal = async (imgId: number) => {
        try {
            await FetchData(
                `${API_ENDPOINTS.IMAGES.ITEM(product.id_producto, imgId)}?principal=true`,
                'PATCH'
            );
            fetchRes();
        } catch (error) {
            console.error("Error setting principal image", error);
        }
    };

    // Filter logic
    const filteredImages = images.filter(img => {
        if (selectedVariantId === "all") return true;
        if (selectedVariantId === "generic") return img.id_variante_producto == null;
        return img.id_variante_producto?.toString() === selectedVariantId;
    });

    const getVariantName = (vId: number | null) => {
        if (!vId) return "General";
        const v = variants.find(x => x.id_variante_producto === vId);
        return v ? `${v.sku}` : "Desconocido";
    };

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return url;
    };

    return (
        <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las Imágenes</SelectItem>
                            <SelectItem value="generic">Generales (Producto)</SelectItem>
                            {variants.map(v => (
                                <SelectItem key={v.id_variante_producto} value={v.id_variante_producto.toString()}>
                                    Var: {v.sku}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={fetchRes}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                    <span className="text-xs font-medium mr-2">Subir a:</span>
                    <Select value={uploadVariantId} onValueChange={setUploadVariantId}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="generic">General</SelectItem>
                            {variants.map(v => (
                                <SelectItem key={v.id_variante_producto} value={v.id_variante_producto.toString()}>
                                    {v.sku}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />
                        <label htmlFor="image-upload">
                            <Button variant="default" size="sm" asChild disabled={uploading} className="cursor-pointer h-8">
                                <span>
                                    {uploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                                    Subir
                                </span>
                            </Button>
                        </label>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando galería...</div>
            ) : filteredImages.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
                    No hay imágenes para esta vista.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredImages.map(img => (
                        <Card key={img.id_imagen_producto} className="relative group overflow-hidden border-2 transition-all hover:border-primary/50">
                            {img.es_principal && (
                                <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-sm flex items-center">
                                    <Star className="w-3 h-3 mr-1 fill-current" /> Principal
                                </div>
                            )}
                            <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                                {getVariantName(img.id_variante_producto ?? null)}
                            </div>

                            <div className="aspect-square bg-muted">
                                <img src={getImageUrl(img.url)} alt="Product" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-blue-400 hover:bg-transparent"
                                        onClick={() => {
                                            setEditingImageId(img.id_imagen_producto);
                                            setImageSrc(getImageUrl(img.url));
                                        }}
                                    >
                                        <Crop className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-destructive hover:bg-transparent"
                                        onClick={() => setImageToDelete(img.id_imagen_producto)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                                {!img.es_principal && (
                                    <Button
                                        variant="ghost" className="h-6 text-white hover:text-foreground hover:bg-transparent text-xs px-2"
                                        onClick={() => handleSetPrincipal(img.id_imagen_producto)}
                                    >
                                        Principal
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la imagen de forma permanente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!imageSrc} onOpenChange={(open) => {
                if (!open) {
                    setImageSrc(null);
                    setEditingImageId(null);
                }
            }}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Recortar Imagen</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[400px] bg-black overflow-hidden rounded-md">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 4}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>
                    <div className="py-4 flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Zoom:</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(Number(e.target.value));
                            }}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageSrc(null)} disabled={uploading}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUploadCropped} disabled={uploading}>
                            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Subir Imagen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
