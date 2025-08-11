import express from 'express';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export function setupTelegramBot() {
  console.log("Telegram bot setup completed");
}

export async function setupTelegramBotWithApp(app: express.Application) {
  // Webhook endpoint for Telegram
  app.post('/webhook', express.json(), async (req, res) => {
    try {
      const update = req.body;
      
      if (update.message) {
        await handleMessage(update.message);
      } else if (update.callback_query) {
        await handleCallbackQuery(update.callback_query);
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Error');
    }
  });

  // Setup bot commands and menu
  app.post('/setup-bot', async (req, res) => {
    try {
      // Set bot commands
      await setMyCommands();
      
      // Set menu button (Mini App)
      await setMenuButton();
      
      res.json({ success: true, message: 'Bot setup completed' });
    } catch (error) {
      console.error('Setup error:', error);
      res.status(500).json({ error: 'Setup failed' });
    }
  });

  // Get Mini App URL
  app.get('/mini-app-url', (req, res) => {
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : `http://localhost:5000`;
    
    res.json({ 
      miniAppUrl: baseUrl,
      telegramUrl: `https://t.me/${getBotUsername()}/start`
    });
  });
}

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/start') {
    const welcomeMessage = `
🎽 Добро пожаловать в KAVARA! 

Я ваш персональный стилист спортивной одежды. Готов подобрать идеальный спортивный образ специально для вас!

🎯 Что я умею:
• Провожу персональную стилистическую диагностику
• Подбираю готовые спортивные боксы
• Создаю индивидуальные комплекты
• Отслеживаю ваши заказы

Нажмите кнопку "Открыть приложение" или используйте меню ниже ⬇️
    `;

    const keyboard = {
      inline_keyboard: [
        [{ text: "🚀 Открыть приложение", web_app: { url: getWebAppUrl() } }],
        [
          { text: "📋 Пройти тест", callback_data: "quiz" },
          { text: "📦 Готовые боксы", callback_data: "ready_boxes" }
        ],
        [
          { text: "📞 Поддержка", callback_data: "support" },
          { text: "ℹ️ О нас", callback_data: "about" }
        ]
      ]
    };

    await sendMessage(chatId, welcomeMessage, keyboard);
  }
}

async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  let responseText = '';
  let keyboard: any = null;

  switch (data) {
    case 'quiz':
      responseText = '🎯 Пройдите персональный тест для подбора идеального спортивного образа!';
      keyboard = {
        inline_keyboard: [
          [{ text: "📋 Начать тест", web_app: { url: `${getWebAppUrl()}/quiz` } }]
        ]
      };
      break;

    case 'ready_boxes':
      responseText = '📦 Посмотрите наши готовые спортивные боксы!';
      keyboard = {
        inline_keyboard: [
          [{ text: "🛍️ Смотреть боксы", web_app: { url: `${getWebAppUrl()}/ready-boxes` } }]
        ]
      };
      break;

    case 'support':
      responseText = '📞 Служба поддержки KAVARA готова помочь!';
      keyboard = {
        inline_keyboard: [
          [{ text: "💬 Связаться", web_app: { url: `${getWebAppUrl()}/support` } }]
        ]
      };
      break;

    case 'about':
      responseText = `
ℹ️ О KAVARA

KAVARA - это персональный стилист спортивной одежды в Telegram. Мы помогаем подобрать идеальную спортивную одежду для любого случая:

🎯 Персональный подход
• Учитываем ваши предпочтения и цели
• Анализируем стиль жизни и активности
• Подбираем по размерам и бюджету

📦 Удобные форматы
• Готовые тематические боксы
• Индивидуальные подборки
• Быстрая доставка

💝 Качество и стиль
• Только проверенные бренды
• Актуальные тренды
• Профессиональные рекомендации
      `;
      keyboard = {
        inline_keyboard: [
          [{ text: "🚀 Открыть приложение", web_app: { url: getWebAppUrl() } }]
        ]
      };
      break;
  }

  await sendMessage(chatId, responseText, keyboard);
  await answerCallbackQuery(callbackQuery.id);
}

async function setMyCommands() {
  const commands = [
    { command: 'start', description: 'Главное меню' },
    { command: 'app', description: 'Открыть приложение' },
    { command: 'quiz', description: 'Пройти тест стиля' },
    { command: 'boxes', description: 'Готовые боксы' },
    { command: 'orders', description: 'Мои заказы' },
    { command: 'support', description: 'Поддержка' }
  ];

  const response = await fetch(`${TELEGRAM_API_URL}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands })
  });

  return response.json();
}

async function setMenuButton() {
  const menuButton = {
    type: 'web_app',
    text: 'Открыть KAVARA',
    web_app: { url: getWebAppUrl() }
  };

  const response = await fetch(`${TELEGRAM_API_URL}/setChatMenuButton`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ menu_button: menuButton })
  });

  return response.json();
}

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const payload: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.json();
}

async function answerCallbackQuery(callbackQueryId: string) {
  const response = await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });

  return response.json();
}

function getWebAppUrl(): string {
  return process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : `http://localhost:5000`;
}

function getBotUsername(): string {
  // Extract username from bot token if needed
  // For now, return placeholder - will be updated when we get bot info
  return 'kavara_style_bot';
}

// Get bot info to retrieve username
export async function getBotInfo() {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Failed to get bot info:', error);
    return null;
  }
}