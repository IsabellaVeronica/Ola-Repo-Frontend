import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ProductDetailDialog } from './ProductDetailDialog';
import type { Product } from './CartConfig';
import { API_ENDPOINTS } from '@/services/api';
import { FetchData } from '@/services/fetch';
import { useSettings } from '@/hooks/useSettings';
import { Trophy } from 'lucide-react';

export const TopPerfumes: React.FC = () => {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        // Construct Query Params. 
        // We assume the backend might eventually support sort=salidas for public products.
        // For now, it will fetch the normal products list but limited to 3.
        const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}?limit=3&sort=salidas&dir=desc`;
        const response = await FetchData<any>(url, 'GET');

        if (response.message === 'Tienda cerrada') {
          setProducts([]);
          return;
        }

        const rawProducts = response.data || [];

        // Map to Product Interface
        const mappedProducts: Product[] = rawProducts.slice(0, 3).map((p: any) => ({
          id: Number(p.id_producto),
          name: p.nombre,
          price: Number(p.min_price) || Number(p.precio) || 0,
          image: p.imagen_principal || 'https://placehold.co/400x400/261633/FFF5F7?text=Perfume', // Placeholder
          description: p.descripcion || '',
          category: p.categoria || 'General',
          brand: p.marca || 'Marca',
          categoryId: String(p.id_categoria),
          brandId: String(p.id_marca)
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch top products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 animate-pulse text-muted-foreground">
        Cargando perfumes destacados...
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-16 text-center">
        <Trophy className="w-10 h-10 text-secondary mb-4" />
        <h3 className="font-display italic text-4xl md:text-5xl text-foreground font-light mb-4">
          Perfumes Destacados
        </h3>
        <p className="text-secondary text-base md:text-lg max-w-lg font-light">
          El Top 3 de nuestras fragancias <span className="font-bold italic">más vendidas</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto px-4">
        {products.map((product, index) => (
          <div key={product.id} className="relative group">
            {/* Top Badge */}
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-md">
              #{index + 1}
            </div>
            
            <ProductCard
              product={product}
              settings={settings}
              onSelect={(p) => {
                setSelectedProductId(Number(p.id));
                setDetailOpen(true);
              }}
            />
          </div>
        ))}
      </div>

      <ProductDetailDialog
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        productId={selectedProductId}
        settings={settings}
      />
    </div>
  );
};
