# Netflix Clone

Современный клон Netflix, созданный с использованием React, TypeScript, Vite и Feature-Sliced Design архитектуры.

## 🚀 Технологии

- **React 19**
- **TypeScript 5 (strict)**
- **Vite 6** (manualChunks, visualizer, PWA)
- **@tanstack/react-query v5** (infinite queries)
- **Zustand 5** (persist + immer)
- **Emotion** (ThemeProvider + глобальные стили)
- **React Router v7**
- **Kinopoisk API** (через Vite proxy)
- **Framer Motion 12** (анимации)
- **vite-plugin-pwa** (injectManifest, кастомный SW)

## 📁 Архитектура

Проект использует **Feature-Sliced Design (FSD)** архитектуру:

```
src/
├── app/           # Инициализация приложения
├── pages/         # Страницы приложения
├── widgets/       # Композитные блоки
├── features/      # Функциональности
├── entities/      # Бизнес-сущности
└── shared/        # Переиспользуемые ресурсы
```

## 🛠 Установка и запуск

### Предварительные требования

- Node.js 18+
- Bun (рекомендуется) или npm/yarn

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd netflix-clone
```

2. Установите зависимости:
```bash
bun install
```

3. Скопируйте файл окружения:
```bash
cp .env.example .env
```

4. Получите API ключ от [Kinopoisk API](https://api.kinopoisk.dev/) и добавьте его в `.env`:
```env
VITE_KINOPOISK_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.kinopoisk.dev
# Опционально: для мониторинга/логгирования
# VITE_SENTRY_DSN=
```

### Запуск

```bash
# Режим разработки
bun dev

# Проверка типов и линта
bun typecheck
bun lint

# Юнит-тесты
bun test

# E2E тесты (Playwright)
bun run test:e2e

# Сборка для продакшена
bun build

# Предварительный просмотр сборки
bun preview
```

## 🔧 Исправленные проблемы

### React Query v5 совместимость
- ✅ Убраны устаревшие `onSuccess`/`onError` callbacks
- ✅ Добавлен `initialPageParam` для `useInfiniteQuery`
- ✅ Использование `useEffect` для side effects
- ✅ Правильная типизация для React Query v5

### TypeScript
- ✅ Исправлены конфликты типов в `FilterParams` и `SortParams`
- ✅ Добавлены типы для Emotion Theme
- ✅ Строгая типизация с `exactOptionalPropertyTypes`

### Vite
- ✅ Заменен `__DEV__` на `import.meta.env.DEV`
- ✅ Настроены path aliases для FSD структуры
- ✅ Оптимизированы настройки сборки
- ✅ Разделение бандла через manualChunks
- ✅ Аналитика бандла `stats.html`
- ✅ PWA: vite-plugin-pwa (injectManifest) + кастомный service worker

## 🎯 Функциональность

### Реализовано
- ✅ Базовая структура приложения
- ✅ Роутинг (главная, поиск, избранное, страница фильма)
- ✅ Адаптивный Layout с Header и Sidebar
- ✅ Интеграция с Kinopoisk API
- ✅ Управление состоянием (Zustand + React Query)
- ✅ Поиск фильмов с фильтрами и бесконечной прокруткой
- ✅ Подсказки поиска + клавиатурная навигация
- ✅ Избранные фильмы (persist)
- ✅ Трендовые фильмы, новинки, топ фильмы
- ✅ Детальная страница фильма (hero, описание, трейлер, провайдеры, актёры/создатели, похожие)
- ✅ ErrorBoundary + дружелюбный Fallback
- ✅ DevToasts (важные логи в dev)
- ✅ SEO helper `setSeo`
- ✅ PWA (precache + runtime cache)

### В планах
- 🔄 Тема light/dark
- 🔄 Улучшение Mobile UX Sidebar/Header
- 🔄 Оптимизация изображений (WebP/мульти-размеры)
- 🔄 Доп. тест-кейсы (unit/e2e)

## 🎨 UI/UX

Дизайн вдохновлен Netflix с темной темой и красным акцентом (#E50914).

### Цветовая схема
- **Фон**: #000000
- **Поверхность**: #141414
- **Основной**: #E50914
- **Текст**: #FFFFFF, #B3B3B3, #808080

## 📝 Скрипты

```bash
bun dev          # Запуск dev сервера
bun build        # Сборка для продакшена
bun preview      # Предварительный просмотр
bun lint         # Проверка кода
bun test         # Юнит-тесты
bun run test:e2e # E2E Playwright
```

## 🤝 Вклад в проект

1. Форкните проект
2. Создайте feature ветку
3. Внесите изменения
4. Отправьте Pull Request

## 📄 Лицензия

MIT License