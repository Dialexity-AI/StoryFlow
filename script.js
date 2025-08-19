// StoryFlow - JavaScript функціональність

class StoryFlow {
    constructor() {
        this.currentLanguage = 'uk';
        this.currentTheme = 'light';
        this.isPremium = false;
        this.stories = [];
        this.currentStory = null;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.loadStories();
        this.showSection('home');
    }

    // Завантаження налаштувань з localStorage
    loadSettings() {
        const savedTheme = localStorage.getItem('storyflow-theme');
        const savedLanguage = localStorage.getItem('storyflow-language');
        const savedPremium = localStorage.getItem('storyflow-premium');

        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.setTheme(savedTheme);
        }

        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
            this.setLanguage(savedLanguage);
        }

        if (savedPremium) {
            this.isPremium = JSON.parse(savedPremium);
        }
    }

    // Налаштування обробників подій
    setupEventListeners() {
        // Навігація
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Перемикач теми
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Вибір мови
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Кнопка створення історії
        document.getElementById('createStoryBtn').addEventListener('click', () => {
            this.showStoryGenerator();
        });

        // Генерація історії
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateStory();
        });

        // Збереження історії
        document.getElementById('saveStoryBtn').addEventListener('click', () => {
            this.saveStory();
        });

        // Поділення історії
        document.getElementById('shareStoryBtn').addEventListener('click', () => {
            this.shareStory();
        });

        // Преміум кнопки
        document.querySelectorAll('.pricing-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                this.upgradeToPremium();
            });
        });
    }

    // Показ секції
    showSection(sectionId) {
        // Приховуємо всі секції
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Показуємо потрібну секцію
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Оновлюємо активне посилання в навігації
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Прокручуємо до початку секції
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Перемикання теми
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('storyflow-theme', theme);

        // Оновлюємо іконку
        const themeIcon = document.querySelector('#themeToggle i');
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // Встановлення мови
    setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('storyflow-language', language);
        this.updateContent();
    }

    // Оновлення контенту при зміні мови
    updateContent() {
        const translations = this.getTranslations();
        
        // Оновлюємо заголовки
        document.querySelector('.hero-title').textContent = translations.heroTitle;
        document.querySelector('.hero-subtitle').textContent = translations.heroSubtitle;
        
        // Оновлюємо кнопки
        document.getElementById('createStoryBtn').innerHTML = 
            `<i class="fas fa-magic"></i>${translations.createStory}`;
        document.getElementById('generateBtn').innerHTML = 
            `<i class="fas fa-wand-magic-sparkles"></i>${translations.generateStory}`;
    }

    // Переклади
    getTranslations() {
        const translations = {
            uk: {
                heroTitle: 'Створюйте чарівні історії з картинками',
                heroSubtitle: 'Генератор історій з штучним інтелектом для дітей та дорослих',
                createStory: 'Створити нову історію',
                generateStory: 'Згенерувати історію',
                loading: 'Створюємо вашу історію...',
                save: 'Зберегти',
                share: 'Поділитися'
            },
            en: {
                heroTitle: 'Create Magical Stories with Pictures',
                heroSubtitle: 'AI Story Generator for Children and Adults',
                createStory: 'Create New Story',
                generateStory: 'Generate Story',
                loading: 'Creating your story...',
                save: 'Save',
                share: 'Share'
            },
            es: {
                heroTitle: 'Crea Historias Mágicas con Imágenes',
                heroSubtitle: 'Generador de Historias con IA para Niños y Adultos',
                createStory: 'Crear Nueva Historia',
                generateStory: 'Generar Historia',
                loading: 'Creando tu historia...',
                save: 'Guardar',
                share: 'Compartir'
            }
        };

        return translations[this.currentLanguage] || translations.uk;
    }

    // Показ генератора історій
    showStoryGenerator() {
        const generator = document.getElementById('storyGenerator');
        generator.style.display = 'block';
        generator.scrollIntoView({ behavior: 'smooth' });
    }

    // Генерація історії
    async generateStory() {
        const theme = document.getElementById('storyTheme').value;
        const length = document.getElementById('storyLength').value;
        const style = document.getElementById('storyStyle').value;

        if (!theme.trim()) {
            this.showNotification('Будь ласка, введіть тему історії', 'error');
            return;
        }

        // Показуємо завантаження
        this.showLoading(true);

        try {
            // Генеруємо історію
            const story = await this.generateStoryContent(theme, length, style);
            
            // Генеруємо картинки
            const images = await this.generateImages(story, length);
            
            // Показуємо результат
            this.displayStory(story, images);
            
        } catch (error) {
            console.error('Помилка генерації історії:', error);
            this.showNotification('Помилка при створенні історії. Спробуйте ще раз.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Генерація тексту історії
    async generateStoryContent(theme, length, style) {
        // Тут буде інтеграція з локальною моделлю
        // Поки що використовуємо заглушку
        
        const storyTemplates = {
            adventure: {
                title: `Пригоди в ${theme}`,
                pages: [
                    `Жив-був один сміливий мандрівник на ім'я Алекс. Одного дня він вирішив відправитися в подорож до ${theme}.`,
                    `По дорозі Алекс зустрів мудрого старця, який дав йому чарівний компас, що вказував шлях до ${theme}.`,
                    `Коли Алекс дістався до ${theme}, він зрозумів, що це було найкраще рішення в його житті.`
                ]
            },
            fantasy: {
                title: `Чарівна історія про ${theme}`,
                pages: [
                    `У чарівному світі, де все можливо, існувало особливе місце - ${theme}.`,
                    `Там жили чарівні істоти, які охороняли таємниці ${theme} від злих сил.`,
                    `Тільки чисте серце могло побачити справжню красу ${theme} і зрозуміти його магію.`
                ]
            },
            educational: {
                title: `Дізнаємося про ${theme}`,
                pages: [
                    `${theme} - це цікава тема для вивчення. Давайте дізнаємося більше про неї.`,
                    `Історики та вчені багато років вивчали ${theme} і зробили багато важливих відкриттів.`,
                    `Сьогодні ми можемо використовувати знання про ${theme} для покращення нашого життя.`
                ]
            },
            funny: {
                title: `Смішна історія про ${theme}`,
                pages: [
                    `Одного разу один веселий персонаж на ім'я Жарт вирішив зробити ${theme} ще смішнішим.`,
                    `Він так сміявся, що всі навколо почали сміятися разом з ним, навіть ${theme} засміялося!`,
                    `З того дня ${theme} стало найвеселішим місцем у світі, де всі завжди посміхаються.`
                ]
            }
        };

        const template = storyTemplates[style] || storyTemplates.adventure;
        const pages = template.pages.slice(0, parseInt(length));

        return {
            title: template.title,
            pages: pages,
            theme: theme,
            style: style,
            length: length,
            createdAt: new Date().toISOString()
        };
    }

    // Генерація картинок
    async generateImages(story, length) {
        // Тут буде інтеграція з Stable Diffusion або іншим генератором зображень
        // Поки що використовуємо заглушки
        
        const images = [];
        for (let i = 0; i < parseInt(length); i++) {
            // Генеруємо унікальний URL для заглушки
            const seed = Math.floor(Math.random() * 1000);
            images.push(`https://picsum.photos/800/400?random=${seed + i}`);
        }
        
        return images;
    }

    // Показ історії
    displayStory(story, images) {
        this.currentStory = story;
        
        // Оновлюємо заголовок
        document.getElementById('storyTitle').textContent = story.title;
        
        // Створюємо сторінки
        const storyPages = document.getElementById('storyPages');
        storyPages.innerHTML = '';
        
        story.pages.forEach((pageText, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'story-page';
            pageElement.innerHTML = `
                <div class="story-page-image">
                    <img src="${images[index]}" alt="Ілюстрація до сторінки ${index + 1}" loading="lazy">
                </div>
                <div class="story-page-content">
                    <h3 class="story-page-title">Сторінка ${index + 1}</h3>
                    <p class="story-page-text">${pageText}</p>
                </div>
            `;
            storyPages.appendChild(pageElement);
        });
        
        // Показуємо контейнер історії
        document.getElementById('storyContainer').style.display = 'block';
        document.getElementById('storyContainer').scrollIntoView({ behavior: 'smooth' });
    }

    // Показ/приховування завантаження
    showLoading(show) {
        const loadingContainer = document.getElementById('loadingContainer');
        const generator = document.getElementById('storyGenerator');
        
        if (show) {
            loadingContainer.style.display = 'block';
            generator.style.display = 'none';
        } else {
            loadingContainer.style.display = 'none';
            generator.style.display = 'block';
        }
    }

    // Збереження історії
    saveStory() {
        if (!this.currentStory) {
            this.showNotification('Немає історії для збереження', 'error');
            return;
        }

        // Додаємо історію до списку
        this.stories.push(this.currentStory);
        localStorage.setItem('storyflow-stories', JSON.stringify(this.stories));
        
        this.showNotification('Історію збережено!', 'success');
        this.loadStories(); // Оновлюємо список історій
    }

    // Поділення історії
    shareStory() {
        if (!this.currentStory) {
            this.showNotification('Немає історії для поділення', 'error');
            return;
        }

        // Створюємо посилання для поділення
        const shareData = {
            title: this.currentStory.title,
            text: this.currentStory.pages[0], // Перша сторінка як опис
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Копіюємо в буфер обміну
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showNotification('Посилання скопійовано в буфер обміну!', 'success');
            });
        }
    }

    // Завантаження збережених історій
    loadStories() {
        const savedStories = localStorage.getItem('storyflow-stories');
        if (savedStories) {
            this.stories = JSON.parse(savedStories);
        }
        
        this.displayStories();
    }

    // Показ списку історій
    displayStories() {
        const storiesGrid = document.getElementById('storiesGrid');
        
        if (this.stories.length === 0) {
            storiesGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 2rem;">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>Поки що немає збережених історій. Створіть свою першу історію!</p>
                </div>
            `;
            return;
        }

        storiesGrid.innerHTML = this.stories.map((story, index) => `
            <div class="story-card" onclick="storyFlow.openStory(${index})">
                <div class="story-card-image">
                    <img src="https://picsum.photos/400/200?random=${index}" alt="${story.title}">
                </div>
                <div class="story-card-content">
                    <h3 class="story-card-title">${story.title}</h3>
                    <p class="story-card-meta">
                        ${story.style} • ${story.length} сторінок • ${new Date(story.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        `).join('');
    }

    // Відкриття історії
    openStory(index) {
        const story = this.stories[index];
        if (story) {
            this.currentStory = story;
            this.showSection('home');
            
            // Генеруємо картинки для відображення
            this.generateImages(story, story.length).then(images => {
                this.displayStory(story, images);
            });
        }
    }

    // Оновлення до преміум
    upgradeToPremium() {
        this.isPremium = true;
        localStorage.setItem('storyflow-premium', 'true');
        
        // Приховуємо рекламу
        const adContainer = document.getElementById('adContainer');
        if (adContainer) {
            adContainer.style.display = 'none';
        }
        
        this.showNotification('Вітаємо! Ви тепер преміум користувач!', 'success');
    }

    // Показ повідомлень
    showNotification(message, type = 'info') {
        // Створюємо елемент повідомлення
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Додаємо стилі
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 1rem;
            box-shadow: 0 10px 30px var(--shadow-color);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        // Додаємо до сторінки
        document.body.appendChild(notification);

        // Обробник закриття
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Автоматичне закриття через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Інтеграція з локальними моделями
    async callLocalModel(prompt, modelType = 'llama') {
        // Тут буде код для інтеграції з локальними моделями
        // Приклад для Ollama (Llama)
        
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: modelType,
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('Помилка з'єднання з моделлю');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Помилка виклику локальної моделі:', error);
            throw error;
        }
    }

    // Інтеграція з Stable Diffusion
    async callStableDiffusion(prompt) {
        // Тут буде код для інтеграції з Stable Diffusion
        // Приклад для локального API
        
        try {
            const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    negative_prompt: 'blurry, low quality, distorted',
                    steps: 20,
                    cfg_scale: 7,
                    width: 800,
                    height: 400,
                    sampler_name: 'DPM++ 2M Karras'
                })
            });

            if (!response.ok) {
                throw new Error('Помилка з\'єднання з Stable Diffusion');
            }

            const data = await response.json();
            return `data:image/png;base64,${data.images[0]}`;
        } catch (error) {
            console.error('Помилка виклику Stable Diffusion:', error);
            throw error;
        }
    }
}

// Додаємо CSS для повідомлень
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-secondary);
        margin-left: auto;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification-info {
        border-left: 4px solid var(--primary-color);
    }
`;

// Додаємо стилі до сторінки
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Ініціалізація додатку
let storyFlow;
document.addEventListener('DOMContentLoaded', () => {
    storyFlow = new StoryFlow();
});

// Глобальна функція для доступу з HTML
window.storyFlow = null;
document.addEventListener('DOMContentLoaded', () => {
    window.storyFlow = new StoryFlow();
});
