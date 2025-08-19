# Deployment Guide (StoryFlow)

## 1) Requirements
- Node.js 18.17+ (or 20 LTS)
- PostgreSQL 14+ (managed DB або Docker)
- Заповнений файл `.env` на основі `.env.example`

## 2) Production env vars (.env)
Скопіюйте `.env.example` у `.env` і виставте значення:
- `DATABASE_URL` — підключення до Postgres
- `JWT_SECRET` — довгий випадковий рядок
- `NEXT_PUBLIC_SITE_URL` — публічний URL сайту
- (опц.) Stripe: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`

## 3) Локально з Docker (dev)
```bash
# підняти Postgres
npm run db:up
# згенерувати Prisma клієнт
npm run prisma:generate
# накатити схему
npm run prisma:push
# запуск дев-сервера
npm run dev
```

## 4) Production build (без Docker)
```bash
# встановити залежності
npm ci
# згенерувати Prisma
npm run prisma:generate
# зібрати Next.js
npm run build
# застосувати міграції в проді
npm run prisma:migrate:deploy
# старт
npm run start
```

## 5) Docker build (app only)
```bash
# побудова образу
docker build -t storyflow-app .
# запуск контейнера (потрібен зовнішній Postgres)
# передайте DATABASE_URL та інші змінні середовища
docker run -d --name storyflow -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public \
  -e JWT_SECRET=please_change_me \
  storyflow-app
```

## 6) Hetzner VPS (рекомендовано)
- Встановіть Node.js LTS, Nginx, Docker (за потреби)
- Налаштуйте системний сервіс (pm2 або systemd) для процесу `npm run start`
- Nginx як reverse proxy до `127.0.0.1:3000`
- SSL через Let’s Encrypt

Приклад Nginx (спрощено):
```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 7) Post-deploy checklist
- [ ] Перевірити `DATABASE_URL`
- [ ] Запустити `npm run prisma:migrate:deploy`
- [ ] Перевірити логін/реєстрацію (`/signup`, `/login`)
- [ ] Перевірити історії (`/library`, `/api/stories`)
- [ ] Увімкнути Cloudflare CDN (опц.)
- [ ] Налаштувати резервні копії БД

---
У разі питань: див. `README.md` або відкрийте issue.

