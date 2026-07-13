import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersProps {
  orders: Order[];
  onOpenShop: () => void;
}

export default function MyOrders({ orders, onOpenShop }: MyOrdersProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-sans text-right" dir="rtl">
      <div className="flex items-center gap-2 mb-6 justify-start">
        <div className="p-2 bg-[#0B192C] text-white rounded-lg">
          <ShoppingBag size={20} />
        </div>
        <div className="text-right">
          <h1 className="text-xl font-black text-gray-900">سجل طلبات الشراء الخاصة بك</h1>
          <p className="text-xs text-gray-400 font-semibold">تتبع شحناتك الحالية في مصر واستعرض فواتيرك السابقة بسهولة.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="bg-gray-50 p-6 rounded-full text-gray-400">
            <ShoppingBag size={48} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm mb-1">لا توجد طلبات شراء مسجلة</h3>
            <p className="text-xs text-gray-400 max-w-xs font-semibold mx-auto leading-relaxed">
              لم تقم بطلب أي منتجات إلكترونية بعد. استعرض الكتالوج المميز الآن لتسوق أحدث الأجهزة الفاخرة المتاحة داخل جمهورية مصر العربية!
            </p>
          </div>
          <button
            onClick={onOpenShop}
            className="bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            ابدأ التسوق الآن
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            // Tracking stages translated to Arabic
            const stages = [
              { label: 'تم استلام الطلب', icon: Clock, desc: 'قيد التجهيز', active: true },
              { label: 'جاري الشحن', icon: Truck, desc: 'مع مندوب التوصيل', active: order.status === 'Shipped' || order.status === 'Delivered' },
              { label: 'تم التسليم بنجاح', icon: CheckCircle2, desc: 'تم الاكتمال ✅', active: order.status === 'Delivered' },
            ];

            return (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 text-xs text-gray-500 font-semibold text-right">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-start">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">تاريخ الطلب</span>
                      <span className="font-bold text-gray-700">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">الرقم المرجعي للطلب</span>
                      <span className="font-bold text-gray-800 font-mono text-[11px]">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">وسيلة الدفع</span>
                      <span className="font-bold text-gray-700">{order.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <span className="text-[10px] text-gray-400 font-bold block">المبلغ الإجمالي الكلي</span>
                    <strong className="text-sm font-black text-gray-900">{order.total.toLocaleString()} ج.م</strong>
                  </div>
                </div>

                {/* Items & Shipping */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                  {/* Items List */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">الأجهزة الإلكترونية المطلوبة</p>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs justify-start">
                        <div className="w-10 h-10 bg-gray-50 rounded border p-1 flex items-center justify-center flex-shrink-0 ml-2">
                          <img src={it.product.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0 flex-1 text-right">
                          <h4 className="font-bold text-gray-800 truncate">{it.product.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold">الكمية: {it.quantity} × {it.product.price.toLocaleString()} ج.م</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details */}
                  {order.shippingAddress && (
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 text-xs text-gray-600 font-medium space-y-1.5 text-right">
                      <p className="font-extrabold text-gray-900 uppercase text-[10px] tracking-wide mb-1.5 border-b pb-1">تفاصيل وجهة الشحن بمصر</p>
                      <p className="text-gray-900 font-bold">{order.shippingAddress.fullName}</p>
                      <p><span className="text-gray-400">رقم الهاتف:</span> {order.shippingAddress.phone}</p>
                      <p><span className="text-gray-400">العنوان:</span> {order.shippingAddress.addressLine}، {order.shippingAddress.city}، {order.shippingAddress.country}</p>
                    </div>
                  )}
                </div>

                {/* Tracking Progress Visualizer */}
                <div className="px-5 py-4 bg-gray-50/20 border-t border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-4 text-right">تتبع مسار شحنة حلمونة الثقة</p>
                  <div className="flex justify-between items-center max-w-md mx-auto relative pb-2" dir="ltr">
                    {/* Background track line */}
                    <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-gray-200 -z-1" />
                    
                    {/* Active track line overlay */}
                    <div 
                      className="absolute left-6 top-3.5 h-0.5 bg-green-500 transition-all duration-500 -z-1"
                      style={{ 
                        width: order.status === 'Pending' 
                          ? '0%' 
                          : order.status === 'Shipped' 
                            ? '50%' 
                            : '100%' 
                      }}
                    />

                    {stages.map((st, idx) => {
                      const Icon = st.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center text-center relative z-10">
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                              st.active 
                                ? 'bg-green-500 border-green-600 text-white shadow-sm' 
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}
                          >
                            <Icon size={12} />
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 ${st.active ? 'text-gray-900' : 'text-gray-400'}`}>
                            {st.label}
                          </span>
                          <span className="text-[8px] text-gray-400">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
