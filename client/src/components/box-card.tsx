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
    <div className={`box-card ${isComingSoon ? "coming-soon" : ""}`}>
      <img 
        src={box.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"} 
        alt={box.name}
        className={`w-full h-48 object-cover ${isComingSoon ? "grayscale" : ""}`}
      />
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {box.emoji && <span className="text-2xl">{box.emoji}</span>}
          <h3 className="font-semibold text-lg">{box.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{box.description}</p>
        
        {box.contents && box.contents.length > 0 && !isComingSoon && (
          <div className="mb-3">
            <span className="text-xs text-gray-500">В составе:</span>
            <ul className="text-sm text-gray-700 mt-1">
              {box.contents.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {isComingSoon ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onNotify?.(box)}
          >
            Уведомить о поступлении
          </Button>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {box.price.toLocaleString('ru-RU')}₽
            </span>
            <Button 
              onClick={() => onSelect?.(box)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Выбрать{variant === "default" ? " этот бокс" : ""}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
