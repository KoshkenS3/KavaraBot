import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Order } from "@shared/schema";
import { mockUser } from "@/lib/mock-data";

export default function MyOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders/user", mockUser.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/user/${mockUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json() as Promise<Order[]>;
    },
  });

  const currentOrders = orders?.filter(order => 
    order.status === "pending" || order.status === "processing" || order.status === "shipped"
  ) || [];
  
  const historyOrders = orders?.filter(order => 
    order.status === "delivered" || order.status === "cancelled"
  ) || [];

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-orange-500" />;
      case "processing": return <Package className="w-4 h-4 text-blue-500" />;
      case "shipped": return <Truck className="w-4 h-4 text-purple-500" />;
      case "delivered": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "pending": return "Обрабатывается";
      case "processing": return "В работе";
      case "shipped": return "В пути";
      case "delivered": return "Доставлен";
      case "cancelled": return "Отменен";
      default: return "Неизвестно";
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">Заказ #{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt || '').toLocaleDateString('ru-RU')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(order.status)}
          <span className="text-sm font-medium">{getStatusText(order.status)}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">Клиент: {order.customerName}</p>
        <p className="text-sm text-gray-600">Телефон: {order.customerPhone}</p>
        <p className="text-sm text-gray-600">Доставка: {order.deliveryMethod}</p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-primary">
          {order.totalPrice.toLocaleString('ru-RU')}₽
        </span>
        <Button variant="outline" size="sm">
          Подробнее
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем заказы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 bg-secondary text-white">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📦</div>
          <div>
            <h2 className="font-semibold">Мои заказы</h2>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Текущие заказы</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-4 space-y-4">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Нет текущих заказов</p>
                <p className="text-sm text-gray-500 mt-1">
                  Оформите свой первый заказ!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-4 space-y-4">
            {historyOrders.length > 0 ? (
              historyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">История заказов пуста</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}