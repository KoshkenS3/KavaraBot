import { useState } from "react";
import { Phone, MessageCircle, RotateCcw, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqData = [
  {
    question: "Как работает подбор боксов?",
    answer: "Наши стилисты анализируют ваши ответы в анкете о размерах, целях тренировок и бюджете, чтобы подобрать идеальный комплект спортивной одежды."
  },
  {
    question: "Можно ли вернуть или обменять товар?",
    answer: "Да, у вас есть 14 дней для возврата или обмена товара в оригинальной упаковке и без следов использования."
  },
  {
    question: "Какие способы доставки доступны?",
    answer: "Мы предлагаем доставку курьером по Москве (300₽), СДЭК по России (от 250₽) и самовывоз (бесплатно)."
  },
  {
    question: "Как часто выходят новые боксы?",
    answer: "Новые коллекции выходят ежемесячно. Подпишитесь на уведомления, чтобы не пропустить!"
  },
  {
    question: "Можно ли изменить состав бокса?",
    answer: "Готовые боксы имеют фиксированный состав, но вы можете пройти персональный опрос для индивидуального подбора."
  }
];

export default function Support() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const FAQ = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h3 className="font-semibold">Частые вопросы</h3>
        </div>
        
        <Accordion type="single" collapsible className="space-y-2">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );

  const ContactOperator = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h3 className="font-semibold">Связь с оператором</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Ваше имя</Label>
            <Input
              id="name"
              placeholder="Как к вам обращаться?"
              value={contactForm.name}
              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="subject">Тема обращения</Label>
            <Input
              id="subject"
              placeholder="Кратко опишите суть вопроса"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Сообщение</Label>
            <Textarea
              id="message"
              placeholder="Опишите ваш вопрос подробнее..."
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>
          
          <Button className="w-full bg-primary text-white">
            Отправить сообщение
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-semibold mb-3">Другие способы связи</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Телефон</p>
              <p className="text-sm text-gray-600">+7 (495) 123-45-67</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <MessageCircle className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Telegram</p>
              <p className="text-sm text-gray-600">@kavara_support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Returns = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <RotateCcw className="w-6 h-6 text-primary" />
          <h3 className="font-semibold">Возврат и обмен</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Условия возврата</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 14 дней с момента получения</li>
              <li>• Товар в оригинальной упаковке</li>
              <li>• Без следов использования</li>
              <li>• С сохранными бирками</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Как оформить возврат</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Свяжитесь с нами любым удобным способом</p>
              <p>2. Укажите номер заказа и причину возврата</p>
              <p>3. Упакуйте товар в оригинальную упаковку</p>
              <p>4. Передайте курьеру или отправьте почтой</p>
              <p>5. Получите возврат средств в течение 3-5 дней</p>
            </div>
          </div>
          
          <Button className="w-full" variant="outline">
            Оформить возврат
          </Button>
        </div>
      </div>
    </div>
  );

  const Feedback = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-6 h-6 text-primary" />
          <h3 className="font-semibold">Жалобы и предложения</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Ваше мнение важно для нас! Поделитесь своими впечатлениями, 
            замечаниями или предложениями по улучшению сервиса.
          </p>
          
          <div>
            <Label htmlFor="feedback-type">Тип обращения</Label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="">Выберите тип</option>
              <option value="complaint">Жалоба</option>
              <option value="suggestion">Предложение</option>
              <option value="praise">Благодарность</option>
              <option value="other">Другое</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="feedback-message">Ваше сообщение</Label>
            <Textarea
              id="feedback-message"
              placeholder="Расскажите подробнее..."
              rows={4}
            />
          </div>
          
          <Button className="w-full bg-primary text-white">
            Отправить отзыв
          </Button>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-6">
        <h4 className="font-semibold mb-2">Помогите нам стать лучше!</h4>
        <p className="text-sm text-gray-600 mb-4">
          Оцените наш сервис и получите скидку 5% на следующий заказ.
        </p>
        <Button variant="outline" className="w-full">
          Оставить отзыв
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 bg-secondary text-white">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📞</div>
          <div>
            <h2 className="font-semibold">Поддержка</h2>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Связь</TabsTrigger>
            <TabsTrigger value="returns">Возврат</TabsTrigger>
            <TabsTrigger value="feedback">Отзывы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="mt-4">
            <FAQ />
          </TabsContent>
          
          <TabsContent value="contact" className="mt-4">
            <ContactOperator />
          </TabsContent>
          
          <TabsContent value="returns" className="mt-4">
            <Returns />
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-4">
            <Feedback />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}