#!/usr/bin/env python3
"""
StoryFlow - Локальний сервер для розробки
Підтримує CORS та статичні файли
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP Request Handler з підтримкою CORS"""
    
    def end_headers(self):
        """Додає CORS заголовки до відповіді"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Обробка preflight запитів"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Обробка GET запитів"""
        # Логування запитів
        print(f"[GET] {self.client_address[0]} - {self.path}")
        
        # Перевірка на API запити
        if self.path.startswith('/api/'):
            self.handle_api_request()
            return
        
        # Обробка статичних файлів
        super().do_GET()
    
    def do_POST(self):
        """Обробка POST запитів"""
        print(f"[POST] {self.client_address[0]} - {self.path}")
        
        if self.path.startswith('/api/'):
            self.handle_api_request()
            return
        
        # Повертаємо 404 для невідомих POST запитів
        self.send_error(404, "Not Found")
    
    def handle_api_request(self):
        """Обробка API запитів"""
        if self.path == '/api/health':
            self.send_health_response()
        elif self.path == '/api/generate-story':
            self.send_story_response()
        elif self.path == '/api/generate-image':
            self.send_image_response()
        else:
            self.send_error(404, "API endpoint not found")
    
    def send_health_response(self):
        """Відповідь на health check"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        response = {
            'status': 'ok',
            'service': 'StoryFlow',
            'version': '1.0.0'
        }
        self.wfile.write(str(response).encode())
    
    def send_story_response(self):
        """Відповідь на запит генерації історії"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        # Заглушка для генерації історії
        response = {
            'success': True,
            'story': {
                'title': 'Тестова історія',
                'pages': [
                    'Це перша сторінка тестової історії.',
                    'Це друга сторінка тестової історії.',
                    'Це третя сторінка тестової історії.'
                ]
            }
        }
        self.wfile.write(str(response).encode())
    
    def send_image_response(self):
        """Відповідь на запит генерації зображення"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        # Заглушка для генерації зображення
        response = {
            'success': True,
            'image_url': 'https://picsum.photos/800/400?random=1'
        }
        self.wfile.write(str(response).encode())

def main():
    """Головна функція"""
    port = 8000
    
    # Перевірка аргументів командного рядка
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Помилка: порт має бути числом")
            sys.exit(1)
    
    # Зміна робочої директорії на папку з файлами
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Створення сервера
    with socketserver.TCPServer(("", port), CORSRequestHandler) as httpd:
        print(f"🚀 StoryFlow сервер запущений на http://localhost:{port}")
        print(f"📁 Робоча директорія: {script_dir}")
        print("🛑 Для зупинки натисніть Ctrl+C")
        print("-" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Сервер зупинено")
            httpd.shutdown()

if __name__ == "__main__":
    main()
