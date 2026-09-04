import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Product } from './CartConfig';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  settings?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, settings }) => {
  const [hovered, setHovered] = useState(false);

  // Compile unique images
  const allImages = Array.from(new Set([product.image, ...(product.images || [])])).filter(Boolean);

  // Show first image normally, switch to second on hover if available
  const activeImageIndex = (hovered && allImages.length > 1) ? 1 : 0;

  const currency = settings?.catalogo?.simbolo_moneda || '$';
  const showDecimals = settings?.catalogo?.mostrar_decimales !== false;
  const formattedPrice = showDecimals
    ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(product.price).toLocaleString();

  const brandLabel = product.brand || product.category || 'Exclusivo';

  return (
    <div
      className="group cursor-pointer flex flex-col h-full bg-card/40 hover:bg-card/90 border border-border/40 hover:border-secondary/40 p-4 rounded-3xl transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(product)}
    >
      {/* 1. Header: Brand & Product Name (ABOVE Image) */}
      <div className="mb-3 space-y-1 text-left px-1 min-h-[54px] flex flex-col justify-end">
        <span className="text-[10px] font-black tracking-[0.2em] text-secondary uppercase block truncate">
          {brandLabel}
        </span>
        <h3 className="font-display text-base sm:text-lg text-foreground font-semibold leading-tight group-hover:text-secondary transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>

      {/* 2. Center: Product Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-muted/20 border border-border/20">
        {allImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${product.name} ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-500 ease-in-out"
            style={{ 
              opacity: activeImageIndex === idx ? 1 : 0,
              transform: activeImageIndex === idx 
                ? (hovered ? 'scale(1.06)' : 'scale(1)') 
                : 'scale(0.98)'
            }}
          />
        ))}

        {/* Badges inside image */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 z-20">
            <span className="text-[9px] font-bold tracking-widest uppercase bg-foreground/90 backdrop-blur-md text-background px-3 py-1 rounded-full shadow-sm">
              Agotado
            </span>
          </div>
        )}

        {/* Hover CTA overlay button */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: `translateX(-50%) ${hovered ? 'translateY(0)' : 'translateY(8px)'}` }}
        >
          <span className="bg-background/95 backdrop-blur-md text-foreground text-[9px] tracking-[0.2em] uppercase px-4 py-2 rounded-full font-bold shadow-lg border border-border whitespace-nowrap">
            Ver Detalles
          </span>
        </div>
      </div>

      {/* 3. Footer: Price & WhatsApp Action (BELOW Image) */}
      <div className="mt-auto pt-1 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio</span>
          <span className="text-base sm:text-lg font-extrabold text-secondary tracking-tight">
            {currency}{formattedPrice}
          </span>
        </div>

        <a
          href={`https://wa.me/${settings?.contacto?.whatsapp || ''}?text=${encodeURIComponent('Hola, me interesa el perfume ' + product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-secondary/30 bg-secondary/5 hover:bg-secondary hover:text-secondary-foreground text-secondary text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="truncate">Pedir por WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
