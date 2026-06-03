// ============================================
// ПРАКТИЧЕСКАЯ РАБОТА №3
// JavaScript для галереи: лайки, подсчёт, фильтрация
// ============================================

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Галерея загружена!');
    
    // Подсчёт количества изображений/ресурсов
    function countResources() {
        const cards = document.querySelectorAll('.image-card');
        const counter = document.getElementById('image-counter');
        if (counter) {
            counter.textContent = cards.length;
        }
        console.log(`📊 Найдено ресурсов: ${cards.length}`);
    }
    
    // Система лайков
    function setupLikes() {
        const likeButtons = document.querySelectorAll('.like-btn');
        const totalLikesElement = document.getElementById('total-likes');
        let totalLikes = 0;
        
        // Загрузка сохранённых лайков из localStorage
        const savedLikes = JSON.parse(localStorage.getItem('resourceLikes') || '{}');
        
        likeButtons.forEach(button => {
            const id = button.getAttribute('data-id');
            const likesSpan = button.querySelector('.like-count');
            
            // Восстановление сохранённого состояния
            if (savedLikes[id]) {
                button.classList.add('liked');
                likesSpan.textContent = savedLikes[id];
                totalLikes += savedLikes[id];
            }
            
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                let currentLikes = parseInt(likesSpan.textContent);
                
                if (this.classList.contains('liked')) {
                    // Убираем лайк
                    currentLikes--;
                    totalLikes--;
                    this.classList.remove('liked');
                } else {
                    // Добавляем лайк
                    currentLikes++;
                    totalLikes++;
                    this.classList.add('liked');
                    
                    // Анимация
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                }
                
                // Обновляем счётчик
                likesSpan.textContent = currentLikes;
                if (totalLikesElement) {
                    totalLikesElement.textContent = totalLikes;
                }
                
                // Сохраняем в localStorage
                savedLikes[id] = currentLikes;
                localStorage.setItem('resourceLikes', JSON.stringify(savedLikes));
                
                console.log(`❤️ Ресурс ${id}: ${currentLikes} лайков, всего: ${totalLikes}`);
            });
        });
        
        if (totalLikesElement) {
            totalLikesElement.textContent = totalLikes;
        }
    }
    
    // Переключение вида (сетка/список)
    function setupViewToggle() {
        const gridViewBtn = document.getElementById('grid-view');
        const listViewBtn = document.getElementById('list-view');
        const galleryGrid = document.querySelector('.gallery-grid');
        
        if (gridViewBtn && listViewBtn && galleryGrid) {
            gridViewBtn.addEventListener('click', () => {
                galleryGrid.classList.remove('list-view');
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                localStorage.setItem('galleryView', 'grid');
            });
            
            listViewBtn.addEventListener('click', () => {
                galleryGrid.classList.add('list-view');
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                localStorage.setItem('galleryView', 'list');
            });
            
            // Восстановление сохранённого вида
            const savedView = localStorage.getItem('galleryView');
            if (savedView === 'list') {
                galleryGrid.classList.add('list-view');
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
            }
        }
    }
    
    // Фильтрация по категориям
    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.image-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Обновляем активную кнопку
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = '';
                        // Добавляем анимацию
                        card.style.animation = 'fadeIn 0.3s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Обновляем счётчик видимых элементов
                const visibleCards = document.querySelectorAll('.image-card[style="display: none;"]').length;
                const total = cards.length;
                const visible = total - visibleCards;
                console.log(`🔍 Фильтр: ${filter}, показано: ${visible} из ${total}`);
            });
        });
    }
    
    // Обработка формы на странице контактов
    function setupContactForm() {
        const form = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name')?.value.trim();
                const email = document.getElementById('email')?.value.trim();
                const message = document.getElementById('message')?.value.trim();
                const consent = document.getElementById('consent')?.checked;
                
                if (!name || !email || !message) {
                    showFormMessage('Пожалуйста, заполните все обязательные поля!', 'error');
                    return;
                }
                
                if (!consent) {
                    showFormMessage('Необходимо согласие на обработку персональных данных!', 'error');
                    return;
                }
                
                if (!email.includes('@') || !email.includes('.')) {
                    showFormMessage('Введите корректный email адрес!', 'error');
                    return;
                }
                
                // Имитация отправки
                showFormMessage(`✅ Спасибо, ${name}! Ваше сообщение отправлено. Я отвечу на ${email} в ближайшее время.`, 'success');
                form.reset();
                
                // Очистка сообщения через 5 секунд
                setTimeout(() => {
                    if (formMessage) formMessage.innerHTML = '';
                }, 5000);
            });
        }
        
        function showFormMessage(text, type) {
            if (formMessage) {
                formMessage.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
                formMessage.style.color = type === 'error' ? '#dc3545' : '#28a745';
                formMessage.style.fontWeight = 'bold';
            }
        }
    }
    
    // Эффект наведения для карточек (дополнительно)
    function setupCardEffects() {
        const cards = document.querySelectorAll('.image-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    // Обновление текущего года в подвале
    function updateCurrentYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    
    // Индикатор работы JavaScript
    function showJsStatus() {
        const statusSpan = document.getElementById('js-status');
        if (statusSpan) {
            statusSpan.innerHTML = '<i class="fas fa-check-circle"></i> JavaScript загружен и работает!';
        }
        console.log('🎉 JavaScript полностью инициализирован!');
    }
    
    // Запуск всех функций
    countResources();
    setupLikes();
    setupViewToggle();
    setupFilters();
    setupContactForm();
    setupCardEffects();
    updateCurrentYear();
    showJsStatus();
});