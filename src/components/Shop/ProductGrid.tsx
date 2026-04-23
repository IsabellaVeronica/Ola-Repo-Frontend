import React, { useState, useEffect, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { ProductCard } from './ProductCard';
import { ProductDetailDialog } from './ProductDetailDialog';
import { Search } from 'lucide-react';
import type { Product } from './CartConfig';
import { API_ENDPOINTS } from '@/services/api';
import { FetchData } from '@/services/fetch';
import { useSettings } from '@/hooks/useSettings';
import { Store } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [storeClosed, setStoreClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ id: 'all', name: 'Todos' });
  const [selectedBrand, setSelectedBrand] = useState({ id: 'all', name: 'Todas' });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [orderBy, setOrderBy] = useState('default');

  // Categories & Brands from API
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string, name: string }[]>([]);

  // Fetch initial metadata (Categories & Brands)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsData, brandsData] = await Promise.all([
          FetchData<any[]>(API_ENDPOINTS.CATALOG.CATEGORIES, 'GET'),
          FetchData<any[]>(API_ENDPOINTS.CATALOG.BRANDS, 'GET')
        ]);

        // Map API response to simple list
        // Assuming API returns [{ id_categoria: 1, nombre: "..." }, ...] - Need to verify structure or use lenient mapping
        // Based on user description: GET /api/catalog/categories
        // I will log them to check structure if needed, but for now map broadly

        // Helper to extract array from response
        const getList = (data: any) => {
          if (Array.isArray(data)) return data;
          if (data && Array.isArray(data.data)) return data.data;
          return [];
        };

        const catsList = getList(catsData);
        if (catsList.length > 0) {
          setCategories([{ id: 'all', name: 'Todos' }, ...catsList.map((c: any) => ({
            id: String(c.id_categoria || c.id || c),
            name: c.nombre || c.name || String(c)
          }))]);
        }

        const brandsList = getList(brandsData);
        if (brandsList.length > 0) {
          setBrands([{ id: 'all', name: 'Todas' }, ...brandsList.map((b: any) => ({
            id: String(b.id_marca || b.id || b),
            name: b.nombre || b.name || String(b)
          }))]);
        }

      } catch (error) {
        console.error("Failed to fetch metadata", error);
        // Fallback or empty
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construct Query Params
        const params = new URLSearchParams();
        params.append('limit', '100'); // Fetch more to allow client filtering if backend doesn't support it yet

        if (searchTerm) params.append('q', searchTerm);

        // Mapping Sorting
        if (orderBy === 'price-asc') {
          params.append('sort', 'price');
          params.append('dir', 'asc');
        } else if (orderBy === 'price-desc') {
          params.append('sort', 'price');
          params.append('dir', 'desc');
        } else if (orderBy === 'name-asc') {
          params.append('sort', 'name');
          params.append('dir', 'asc');
        } else if (orderBy === 'name-desc') {
          params.append('sort', 'name');
          params.append('dir', 'desc');
        }

        const url = `${API_ENDPOINTS.CATALOG.PRODUCTS}?${params.toString()}`;
        const response = await FetchData<any>(url, 'GET');

        if (response.message === 'Tienda cerrada') {
          setStoreClosed(true);
          setProducts([]);
          return;
        }

        setStoreClosed(false);
        const rawProducts = response.data || [];

        // Map to Product Interface
        const mappedProducts: Product[] = rawProducts.map((p: any) => ({
          id: Number(p.id_producto),
          name: p.nombre,
          price: Number(p.min_price) || Number(p.precio) || 0,
          image: p.imagen_principal || 'https://placehold.co/400x400/261633/FFF5F7?text=Producto', // Placeholder
          description: p.descripcion || '',
          category: p.categoria || 'General',
          brand: p.marca || 'Generic',
          categoryId: String(p.id_categoria), // Mapped from Proxy Injection
          brandId: String(p.id_marca)         // Mapped from Proxy Injection
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, orderBy]);

  // Client-Side Filter for Categories, Brands
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCategory = selectedCategory.id === 'all' || product.categoryId === selectedCategory.id;
      const matchBrand = selectedBrand.id === 'all' || product.brandId === selectedBrand.id;
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;

      return matchCategory && matchBrand && matchPrice;
    });
  }, [products, selectedCategory, selectedBrand, priceRange]);


  return (
    <div className="space-y-8">
      {/* Filters Container */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto bg-card/50 p-6 rounded-xl border border-border">

        {/* Row 1: Search Bar (Main) */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar productos, categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-accent w-full text-lg"
          />
        </div>

        {/* Row 2: Multi-Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Category Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Categoría</label>
            <select
              value={selectedCategory.id}
              onChange={(e) => {
                const cat = categories.find(c => c.id === e.target.value);
                if (cat) setSelectedCategory(cat);
              }}
              className="w-full bg-background border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Marca</label>
            <select
              value={selectedBrand.id}
              onChange={(e) => {
                const brd = brands.find(b => b.id === e.target.value);
                if (brd) setSelectedBrand(brd);
              }}
              className="w-full bg-background border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Rango de Precio</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-full bg-background border-input text-foreground h-10"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-full bg-background border-input text-foreground h-10"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Ordenar por</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full bg-background border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="default">Seleccionar...</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {loading || settingsLoading ? (
          <div className="col-span-full text-center py-20 text-muted-foreground animate-pulse font-medium">Buscando productos...</div>
        ) : storeClosed ? (
          <div className="col-span-full py-20 bg-card/40 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Store className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tight">Catálogo Cerrado</h3>
              <p className="text-muted-foreground font-medium">Estamos actualizando nuestro inventario. ¡Regresa pronto!</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onSelect={(p) => {
                setSelectedProductId(Number(p.id));
                setDetailOpen(true);
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p className="text-xl">No encontramos productos.</p>
          </div>
        )}
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
