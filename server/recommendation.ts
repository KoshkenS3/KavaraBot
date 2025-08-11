import type { Box, QuizResponse, SportType } from "@shared/types";

// Маппинг целей квиза в виды спорта
export function mapQuizGoalsToSportTypes(goals: string[]): SportType[] {
  const sportTypesMap: Record<string, SportType> = {
    "running": "running" as SportType,
    "strength": "power" as SportType,
    "yoga": "yoga" as SportType,
    "cycling": "cycling" as SportType,
    "team-sports": "command_sports" as SportType,
    "casual": "running" as SportType, // Повседневная носка -> легкий бег
  };

  return goals
    .map(goal => sportTypesMap[goal])
    .filter(sportType => sportType !== undefined);
}

// Маппинг бюджета в числовое значение
export function mapBudgetToNumber(budget: string): number {
  const budgetMap: Record<string, number> = {
    "5000": 5000,
    "10000": 10000,
    "15000": 15000,
    "15000+": 50000, // Без ограничений для премиум сегмента
  };

  return budgetMap[budget] || 50000;
}

// Простая логика фильтрации по цене и спорту
export function filterPersonalBoxes(boxes: Box[], quizResponse: QuizResponse): Box[] {
  if (!quizResponse.goals || !quizResponse.budget) {
    // Если нет данных квиза, возвращаем все доступные боксы
    return boxes.filter(box => box.isAvailable);
  }

  const userSportTypes = mapQuizGoalsToSportTypes(quizResponse.goals);
  const userBudget = mapBudgetToNumber(quizResponse.budget);

  const filteredBoxes = boxes.filter(box => {
    // Проверяем доступность
    if (!box.isAvailable) return false;

    // Фильтрация по бюджету
    if (box.price > userBudget) return false;

    // Фильтрация по видам спорта
    if (box.sportTypes && box.sportTypes.length > 0) {
      const hasMatchingSport = box.sportTypes.some(sportType => 
        userSportTypes.includes(sportType)
      );
      if (!hasMatchingSport) return false;
    }

    return true;
  });

  // Сортируем по цене (сначала более доступные)
  return filteredBoxes.sort((a, b) => a.price - b.price);
}

// Функция для получения топ-3 рекомендаций
export function getTopRecommendations(boxes: Box[], quizResponse: QuizResponse): Box[] {
  const filtered = filterPersonalBoxes(boxes, quizResponse);
  
  // Возвращаем максимум 3 бокса
  return filtered.slice(0, 3);
}
