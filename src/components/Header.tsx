import React from 'react';
import { Search, ShoppingCart, MapPin, Store, User, ShoppingBag, Wallet } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  currentTab: 'shop' | 'seller' | 'orders';
  setCurrentTab: (tab: 'shop' | 'seller' | 'orders') => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  deliveryLocation: string;
  onRequestLocation: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  cart,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  deliveryLocation,
  onRequestLocation,
  walletBalance,
  onOpenWallet,
}: HeaderProps) {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full flex flex-col z-40 bg-white shadow-sm font-sans" dir="rtl">
      {/* Top Banner (Optional Promo) */}
      <div className="bg-[#1e1e1e] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex justify-center items-center gap-2">
        <span>⚡ بوابة حلمونة الثقة للإلكترونيات والمكونات الإلكترونية المعتمدة بمصر 🇪🇬</span>
      </div>

      {/* Main Navy Header */}
      <div className="bg-[#0B192C] py-3.5 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Right Section: Logo & Address */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('shop')} 
            className="flex items-center cursor-pointer select-none"
            id="header-logo"
          >
            <div className="bg-black text-white px-3 py-1 text-xl sm:text-2xl font-black rounded-lg tracking-tighter flex items-center gap-1 shadow-md">
              <span className="text-sky-400">حلمونة</span>
              <span className="text-white text-sm bg-stone-800 px-1.5 py-0.5 rounded font-bold">الثقة</span>
            </div>
          </div>

          {/* Delivery Location Selector */}
          <div 
            onClick={onRequestLocation}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
            title="انقر لتحديد موقعك الجغرافي عبر الـ GPS للتوصيل"
          >
            <MapPin size={16} className="text-white shrink-0" />
            <div className="text-right leading-tight">
              <p className="text-[10px] text-gray-300 font-normal">التوصيل إلى</p>
              <p className="font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">{deliveryLocation}</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="w-full md:max-w-xl flex items-center relative" id="header-search">
          <div className="absolute right-3.5 text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="عن ماذا تبحث في الإلكترونيات؟ (أردوينو، مستشعرات، كابلات...)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'shop') setCurrentTab('shop');
            }}
            className="w-full bg-white text-gray-900 pr-11 pl-4 py-2.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 text-sm shadow-inner text-right"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded"
            >
              مسح
            </button>
          )}
        </div>

        {/* Left Section: Action Links & Tabs */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 w-full md:w-auto" id="header-actions">
          {/* Seller Panel Toggle Button */}
          <button
            onClick={() => setCurrentTab(currentTab === 'seller' ? 'shop' : 'seller')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 ${
              currentTab === 'seller'
                ? 'bg-sky-500 text-slate-900 hover:bg-sky-400'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
            id="seller-hub-toggle"
          >
            <Store size={16} />
            <span>{currentTab === 'seller' ? 'العودة للمتجر' : 'لوحة التاجر'}</span>
          </button>

          {/* Orders Button */}
          <button
            onClick={() => setCurrentTab('orders')}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors py-2 px-1 ${
              currentTab === 'orders' ? 'text-sky-300 border-b-2 border-sky-300' : 'text-gray-300 hover:text-white'
            }`}
            id="orders-toggle"
          >
            <ShoppingBag size={16} />
            <span>طلباتي</span>
          </button>

          {/* Wallet Trigger */}
          <div className="relative">
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 text-white hover:opacity-95 transition-all font-bold py-2 px-3 sm:px-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm border border-emerald-500/20 cursor-pointer"
              id="wallet-trigger"
              title="محفظتك الإلكترونية الآمنة - انقر للشحن أو التحقق من الرصيد"
            >
              <Wallet size={16} className="text-emerald-200 shrink-0" />
              <div className="text-right leading-tight">
                <span className="text-[9px] text-emerald-100 block font-bold">المحفظة الآمنة</span>
                <span className="text-xs font-black">{walletBalance.toLocaleString()} ج.م</span>
              </div>
            </button>
          </div>

          {/* Cart Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity font-bold py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg"
              id="cart-trigger"
            >
              <div className="relative">
                <ShoppingCart size={20} className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#0B192C]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm hidden lg:inline text-white">السلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Header: Navigation & Categories */}
      {currentTab === 'shop' && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 md:px-8 py-2.5 flex items-center gap-3 overflow-x-auto scrollbar-none text-xs font-semibold text-gray-700">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${
              selectedCategory === 'All'
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-100 border border-gray-200'
            }`}
          >
            جميع الفئات
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
