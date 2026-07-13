import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Landmark, Package, ClipboardList, CheckCircle, MapPin, Lock, ShieldCheck, LogOut, MessageSquare, Send, X } from 'lucide-react';
import { Product, ChatSession, TopUpRequest } from '../types';

interface SellerPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  sellerOrders: { id: string; date: string; items: any[]; total: number; status: string; shippingAddress?: any }[];
  onUpdateOrderStatus?: (orderId: string, status: 'Shipped' | 'Delivered') => void;
  chatSessions: ChatSession[];
  onReplyToChat: (sessionId: string, text: string) => void;
  topUpRequests: TopUpRequest[];
  onApproveTopUpRequest: (requestId: string) => void;
  onRejectTopUpRequest: (requestId: string, reason: string) => void;
}

// Preset electronics stock photos
const IMAGE_PRESETS = [
  { name: 'لوحة أردوينو تطويرية', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&auto=format&fit=crop&q=80' },
  { name: 'أوفوميتر / ملتيميتر رقمي', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { name: 'مجموعة مستشعرات ذكية', url: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=600&auto=format&fit=crop&q=80' },
  { name: 'لوحة تجارب Breadboard', url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80' },
  { name: 'جهاز راسم الإشارة (أوسيلوسكوب)', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80' },
  { name: 'كاوية لحام قصدير احترافية', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80' },
  { name: 'محرك سيرفو دقيق', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80' },
  { name: 'قطع ومكونات دقيقة', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80' },
];

const CATEGORIES = [
  'لوحات وميكروكنترولر',
  'أجهزة ومعدات قياس',
  'مستشعرات ووحدات',
  'مكونات إلكترونية',
  'أدوات لحام وتجميع',
  'محركات ومشغلات'
];

export default function SellerPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  sellerOrders,
  onUpdateOrderStatus,
  chatSessions,
  onReplyToChat,
  topUpRequests,
  onApproveTopUpRequest,
  onRejectTopUpRequest,
}: SellerPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_seller_authenticated') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'add' | 'orders' | 'chats' | 'topups'>('inventory');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [replyInput, setReplyInput] = useState<string>('');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);

  
  // Adding / Editing form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(5000);
  const [originalPrice, setOriginalPrice] = useState(6000);
  const [image, setImage] = useState(IMAGE_PRESETS[0].url);
  const [stock, setStock] = useState(10);
  const [isExpress, setIsExpress] = useState(true);

  // Specifications
  const [specs, setSpecs] = useState<[string, string][]>([
    ['سنة الموديل', '2026'],
    ['اللون', 'أسود'],
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Dashboard calculations
  const totalSalesVal = sellerOrders.reduce((sum, order) => sum + order.total, 0);
  const activeListingsCount = products.length;
  const pendingOrdersCount = sellerOrders.filter(o => o.status !== 'Delivered').length;

  const handleSelectPreset = (url: string) => {
    setImage(url);
  };

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setSpecs([...specs, [newSpecKey.trim(), newSpecVal.trim()]]);
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setEditingId('');
    setName('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setBrand('');
    setPrice(5000);
    setOriginalPrice(6000);
    setImage(IMAGE_PRESETS[0].url);
    setStock(10);
    setIsExpress(true);
    setSpecs([
      ['سنة الموديل', '2026'],
      ['اللون', 'أسود'],
    ]);
  };

  const handleEditClick = (prod: Product) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setCategory(prod.category);
    setBrand(prod.brand);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || prod.price);
    setImage(prod.image);
    setStock(prod.stock);
    setIsExpress(prod.isExpress);
    setSpecs(Object.entries(prod.specifications));
    setActiveSubTab('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    // Convert specs array back to record map
    const specificationsRecord: Record<string, string> = {};
    specs.forEach(([k, v]) => {
      specificationsRecord[k] = v;
    });

    if (isEditing) {
      const updatedProduct: Product = {
        id: editingId,
        name,
        description,
        category,
        brand,
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        image,
        stock,
        isExpress,
        specifications: specificationsRecord,
        rating: products.find(p => p.id === editingId)?.rating || 5.0,
        reviewsCount: products.find(p => p.id === editingId)?.reviewsCount || 0,
        reviews: products.find(p => p.id === editingId)?.reviews || [],
      };
      onUpdateProduct(updatedProduct);
    } else {
      const randomId = 'prod-' + Math.floor(100 + Math.random() * 900);
      const newProduct: Product = {
        id: randomId,
        name,
        description,
        category,
        brand,
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        image,
        stock,
        isExpress,
        specifications: specificationsRecord,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
      };
      onAddProduct(newProduct);
    }

    handleResetForm();
    setActiveSubTab('inventory');
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-12 px-4 font-sans text-right" dir="rtl">
        <div className="bg-[#0B192C] text-white p-6 rounded-2xl shadow-xl border border-[#1E2E44]/50 flex flex-col space-y-4">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-sky-500/10 rounded-full text-sky-400">
              <Lock size={32} />
            </div>
            <h2 className="text-lg font-black">لوحة المالك والتاجر الحصري</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              عذراً! طبقاً لتعليمات المالك لمنع عشوائية العروض، تم غلق لوحة إضافة وتعديل المنتجات والأجهزة برمز سري مخصص لمنع أي شخص غريب من العبث بمنتجات المتجر.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (pinInput === '235611') {
              setIsAuthenticated(true);
              localStorage.setItem('is_seller_authenticated', 'true');
              setPinError('');
            } else {
              setPinError('الرمز السري غير صحيح! يرجى إدخال رمز التحقق المعتمد للمتابعة.');
            }
          }} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">أدخل رمز الدخول لفتح اللوحة:</label>
              <input
                type="password"
                required
                maxLength={10}
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-white text-gray-900 border border-slate-200 rounded-xl p-2.5 text-center font-mono text-base outline-none focus:ring-2 focus:ring-sky-500 text-right"
              />
            </div>

            {pinError && (
              <p className="text-[11px] text-red-400 font-bold leading-relaxed">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-[#0B192C] font-black text-xs transition-colors cursor-pointer"
            >
              فتح اللوحة الآن 🛡️
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 font-sans text-right" dir="rtl">
      
      {/* Seller Header */}
      <div className="bg-[#0B192C] text-white p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg relative overflow-hidden border border-[#1E2E44]/50">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -ml-16 -mt-16" />
        <div className="relative z-10 text-right">
          <div className="flex items-center gap-2 mb-1.5 justify-start">
            <span className="bg-sky-500 text-[#0B192C] text-[10px] font-black px-2.5 py-0.5 rounded tracking-wider">مركز تجار حلمونة الثقة بمصر</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black">لوحة تحكم وإدارة مبيعات التاجر</h1>
          <p className="text-slate-300 text-xs mt-1 font-semibold">أهلاً بك يا مهندس عمر بيبرس. يمكنك إدارة معروضاتك بالكامل ومتابعة طلبات الشحن.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('is_seller_authenticated');
            }}
            className="bg-red-900/20 hover:bg-red-900/30 text-red-300 border border-red-900/30 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            title="تسجيل خروج التاجر لمنع التعديل"
          >
            <LogOut size={14} />
            <span>خروج المالك 🔒</span>
          </button>
          <button
            onClick={() => {
              handleResetForm();
              setActiveSubTab('add');
            }}
            className="bg-sky-500 hover:bg-sky-400 text-[#0B192C] font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition-colors shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>عرض منتج جديد بالمتجر</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">إجمالي المبيعات المستلمة</span>
            <span className="text-xl font-black text-gray-900">{totalSalesVal.toLocaleString()} ج.م</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Landmark size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">المنتجات النشطة المعروضة</span>
            <span className="text-xl font-black text-gray-900">{activeListingsCount} منتج</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">طلبات بانتظار الشحن والتسليم</span>
            <span className="text-xl font-black text-gray-900">{pendingOrdersCount} طلب</span>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <ClipboardList size={20} />
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-gray-200 mb-6 gap-6 text-sm font-bold justify-start">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`pb-3 transition-colors cursor-pointer ${activeSubTab === 'inventory' ? 'text-black border-b-2 border-black font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          منتجاتك المعروضة للبيع ({products.length})
        </button>
        <button
          onClick={() => {
            if (!isEditing) handleResetForm();
            setActiveSubTab('add');
          }}
          className={`pb-3 transition-colors cursor-pointer ${activeSubTab === 'add' ? 'text-black border-b-2 border-black font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {isEditing ? '✏️ تعديل تفاصيل هذا المنتج' : '➕ إضافة منتج إلكتروني جديد'}
        </button>
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 transition-colors cursor-pointer ${activeSubTab === 'orders' ? 'text-black border-b-2 border-black font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          طلبات المشترين بمصر ({sellerOrders.length})
        </button>
        <button
          onClick={() => setActiveSubTab('chats')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'chats' ? 'text-black border-b-2 border-black font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <MessageSquare size={16} />
          <span>محادثات العملاء الفورية ({chatSessions.length})</span>
          {chatSessions.some((s) => s.unreadCount > 0) && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">جديد</span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('topups')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'topups' ? 'text-black border-b-2 border-black font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Landmark size={16} />
          <span>طلبات شحن المحفظة ({topUpRequests.length})</span>
          {topUpRequests.some((r) => r.status === 'pending') && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">معلق</span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-right">
          {products.length === 0 ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
              <Package size={48} className="text-gray-300" />
              <p className="font-semibold text-gray-800 text-sm">لم تقم بعرض أي منتج خاص بك في المتجر حتى الآن.</p>
              <button
                onClick={() => setActiveSubTab('add')}
                className="bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] px-5 py-2 rounded-xl font-bold text-xs shadow-sm cursor-pointer"
              >
                إضافة أول منتج خاص بك
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 border-b border-gray-150 uppercase font-black text-gray-500">
                  <tr>
                    <th className="px-6 py-4 text-right">تفاصيل المنتج والماركة</th>
                    <th className="px-6 py-4 text-right">الفئة</th>
                    <th className="px-6 py-4 text-right">سعر البيع</th>
                    <th className="px-6 py-4 text-right">المخزون المتاح</th>
                    <th className="px-6 py-4 text-right">شحن سريع</th>
                    <th className="px-6 py-4 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors font-medium text-gray-700">
                      <td className="px-6 py-4 flex items-center gap-3 text-right">
                        <img src={prod.image} alt="" className="w-10 h-10 object-contain bg-white rounded border p-0.5 ml-2" referrerPolicy="no-referrer" />
                        <div className="min-w-0 max-w-xs text-right">
                          <p className="font-bold text-gray-900 truncate">{prod.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{prod.brand}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        <span>{prod.price.toLocaleString()} ج.م</span>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through block">{prod.originalPrice.toLocaleString()} ج.م</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${prod.stock === 0 ? 'text-red-600' : prod.stock <= 3 ? 'text-orange-500' : 'text-green-700'}`}>
                          {prod.stock === 0 ? 'نفد المخزون' : `${prod.stock} قطع`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold italic rounded ${prod.isExpress ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-400'}`}>
                          {prod.isExpress ? '⚡ سريع' : 'عادي'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center justify-start gap-2.5">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"
                            title="تعديل تفاصيل المنتج"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                            title="حذف المنتج من المتجر"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm max-w-4xl text-right">
          <h3 className="text-sm font-extrabold text-gray-900 tracking-wider mb-5">
            {isEditing ? 'تعديل تفاصيل المنتج المختار' : 'إدراج وعرض منتج إلكتروني جديد'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Right Fields (Form Controls) */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">اسم الجهاز / المنتج بالتفصيل</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: لوحة تطوير أردوينو أونو متوافقة مع كابل USB"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">الماركة / المصنع</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أردوينو، إسبيريسيف، هيرمان"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-right"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">الفئة</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-semibold text-gray-700 h-[38px] text-right"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">سعر البيع الحالي (ج.م)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-left"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">السعر الأصلي قبل الخصم (ج.م)</label>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">الكمية المتوفرة للبيع</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-left"
                  />
                </div>
                <div className="flex flex-col justify-end items-start">
                  <label className="flex items-center gap-2 cursor-pointer py-2 text-xs font-bold text-gray-700 justify-start">
                    <input
                      type="checkbox"
                      checked={isExpress}
                      onChange={(e) => setIsExpress(e.target.checked)}
                      className="accent-sky-600 h-4.5 w-4.5 rounded ml-1"
                    />
                    <span>شحن سريع ومضمون عبر حلمونة الثقة ⚡</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">وصف المنتج ومميزاته</label>
                <textarea
                  required
                  placeholder="اكتب تفاصيل كاملة عن المكون الإلكتروني، جهود التشغيل، والضمان بمصر..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-right"
                />
              </div>
            </div>

            {/* Left Fields: Image presets and specs */}
            <div className="space-y-4">
              {/* Image preset selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">رابط صورة المنتج</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل رابط صورة خارجية مخصصة..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-gray-900 text-left mb-3"
                />

                <span className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">أو اختر صورة احترافية جاهزة لجهازك</span>
                <div className="grid grid-cols-4 gap-2 border border-gray-150 p-2.5 rounded-xl max-h-[140px] overflow-y-auto bg-gray-50/50">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`aspect-square p-1 border rounded-lg bg-white flex items-center justify-center relative hover:border-sky-400 transition-colors ${
                        image === preset.url ? 'ring-2 ring-sky-400 border-sky-500 shadow-inner' : 'border-gray-200'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">المواصفات الفنية والتقنية الإضافية</label>
                <div className="border border-gray-150 p-3 rounded-xl bg-gray-50/50 space-y-2 mb-3">
                  {specs.length === 0 ? (
                    <span className="text-[11px] text-gray-400 italic block">لا توجد مواصفات فنية مضافة حالياً.</span>
                  ) : (
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto pl-1">
                      {specs.map(([k, v], idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-semibold bg-white border border-gray-100 rounded-md p-1.5 pr-2.5">
                          <span className="text-gray-700 truncate">{k}: <strong className="text-gray-950 font-bold">{v}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(idx)}
                            className="text-red-500 hover:text-red-700 text-[10px] hover:bg-red-50 px-1.5 py-0.5 rounded"
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="مثال: الذاكرة العشوائية"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="bg-white text-xs border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-400 outline-none font-medium text-right"
                  />
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="مثال: 12 جيجابايت"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                      className="bg-white text-xs border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-400 outline-none font-medium flex-grow text-right text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-3 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                handleResetForm();
                setActiveSubTab('inventory');
              }}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isEditing ? 'حفظ تفاصيل المنتج المحدثة 💾' : 'عرض وإطلاق المنتج للبيع الآن 🚀'}
            </button>
          </div>
        </form>
      )}

      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-right">
          {sellerOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
              <ClipboardList size={48} className="text-gray-300" />
              <p className="font-semibold text-gray-800 text-sm">لا توجد طلبات شراء مسجلة من عملائك بعد.</p>
              <p className="text-[11px] text-gray-400 max-w-sm">عندما يقوم المشتري بتأكيد طلبه من واجهة المتجر، فإنه يظهر تلقائياً هنا لتتمكن من شحن الطلب وتحديث حالته!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sellerOrders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/20 transition-colors">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <span className="font-black text-xs text-gray-900">رقم الطلب: {order.id}</span>
                      <span className="text-[10px] text-gray-400 font-bold">({order.date})</span>
                    </div>

                    {order.shippingAddress && (
                      <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
                        <p><span className="font-bold">المستلم:</span> {order.shippingAddress.fullName} | {order.shippingAddress.phone}</p>
                        <p><span className="font-bold">العنوان:</span> {order.shippingAddress.addressLine}، {order.shippingAddress.city}</p>
                      </div>
                    )}
                    
                    {/* Order items list */}
                    <div className="flex flex-wrap gap-1.5 mt-2 justify-start">
                      {order.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-md py-1 px-2 text-[10px] font-bold text-gray-700">
                          <img src={it.product.image} alt="" className="w-4 h-4 object-contain ml-1" referrerPolicy="no-referrer" />
                          <span className="truncate max-w-[120px]">{it.product.name}</span>
                          <span className="text-gray-400 mr-1">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold block">مجموع المستحقات</span>
                      <strong className="text-xs font-black text-gray-900">{order.total.toLocaleString()} ج.م</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : order.status === 'Shipped' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'Pending' ? 'قيد المعالجة' : order.status === 'Shipped' ? 'تم الشحن' : 'تم التسليم'}
                      </span>

                      {onUpdateOrderStatus && order.status !== 'Delivered' && (
                        <button
                          onClick={() => onUpdateOrderStatus(
                            order.id, 
                            order.status === 'Pending' ? 'Shipped' : 'Delivered'
                          )}
                          className="bg-black text-white hover:bg-gray-900 text-[10px] font-bold py-1 px-2.5 rounded transition-colors cursor-pointer"
                        >
                          {order.status === 'Pending' ? 'تأكيد الشحن ⚡' : 'تأكيد التسليم للعميل'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'chats' && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          {/* Right side: Sessions List */}
          <div className="md:col-span-1 border-l border-gray-150 flex flex-col bg-slate-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-extrabold text-xs text-gray-700">المحادثات الواردة ({chatSessions.length})</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">انقر على العميل لبدء الرد عليه مباشرة.</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {chatSessions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 space-y-2">
                  <MessageSquare size={32} className="mx-auto text-gray-300" />
                  <p className="text-xs font-bold">لا توجد محادثات نشطة حالياً</p>
                  <p className="text-[10px] text-gray-400">ستظهر رسائل المشترين هنا فور تواصلهم معك.</p>
                </div>
              ) : (
                chatSessions.map((session) => {
                  const isSelected = session.id === selectedSessionId;
                  return (
                    <button
                      key={session.id}
                      onClick={() => {
                        setSelectedSessionId(session.id);
                        // Mark as read immediately on click
                        session.unreadCount = 0;
                      }}
                      className={`w-full text-right p-4 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                        isSelected ? 'bg-sky-50' : 'hover:bg-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                          {session.clientName}
                          {session.unreadCount > 0 && (
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                          )}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">{session.lastMessageTime}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">{session.clientPhone}</div>
                      <p className="text-[10px] text-gray-400 truncate max-w-full font-medium">
                        {session.lastMessageText || 'لا توجد رسائل بعد'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Left side: Active Conversation Chat */}
          <div className="md:col-span-2 flex flex-col h-[500px] bg-white">
            {selectedSessionId && chatSessions.find((s) => s.id === selectedSessionId) ? (() => {
              const session = chatSessions.find((s) => s.id === selectedSessionId)!;
              return (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-150 flex justify-between items-center bg-slate-50 shrink-0">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">محادثة: {session.clientName}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">الهاتف: {session.clientPhone}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      خط اتصال مباشر 🛡️
                    </span>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 flex flex-col">
                    {session.messages.map((msg) => {
                      const isSeller = msg.sender === 'seller';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${isSeller ? 'self-start' : 'self-end'}`}
                        >
                          <span className="text-[9px] text-gray-400 font-bold mb-0.5 px-1">
                            {isSeller ? 'أنت (المهندس عمر بيبرس)' : session.clientName}
                          </span>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                              isSeller
                                ? 'bg-[#0B192C] text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[8px] text-gray-400 font-mono mt-1 text-left px-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!replyInput.trim()) return;
                      onReplyToChat(session.id, replyInput.trim());
                      setReplyInput('');
                    }}
                    className="p-3 border-t border-gray-150 flex gap-2 bg-white shrink-0"
                  >
                    <input
                      type="text"
                      required
                      placeholder={`اكتب ردك للمشتري ${session.clientName} هنا...`}
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="flex-1 bg-slate-50 text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-600 text-[#0B192C] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>إرسال الرد</span>
                      <Send size={14} className="rotate-180" />
                    </button>
                  </form>
                </>
              );
            })() : (
              <div className="m-auto text-center text-gray-400 space-y-3 p-8">
                <MessageSquare size={48} className="mx-auto text-gray-250 animate-pulse text-sky-500" />
                <p className="text-xs font-extrabold text-gray-700">لم يتم تحديد أي محادثة للرد عليها</p>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                  الرجاء النقر على اسم العميل من القائمة الجانبية في اليمين لعرض تفاصيل رسائله ومساعدته فورياً.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'topups' && (
        <div className="space-y-6 text-right font-sans" dir="rtl">
          {/* Dashboard Header Info */}
          <div className="bg-[#0B192C] text-white p-6 rounded-2xl border border-sky-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                <Landmark className="text-sky-400" size={20} />
                <span>نظام إدارة شحن المحافظ المالي اليدوي المباشر بمصر</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-medium">
                هنا تظهر طلبات الشحن التي قام بها المشترون عن طريق إرسال الأموال مباشرة إلى حسابك الخاص (فودافون كاش، إنستاباي، أو فوري). عندما تراجع حسابك وتتأكد من استلام المبلغ على هاتفك، اضغط على <strong>"تأكيد وموافقة"</strong> ليتم تفعيل رصيد المشتري فورياً.
              </p>
            </div>
            <div className="bg-sky-500/15 text-sky-400 px-3.5 py-2 rounded-xl text-[11px] font-bold border border-sky-500/20 leading-relaxed max-w-xs self-start md:self-center">
              💡 الأموال تذهب مباشرة لـ فودافون كاش أو إنستاباي الخاص بك، والموقع هنا يعمل كلوحة تحكم لتأكيد الرصيد وتفعيله للعملاء.
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 overflow-hidden">
            <h4 className="text-sm font-black text-slate-800 mb-4">طلبات التحويل والشحن الواردة</h4>
            
            {topUpRequests.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Landmark size={44} className="mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-bold text-gray-700">لا يوجد أي طلبات شحن حالياً</p>
                <p className="text-[10px] text-gray-400 mt-1">سيتم سرد أي طلبات يرسلها العملاء بعد إيداع الأموال هنا.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-150 text-slate-400 font-extrabold pb-3 text-right">
                      <th className="pb-3 pt-1 pr-2">المشتري</th>
                      <th className="pb-3 pt-1">المبلغ المطلوب</th>
                      <th className="pb-3 pt-1">طريقة التحويل</th>
                      <th className="pb-3 pt-1">رقم/مرجع العملية</th>
                      <th className="pb-3 pt-1">التاريخ والوقت</th>
                      <th className="pb-3 pt-1">حالة الطلب</th>
                      <th className="pb-3 pt-1 pl-2 text-left">التحكم والإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topUpRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        {/* Client details */}
                        <td className="py-4 pr-2">
                          <span className="font-extrabold text-slate-800 block text-xs">{req.clientName}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{req.clientPhone}</span>
                        </td>
                        
                        {/* Amount */}
                        <td className="py-4 font-black text-emerald-700 text-xs">
                          {req.amount.toLocaleString()} ج.م
                        </td>
                        
                        {/* Method */}
                        <td className="py-4">
                          {req.paymentMethod === 'vodafone_cash' ? (
                            <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-1 rounded-full border border-red-100">
                              🔴 فودافون كاش بمصر
                            </span>
                          ) : req.paymentMethod === 'instapay' ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-100">
                              ⚡ إنستاباي InstaPay
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded-full border border-yellow-200">
                              🔸 فوري مباشر
                            </span>
                          )}
                        </td>
                        
                        {/* Transaction ID */}
                        <td className="py-4 text-slate-700">
                          {req.receiptImage ? (
                            <div className="flex items-center gap-2 justify-start">
                              <img 
                                src={req.receiptImage} 
                                alt="Receipt Thumbnail" 
                                className="w-8 h-8 rounded border border-gray-200 object-cover cursor-pointer hover:scale-105 transition-all ml-1.5"
                                onClick={() => setViewingReceiptUrl(req.receiptImage!)}
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setViewingReceiptUrl(req.receiptImage!)}
                                className="text-[10px] font-black text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                              >
                                عرض الإيصال 🖼️
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-[11px] text-gray-400 italic">
                              {req.transactionId || 'لم يتم إرفاق إيصال'}
                            </span>
                          )}
                        </td>
                        
                        {/* Date */}
                        <td className="py-4 text-gray-500 font-semibold">
                          {req.date}
                        </td>
                        
                        {/* Status */}
                        <td className="py-4">
                          {req.status === 'pending' && (
                            <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full border border-amber-100 animate-pulse">
                              ⏳ قيد المراجعة
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-1 rounded-full border border-green-100">
                              ✅ تم تأكيد الشحن
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <div className="space-y-1">
                              <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-1 rounded-full border border-red-100">
                                ❌ مرفوض
                              </span>
                              {req.rejectionReason && (
                                <p className="text-[9px] text-red-500 font-bold max-w-[150px] leading-relaxed">
                                  السبب: {req.rejectionReason}
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                        
                        {/* Actions */}
                        <td className="py-4 pl-2 text-left">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              {/* Rejection input field trigger */}
                              {rejectionReasons[req.id] !== undefined ? (
                                <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-150">
                                  <input
                                    type="text"
                                    placeholder="اكتب سبب الرفض هنا..."
                                    value={rejectionReasons[req.id]}
                                    onChange={(e) => setRejectionReasons({ ...rejectionReasons, [req.id]: e.target.value })}
                                    className="bg-white border border-red-200 rounded-lg p-1.5 text-[10px] font-bold outline-none focus:ring-1 focus:ring-red-400 w-36"
                                  />
                                  <button
                                    onClick={() => {
                                      if (!rejectionReasons[req.id].trim()) {
                                        alert('الرجاء كتابة سبب الرفض لتوضيحه للمشتري');
                                        return;
                                      }
                                      onRejectTopUpRequest(req.id, rejectionReasons[req.id]);
                                      // Remove key from rejectionReasons state
                                      const updated = { ...rejectionReasons };
                                      delete updated[req.id];
                                      setRejectionReasons(updated);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
                                  >
                                    تأكيد الرفض
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updated = { ...rejectionReasons };
                                      delete updated[req.id];
                                      setRejectionReasons(updated);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 font-bold text-[10px] px-1"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => onApproveTopUpRequest(req.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-[10px] py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                                  >
                                    <ShieldCheck size={12} />
                                    <span>تأكيد وموافقة ✔️</span>
                                  </button>
                                  <button
                                    onClick={() => setRejectionReasons({ ...rejectionReasons, [req.id]: '' })}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold text-[10px] py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    رفض
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 font-semibold text-[10px] italic">مكتمل</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Lightbox Modal for Receipt Images */}
      {viewingReceiptUrl && (
        <div 
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4"
          onClick={() => setViewingReceiptUrl(null)}
        >
          <div 
            className="relative bg-white rounded-2xl max-w-2xl w-full p-4 overflow-hidden shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200 text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex justify-between items-center w-full pb-3 border-b border-gray-100 mb-4">
              <span className="font-black text-sm text-[#0B192C]">إيصال تحويل المشتري المعلق 📋</span>
              <button
                onClick={() => setViewingReceiptUrl(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="w-full max-h-[70vh] overflow-auto flex justify-center items-center bg-slate-950 rounded-xl border border-slate-900 p-2">
              <img 
                src={viewingReceiptUrl} 
                alt="Receipt Full View" 
                className="max-h-[65vh] max-w-full object-contain rounded-lg" 
                referrerPolicy="no-referrer"
              />
            </div>
            
            <p className="text-[10px] text-gray-400 mt-3 text-center">
              💡 يرجى مطابقة بيانات مرسل التحويل والمبلغ في الإيصال مع رصيد حسابك المالي الفعلي قبل التأكيد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
