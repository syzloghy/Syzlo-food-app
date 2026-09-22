import React, { useEffect, useState } from 'react';
import { useApp, CustomerScreen } from '../../context/AppContext';
import { Home, ReceiptText, Tag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { customerScreen, setCustomerScreen } = useApp();
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

 const navItems: {
  id: CustomerScreen;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'orders', label: 'Orders', icon: <ReceiptText className="w-5 h-5" /> },
  { id: 'offers', label: 'Offers', icon: <Tag className="w-5 h-5" /> },
  { id: 'profile', label: 'Account', icon: <User className="w-5 h-5" /> },
];

  return (
    <nav
      className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#565F28] border-t border-[#485020] pb-safe shadow-2xl transition-transform duration-200 ${
        isScrolling ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="grid grid-cols-4 h-15 items-center px-1">
        {navItems.map((item) => {
          const isActive = customerScreen === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setCustomerScreen(item.id)}
              className="flex flex-col items-center justify-center relative py-1 focus:outline-hidden group"
            >
              <div
                className={`relative p-1 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-white scale-105'
                    : 'text-[#D0D6B8] group-hover:text-white'
                }`}
              >
                {item.icon}
              </div>

              <span
                className={`text-[11px] tracking-tight transition-all duration-150 ${
                  isActive
                    ? 'font-black text-white'
                    : 'font-medium text-[#D0D6B8]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
