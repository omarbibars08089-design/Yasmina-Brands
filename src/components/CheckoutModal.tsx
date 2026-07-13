import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, ShoppingBag, Truck, CheckCircle2, MapPin, Wallet, AlertCircle } from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  onViewOrders: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'success';

// Egypt Governorates List
const EGYPT_CITIES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية', 
  'المنوفية', 'الغربية', 'البحيرة', 'دمياط', 'بورسعيد', 'الإسماعيلية', 
  'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 
  'الأقصر', 'أسوان', 'البحر الأحمر', 'مطروح', 'شمال سيناء', 'جنوب سيناء'
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onPlaceOrder,
  onViewOrders,
  walletBalance,
  onOpenWallet,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine: '',
    city: 'القاهرة',
    country: 'جمهورية مصر العربية',
  });
  const [paymentMethod, setPaymentMethod] = useState<'wallet'>('wallet');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: '',
  });
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [locatingStatus, setLocatingStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const actualTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  // Free delivery threshold for Egypt (e.g. 10,000 EGP)
  const isFreeDelivery = actualTotal >= 10000;
  const shippingFee = isFreeDelivery ? 0 : 100; // 100 EGP shipping inside Egypt
  const grandTotal = actualTotal + shippingFee;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  // HTML5 Geolocation Retrieval
  const handleAutofillLocation = () => {
    if (!navigator.geolocation) {
      alert('عذراً، متصفحك لا يدعم خاصية التحديد الجغرافي.');
      return;
    }

    setLocatingStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        
        // Reverse-geocode approximation/mock or direct autofill
        setShipping((prev) => ({
          ...prev,
          addressLine: `📍 إحداثيات GPS المستلمة: (خط عرض: ${lat}، خط طول: ${lon}) - مصر`,
        }));
        setLocatingStatus('success');
      },
      (error) => {
        console.error('Error fetching geolocation', error);
        setLocatingStatus('error');
        alert('تعذر تحديد موقعك الحالي. يرجى التأكد من السماح للمتصفح بالوصول للموقع وإدخال العنوان يدوياً.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePlaceOrderClick = () => {
    const randomId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const currentDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newOrder: Order = {
      id: randomId,
      items: [...cart],
      total: grandTotal,
      status: 'Pending',
      date: currentDate,
      shippingAddress: shipping,
      paymentMethod: 'دفع آمن من رصيد المحفظة الإلكترونية',
    };

    onPlaceOrder(newOrder);
    setCreatedOrder(newOrder);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-sans" dir="rtl">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        id="checkout-wizard-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-green-600" />
            <span>إتمام الشراء الآمن (حلمونة الثقة - مصر)</span>
          </h2>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step Indicators */}
        {step !== 'success' && (
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-3.5 flex justify-between text-xs font-bold text-gray-400">
            <span className={step === 'shipping' ? 'text-black font-extrabold border-b-2 border-black pb-1' : 'text-gray-400'}>
              1. عنوان التوصيل بمصر
            </span>
            <span className={step === 'payment' ? 'text-black font-extrabold border-b-2 border-black pb-1' : 'text-gray-400'}>
              2. وسيلة الدفع الآمنة
            </span>
            <span className={step === 'review' ? 'text-black font-extrabold border-b-2 border-black pb-1' : 'text-gray-400'}>
              3. مراجعة وتأكيد الطلب
            </span>
          </div>
        )}

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 text-right">
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
                  تفاصيل عنوان الشحن والتسليم
                </h3>
                
                {/* Geolocation Button */}
                <button
                  type="button"
                  onClick={handleAutofillLocation}
                  className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    locatingStatus === 'locating'
                      ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                      : locatingStatus === 'success'
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : 'bg-sky-50 hover:bg-sky-100 text-slate-800 border-sky-300'
                  }`}
                >
                  <MapPin size={13} className="text-sky-600 shrink-0" />
                  <span>
                    {locatingStatus === 'locating'
                      ? 'جاري جلب موقعك الـ GPS...'
                      : locatingStatus === 'success'
                      ? 'تم تحديد موقعك بنجاح ✅'
                      : '📍 حدد موقعي الحالي تلقائياً'}
                  </span>
                </button>
              </div>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">الاسم الكامل للمستلم</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عمر بيبرس"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-right"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      placeholder="مثال: omar@example.com"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">رقم الهاتف المصري (+20)</label>
                    <input
                      type="tel"
                      required
                      placeholder="مثال: 01012345678"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">عنوان التوصيل بالتفصيل بمصر</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الشارع، رقم المبنى، الدور، رقم الشقة (أو سيتم ملؤه تلقائياً بالنقر على تحديد موقعي)"
                    value={shipping.addressLine}
                    onChange={(e) => setShipping({ ...shipping, addressLine: e.target.value })}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">المحافظة</label>
                    <select
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-right"
                    >
                      {EGYPT_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">الدولة (متاح داخل مصر فقط)</label>
                    <input
                      type="text"
                      disabled
                      value={shipping.country}
                      className="w-full bg-gray-100 text-xs border border-gray-200 rounded-lg p-2.5 font-bold text-gray-600 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-900 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow"
                >
                  الاستمرار لاختيار وسيلة الدفع
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">
                وسيلة الدفع المعتمدة لدى منصة حلمونة الثقة
              </h3>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0B192C] text-sm">الدفع الآمن الفوري عبر المحفظة الإلكترونية</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">يتم خصم قيمة المكونات والقطع المطلوبة من رصيدك الآمن مباشرةً.</p>
                  </div>
                </div>
                <div className="bg-white border border-emerald-100 rounded-xl px-4 py-2.5 text-center min-w-[120px]">
                  <span className="text-[9px] text-gray-400 font-bold block">رصيد محفظتك الحالي</span>
                  <span className="text-base font-black text-emerald-700">{walletBalance.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Compare values */}
              <div className="border border-slate-100 rounded-xl p-4 space-y-2.5 bg-slate-50 text-xs font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>المبلغ الإجمالي المطلوب للطلب:</span>
                  <span className="font-bold text-slate-800">{grandTotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>رصيد محفظتك الآمنة:</span>
                  <span className={`font-bold ${walletBalance >= grandTotal ? 'text-emerald-600' : 'text-red-500'}`}>
                    {walletBalance.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="border-t border-slate-200/60 pt-2.5 flex justify-between font-black text-slate-900">
                  <span>الرصيد المتبقي بعد الشراء:</span>
                  {walletBalance >= grandTotal ? (
                    <span className="text-emerald-700">{(walletBalance - grandTotal).toLocaleString()} ج.م</span>
                  ) : (
                    <span className="text-red-500">عجز بقيمة {(grandTotal - walletBalance).toLocaleString()} ج.م</span>
                  )}
                </div>
              </div>

              {walletBalance < grandTotal ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2 text-xs font-bold leading-relaxed">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span>عذراً، رصيد محفظتك غير كافٍ لتغطية قيمة الطلب! يرجى شحن رصيد المحفظة بمبلغ لا يقل عن <strong>{(grandTotal - walletBalance).toLocaleString()} ج.م</strong> للمتابعة وإتمام عملية الشراء بنجاح.</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onOpenWallet}
                      className="bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] px-4.5 py-2 rounded-lg font-black text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wallet size={14} />
                      <span>شحن محفظتي الآن بمصر 💳</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50/50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-2.5 text-xs font-bold">
                  <ShieldCheck size={18} className="text-green-600 shrink-0" />
                  <span>رصيد محفظتك كافٍ وجاهز لإتمام عملية الدفع الآمنة بنسبة 100%! انقر على زر المتابعة بالأسفل لتأكيد طلبك.</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  disabled={walletBalance < grandTotal}
                  className={`font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow ${
                    walletBalance >= grandTotal
                      ? 'bg-black hover:bg-gray-900 text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  مراجعة تفاصيل الطلب
                </button>
              </div>
            </form>
          )}

          {step === 'review' && (
            <div className="space-y-5">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">
                مراجعة وتأكيد الطلب النهائي
              </h3>

              {/* Delivery Details Card */}
              <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-1.5 font-semibold text-gray-600">
                <p className="font-extrabold text-gray-900 uppercase text-[10px] tracking-wide mb-1 border-b pb-1">تفاصيل الشحن والتسليم</p>
                <p><span className="text-gray-400">اسم المستلم:</span> {shipping.fullName}</p>
                <p><span className="text-gray-400">رقم الهاتف:</span> {shipping.phone}</p>
                <p><span className="text-gray-400">عنوان التوصيل:</span> {shipping.addressLine}، {shipping.city}، {shipping.country}</p>
                <p><span className="text-gray-400">طريقة الشحن:</span> شحن سريع ومضمون عبر أسطول حلمونة الثقة لمحافظة {shipping.city}</p>
              </div>

              {/* Items Card */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto pl-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded-lg text-xs">
                    <img src={item.product.image} alt="" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                    <span className="font-bold text-gray-800 truncate flex-1">{item.product.name}</span>
                    <span className="font-bold text-gray-500 mr-2">الكمية: {item.quantity}</span>
                    <span className="font-bold text-gray-900">{(item.product.price * item.quantity).toLocaleString()} ج.م</span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-gray-500">
                  <span>المجموع الفرعي</span>
                  <span>{actualTotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-500">
                  <span>تكلفة الشحن والتسليم بمصر</span>
                  <span>{shippingFee === 0 ? 'شحن مجاني 🎁' : `${shippingFee} ج.م`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-2">
                  <span>المبلغ الإجمالي الكلي للدفع</span>
                  <span>{grandTotal.toLocaleString()} ج.م</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  السابق
                </button>
                <button
                  onClick={handlePlaceOrderClick}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-8 py-2.5 rounded-xl transition-colors shadow flex items-center gap-2"
                >
                  <ShoppingBag size={14} />
                  <span>تأكيد وشحن الطلب الآن 🛒</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && createdOrder && (
            <div className="text-center py-6 px-4 flex flex-col items-center">
              <div className="text-green-500 mb-4 animate-bounce">
                <CheckCircle2 size={54} className="fill-green-100" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                تم تسجيل طلبك بنجاح في حلمونة الثقة! 🎉
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                رقم الطلب المرجعي: <strong className="font-bold text-gray-700 font-mono">{createdOrder.id}</strong>
              </p>

              {/* Courier Status Card */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 w-full max-w-sm mb-6 text-xs text-right space-y-2 font-medium text-gray-600">
                <p className="font-extrabold text-gray-900 text-center uppercase tracking-wide border-b border-gray-100 pb-1.5 mb-1.5">
                  تفاصيل الشحن والتسليم (مصر)
                </p>
                <p><span className="text-gray-400">المستلم:</span> {createdOrder.shippingAddress.fullName}</p>
                <p><span className="text-gray-400">العنوان:</span> {createdOrder.shippingAddress.addressLine}، {createdOrder.shippingAddress.city}</p>
                <p><span className="text-gray-400">تاريخ التوصيل المتوقع:</span> خلال 24 إلى 48 ساعة كحد أقصى</p>
                <p><span className="text-gray-400">حالة الدفع بمصر:</span> تم الدفع بأمان بالكامل خصماً من المحفظة (0 ج.م مطلوب عند الاستلام) ✅</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] py-3 rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  مواصلة التسوق بالمتجر
                </button>
                <button
                  onClick={() => {
                    onViewOrders();
                    onClose();
                  }}
                  className="flex-1 bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-bold text-xs transition-colors shadow"
                >
                  عرض طلباتي السابقة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
