import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, Check, Smartphone, Landmark, AlertCircle, Copy, Camera, Image as ImageIcon } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTopUp: (amount: number) => void;
  onSubmitTopUpRequest?: (request: {
    clientName: string;
    clientPhone: string;
    amount: number;
    paymentMethod: 'vodafone_cash' | 'instapay' | 'fawry';
    transactionId?: string;
    receiptImage?: string;
  }) => void;
}

type PaymentMethod = 'manual_transfer';

export default function WalletModal({ isOpen, onClose, walletBalance, onTopUp, onSubmitTopUpRequest }: WalletModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('manual_transfer');
  const [amount, setAmount] = useState<string>('500');
  
  // Manual Cash transfer states
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualMethod, setManualMethod] = useState<'vodafone_cash' | 'instapay' | 'fawry'>('vodafone_cash');
  const [manualReceipt, setManualReceipt] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAmountSelect = (val: number) => {
    setAmount(val.toString());
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً! الحد الأقصى المسموح به هو 8 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setManualReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('الرجاء إدخال مبلغ شحن صحيح');
      return;
    }

    if (!manualName.trim()) {
      alert('الرجاء إدخال اسمك بالكامل لمطابقة عملية التحويل');
      return;
    }
    if (!manualPhone || manualPhone.length < 11) {
      alert('الرجاء إدخال رقم الهاتف الذي قمت بالتحويل منه (11 رقم)');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      if (onSubmitTopUpRequest) {
        onSubmitTopUpRequest({
          clientName: manualName,
          clientPhone: manualPhone,
          amount: parsedAmount,
          paymentMethod: manualMethod,
          transactionId: 'تم إرفاق صورة التحويل',
          receiptImage: manualReceipt || undefined,
        });
      }
      setIsProcessing(false);
      
      const methodLabel = manualMethod === 'vodafone_cash' ? 'فودافون كاش' : manualMethod === 'instapay' ? 'إنستاباي' : 'فوري';
      setSuccessMsg(`تم إرسال طلب التحويل بنجاح! 📨 سيقوم البشمهندس عمر بمراجعة تحويل الـ ${methodLabel} الخاص بك بمبلغ ${parsedAmount.toLocaleString()} ج.م وتفعيل رصيدك فورياً.`);
      
      setManualName('');
      setManualPhone('');
      setManualReceipt('');
      
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 5000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans text-right" dir="rtl">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B192C] p-5 text-white flex justify-between items-center relative border-b border-sky-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/15 rounded-xl text-sky-400">
              <Wallet size={22} />
            </div>
            <div>
              <h2 className="text-base font-black">شحن المحفظة الإلكترونية الآمنة</h2>
              <p className="text-[10px] text-slate-300">قم بإضافة الأموال للشراء المباشر والآمن من حلمونة الثقة بمصر</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Balance Hero Banner */}
        <div className="bg-sky-50/50 p-5 border-b border-sky-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">رصيدك الحالي بالمحفظة</span>
            <span className="text-2xl font-black text-[#0B192C]">{walletBalance.toLocaleString()} <span className="text-xs font-bold text-slate-500">ج.م</span></span>
          </div>
          <div className="bg-[#0B192C] text-white py-1 px-2.5 rounded-full text-[10px] font-black flex items-center gap-1">
            <ShieldCheck size={12} className="text-green-400" />
            <span>حماية مشفرة 100%</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {successMsg ? (
            <div className="py-8 flex flex-col items-center text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200 animate-bounce">
                <Check size={36} className="stroke-[3]" />
              </div>
              <h3 className="text-base font-extrabold text-green-700">{successMsg}</h3>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                تم تسجيل طلب التحويل الخاص بك بنجاح. بمجرد مراجعته وتأكيده من قبل المهندس عمر، سيتم تفعيل الرصيد في محفظتك الإلكترونية فوراً.
              </p>
            </div>
          ) : (
            <form onSubmit={handleTopUpSubmit} className="space-y-5">
              {/* Step 1: Top-up Amount */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2">1. حدد مبلغ الشحن بالجنيه المصري (ج.م)</label>
                
                {/* Preset Fast Selection Chips */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[200, 500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountSelect(val)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        amount === val.toString()
                          ? 'border-sky-500 bg-sky-50 text-sky-700 font-black'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      {val.toLocaleString()} ج.m
                    </button>
                  ))}
                </div>

                {/* Custom input */}
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="100000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-4 pl-12 focus:ring-2 focus:ring-sky-500 outline-none font-bold text-left text-[#0B192C]"
                    placeholder="أدخل مبلغاً مخصصاً بالجنيه المصري"
                  />
                  <span className="absolute left-4 top-3.5 text-xs font-black text-gray-400">ج.م</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">الحد الأدنى للشحن هو 50 ج.م والحد الأقصى للمرة الواحدة هو 100,000 ج.م</p>
              </div>

              {/* Step 2: Manual Cash Transfer Details */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2.5">2. اختر طريقة التحويل المباشر التي استخدمتها:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'vodafone_cash', name: '🔴 فودافون كاش' },
                      { id: 'instapay', name: '⚡ إنستاباي' },
                      { id: 'fawry', name: '🔸 كشك فوري' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setManualMethod(m.id as any)}
                        className={`py-2.5 px-1 rounded-xl border text-[11px] font-black transition-all cursor-pointer ${
                          manualMethod === m.id
                            ? 'bg-[#0B192C] text-white border-transparent'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number to pay to info box */}
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 text-xs text-sky-900 leading-relaxed space-y-2 text-right">
                  <div className="flex items-center gap-1.5 font-black text-sky-950">
                    <Landmark size={15} />
                    <span>بيانات تحويل الأموال للمهندس عمر بيبرس:</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-700">
                    الرجاء تحويل المبلغ المطلوب وهو (<strong className="text-black font-extrabold">{parseFloat(amount || '0').toLocaleString()} ج.م</strong>) إلى الحساب التالي:
                  </p>
                  
                  <div className="bg-white p-3 rounded-xl border border-sky-100/50 flex items-center justify-between font-bold">
                    <div>
                      <span className="text-[10px] text-gray-400 block">
                        {manualMethod === 'vodafone_cash' ? '🔴 رقم فودافون كاش المعتمد' : '⚡ رقم إنستاباي / فوري المعتمد'}
                      </span>
                      <span className="font-mono text-sm font-black text-slate-800 select-all">
                        {manualMethod === 'vodafone_cash' ? '01006400159' : '01117906939'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const num = manualMethod === 'vodafone_cash' ? '01006400159' : '01117906939';
                        navigator.clipboard.writeText(num);
                        alert(`تم نسخ الرقم بنجاح: ${num}`);
                      }}
                      className="bg-[#0B192C] hover:bg-sky-500 hover:text-[#0B192C] text-white py-1 px-3 rounded-lg text-[10px] font-black transition-colors cursor-pointer"
                    >
                      نسخ الرقم 📋
                    </button>
                  </div>
                </div>

                {/* User Info Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">اسمك بالكامل (لمطابقة صاحب التحويل والاعتماد):</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمد علي"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-right text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">رقم الهاتف الذي قمت بالتحويل منه:</label>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      placeholder="مثال: 01012345678"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-mono text-left text-slate-800"
                    />
                  </div>

                  {/* Image attachment */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5">صورة إيصال التحويل / لقطة شاشة تأكيد الدفع:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptChange}
                      className="hidden"
                      id="receipt-upload-modal"
                    />
                    <label
                      htmlFor="receipt-upload-modal"
                      className="border border-dashed border-gray-300 hover:border-sky-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white hover:bg-sky-50/20 text-center"
                    >
                      {manualReceipt ? (
                        <div className="space-y-2">
                          <img src={manualReceipt} className="max-h-24 mx-auto rounded-lg shadow-xs object-cover border border-slate-100" alt="Receipt Preview" />
                          <span className="text-[10px] text-emerald-600 font-extrabold block">✓ تم إرفاق صورة الإيصال بنجاح! انقر للتغيير</span>
                        </div>
                      ) : (
                        <>
                          <div className="p-2 bg-sky-50 rounded-lg text-[#0B192C]">
                            <Camera size={18} />
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-slate-700 block">اضغط لإرفاق صورة الإيصال أو لقطة الشاشة</span>
                            <span className="text-[9px] text-gray-400 block mt-0.5">يسهل عملية تأكيد الرصيد وتفعيله فوراً</span>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Top Up Action Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-6 rounded-xl bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-99 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white hover:border-[#0B192C] border-t-transparent rounded-full animate-spin" />
                    <span>جاري تسجيل طلب الشحن وإرساله للمهندس عمر...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>إرسال طلب التحويل للمراجعة وتفعيل الرصيد يدوياً 📨</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
