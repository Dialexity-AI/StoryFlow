# Налаштування Stable Diffusion для StoryFlow

## Вибір інтерфейсу

### Automatic1111 WebUI (рекомендований)

#### Встановлення

**Windows:**
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
webui.bat
```

**Linux/macOS:**
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
./webui.sh
```

#### Налаштування API

1. Відкрийте `http://localhost:7860`
2. Перейдіть в Settings → API
3. Увімкніть "Enable API"
4. Збережіть налаштування
5. Перезапустіть WebUI

### ComfyUI (альтернатива)

```bash
git clone https://github.com/comfyanonymous/ComfyUI
cd ComfyUI
pip install -r requirements.txt
python main.py
```

## Завантаження моделей

### Базові моделі

```bash
# Stable Diffusion 1.5
# Завантажте з Hugging Face
# https://huggingface.co/runwayml/stable-diffusion-v1-5

# Stable Diffusion 2.1
# https://huggingface.co/stabilityai/stable-diffusion-2-1

# Stable Diffusion XL
# https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
```

### Спеціалізовані моделі для дітей

```bash
# Дитячі ілюстрації
# https://civitai.com/models/1234/childrens-book-illustration

# Карикатурний стиль
# https://civitai.com/models/5678/cartoon-style
```

## Інтеграція з StoryFlow

### 1. Редагування script.js

```javascript
async callStableDiffusion(prompt) {
    try {
        const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                negative_prompt: 'blurry, low quality, distorted, nsfw, adult content',
                steps: 20,
                cfg_scale: 7,
                width: 800,
                height: 400,
                sampler_name: 'DPM++ 2M Karras',
                batch_size: 1,
                restore_faces: false,
                tiling: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return `data:image/png;base64,${data.images[0]}`;
    } catch (error) {
        console.error('Помилка з\'єднання з Stable Diffusion:', error);
        throw error;
    }
}
```

### 2. Створення промптів для зображень

```javascript
async generateImages(story, length) {
    const images = [];
    
    for (let i = 0; i < parseInt(length); i++) {
        const pageText = story.pages[i];
        
        // Створюємо промпт на основі тексту сторінки
        const imagePrompt = this.createImagePrompt(pageText, story.style);
        
        try {
            const imageData = await this.callStableDiffusion(imagePrompt);
            images.push(imageData);
        } catch (error) {
            console.error(`Помилка генерації зображення ${i + 1}:`, error);
            // Використовуємо заглушку
            images.push(`https://picsum.photos/800/400?random=${i}`);
        }
    }
    
    return images;
}

createImagePrompt(pageText, style) {
    const stylePrompts = {
        adventure: 'adventure scene, vibrant colors, dynamic composition',
        fantasy: 'fantasy illustration, magical elements, dreamy atmosphere',
        educational: 'educational illustration, clear and simple, friendly style',
        funny: 'cartoon style, humorous illustration, bright colors'
    };
    
    // Видаляємо зайві слова та створюємо короткий опис
    const cleanText = pageText
        .replace(/[^\w\s]/g, ' ')
        .split(' ')
        .slice(0, 10)
        .join(' ');
    
    return `${cleanText}, ${stylePrompts[style]}, children's book illustration, high quality, detailed`;
}
```

## Оптимізація якості

### Налаштування параметрів

```javascript
const sdParams = {
    // Основні параметри
    steps: 20,              // Кількість кроків (20-30 для балансу)
    cfg_scale: 7,           // Слідування промпту (7-10)
    width: 800,             // Ширина зображення
    height: 400,            // Висота зображення
    
    // Семплер
    sampler_name: 'DPM++ 2M Karras', // Кращий семплер
    
    // Додаткові налаштування
    restore_faces: false,   // Відновлення облич
    tiling: false,          // Повторення
    batch_size: 1,          // Розмір пакету
};
```

### Покращення промптів

```javascript
// Позитивні промпти
const positivePrompt = `
    ${sceneDescription}, 
    children's book illustration, 
    high quality, 
    detailed, 
    vibrant colors, 
    professional artwork, 
    safe for children, 
    family friendly
`;

// Негативні промпти
const negativePrompt = `
    blurry, 
    low quality, 
    distorted, 
    nsfw, 
    adult content, 
    violence, 
    scary, 
    dark, 
    realistic, 
    photograph
`;
```

## Кешування зображень

```javascript
class ImageCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100; // Максимальна кількість зображень
    }
    
    async getImage(prompt) {
        const key = this.hashPrompt(prompt);
        
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        const image = await this.generateImage(prompt);
        
        if (this.cache.size >= this.maxSize) {
            // Видаляємо найстаріший елемент
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, image);
        return image;
    }
    
    hashPrompt(prompt) {
        // Простий хеш для промпту
        return prompt.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
}
```

## Вирішення проблем

### Помилка "Connection refused"

```bash
# Перевірте, чи запущений WebUI
netstat -an | grep 7860

# Перезапустіть з API
./webui.sh --api

# Або в Windows
webui.bat --api
```

### Повільна генерація

```javascript
// Зменшіть кількість кроків
steps: 15,

// Використовуйте менший розмір
width: 512,
height: 256,

// Увімкніть GPU (якщо доступний)
// В налаштуваннях WebUI
```

### Погана якість зображень

```javascript
// Покращіть промпт
const betterPrompt = `
    ${sceneDescription}, 
    professional children's book illustration, 
    watercolor style, 
    warm colors, 
    detailed background, 
    high resolution, 
    masterpiece
`;

// Збільшіть кількість кроків
steps: 30,
cfg_scale: 8,
```

## Моніторинг використання

### Логи WebUI

```bash
# Перегляд логів
tail -f webui.log

# Очищення логів
> webui.log
```

### Метрики в StoryFlow

```javascript
this.imageMetrics = {
    imagesGenerated: 0,
    averageGenerationTime: 0,
    errors: 0,
    cacheHits: 0
};

// В функції generateImages
const startTime = Date.now();
// ... генерація ...
const endTime = Date.now();
this.imageMetrics.imagesGenerated++;
this.imageMetrics.averageGenerationTime = 
    (this.imageMetrics.averageGenerationTime + (endTime - startTime)) / 2;
```

## Безпека

### Фільтрація контенту

```javascript
// Фільтр небажаного контенту
const contentFilter = {
    blockedWords: ['nsfw', 'adult', 'violence', 'blood', 'scary'],
    
    isSafe(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        return !this.blockedWords.some(word => lowerPrompt.includes(word));
    }
};

// Використання
if (!contentFilter.isSafe(prompt)) {
    throw new Error('Небезпечний контент виявлено');
}
```

### Обмеження доступу

```bash
# Запуск тільки для локального доступу
./webui.sh --listen --port 7860 --server-name 127.0.0.1
```

## Оновлення моделей

```bash
# Оновлення WebUI
cd stable-diffusion-webui
git pull

# Завантаження нових моделей
# Помістіть .safetensors файли в models/Stable-diffusion/
```

## Альтернативні API

### Replicate API

```javascript
async callReplicateAPI(prompt) {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input: {
                prompt: prompt,
                negative_prompt: "blurry, low quality",
                width: 800,
                height: 400
            }
        })
    });
    
    const data = await response.json();
    return data.output[0];
}
```

### Hugging Face API

```javascript
async callHuggingFaceAPI(prompt) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        }
    );
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
```
