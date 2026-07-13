import React from 'react';
import { X, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((total, item) => total + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const actualTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalSavings = subtotal - actualTotal;

  // Let's set a realistic free delivery threshold of 10,000 ج.م for Egypt electronics
  const deliveryThreshold = 10000;
  const isFreeDelivery = actualTotal >= deliveryThreshold;
  const remainingForFreeDelivery = deliveryThreshold - actualTotal;
  const shippingFee = isFreeDelivery ? 0 : 100; // 100 EGP shipping

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" dir="rtl">
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Body */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="px-5 py-5 border-b border-gray-150 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-gray-900" />
              <h2 className="text-base font-extrabold text-gray-900">
                عربة التسوق ({cart.reduce((t, i) => t + i.quantity, 0)} قطع)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="bg-gray-100 p-6 rounded-full text-gray-400">
                  <ShoppingCart size={48} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-800 text-base mb-1">عربة التسوق فارغة حالياً</h3>
                  <p className="text-xs text-gray-400 max-w-xs font-semibold leading-relaxed">
                    يبدو أنك لم تقم بإضافة أي من الأجهزة الإلكترونية المتميزة بعد. تصفح منتجات حلمونة الثقة الآن!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
                >
                  ابدأ التسوق الآن
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Banner */}
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs flex flex-col gap-1 text-amber-900 font-medium">
                  {isFreeDelivery ? (
                    <span className="font-bold text-green-700 flex items-center gap-1">
                      🎉 مبروك! طلبك مؤهل للشحن المجاني داخل مصر.
                    </span>
                  ) : (
                    <span>
                      أضف بقيمة <strong className="font-bold">{remainingForFreeDelivery.toLocaleString()} ج.م</strong> إضافية للحصول على <strong className="font-bold text-amber-800">توصيل مجاني</strong>.
                    </span>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${isFreeDelivery ? 'bg-green-600' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min((actualTotal / deliveryThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4 divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="flex gap-4 p-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors pt-4 text-right"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg border p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate mb-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-gray-900">
                              {item.product.price.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold">ج.م</span>
                            {item.product.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through mr-1">
                                {item.product.originalPrice.toLocaleString()} ج.م
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter & Delete Button */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/50">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-gray-800 text-center min-w-[24px]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="حذف المنتج من السلة"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-150 p-5 bg-gray-50/50 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>المجموع الأساسي</span>
                  <span>{subtotal.toLocaleString()} ج.م</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>مجموع الخصومات الموفرة</span>
                    <span>- {totalSavings.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>رسوم التوصيل (داخل مصر)</span>
                  <span>{isFreeDelivery ? 'مجاني' : `${shippingFee} ج.م`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 border-t border-gray-150 pt-2">
                  <span>الإجمالي الكلي</span>
                  <span>{(actualTotal + shippingFee).toLocaleString()} ج.م</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-99"
              >
                <span>متابعة عملية الشراء</span>
                <ArrowLeft size={16} />
              </button>

              <p className="text-[10px] text-gray-400 text-center font-medium">
                ضمان حلمونة الثقة: دفع آمن عند الاستلام وتوصيل لجميع محافظات جمهورية مصر العربية.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
