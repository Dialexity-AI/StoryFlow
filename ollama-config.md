# Налаштування Ollama для StoryFlow

## Встановлення Ollama

### Windows
1. Завантажте інсталятор з [ollama.ai/download](https://ollama.ai/download)
2. Запустіть інсталятор та слідуйте інструкціям
3. Перезавантажте комп'ютер

### macOS
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Завантаження моделей

### Llama 2 (рекомендована)
```bash
# Базова модель
ollama pull llama2

# 7B параметрів (швидша)
ollama pull llama2:7b

# 13B параметрів (краща якість)
ollama pull llama2:13b
```

### Mistral (альтернатива)
```bash
# Mistral 7B
ollama pull mistral

# Mistral Instruct
ollama pull mistral:instruct
```

### Українські моделі
```bash
# Якщо доступна українська версія
ollama pull llama2:7b-uk
```

## Запуск Ollama

```bash
# Запуск сервера
ollama serve

# В іншому терміналі перевірте статус
ollama list
```

## Тестування з'єднання

### Curl тест
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "prompt": "Створи коротку історію про космічну подорож українською мовою",
    "stream": false
  }'
```

### Python тест
```python
import requests
import json

url = "http://localhost:11434/api/generate"
data = {
    "model": "llama2",
    "prompt": "Створи коротку історію про космічну подорож українською мовою",
    "stream": False
}

response = requests.post(url, json=data)
print(response.json()['response'])
```

## Інтеграція з StoryFlow

### 1. Редагування script.js

Знайдіть функцію `callLocalModel` та замініть її:

```javascript
async callLocalModel(prompt, modelType = 'llama2') {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: modelType,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    max_tokens: 1000
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Помилка з\'єднання з Ollama:', error);
        throw error;
    }
}
```

### 2. Створення промптів для історій

```javascript
async generateStoryContent(theme, length, style) {
    const stylePrompts = {
        adventure: 'пригодницька історія з елементами подорожі та відкриттів',
        fantasy: 'фентезі історія з чарівними елементами та магією',
        educational: 'навчальна історія з корисними фактами та знаннями',
        funny: 'смішна історія з гумором та веселими ситуаціями'
    };

    const prompt = `Створи ${length} сторінок ${stylePrompts[style]} про "${theme}". 
                   Кожна сторінка має бути окремим абзацем українською мовою.
                   Історія має бути цікавою для дітей та дорослих.
                   Використовуй яскраві описи та диалоги.
                   
                   Формат відповіді:
                   Сторінка 1: [текст першої сторінки]
                   
                   Сторінка 2: [текст другої сторінки]
                   
                   [і так далі...]`;

    try {
        const response = await this.callLocalModel(prompt, 'llama2');
        
        // Парсимо відповідь
        const pages = response
            .split(/\n+/)
            .filter(line => line.trim().startsWith('Сторінка'))
            .map(line => line.replace(/^Сторінка \d+:\s*/, ''))
            .filter(text => text.trim().length > 0);

        return {
            title: `${stylePrompts[style]} про ${theme}`,
            pages: pages.slice(0, parseInt(length)),
            theme: theme,
            style: style,
            length: length,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Помилка генерації історії:', error);
        // Повертаємо заглушку при помилці
        return this.getFallbackStory(theme, length, style);
    }
}
```

## Оптимізація продуктивності

### Налаштування параметрів

```javascript
// В функції callLocalModel
options: {
    temperature: 0.7,    // Креативність (0.0 - 1.0)
    top_p: 0.9,         // Якість відповіді
    max_tokens: 1000,   // Максимальна довжина
    repeat_penalty: 1.1 // Штраф за повторення
}
```

### Кешування результатів

```javascript
// Додайте кеш для збереження результатів
this.storyCache = new Map();

async generateStoryContent(theme, length, style) {
    const cacheKey = `${theme}-${length}-${style}`;
    
    if (this.storyCache.has(cacheKey)) {
        return this.storyCache.get(cacheKey);
    }
    
    // ... генерація історії ...
    
    this.storyCache.set(cacheKey, story);
    return story;
}
```

## Вирішення проблем

### Помилка "Connection refused"
```bash
# Перевірте, чи запущений Ollama
ollama list

# Перезапустіть сервіс
ollama serve
```

### Повільна генерація
```bash
# Використовуйте меншу модель
ollama pull llama2:7b

# Або налаштуйте GPU (якщо доступний)
ollama run llama2:7b --gpu
```

### Погана якість історій
```javascript
// Покращіть промпт
const prompt = `Ти - професійний письменник дитячих історій. 
               Створи захоплюючу ${length}-сторінкову історію про "${theme}" 
               в стилі ${style}. Кожна сторінка має бути 2-3 речення, 
               написана українською мовою для дітей 6-12 років.`;
```

## Моніторинг використання

### Логи Ollama
```bash
# Перегляд логів
tail -f ~/.ollama/logs/ollama.log

# Очищення логів
rm ~/.ollama/logs/ollama.log
```

### Метрики в StoryFlow
```javascript
// Додайте метрики
this.metrics = {
    storiesGenerated: 0,
    averageGenerationTime: 0,
    errors: 0
};

// В функції generateStoryContent
const startTime = Date.now();
// ... генерація ...
const endTime = Date.now();
this.metrics.storiesGenerated++;
this.metrics.averageGenerationTime = 
    (this.metrics.averageGenerationTime + (endTime - startTime)) / 2;
```

## Безпека

### Локальне використання
- Ollama працює повністю локально
- Дані не передаються в інтернет
- Можна використовувати без інтернету

### Обмеження доступу
```bash
# Запуск тільки для локального доступу
ollama serve --host 127.0.0.1
```

## Оновлення моделей

```bash
# Оновлення всіх моделей
ollama pull llama2:latest

# Видалення старої версії
ollama rm llama2:7b
```
