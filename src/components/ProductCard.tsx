import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, e?: React.MouseEvent) => void;
}

export default function ProductCard({ product, onOpenDetails, onAddToCart }: ProductCardProps) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group relative text-right"
      id={`product-card-${product.id}`}
      dir="rtl"
    >
      {/* Badges / Top row */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-sm">
            خصم {discountPercent}%
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="bg-orange-500 text-white font-semibold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
            متبقي {product.stock} قطع فقط!
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-500 text-white font-semibold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
            نفد من المخزن
          </span>
        )}
      </div>

      {/* Main Image Section */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
        {/* Hover Fast View Action */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-1">
          <span className="uppercase tracking-wider">{product.brand}</span>
          <span>{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2 h-10 group-hover:text-black transition-colors mb-2">
          {product.name}
        </h3>

        {/* Ratings & Express Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold gap-0.5">
            <span>{product.rating}</span>
            <Star size={10} className="fill-green-700 stroke-green-700" />
          </div>
          <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
          
          {product.isExpress && (
            <div className="flex items-center bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded italic shadow-sm leading-tight mr-auto">
              ⚡ شحن سريع الثقة
            </div>
          )}
        </div>

        {/* Pricing and Add Button */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-gray-900 leading-none">
                {product.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-[10px] font-bold">ج.م</span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} ج.م
              </span>
            )}
          </div>

          <button
            onClick={(e) => onAddToCart(product, 1, e)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] shadow-sm hover:shadow active:scale-95'
            }`}
            title={product.stock === 0 ? 'غير متوفر حالياً' : 'أضف إلى السلة'}
            id={`btn-add-cart-${product.id}`}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
