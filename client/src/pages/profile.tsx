import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Edit, Settings, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUser } from "@/lib/mock-data";
import type { QuizResponse } from "@shared/schema";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: false,
    newBoxes: true,
  });

  const { data: quizResponse } = useQuery<QuizResponse>({
    queryKey: ["/api/quiz-responses/user", mockUser.id],
    queryFn: async () => {
      const response = await fetch(`/api/quiz-responses/user/${mockUser.id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch quiz response");
      }
      return response.json();
    },
  });

  const PersonalData = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Личные данные</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Сохранить" : "Редактировать"}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              defaultValue={mockUser.firstName}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              defaultValue={mockUser.lastName}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              defaultValue={mockUser.username}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Sizes = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold mb-4">Размеры</h3>
        
        {quizResponse ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Размер одежды</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {quizResponse.size || "Не указан"}
                </div>
              </div>
              <div>
                <Label>Рост</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {quizResponse.height ? `${quizResponse.height} см` : "Не указан"}
                </div>
              </div>
            </div>
            <div>
              <Label>Вес</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {quizResponse.weight ? `${quizResponse.weight} кг` : "Не указан"}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Обновить размеры
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Размеры не указаны</p>
            <Button>Пройти тест размеров</Button>
          </div>
        )}
      </div>
    </div>
  );

  const Preferences = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold mb-4">Предпочтения</h3>
        
        {quizResponse?.goals ? (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Цели тренировок</Label>
              <div className="flex flex-wrap gap-2">
                {quizResponse.goals.map((goal, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label>Бюджет</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {quizResponse.budget || "Не указан"}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Обновить предпочтения
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Предпочтения не указаны</p>
            <Button>Пройти опрос</Button>
          </div>
        )}
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold mb-4">Настройки уведомлений</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Уведомления о заказах</Label>
              <p className="text-sm text-gray-600">Статус заказа и доставки</p>
            </div>
            <Switch
              checked={notifications.orders}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, orders: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Акции и скидки</Label>
              <p className="text-sm text-gray-600">Специальные предложения</p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, promotions: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Новые боксы</Label>
              <p className="text-sm text-gray-600">Уведомления о новых коллекциях</p>
            </div>
            <Switch
              checked={notifications.newBoxes}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, newBoxes: checked }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 bg-secondary text-white">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">👤</div>
          <div>
            <h2 className="font-semibold">Профиль</h2>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="personal">Данные</TabsTrigger>
            <TabsTrigger value="sizes">Размеры</TabsTrigger>
            <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-4">
            <PersonalData />
          </TabsContent>
          
          <TabsContent value="sizes" className="mt-4">
            <Sizes />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-4">
            <Preferences />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}