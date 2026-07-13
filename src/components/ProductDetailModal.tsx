import React, { useState } from 'react';
import { X, Star, ShoppingCart, Shield, Truck, RefreshCw, Send } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onAddReview,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice 
    ? Math.round((savings / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = (val: number) => {
    if (val >= 1 && val <= product.stock) {
      setQuantity(val);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    
    onAddReview(product.id, {
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });

    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      {/* Modal Card */}
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        id="product-details-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-6 md:p-8 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image Container */}
              <div className="w-full aspect-square bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
                <img
                  src={selectedImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin justify-end">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg border p-1 flex items-center justify-center bg-white cursor-pointer ${
                        selectedImage === img ? 'border-sky-500 ring-2 ring-sky-400/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail-${idx}`}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Specs and Adding Section */}
            <div className="flex flex-col">
              {/* Brand & Category */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#7e858a]">
                  {product.brand}
                </span>
                <span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-3 text-right">
                {product.name}
              </h1>

              {/* Reviews count & Express Badge */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 justify-start">
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold text-xs">
                  <span>{product.rating}</span>
                  <Star size={12} className="fill-green-700 stroke-green-700" />
                </div>
                <span className="text-xs text-gray-400 font-bold">
                  ({product.reviewsCount} تقييم من المشترين بمصر)
                </span>
                {product.isExpress && (
                  <span className="mr-auto bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded italic leading-tight uppercase tracking-wider">
                    ⚡ شحن سريع ومضمون
                  </span>
                )}
              </div>

              {/* Pricing Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
                <div className="flex items-baseline gap-2 justify-start">
                  <span className="text-2xl md:text-3xl font-black text-gray-900">
                    {product.price.toLocaleString()} ج.م
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                      {product.originalPrice.toLocaleString()} ج.م
                    </span>
                  )}
                </div>

                {product.originalPrice && (
                  <div className="flex items-center gap-2 mt-1.5 justify-start">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                      خصم {discountPercent}%
                    </span>
                    <span className="text-xs text-red-600 font-bold">
                      لقد وفرت {savings.toLocaleString()} ج.م من السعر الأصلي!
                    </span>
                  </div>
                )}

                <div className="text-[11px] text-gray-400 mt-2 font-medium text-right">
                  الأسعار شاملة ضريبة القيمة المضافة في مصر. تسليم سريع ومباشر من مخازن حلمونة الثقة المعتمدة.
                </div>
              </div>

              {/* Purchase Section */}
              <div className="flex flex-col gap-4 pb-6 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-4 justify-start">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">الكمية المطلوبة:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3.5 py-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 text-sm font-bold text-gray-800 text-center select-none min-w-[40px]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-3.5 py-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    ({product.stock === 0 ? 'نفد المخزون' : `متوفر فقط ${product.stock} قطع بالمخزن`})
                  </span>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  disabled={product.stock === 0}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                    product.stock === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] active:scale-99 font-black'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>{product.stock === 0 ? 'نفد من المخزن مؤقتاً' : 'إضافة إلى عربة التسوق 🛒'}</span>
                </button>
              </div>

              {/* Delivery info & guarantees */}
              <div className="grid grid-cols-3 gap-3 text-[10px] sm:text-xs text-gray-500 font-bold">
                <div className="flex flex-col items-center text-center p-2.5 bg-gray-50 rounded-lg">
                  <Truck size={16} className="text-sky-600 fill-slate-900 stroke-slate-900 mb-1.5" />
                  <span className="font-bold text-gray-700">شحن سريع بمصر</span>
                  <span className="text-[10px] text-gray-400 font-normal">مجاني فوق 10,000 ج.م</span>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 bg-gray-50 rounded-lg">
                  <Shield size={16} className="text-sky-600 fill-slate-900 stroke-slate-900 mb-1.5" />
                  <span className="font-bold text-gray-700">ضمان سنة معتمد</span>
                  <span className="text-[10px] text-gray-400 font-normal">وكيل رسمي بمصر</span>
                </div>
                <div className="flex flex-col items-center text-center p-2.5 bg-gray-50 rounded-lg">
                  <RefreshCw size={16} className="text-sky-600 fill-slate-900 stroke-slate-900 mb-1.5" />
                  <span className="font-bold text-gray-700">إرجاع سهل ومضمون</span>
                  <span className="text-[10px] text-gray-400 font-normal">خلال 15 يوماً من الاستلام</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section: Description & Reviews */}
          <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
            {/* Description & Technical Specs */}
            <div className="text-right">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3">
                نظرة عامة على هذا الجهاز
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6 font-medium">
                {product.description}
              </p>

              <h3 className="text-sm font-extrabold text-gray-900 mb-3">
                المواصفات الفنية والتقنية للمنتج
              </h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-right">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr 
                        key={key} 
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                      >
                        <td className="px-4 py-2.5 font-bold text-gray-700 border-b border-gray-100/50 w-1/3">
                          {key}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600 border-b border-gray-100/50">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="flex flex-col text-right">
              <h3 className="text-sm font-extrabold text-gray-900 mb-4">
                تقييمات وآراء العملاء بمصر
              </h3>

              {/* Reviews List */}
              <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pl-2 mb-6 border-b border-gray-100 pb-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="bg-gray-50 rounded-xl p-3.5 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-gray-800">{rev.userName}</span>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2 text-amber-500 justify-start">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 leading-relaxed font-semibold">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-6">
                    لا توجد تقييمات لهذا المنتج بعد. كن أول من يشاركنا رأيه وتجربته!
                  </p>
                )}
              </div>

              {/* Write a Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-gray-50/75 border border-gray-100 rounded-xl p-4 text-right">
                <h4 className="text-xs font-extrabold text-gray-800 mb-3">
                  اكتب تقييمك الخاص للمنتج
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">اسمك الكامل</label>
                    <input
                      type="text"
                      placeholder="مثال: أحمد عبد الله"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-400 outline-none text-right"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">تقييمك بالنجوم</label>
                    <div className="flex items-center gap-1 h-[34px] justify-start">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewRating(i + 1)}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star 
                            size={18} 
                            className={i < reviewRating ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-3.5">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">تفاصيل تجربتك ورأيك بالجهاز</label>
                  <textarea
                    placeholder="اكتب هنا ما أعجبك وما لم يعجبك في هذا الجهاز الإلكتروني بالتفصيل..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={2}
                    className="w-full bg-white text-xs border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-sky-400 outline-none resize-none text-right"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#0B192C] hover:bg-sky-500 text-white hover:text-[#0B192C] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send size={12} />
                  <span>إرسال تقييمي للمنتج 📤</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
