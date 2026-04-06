import React, { useState } from 'react';
import type { Product } from './CartConfig';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  settings?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, settings }) => {
  const [hovered, setHovered] = useState(false);

  const currency = settings?.catalogo?.simbolo_moneda || '$';
  const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
  const formattedPrice = showDecimals
    ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(product.price).toLocaleString();

  const brandLabel = product.brand && product.brand !== 'Marca'
    ? product.brand
    : (product.category !== 'General' ? product.category : 'Exclusivo');

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(product)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden mb-5">
        
        {/* Terracotta wash on hover - fills from bottom */}
        <div
          className="absolute inset-0 bg-secondary origin-bottom transition-transform duration-700 ease-in-out z-0"
          style={{ transform: hovered ? 'scaleY(1)' : 'scaleY(0)' }}
        />

        {/* Background neutral layer */}
        <div className="absolute inset-0 bg-foreground/[0.04] z-0" />

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6 z-10 transition-all duration-700 ease-out drop-shadow-xl mix-blend-darken dark:mix-blend-normal"
          style={{ transform: hovered ? 'scale(1.08) translateY(-6px)' : 'scale(1) translateY(0)' }}
        />

        {/* Brand badge top-left */}
        <div
          className="absolute top-4 left-4 z-20 transition-all duration-500"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(-8px)' }}
        >
          <span className="text-[8px] font-bold tracking-[0.3em] uppercase bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full">
            {brandLabel}
          </span>
        </div>

        {/* Price badge top-right */}
        <div
          className="absolute top-4 right-4 z-20 transition-all duration-500"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(8px)' }}
        >
          <span className="text-[9px] font-bold tracking-wider bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full">
            {currency}{formattedPrice}
          </span>
        </div>

        {/* Bottom CTA Pill */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 transition-all duration-500"
          style={{ opacity: hovered ? 1 : 0, transform: `translateX(-50%) ${hovered ? 'translateY(0)' : 'translateY(12px)'}` }}
        >
          <button
            className="bg-background text-foreground text-[9px] sm:text-[10px] tracking-[0.25em] uppercase px-7 py-3 rounded-full font-semibold shadow-2xl border border-background/20 whitespace-nowrap hover:bg-secondary hover:text-secondary-foreground transition-colors duration-200"
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Text Block */}
      <div className="text-center px-2">
        {/* Animated terracotta underline  */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className="h-[1.5px] bg-secondary transition-all duration-500"
            style={{ width: hovered ? '28px' : '0px' }}
          />
          <span className="text-[9px] font-bold tracking-[0.25em] text-secondary uppercase">
            {brandLabel}
          </span>
          <span
            className="h-[1.5px] bg-secondary transition-all duration-500"
            style={{ width: hovered ? '28px' : '0px' }}
          />
        </div>

        <h3
          className="font-display text-xl md:text-2xl text-foreground leading-tight font-light transition-colors duration-300"
          style={{ color: hovered ? 'hsl(var(--secondary))' : undefined }}
        >
          {product.name}
        </h3>
      </div>
    </div>
  );
};
