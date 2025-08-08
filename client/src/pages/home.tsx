import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleMenuOption = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-6 border-b border-gray-200">
        <h1 className="text-6xl font-bold text-black mb-4 tracking-tight">
          KAVARA
        </h1>
        <p className="text-xl text-gray-700 font-medium tracking-wide">
          ОДЕЖДА ДЛЯ БОРЬБЫ
        </p>
        <div className="mt-8">
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="p-6 space-y-4">
        <button 
          className="w-full bg-black text-white py-6 text-lg font-semibold tracking-wide hover:bg-gray-900 transition-colors"
          onClick={() => handleMenuOption("/quiz")}
        >
          ПЕРСОНАЛЬНЫЙ ПОДБОР
        </button>

        <button 
          className="w-full border-2 border-black text-black py-6 text-lg font-semibold tracking-wide hover:bg-black hover:text-white transition-colors"
          onClick={() => handleMenuOption("/ready-boxes")}
        >
          ГОТОВЫЕ КОЛЛЕКЦИИ
        </button>
      </div>

      {/* Categories Grid */}
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-black tracking-wide">КАТЕГОРИИ</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-lg font-bold text-black mb-1">РАШГАРДЫ</div>
              <div className="text-sm text-gray-600 font-medium">ДЛЯ БОРЬБЫ</div>
            </div>
          </div>
          
          <div className="aspect-square bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-lg font-bold text-black mb-1">ШОРТЫ</div>
              <div className="text-sm text-gray-600 font-medium">ДЛЯ ТРЕНИРОВОК</div>
            </div>
          </div>
          
          <div className="aspect-square bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-lg font-bold text-black mb-1">ФУТБОЛКИ</div>
              <div className="text-sm text-gray-600 font-medium">LIFESTYLE</div>
            </div>
          </div>
          
          <div className="aspect-square bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-lg font-bold text-black mb-1">АКСЕССУАРЫ</div>
              <div className="text-sm text-gray-600 font-medium">ДОПОЛНИТЕЛЬНО</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sale Banner */}
      <div className="mx-6 mb-6 bg-red-600 text-white text-center py-4">
        <div className="text-sm font-bold tracking-wide">ПЕРСОНАЛЬНЫЙ КОМПЛЕКТ KAVARA</div>
        <div className="text-lg font-bold">СО СКИДКОЙ 15%</div>
      </div>

      {/* Brand Philosophy */}
      <div className="bg-black text-white">
        <div className="text-center py-12 px-6">
          <h2 className="text-3xl font-bold mb-6 tracking-wide">KAVARA CLAN</h2>
          <p className="text-gray-300 leading-relaxed text-lg max-w-md mx-auto">
            Одежда для тех, кто не сдается. Для тех, кто борется и побеждает.
            Качество, которое выдерживает самые жесткие тренировки.
          </p>
          <button 
            className="mt-8 border border-white text-white px-8 py-3 font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
            onClick={() => handleMenuOption("/about")}
          >
            УЗНАТЬ БОЛЬШЕ
          </button>
        </div>
      </div>
    </div>
  );
}