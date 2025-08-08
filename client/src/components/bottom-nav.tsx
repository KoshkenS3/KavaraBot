import { useLocation } from "wouter";
import { Home, Package, User, Phone } from "lucide-react";

const menuItems = [
  { path: "/", icon: Home, label: "ГЛАВНАЯ" },
  { path: "/my-orders", icon: Package, label: "ЗАКАЗЫ" },
  { path: "/profile", icon: User, label: "ПРОФИЛЬ" },
  { path: "/support", icon: Phone, label: "КОНТАКТЫ" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black px-4 py-3 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => {
          const isActive = location === item.path || 
            (item.path !== "/" && location.startsWith(item.path));
          
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-2 px-2 py-1 transition-colors ${
                isActive 
                  ? "text-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <IconComponent 
                className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-1"}`} 
              />
              <span className={`text-xs font-bold tracking-wider ${
                isActive ? "text-black" : "text-gray-500"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}