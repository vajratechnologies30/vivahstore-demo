import { Link } from "wouter";
import { formatINR } from "@shared/store";

export type ProductCardData = {
  slug: string;
  name: string;
  subtitle: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  badge: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images?.[0];
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Vivah
          </div>
        )}
        {product.badge && (
          <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-wine">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-wine/95 py-3.5 text-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-ivory">
            View the piece
          </span>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="font-display text-[1.15rem] leading-snug text-ink transition-colors group-hover:text-wine">
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="mt-1 text-[11px] font-light uppercase tracking-[0.12em] text-muted-foreground">
            {product.subtitle}
          </p>
        )}
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-sm tabular-nums text-ink">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs tabular-nums text-muted-foreground line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
