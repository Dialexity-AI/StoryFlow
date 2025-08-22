#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 StoryFlow Production Setup\n');

// Перевірка наявності необхідних файлів
const requiredFiles = [
  'package.json',
  'prisma/schema.prisma',
  'lib/auth.ts',
  'lib/stripe.ts'
];

console.log('📋 Перевірка файлів...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Файл ${file} не знайдено`);
    process.exit(1);
  }
}
console.log('✅ Всі необхідні файли знайдено\n');

// Генерація JWT секрету
console.log('🔐 Генерація JWT секрету...');
const jwtSecret = require('crypto').randomBytes(64).toString('hex');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Перевірка Prisma
console.log('🗄️ Перевірка Prisma...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client згенеровано');
} catch (error) {
  console.error('❌ Помилка генерації Prisma Client');
  process.exit(1);
}

// Створення .env.example якщо не існує
if (!fs.existsSync('env.example')) {
  console.log('📝 Створення env.example...');
  const envExample = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/storyflow"
DIRECT_URL="postgresql://username:password@localhost:5432/storyflow"

# JWT Configuration
JWT_SECRET="${jwtSecret}"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_PRICE_ID="price_your_premium_plan_price_id"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# AI Server (optional - for external AI generation)
AI_SERVER_URL="http://localhost:8000"

# Development
NODE_ENV="development"
`;
  fs.writeFileSync('env.example', envExample);
  console.log('✅ env.example створено');
}

console.log('\n🎉 Налаштування завершено!\n');

console.log('📋 Наступні кроки:');
console.log('1. Створіть базу даних на Neon: https://neon.tech');
console.log('2. Налаштуйте Stripe: https://dashboard.stripe.com/');
console.log('3. Додайте змінні середовища в Vercel');
console.log('4. Запустіть міграції: npm run prisma:migrate:deploy');
console.log('5. Перевірте health check: /api/health\n');

console.log('📚 Документація:');
console.log('- VERCEL_SETUP.md - детальна інструкція');
console.log('- SETUP_BACKEND.md - загальна документація');
console.log('- env.example - приклад змінних середовища\n');

console.log('🔗 Корисні посилання:');
console.log('- Neon Database: https://neon.tech');
console.log('- Stripe Dashboard: https://dashboard.stripe.com/');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
console.log('- Prisma Studio: npx prisma studio');
