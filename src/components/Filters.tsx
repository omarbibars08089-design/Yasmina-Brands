import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface FiltersProps {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  allBrands: string[];
  maxPrice: number;
}

export default function Filters({
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  allBrands,
  maxPrice,
}: FiltersProps) {
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSortBy('popular');
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 p-5 shadow-sm font-sans space-y-6 text-right" dir="rtl">
      {/* Header and Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wider">
          تصفية وترتيب المنتجات
        </h3>
        {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice || sortBy !== 'popular') && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-red-600 hover:text-red-700 font-bold transition-colors cursor-pointer"
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-bold text-gray-400 tracking-wider">
          ترتيب حسب
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-gray-50 text-xs border border-gray-200 rounded-lg p-2.5 pr-3 pl-8 focus:ring-1 focus:ring-sky-400 outline-none font-semibold text-gray-700 h-[38px] appearance-none cursor-pointer text-right"
          >
            <option value="popular">⭐ الأكثر شعبية وترشيحاً</option>
            <option value="price-low">💸 السعر: من الأقل للأعلى</option>
            <option value="price-high">💰 السعر: من الأعلى للأقل</option>
            <option value="rating">🌟 تقييم المشترين</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <ArrowUpDown size={14} />
          </div>
        </div>
      </div>

      {/* Price Slider / Input */}
      <div className="space-y-3">
        <label className="block text-[11px] font-bold text-gray-400 tracking-wider">
          نطاق السعر (ج.م)
        </label>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute right-2.5 top-2.5 text-[9px] text-gray-400 font-bold">الأدنى</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.max(0, Number(e.target.value)), priceRange[1]])}
              className="w-full bg-gray-50 text-xs border border-gray-200 rounded-lg p-2 pr-9 focus:ring-1 focus:ring-sky-400 outline-none font-semibold text-gray-800 text-left"
            />
          </div>
          <div className="flex-1 relative">
            <span className="absolute right-2.5 top-2.5 text-[9px] text-gray-400 font-bold">الأقصى</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.min(maxPrice, Math.max(priceRange[0], Number(e.target.value)))])}
              className="w-full bg-gray-50 text-xs border border-gray-200 rounded-lg p-2 pr-9 focus:ring-1 focus:ring-sky-400 outline-none font-semibold text-gray-800 text-left"
            />
          </div>
        </div>

        {/* Range slider bar */}
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-black h-1 rounded-lg bg-gray-200 cursor-pointer"
        />
      </div>

      {/* Brands check-list */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-bold text-gray-400 tracking-wider">
          الماركة / العلامة التجارية
        </label>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pl-1">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer hover:text-black justify-start"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="accent-slate-900 h-4 w-4 rounded border-gray-300 focus:ring-0 cursor-pointer ml-1"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
