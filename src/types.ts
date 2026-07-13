export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  isExpress: boolean;
  stock: number;
  specifications: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'seller';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string; // client unique identifier (phone or random ID)
  clientName: string;
  clientPhone: string;
  messages: ChatMessage[];
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface TopUpRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  paymentMethod: 'vodafone_cash' | 'instapay' | 'fawry';
  transactionId?: string; // The transaction ID (رقم العملية / المرجع) - اختياري الآن
  receiptImage?: string; // Base64 screenshot or placeholder
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  rejectionReason?: string;
}

