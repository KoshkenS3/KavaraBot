import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import LoadingOverlay from "@/components/loading-overlay";
import type { Box, InsertOrder } from "@shared/schema";
import { useTelegram } from "@/hooks/use-telegram";

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: string;
  paymentMethod: string;
}

export default function Order() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isInTelegram } = useTelegram();
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryMethod: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedBox");
    if (stored) {
      setSelectedBox(JSON.parse(stored));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const createOrder = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      sessionStorage.setItem("lastOrder", JSON.stringify(order));
      setLocation("/order-success");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Попробуйте снова.",
        variant: "destructive",
      });
    },
  });

  const calculateDeliveryPrice = () => {
    switch (formData.deliveryMethod) {
      case "courier":
        return 300;
      case "cdek":
        return 250;
      case "pickup":
        return 0;
      default:
        return 0;
    }
  };

  const calculatePaymentFee = () => {
    return formData.paymentMethod === "cash" ? 200 : 0;
  };

  const calculateTotalPrice = () => {
    if (!selectedBox) return 0;
    return selectedBox.price + calculateDeliveryPrice() + calculatePaymentFee();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBox) return;

    const isValid = formData.customerName && 
                   formData.customerPhone && 
                   formData.deliveryMethod && 
                   formData.paymentMethod;

    if (!isValid) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      const orderData: InsertOrder = {
        userId: user?.id.toString() || "",
        boxId: selectedBox.id,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        totalPrice: calculateTotalPrice(),
      };

      createOrder.mutate(orderData);
      setIsLoading(false);
    }, 2000);
  };

  // Check authentication
  if (!isInTelegram || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-6">
            Заказы доступны только пользователям Telegram
          </p>
          <Button onClick={() => setLocation("/")}>На главную</Button>
        </div>
      </div>
    );
  }

  if (!selectedBox) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isVisible={isLoading} />
      
      <div className="p-4 bg-secondary text-white">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-semibold">Оформление заказа</h2>
          </div>
        </div>
      </div>

      {/* Order Confirmation */}
      <div className="p-4 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h3 className="font-semibold mb-3">Подтверждение выбора</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={selectedBox.imageUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"} 
              alt={selectedBox.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold">{selectedBox.name}</h4>
              <p className="text-sm text-gray-600">{selectedBox.description}</p>
              <p className="text-lg font-bold text-primary mt-1">
                {selectedBox.price.toLocaleString('ru-RU')}₽
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => window.history.back()}
          >
            Изменить выбор
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold mb-4">Контактные данные</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                placeholder="Ваше имя"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 999-99-99"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email (опционально)</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold mb-4">Доставка</h3>
          <RadioGroup 
            value={formData.deliveryMethod}
            onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryMethod: value }))}
          >
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
              <RadioGroupItem value="courier" id="courier" />
              <Label htmlFor="courier" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xl">🚚</span>
                <div>
                  <span className="font-medium">Курьер по Москве</span>
                  <div className="text-sm text-gray-600">300₽</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
              <RadioGroupItem value="cdek" id="cdek" />
              <Label htmlFor="cdek" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xl">📦</span>
                <div>
                  <span className="font-medium">СДЭК</span>
                  <div className="text-sm text-gray-600">от 250₽</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xl">🏪</span>
                <div>
                  <span className="font-medium">Самовывоз</span>
                  <div className="text-sm text-gray-600">бесплатно</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold mb-4">Оплата</h3>
          <RadioGroup 
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
          >
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xl">💳</span>
                <span className="font-medium">Банковская карта</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
              <RadioGroupItem value="sbp" id="sbp" />
              <Label htmlFor="sbp" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xl">📱</span>
                <span className="font-medium">СБП</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xl">💰</span>
                <div>
                  <span className="font-medium">При получении</span>
                  <div className="text-sm text-gray-600">+200₽</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Total Price */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Итого:</span>
            <span className="text-xl font-bold text-primary">
              {calculateTotalPrice().toLocaleString('ru-RU')}₽
            </span>
          </div>
        </div>

        {/* Final Order Button */}
        <Button 
          type="submit"
          className="w-full bg-primary text-white text-lg py-4"
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? "Оформляем заказ..." : "Оформить заказ"}
        </Button>
      </form>
    </div>
  );
}
