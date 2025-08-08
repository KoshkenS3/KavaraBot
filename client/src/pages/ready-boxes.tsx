import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import BoxCard from "@/components/box-card";
import type { Box } from "@shared/schema";

export default function ReadyBoxes() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: readyBoxes, isLoading } = useQuery({
    queryKey: ["/api/boxes", { category: "ready" }],
    queryFn: async () => {
      const response = await fetch("/api/boxes?category=ready");
      if (!response.ok) throw new Error("Failed to fetch boxes");
      return response.json() as Promise<Box[]>;
    },
  });

  const notifyMutation = useMutation({
    mutationFn: async (boxId: string) => {
      const response = await apiRequest("POST", "/api/notifications", {
        boxId,
        userId: "mock-user-1", // In real app, get from Telegram WebApp
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Мы уведомим вас о поступлении товара!",
      });
    },
  });

  const handleSelectBox = (box: Box) => {
    sessionStorage.setItem("selectedBox", JSON.stringify(box));
    setLocation("/order");
  };

  const handleNotifyMe = (box: Box) => {
    notifyMutation.mutate(box.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем боксы...</p>
        </div>
      </div>
    );
  }

  const availableBoxes = readyBoxes?.filter(box => box.isAvailable) || [];
  const comingSoonBoxes = readyBoxes?.filter(box => !box.isAvailable) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 -ml-2" 
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-black tracking-wide">ГОТОВЫЕ КОЛЛЕКЦИИ</h2>
            <p className="text-gray-600 font-medium">ВЫБЕРИТЕ ГОТОВЫЙ КОМПЛЕКТ</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Current Boxes Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-6 tracking-wide">ДОСТУПНО СЕЙЧАС</h3>
          <div className="space-y-6">
            {availableBoxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                onSelect={handleSelectBox}
                variant="default"
              />
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        {comingSoonBoxes.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-black mb-6 tracking-wide">СКОРО В ПРОДАЖЕ</h3>
            <div className="space-y-6">
              {comingSoonBoxes.map((box) => (
                <BoxCard
                  key={box.id}
                  box={box}
                  onNotify={handleNotifyMe}
                  variant="coming-soon"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
