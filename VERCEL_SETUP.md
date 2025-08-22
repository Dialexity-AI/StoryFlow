# Налаштування StoryFlow на Vercel

## 🗄️ Крок 1: База даних (Neon)

### 1.1 Створення бази даних
1. Перейдіть на [neon.tech](https://neon.tech)
2. Створіть акаунт та новий проект "storyflow"
3. Скопіюйте connection string з формату:
   ```
   postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/storyflow?sslmode=require
   ```

### 1.2 Налаштування в Vercel
1. Перейдіть в [Vercel Dashboard](https://vercel.com/dashboard)
2. Виберіть ваш StoryFlow проект
3. Перейдіть в **Settings** → **Environment Variables**
4. Додайте змінні:

```
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/storyflow?sslmode=require
DIRECT_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/storyflow?sslmode=require
```

## 🔐 Крок 2: JWT Secret

### 2.1 Генерація секретного ключа
```bash
# В терміналі виконайте:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.2 Додавання в Vercel
```
JWT_SECRET=your-generated-secret-key-here
```

## 💳 Крок 3: Stripe налаштування

### 3.1 Створення продукту в Stripe
1. Перейдіть в [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Products** → **Add Product**
3. Назва: "StoryFlow Premium"
4. Ціна: $9.99/місяць (recurring)
5. Скопіюйте Price ID (наприклад: `price_1ABC123DEF456`)

### 3.2 Налаштування Webhook
1. **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-domain.vercel.app/api/stripe/webhook`
3. Події:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Скопіюйте Webhook Secret

### 3.3 Додавання Stripe змінних в Vercel
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_PRICE_ID=price_your_premium_plan_price_id
```

## 🌐 Крок 4: Site URL

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🚀 Крок 5: Запуск міграцій

### 5.1 В Vercel Dashboard
1. Перейдіть в **Deployments**
2. Виберіть останній deployment
3. **Functions** → **View Function Logs**
4. Додайте команду в **Build Command**:
   ```bash
   npm run prisma:generate && npm run prisma:migrate:deploy && npm run build
   ```

### 5.2 Або через Vercel CLI
```bash
# Встановити Vercel CLI
npm i -g vercel

# Увійти в акаунт
vercel login

# Запустити міграції
vercel env pull .env.local
npx prisma migrate deploy
```

## ✅ Крок 6: Перевірка

### 6.1 Health Check
Відкрийте: `https://your-domain.vercel.app/api/health`

Очікуваний результат:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "services": {
    "database": "connected",
    "stripe": "configured"
  },
  "environment": "production"
}
```

### 6.2 Тестування API
```bash
# Тест реєстрації
curl -X POST https://your-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Тест health check
curl https://your-domain.vercel.app/api/health
```

## 🐛 Troubleshooting

### Проблеми з базою даних
- Перевірте connection string в Neon
- Переконайтеся що `sslmode=require` додано
- Перевірте що база даних активна

### Проблеми зі Stripe
- Перевірте що webhook endpoint правильний
- Переконайтеся що всі події вибрані
- Перевірте логи в Stripe Dashboard

### Проблеми з міграціями
- Перевірте логи в Vercel
- Спробуйте запустити міграції локально
- Перевірте схему в Prisma Studio

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи в Vercel Dashboard
2. Перевірте health check endpoint
3. Перевірте всі змінні середовища
4. Перезапустіть deployment
