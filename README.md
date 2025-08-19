# StoryFlow - Генератор історій з картинками

Сучасний вебсайт для створення унікальних історій з використанням штучного інтелекту та генерації зображень.

## 🌟 Особливості

- **Сучасний дизайн** з спокійними кольорами (бежевий, білий) та темним режимом
- **Генерація історій** з використанням локальних AI моделей
- **Генерація зображень** через Stable Diffusion
- **Мультимовність** (українська, англійська, іспанська)
- **Преміум підписка** з розширеними можливостями
- **Збереження та поділення** історій
- **Адаптивний дизайн** для всіх пристроїв

## 🚀 Швидкий старт

### 1. Завантаження проекту

```bash
# Клонуйте репозиторій або завантажте файли
git clone <repository-url>
cd StoryFlow
```

### 2. Запуск сайту

```bash
# Відкрийте index.html у браузері
# Або використовуйте локальний сервер

# Python 3
python -m http.server 8000

# Node.js (якщо встановлений)
npx serve .

# PHP
php -S localhost:8000
```

### 3. Відкрийте браузер

Перейдіть за адресою: `http://localhost:8000`

## 🤖 Підключення локальних моделей

### Ollama (Llama, Mistral, тощо)

1. **Встановлення Ollama:**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Завантажте з https://ollama.ai/download
   ```

2. **Завантаження моделі:**
   ```bash
   # Llama 2
   ollama pull llama2
   
   # Mistral
   ollama pull mistral
   
   # Українська модель (якщо доступна)
   ollama pull llama2:7b-uk
   ```

3. **Запуск Ollama:**
   ```bash
   ollama serve
   ```

4. **Тестування з'єднання:**
   ```bash
   curl -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"model": "llama2", "prompt": "Привіт, як справи?"}'
   ```

### Stable Diffusion

1. **Встановлення через ComfyUI:**
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI
   cd ComfyUI
   pip install -r requirements.txt
   python main.py
   ```

2. **Або через Automatic1111:**
   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
   cd stable-diffusion-webui
   webui.bat  # Windows
   ./webui.sh  # Linux/macOS
   ```

3. **Налаштування API:**
   - Відкрийте `http://localhost:7860` (Automatic1111)
   - Увімкніть API в налаштуваннях
   - Або використовуйте ComfyUI на порту 8188

## ⚙️ Налаштування інтеграції

### 1. Редагування script.js

Знайдіть функції `callLocalModel` та `callStableDiffusion` та налаштуйте їх під ваші моделі:

```javascript
// Для Ollama
async callLocalModel(prompt, modelType = 'llama2') {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelType,
                prompt: prompt,
                stream: false
            })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Помилка з\'єднання з Ollama:', error);
        throw error;
    }
}

// Для Stable Diffusion
async callStableDiffusion(prompt) {
    try {
        const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                negative_prompt: 'blurry, low quality, distorted',
                steps: 20,
                cfg_scale: 7,
                width: 800,
                height: 400
            })
        });
        
        const data = await response.json();
        return `data:image/png;base64,${data.images[0]}`;
    } catch (error) {
        console.error('Помилка з\'єднання з Stable Diffusion:', error);
        throw error;
    }
}
```

### 2. Активація реальної генерації

Замініть заглушки в функції `generateStoryContent`:

```javascript
async generateStoryContent(theme, length, style) {
    const prompt = `Створи ${length} сторінок історії в стилі ${style} про ${theme}. 
                   Кожна сторінка має бути окремим абзацем українською мовою.`;
    
    try {
        const response = await this.callLocalModel(prompt, 'llama2');
        // Парсимо відповідь та розбиваємо на сторінки
        const pages = response.split('\n\n').filter(page => page.trim());
        
        return {
            title: `Історія про ${theme}`,
            pages: pages.slice(0, parseInt(length)),
            theme: theme,
            style: style,
            length: length,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        // Повертаємо заглушку при помилці
        return this.getFallbackStory(theme, length, style);
    }
}
```

## 🎨 Налаштування дизайну

### Кольори

Основні кольори визначені в CSS змінних:

```css
:root {
    --primary-color: #8B7355;      /* Основний бежевий */
    --secondary-color: #D2B48C;    /* Світло-бежевий */
    --accent-color: #F5DEB3;       /* Світло-жовтий */
    --background-color: #FAF9F6;   /* Світло-бежевий фон */
    --surface-color: #FFFFFF;      /* Білий */
}
```

### Темний режим

```css
[data-theme="dark"] {
    --background-color: #1A1A1A;
    --surface-color: #2D2D2D;
    --text-primary: #FFFFFF;
    --text-secondary: #CCCCCC;
}
```

## 📱 Адаптивність

Сайт автоматично адаптується під різні розміри екранів:

- **Desktop**: Повний функціонал з бічною рекламою
- **Tablet**: Адаптована навігація
- **Mobile**: Мобільна версія без реклами

## 🔧 Розширення функціональності

### Додавання нових мов

1. Додайте опцію в HTML:
```html
<option value="fr">🇫🇷 Français</option>
```

2. Додайте переклади в JavaScript:
```javascript
fr: {
    heroTitle: 'Créez des Histoires Magiques avec des Images',
    heroSubtitle: 'Générateur d\'Histoires IA pour Enfants et Adultes',
    // ...
}
```

### Додавання нових стилів історій

1. Додайте опцію в HTML:
```html
<option value="mystery">Детективна</option>
```

2. Додайте шаблон в JavaScript:
```javascript
mystery: {
    title: `Таємниця ${theme}`,
    pages: [
        `У маленькому містечку з'явилася таємниця, пов'язана з ${theme}.`,
        // ...
    ]
}
```

## 🚀 Розгортання на хостингу

### Netlify

1. Завантажте файли на GitHub
2. Підключіть репозиторій до Netlify
3. Налаштуйте домен

### Vercel

1. Встановіть Vercel CLI
2. Запустіть `vercel` в папці проекту
3. Слідуйте інструкціям

### GitHub Pages

1. Створіть репозиторій `username.github.io`
2. Завантажте файли
3. Увімкніть GitHub Pages в налаштуваннях

## 🔒 Безпека

- Всі дані зберігаються локально в браузері
- API ключі не передаються на сервер
- Локальні моделі працюють без інтернету

## 📊 Монетизація

### Рекламні блоки

Рекламні блоки автоматично показуються не-преміум користувачам:

```javascript
// Приховування реклами для преміум користувачів
if (this.isPremium) {
    document.getElementById('adContainer').style.display = 'none';
}
```

### Преміум функції

- Необмежена генерація історій
- Відсутність реклами
- Розширені стилі та теми
- Пріоритетна підтримка

## 🐛 Вирішення проблем

### Помилка з'єднання з Ollama

```bash
# Перевірте, чи запущений Ollama
ollama list

# Перезапустіть сервіс
ollama serve
```

### Помилка з'єднання з Stable Diffusion

```bash
# Перевірте порт
netstat -an | grep 7860

# Перезапустіть webui
./webui.sh --api
```

### Проблеми з CORS

Додайте заголовки в локальний сервер:

```python
# Python
import http.server
import socketserver

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

with socketserver.TCPServer(("", 8000), CORSRequestHandler) as httpd:
    httpd.serve_forever()
```

## 📞 Підтримка

- **Email**: support@storyflow.com
- **GitHub Issues**: Створюйте issues для багів
- **Discord**: Приєднуйтесь до спільноти

## 📄 Ліцензія

MIT License - дивіться файл LICENSE для деталей.

## 🤝 Внесок

1. Форкніть репозиторій
2. Створіть гілку для нової функції
3. Зробіть коміт змін
4. Створіть Pull Request

---

**StoryFlow** - Створюємо чарівні історії разом! ✨
