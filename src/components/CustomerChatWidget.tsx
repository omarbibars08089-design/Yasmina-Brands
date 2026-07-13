import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, Phone, ShieldCheck, CheckCheck, Loader2 } from 'lucide-react';
import { ChatMessage, ChatSession } from '../types';

interface CustomerChatWidgetProps {
  chatSessions: ChatSession[];
  onStartSession: (name: string, phone: string) => string;
  onSendMessage: (sessionId: string, text: string, sender: 'client' | 'seller') => void;
}

export default function CustomerChatWidget({
  chatSessions,
  onStartSession,
  onSendMessage,
}: CustomerChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState(() => localStorage.getItem('chat-client-name') || '');
  const [clientPhone, setClientPhone] = useState(() => localStorage.getItem('chat-client-phone') || '');
  const [activeSessionId, setActiveSessionId] = useState(() => localStorage.getItem('chat-active-session-id') || '');
  const [messageInput, setMessageInput] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find current active session
  const currentSession = chatSessions.find((s) => s.id === activeSessionId);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages, isOpen]);

  // Keep track of session in localStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('chat-active-session-id', activeSessionId);
    }
  }, [activeSessionId]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    setIsStarting(true);
    setTimeout(() => {
      localStorage.setItem('chat-client-name', clientName);
      localStorage.setItem('chat-client-phone', clientPhone);
      
      const sessId = onStartSession(clientName, clientPhone);
      setActiveSessionId(sessId);
      setIsStarting(false);
    }, 1000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeSessionId) return;

    onSendMessage(activeSessionId, messageInput.trim(), 'client');
    setMessageInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-right" dir="rtl">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer flex items-center justify-center relative group"
          id="live-chat-trigger"
        >
          <MessageSquare size={26} className="animate-pulse" />
          
          {/* Badge for unread replies from the merchant */}
          {currentSession && currentSession.messages.filter(m => m.sender === 'seller').length > 0 && (
            <span className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow animate-bounce">
              !
            </span>
          )}

          {/* Tooltip */}
          <span className="absolute right-16 bg-[#0B192C] text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
            تحدث مباشرة مع م. عمر بيبرس 💬
          </span>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[380px] h-[520px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
          
          {/* Chat Header */}
          <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between border-b border-[#1E2E44]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center border border-emerald-400">
                  م.ع
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#0B192C]"></span>
              </div>
              <div className="text-right">
                <h3 className="font-extrabold text-sm text-white">المهندس عمر بيبرس</h3>
                <span className="text-[10px] text-emerald-400 font-bold block">متصل الآن - مالك المتجر ⚡</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Secure Trust Indicator banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center gap-2 text-[10px] text-emerald-800 font-bold justify-start">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>محادثة مشفرة آمنة ومباشرة مع إدارة حلمونة الثقة بمصر.</span>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col space-y-3.5">
            {!activeSessionId ? (
              /* Phase 1: Onboarding / Identity verification form */
              <div className="my-auto space-y-4 py-4 px-2">
                <div className="text-center space-y-2">
                  <h4 className="font-black text-gray-800 text-sm">مرحباً بك في المحادثة المباشرة!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    يرجى إدخال اسمك ورقم هاتفك بمصر للتواصل المباشر والآمن مع م. عمر بيبرس لحل استفسارك فوراً وتوفير المكونات المطلوبة.
                  </p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1">الاسم الكريم:</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="مثال: أحمد محمد"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-white text-xs border border-gray-200 rounded-xl p-2.5 pr-9 focus:ring-1 focus:ring-emerald-500 outline-none font-semibold text-right"
                      />
                      <User size={14} className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1">رقم الهاتف بمصر للتواصل:</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={11}
                        placeholder="مثال: 01012345678"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-white text-xs border border-gray-200 rounded-xl p-2.5 pr-9 focus:ring-1 focus:ring-emerald-500 outline-none font-mono text-left text-right"
                      />
                      <Phone size={14} className="absolute right-3 top-3.5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isStarting}
                    className="w-full bg-[#0B192C] hover:bg-emerald-600 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>جاري بدء خط الاتصال المباشر...</span>
                      </>
                    ) : (
                      <span>بدء المحادثة الفورية الآن 💬</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Phase 2: Active chat history */
              <>
                {/* Intro message */}
                <div className="bg-white border border-gray-150 p-3.5 rounded-2xl text-xs space-y-1.5 shadow-sm text-right">
                  <span className="font-extrabold text-gray-800 block text-[11px]">مرحباً {clientName} 👋</span>
                  <p className="text-gray-500 leading-relaxed font-semibold">
                    رسائلك تصل الآن مباشرة إلى المهندس عمر بيبرس. لا تتردد في طلب القطع أو الاستفسار عن كود التحقق أو شحن المحفظة.
                  </p>
                </div>

                {/* Messages mapping */}
                {currentSession?.messages.map((msg) => {
                  const isSeller = msg.sender === 'seller';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[82%] ${isSeller ? 'self-start' : 'self-end'}`}
                    >
                      <span className="text-[9px] text-gray-400 font-bold mb-0.5 px-1">
                        {isSeller ? 'المهندس عمر بيبرس' : 'أنت'}
                      </span>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                          isSeller
                            ? 'bg-[#0B192C] text-white rounded-tr-none'
                            : 'bg-emerald-600 text-white rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1 justify-end px-1">
                        <span className="text-[8px] text-gray-400 font-mono">
                          {msg.timestamp}
                        </span>
                        {!isSeller && <CheckCheck size={10} className="text-emerald-500" />}
                      </div>
                    </div>
                  );
                })}

                {/* Empty conversation prompt */}
                {(!currentSession || currentSession.messages.length === 0) && (
                  <div className="my-auto text-center text-gray-400 space-y-2 py-10">
                    <MessageSquare size={32} className="mx-auto text-gray-300 animate-bounce" />
                    <p className="text-xs font-bold">ابدأ كتابة أول رسالة الآن!</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Chat Footer Input */}
          {activeSessionId && (
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                required
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="اكتب رسالتك للمهندس عمر هنا..."
                className="flex-1 bg-slate-50 text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-emerald-500 outline-none font-semibold text-right"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send size={16} className="rotate-180" />
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
}
