'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import Pusher from 'pusher-js';

export default function ChatWidget({ deviceId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check locally for username
    const savedName = localStorage.getItem('bidyut_user_name');
    if (savedName) setUserName(savedName);

    // Initial fetch of chat history
    fetch('/api/chat').then(res => res.json()).then(data => {
      if (data.messages) setMessages(data.messages);
      scrollToBottom();
    }).catch(console.error);

    // Setup Pusher
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || 'dummy_key';
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1';
    
    // Only connect if we have a real key configured to avoid errors
    if (pusherKey !== 'dummy_key') {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster
      });

      const channel = pusher.subscribe('chat-channel');
      channel.bind('new-message', (data) => {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      });

      return () => {
        pusher.unsubscribe('chat-channel');
      };
    } else {
      // Fallback polling if no Pusher
      const interval = setInterval(() => {
        if (isOpen) {
          fetch('/api/chat').then(res => res.json()).then(data => {
            if (data.messages) setMessages(data.messages);
          }).catch(console.error);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const container = messagesEndRef.current?.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }, 150);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const diffInSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const toBn = n => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
    
    if (diffInSeconds < 60) return 'এইমাত্র';
    
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${toBn(minutes)} মিনিট আগে`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${toBn(hours)} ঘণ্টা আগে`;
    
    const days = Math.floor(hours / 24);
    return `${toBn(days)} দিন আগে`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!userName) {
      setShowNameModal(true);
      return;
    }

    const payload = {
      senderId: deviceId,
      senderName: userName,
      message: inputText
    };

    setInputText('');

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // New message will come through socket or polling
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    const nameInput = e.target.elements.name.value.trim();
    if (nameInput) {
      localStorage.setItem('bidyut_user_name', nameInput);
      setUserName(nameInput);
      setShowNameModal(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-[#c09a59] text-black p-4 rounded-full shadow-[0_0_20px_rgba(192,154,89,0.5)] hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-80 h-[400px] sm:h-[450px] flex flex-col bg-[#0a0a0a] rounded-2xl border border-[#c09a59] border-opacity-30 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-[#111] p-4 border-b border-gray-700">
            <h3 className="font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#fbbf24]" />
              পাবলিক লাইভ চ্যাট
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === deviceId;
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs font-semibold ${isMe ? 'text-[#c09a59]' : 'text-[#fbbf24]'}`}>
                      {isMe ? 'আপনি' : msg.senderName}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-[1px]">{getTimeAgo(msg.timestamp)}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                    isMe 
                      ? 'bg-[#c09a59] text-black rounded-tr-none' 
                      : 'bg-[#1a1a1a] text-white border border-gray-700 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-12 shrink-0 w-full" />
          </div>

          <div className="p-3 bg-black bg-opacity-50 border-t border-gray-700">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={userName ? "মেসেজ লিখুন..." : "চ্যাট করতে ক্লিক করুন..."}
                className="flex-1 bg-[#1a1a1a] text-white text-sm rounded-full px-4 py-2 border border-gray-700 focus:outline-none focus:border-[#c09a59] transition-colors"
              />
              <button 
                type="submit"
                className="p-2 bg-[#c09a59] text-black rounded-full hover:bg-[#fbbf24] transition-colors disabled:opacity-50"
                disabled={!inputText.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Name Name Modal */}
      {showNameModal && isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-[2px]">
          <div className="w-72 p-6 glassmorphism rounded-xl border border-[#c09a59]">
            <h3 className="text-xl font-bold text-white mb-4 text-glow">চ্যাটে জয়েন করুন</h3>
            <form onSubmit={handleSaveName}>
              <input 
                name="name"
                type="text" 
                required
                placeholder="আপনার নাম লিখুন"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:border-[#fbbf24]"
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 py-2 text-gray-400 hover:text-white"
                >
                  ক্যান্সেল
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-[#c09a59] text-black font-bold rounded-lg box-glow"
                >
                  জয়েন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
