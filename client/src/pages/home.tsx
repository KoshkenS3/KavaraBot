import { useLocation } from "wouter";
import AppHeader from "@/components/app-header";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleMenuOption = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center py-6">
          <div className="text-4xl mb-3">👋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Добро пожаловать в KAVARA
          </h2>
          <p className="text-gray-600">
            Твой персональный стилист спортивной одежды!
          </p>
        </div>
      </div>

      {/* Main Menu Options */}
      <div className="p-4 space-y-4">
        {/* Custom Box Option */}
        <div 
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMenuOption("/quiz")}
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🎯</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">
                Собрать бокс самостоятельно
              </h3>
              <p className="text-gray-600 text-sm">
                Персональный подбор под твои потребности
              </p>
            </div>
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ready Boxes Option */}
        <div 
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMenuOption("/ready-boxes")}
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">📦</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">
                Выбрать готовый бокс
              </h3>
              <p className="text-gray-600 text-sm">
                Готовые комплекты от наших стилистов
              </p>
            </div>
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* About KAVARA Option */}
        <div 
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleMenuOption("/about")}
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">❓</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">
                Что такое KAVARA
              </h3>
              <p className="text-gray-600 text-sm">
                История бренда и наша философия
              </p>
            </div>
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
