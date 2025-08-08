import { Button } from "@/components/ui/button";
import type { Box } from "@shared/schema";

interface BoxCardProps {
  box: Box;
  onSelect?: (box: Box) => void;
  onNotify?: (box: Box) => void;
  variant?: "default" | "coming-soon";
}

export default function BoxCard({ box, onSelect, onNotify, variant = "default" }: BoxCardProps) {
  const isComingSoon = variant === "coming-soon" || !box.isAvailable;

  return (
    <div className={`border-2 border-black bg-white ${isComingSoon ? "opacity-60" : ""}`}>
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={box.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"} 
          alt={box.name}
          className={`w-full h-full object-cover ${isComingSoon ? "grayscale" : ""}`}
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wide">СКОРО</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2 tracking-wide">{box.name.toUpperCase()}</h3>
        <p className="text-gray-600 mb-4 text-sm">{box.description}</p>
        
        {box.contents && box.contents.length > 0 && !isComingSoon && (
          <div className="mb-6">
            <div className="text-xs font-bold text-black mb-2 tracking-wide">СОСТАВ:</div>
            <ul className="text-sm text-gray-700 space-y-1">
              {box.contents.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4">
          {isComingSoon ? (
            <button 
              className="w-full border border-black text-black py-3 font-semibold tracking-wide hover:bg-black hover:text-white transition-colors"
              onClick={() => onNotify?.(box)}
            >
              УВЕДОМИТЬ О ПОСТУПЛЕНИИ
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-black">
                {box.price.toLocaleString('ru-RU')} ₽
              </div>
              <button 
                onClick={() => onSelect?.(box)}
                className="bg-black text-white px-6 py-3 font-semibold tracking-wide hover:bg-gray-900 transition-colors"
              >
                ВЫБРАТЬ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}