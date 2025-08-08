import { useLocation } from "wouter";
import { Home, Package, User, Phone } from "lucide-react";

const menuItems = [
  { path: "/", icon: Home, label: "Главная", emoji: "🏠" },
  { path: "/my-orders", icon: Package, label: "Мои заказы", emoji: "📦" },
  { path: "/profile", icon: User, label: "Профиль", emoji: "👤" },
  { path: "/support", icon: Phone, label: "Поддержка", emoji: "📞" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => {
          const isActive = location === item.path || 
            (item.path !== "/" && location.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}