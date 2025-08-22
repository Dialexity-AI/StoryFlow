# StoryFlow Backend Setup Guide

## 🚀 Швидкий старт

### 1. Налаштування бази даних

#### Локальна розробка з Docker:
```bash
# Запустити PostgreSQL
npm run db:up

# Створити міграції
npm run prisma:migrate:dev

# Згенерувати Prisma Client
npm run prisma:generate
```

#### Vercel (Production):
```bash
# Підключити базу даних (наприклад, Neon, Supabase, PlanetScale)
# Додати DATABASE_URL та DIRECT_URL в змінні середовища Vercel

# Запустити міграції
npm run prisma:migrate:deploy
```

### 2. Налаштування змінних середовища

Скопіюйте `env.example` в `.env.local` та налаштуйте:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/storyflow"
DIRECT_URL="postgresql://username:password@localhost:5432/storyflow"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_PRICE_ID="price_your_premium_plan_price_id"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Налаштування Stripe

#### Створення продукту та ціни:
1. Увійдіть в [Stripe Dashboard](https://dashboard.stripe.com/)
2. Перейдіть в **Products** → **Add Product**
3. Створіть продукт "StoryFlow Premium"
4. Додайте ціну (наприклад, $9.99/місяць)
5. Скопіюйте Price ID в `STRIPE_PRICE_ID`

#### Налаштування Webhook:
1. Перейдіть в **Developers** → **Webhooks**
2. Додайте endpoint: `https://your-domain.com/api/stripe/webhook`
3. Виберіть події:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Скопіюйте Webhook Secret в `STRIPE_WEBHOOK_SECRET`

### 4. Запуск проекту

```bash
# Встановити залежності
npm install

# Запустити в режимі розробки
npm run dev

# Або збілдити для production
npm run build
npm start
```

## 🔧 API Endpoints

### Аутентифікація
- `POST /api/auth/signup` - Реєстрація
- `POST /api/auth/login` - Вхід
- `GET /api/auth/me` - Отримати поточного користувача
- `POST /api/auth/logout` - Вихід

### Історії
- `GET /api/stories` - Отримати історії (з фільтрами)
- `POST /api/stories` - Створити історію (потребує auth)
- `GET /api/stories/[id]` - Отримати конкретну історію

### Платежі
- `POST /api/checkout` - Створити сесію оплати
- `POST /api/billing-portal` - Доступ до порталу клієнта
- `POST /api/stripe/webhook` - Webhook для Stripe

### Генерація
- `POST /api/generate` - Генерація історії

## 🛡️ Безпека

### JWT Tokens
- Токени зберігаються в httpOnly cookies
- Термін дії: 7 днів
- Автоматичне оновлення при використанні

### Валідація
- Email формат перевіряється
- Пароль мінімум 6 символів
- Всі API запити валідуються

### Rate Limiting
- Middleware захищає від DDoS
- Обмеження на кількість запитів

## 🗄️ База даних

### Схема
- **User**: Користувачі з аутентифікацією
- **Story**: Історії з метаданими
- **Rating**: Рейтинги історій
- **Subscription**: Підписки користувачів
- **Session**: Сесії користувачів
- **Listing**: Лістинг історій для продажу

### Міграції
```bash
# Створити нову міграцію
npx prisma migrate dev --name add_new_feature

# Застосувати міграції в production
npx prisma migrate deploy
```

## 🔍 Моніторинг

### Логи
- Всі помилки логуються в консоль
- Webhook події логуються
- Аутентифікаційні спроби відстежуються

### Health Check
- `GET /api/health` - Перевірка стану API
- Перевіряє підключення до БД
- Перевіряє конфігурацію Stripe

## 🚀 Deployment

### Vercel
1. Підключіть GitHub репозиторій
2. Налаштуйте змінні середовища
3. Запустіть міграції: `npm run prisma:migrate:deploy`
4. Деплой автоматичний при push

### Environment Variables
Обов'язкові для production:
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID`
- `NEXT_PUBLIC_SITE_URL`

## 🐛 Troubleshooting

### Проблеми з базою даних
```bash
# Перевірити підключення
npx prisma db pull

# Скинути базу даних
npx prisma migrate reset

# Переглянути схему
npx prisma studio
```

### Проблеми зі Stripe
- Перевірте правильність ключів
- Перевірте webhook endpoint
- Перевірте події в Stripe Dashboard

### Проблеми з аутентифікацією
- Перевірте JWT_SECRET
- Перевірте cookies в браузері
- Перевірте CORS налаштування
