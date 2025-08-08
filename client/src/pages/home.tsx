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
          СПОРТИВНАЯ ОДЕЖДА
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

      {/* About KAVARA Section */}
      <div className="p-6 bg-gray-50 border-y border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4 tracking-wide">ЧТО ТАКОЕ KAVARA</h2>
          <p className="text-gray-700 leading-relaxed max-w-sm mx-auto mb-6">
            Мы помогаем подобрать идеальную спортивную одежду для ваших тренировок. 
            Наши стилисты учитывают ваши предпочтения, телосложение и спортивные цели.
          </p>
          <button 
            className="border border-black text-black px-6 py-3 font-semibold tracking-wide hover:bg-black hover:text-white transition-colors"
            onClick={() => handleMenuOption("/about")}
          >
            УЗНАТЬ БОЛЬШЕ
          </button>
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
          <h2 className="text-3xl font-bold mb-6 tracking-wide">KAVARA TEAM</h2>
          <p className="text-gray-300 leading-relaxed text-lg max-w-md mx-auto">
            Качественная спортивная одежда для достижения ваших целей.
            Стиль и функциональность в каждой детали.
          </p>
        </div>
      </div>
    </div>
  );
}