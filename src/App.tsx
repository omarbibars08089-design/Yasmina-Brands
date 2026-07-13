import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Star, Package, Sparkles } from 'lucide-react';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Product, CartItem, Order, Review, ChatMessage, ChatSession, TopUpRequest } from './types';

// Import our modular components
import Header from './components/Header';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import SellerPanel from './components/SellerPanel';
import MyOrders from './components/MyOrders';
import WalletModal from './components/WalletModal';
import CustomerChatWidget from './components/CustomerChatWidget';

export default function App() {
  // --- Persistent States from LocalStorage ---
  
  // Products list (merges preset with seller's custom additions)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('noon-products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading products from localstorage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('noon-cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading cart from localstorage', e);
      }
    }
    return [];
  });

  // Orders list placed by the buyer
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('noon-orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading orders from localstorage', e);
      }
    }
    return [];
  });

  // Location for delivery state (restricted to Egypt)
  const [deliveryLocation, setDeliveryLocation] = useState<string>(() => {
    return localStorage.getItem('delivery-location') || 'القاهرة، مصر';
  });

  // Navigation and Filtering States
  const [currentTab, setCurrentTab] = useState<'shop' | 'seller' | 'orders'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  
  // Dynamic Max Price Calculation in EGP
  const maxPriceLimit = useMemo(() => {
    if (products.length === 0) return 50000;
    return Math.max(...products.map((p) => p.price), 50000);
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  // Adjust price range slider when maxPrice changes
  useEffect(() => {
    setPriceRange([0, maxPriceLimit]);
  }, [maxPriceLimit]);

  // Modals & Drawers States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Wallet balance state (Egypt currency, EGP)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('noon-wallet-balance-v3');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) return parsed;
    }
    return 0; // Default wallet balance is 0 as requested
  });

  // Live Chat Sessions State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('noon-chat-sessions-v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing chat sessions', e);
      }
    }
    return [
      {
        id: 'session-demo-1',
        clientName: 'أحمد المصري (تجربة)',
        clientPhone: '01012345678',
        messages: [
          {
            id: 'demo-msg-1',
            sender: 'client',
            text: 'السلام عليكم يا بشمهندس عمر، هل يتوفر لديكم بوردة أردوينو أونو أصلية ومستشعر مسافات فوق صوتية في المخزن حالياً؟',
            timestamp: '10:45 ص'
          }
        ],
        lastMessageText: 'السلام عليكم يا بشمهندس عمر، هل يتوفر لديكم بوردة أردوينو أونو أصلية ومستشعر مسافات فوق صوتية في المخزن حالياً؟',
        lastMessageTime: '10:45 ص',
        unreadCount: 1
      }
    ];
  });

  // Pending and historic wallet top-up requests (Vodafone Cash, Fawry, InstaPay)
  const [topUpRequests, setTopUpRequests] = useState<TopUpRequest[]>(() => {
    const saved = localStorage.getItem('noon-top-up-requests-v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing top up requests', e);
      }
    }
    return [
      {
        id: 'topup-demo-1',
        clientName: 'أحمد المصري',
        clientPhone: '01012345678',
        amount: 500,
        paymentMethod: 'vodafone_cash',
        transactionId: '74829374920',
        status: 'pending',
        date: '2026-07-13 11:20 ص'
      },
      {
        id: 'topup-demo-2',
        clientName: 'كريم الجارحي',
        clientPhone: '01122334455',
        amount: 1200,
        paymentMethod: 'instapay',
        transactionId: 'TXN-9821-IP',
        status: 'approved',
        date: '2026-07-12 04:15 م'
      }
    ];
  });

  // --- Synchronization Effects ---
  useEffect(() => {
    localStorage.setItem('noon-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('noon-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('noon-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('noon-chat-sessions-v3', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('noon-top-up-requests-v3', JSON.stringify(topUpRequests));
  }, [topUpRequests]);


  useEffect(() => {
    localStorage.setItem('delivery-location', deliveryLocation);
  }, [deliveryLocation]);

  useEffect(() => {
    localStorage.setItem('noon-wallet-balance-v3', walletBalance.toString());
  }, [walletBalance]);

  // --- Live Chat Handlers ---
  const handleStartSession = (name: string, phone: string) => {
    const existing = chatSessions.find((s) => s.clientPhone === phone);
    if (existing) {
      return existing.id;
    }

    const newId = `session-${Date.now()}`;
    const timeString = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const newSession: ChatSession = {
      id: newId,
      clientName: name,
      clientPhone: phone,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'seller',
          text: `مرحباً بك يا ${name}! أنا المهندس عمر بيبرس. لقد تلقيت اتصالك، وسأقوم بالرد عليك شخصياً ومساعدتك في توفير أي قطع أو مكونات إلكترونية تحتاجها فوراً. كيف يمكنني خدمتك اليوم؟ 💡⚡`,
          timestamp: timeString
        }
      ],
      lastMessageText: `مرحباً بك يا ${name}! أنا المهندس عمر بيبرس...`,
      lastMessageTime: timeString,
      unreadCount: 0
    };

    setChatSessions((prev) => [newSession, ...prev]);
    return newId;
  };

  const handleSendMessage = (sessionId: string, text: string, sender: 'client' | 'seller') => {
    const timeString = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;

        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender,
          text,
          timestamp: timeString,
        };

        const updatedMessages = [...session.messages, newMsg];
        return {
          ...session,
          messages: updatedMessages,
          lastMessageText: text,
          lastMessageTime: timeString,
          unreadCount: sender === 'client' ? session.unreadCount + 1 : 0,
        };
      })
    );
  };

  const handleReplyToChat = (sessionId: string, text: string) => {
    handleSendMessage(sessionId, text, 'seller');
  };

  // --- Manual Wallet Top Up Request Handlers ---
  const handleCreateTopUpRequest = (reqData: Omit<TopUpRequest, 'id' | 'status' | 'date'>) => {
    const today = new Date().toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newRequest: TopUpRequest = {
      id: 'topup-' + Date.now(),
      status: 'pending',
      date: today,
      ...reqData,
    };
    setTopUpRequests((prev) => [newRequest, ...prev]);
  };

  const handleApproveTopUpRequest = (requestId: string) => {
    setTopUpRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        // Directly increment the wallet balance
        setWalletBalance((balance) => balance + req.amount);
        return { ...req, status: 'approved' };
      })
    );
  };

  const handleRejectTopUpRequest = (requestId: string, reason: string) => {
    setTopUpRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'rejected', rejectionReason: reason } : req))
    );
  };


  // --- Geolocation Request API ---
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('متصفحك لا يدعم خاصية تحديد الموقع الجغرافي.');
      return;
    }

    setDeliveryLocation('جاري تحديد موقعك الجغرافي بمصر...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setDeliveryLocation(`📍 إحداثيات (${lat}، ${lon}) - مصر`);
      },
      (error) => {
        console.error('Error fetching geolocation', error);
        setDeliveryLocation('القاهرة، مصر');
        alert('لم نتمكن من تحديد موقعك الحالي. يرجى تفعيل الـ GPS والسماح بالوصول للموقع.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // --- Dynamic Constants ---
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const allBrands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Brand checkbox filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price range slider filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrands, priceRange, sortBy]);

  // --- Interactive Actions Handler ---

  const handleAddToCart = (product: Product, quantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Avoid triggering open modal details
    }
    
    // Check if item is already in cart
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty <= product.stock) {
        setCart(
          cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQty } : item
          )
        );
      }
    } else {
      if (quantity <= product.stock) {
        setCart([...cart, { product, quantity }]);
      }
    }
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity >= 1 && quantity <= product.stock) {
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleAddReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const randomRevId = 'rev-' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const newReview: Review = {
      id: randomRevId,
      date: today,
      ...reviewData,
    };

    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...(p.reviews || [])];
          // Recalculate average rating
          const avgRating = Number(
            (
              updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
              updatedReviews.length
            ).toFixed(1)
          );

          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating,
          };
        }
        return p;
      })
    );

    // Also update selectedProduct state to render immediately
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        const updatedReviews = [newReview, ...(prev.reviews || [])];
        const avgRating = Number(
          (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
            updatedReviews.length
          ).toFixed(1)
        );
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avgRating,
        };
      });
    }
  };

  // Place order
  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const randomOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newOrder: Order = {
      id: randomOrderId,
      date: today,
      status: 'Pending',
      ...orderData,
    };

    // Deduct stock for ordered items
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderedItem = orderData.items.find((item) => item.product.id === p.id);
        if (orderedItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - orderedItem.quantity),
          };
        }
        return p;
      })
    );

    // Deduct wallet balance securely
    setWalletBalance((prev) => {
      const remaining = prev - orderData.total;
      return remaining >= 0 ? remaining : 0;
    });

    setOrders([newOrder, ...orders]);
    setCart([]); // Clear the cart after ordering
  };

  // Wallet top up handler
  const handleTopUp = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
  };

  // Merchant Portal Order Status Update
  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'Shipped' | 'Delivered') => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  // Seller Dashboard products CRUD
  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(products.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] flex flex-col font-sans antialiased text-gray-900 selection:bg-sky-200" dir="rtl">
      
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        deliveryLocation={deliveryLocation}
        onRequestLocation={handleRequestLocation}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-grow">
        {currentTab === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            
            {/* Top Carousel Banner (Beautiful Hero Image) */}
            <div className="bg-gradient-to-r from-[#0B192C] via-[#1E2E44] to-[#0B192C] rounded-2xl p-6 md:p-8 mb-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative text-right border border-[#1E2E44]/50">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="max-w-lg z-10">
                <span className="bg-sky-500 text-[#0B192C] text-[9px] font-black tracking-widest px-2.5 py-1 rounded mb-3 inline-block">توصيل مضمون داخل مصر 🇪🇬</span>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  ارتقِ بمشاريعك الإلكترونية اليوم!
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 font-medium max-w-sm">
                  اكتشف أحدث المكونات الإلكترونية، لوحات الأردوينو، المستشعرات، ومعدات التطوير والقطع الدقيقة من حلمونة الثقة مع شحن سريع وتوصيل آمن لجميع المحافظات بمصر.
                </p>
                <div className="flex gap-4 mt-5 text-[10px] sm:text-xs font-bold text-white justify-start">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
                    ⚡ شحن حلمونة السريع
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
                    🛡️ ضمان رسمي معتمد بمصر
                  </div>
                </div>
              </div>

              {/* Decorative Banner Image */}
              <div className="relative h-32 md:h-44 w-full md:w-80 flex items-center justify-center bg-transparent z-10">
                <img 
                  src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&auto=format&fit=crop&q=80" 
                  alt="أجهزة تقنية" 
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-2xl hover:rotate-3 transition-transform duration-300" 
                />
              </div>
            </div>

            {/* Marketplace Grid System: Filters & Products */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1 lg:sticky lg:top-4">
                <Filters
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  allBrands={allBrands}
                  maxPrice={maxPriceLimit}
                />
              </div>

              {/* Product Grid */}
              <div className="lg:col-span-3">
                
                {/* Grid header metrics */}
                <div className="flex items-center justify-between mb-4.5 px-1.5 flex-row-reverse">
                  <p className="text-xs font-bold text-gray-500">
                    نعرض لكم <span className="text-black font-black">{filteredProducts.length}</span> من الأجهزة الإلكترونية الممتازة في مصر
                  </p>
                  
                  {selectedCategory !== 'All' && (
                    <span className="bg-black text-white text-[10px] font-black py-1 px-3 rounded-full">
                      الفئة: {selectedCategory}
                    </span>
                  )}
                </div>

                {/* Grid layout */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center gap-4">
                    <Package size={44} className="text-gray-300" />
                    <div>
                      <h3 className="font-extrabold text-gray-800 text-sm mb-1">لم يتم العثور على أي نتائج</h3>
                      <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto leading-relaxed">
                        عذراً، لم نتمكن من العثور على أي أجهزة إلكترونية تطابق خيارات التصفية أو الميزانية المحددة. جرب ضبط الفلاتر أو إعادة تعيين السعر!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onOpenDetails={(p) => setSelectedProduct(p)}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'seller' && (
          <SellerPanel
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            sellerOrders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            chatSessions={chatSessions}
            onReplyToChat={handleReplyToChat}
            topUpRequests={topUpRequests}
            onApproveTopUpRequest={handleApproveTopUpRequest}
            onRejectTopUpRequest={handleRejectTopUpRequest}
          />
        )}

        {currentTab === 'orders' && (
          <MyOrders
            orders={orders}
            onOpenShop={() => setCurrentTab('shop')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-150 py-8 px-4 md:px-8 mt-12 text-xs text-gray-500 text-right" dir="rtl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-bold text-black text-sm justify-start">
            <span className="bg-[#0B192C] text-white px-2.5 py-0.5 rounded text-xs font-black">حلمونة الثقة</span>
            <span>بوابة الإلكترونيات المعتمدة بمصر 🇪🇬</span>
          </div>

          <p className="text-center md:text-left font-semibold">
            © {new Date().getFullYear()} حلمونة الثقة للإلكترونيات. منصة تجارة إلكترونية آمنة وموثوقة 100%. جميع الحقوق محفوظة للعلامة التجارية في جمهورية مصر العربية.
          </p>
        </div>
      </footer>

      {/* --- Overlay Modals & Drawers --- */}

      {/* Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, quantity) => handleAddToCart(product, quantity)}
          onAddReview={handleAddReview}
        />
      )}

      {/* Cart side Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout wizard */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        onViewOrders={() => setCurrentTab('orders')}
        walletBalance={walletBalance}
        onOpenWallet={() => {
          setIsCheckoutOpen(false);
          setIsWalletOpen(true);
        }}
      />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        walletBalance={walletBalance}
        onTopUp={handleTopUp}
        onSubmitTopUpRequest={handleCreateTopUpRequest}
      />

      {/* Floating Live Chat Widget */}
      <CustomerChatWidget
        chatSessions={chatSessions}
        onStartSession={handleStartSession}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
