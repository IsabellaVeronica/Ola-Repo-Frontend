export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  categoryId?: string;
  brandId?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Producto Ejemplo 1',
    description: 'Descripción breve de tu producto de alta calidad.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop',
    category: 'Categoría 1',
    brand: 'Mi Marca',
  },
  {
    id: '2',
    name: 'Producto Ejemplo 2',
    description: 'Producto ideal para el día a día, duradero y confiable.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    category: 'Categoría 2',
    brand: 'Tu Marca',
  },
  {
    id: '3',
    name: 'Producto Ejemplo 3',
    description: 'Un complemento perfecto para tus necesidades.',
    price: 32.50,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    category: 'Categoría 1',
    brand: 'Otra Marca',
  },
  {
    id: '4',
    name: 'Producto Ejemplo 4',
    description: 'Diseño elegante y funcionalidad en un solo artículo.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop',
    category: 'Categoría 3',
    brand: 'Mi Marca',
  }
];
