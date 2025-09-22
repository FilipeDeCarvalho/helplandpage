document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do mapa interativo real
    function initializeRealMap() {
        if (typeof L === 'undefined') {
            console.error('Leaflet não está carregado');
            return;
        }
        
        const mapElement = document.getElementById('real-map');
        if (!mapElement) {
            console.error('Elemento do mapa não encontrado');
            return;
        }
        
        const map = L.map('real-map').setView([-14.235, -51.9253], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Dados de localização (cidades com professores e alunos)
        const locations = [
            { name: "Salvador", lat: -12.9714, lng: -38.5014, teachers: 50, students: 235, status: "active" },
            { name: "São Paulo", lat: -23.5505, lng: -46.6333, teachers: 120, students: 450, status: "expansion" },
            { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, teachers: 85, students: 320, status: "expansion" },
            { name: "Belo Horizonte", lat: -19.9167, lng: -43.9345, teachers: 65, students: 240, status: "expansion" },
            { name: "Brasília", lat: -15.7801, lng: -47.9292, teachers: 70, students: 260, status: "expansion" },
            { name: "Fortaleza", lat: -3.7319, lng: -38.5267, teachers: 40, students: 150, status: "expansion" },
            { name: "Recife", lat: -8.0476, lng: -34.8770, teachers: 35, students: 130, status: "expansion" },
            { name: "Porto Alegre", lat: -30.0346, lng: -51.2177, teachers: 45, students: 170, status: "expansion" },
            { name: "Curitiba", lat: -25.4290, lng: -49.2671, teachers: 55, students: 210, status: "expansion" },
            { name: "Manaus", lat: -3.1190, lng: -60.0217, teachers: 20, students: 80, status: "expansion" },
            { name: "Belém", lat: -1.4558, lng: -48.4902, teachers: 15, students: 60, status: "expansion" },
            { name: "Goiânia", lat: -16.6799, lng: -49.2550, teachers: 30, students: 110, status: "expansion" },
            { name: "Florianópolis", lat: -27.5954, lng: -48.5480, teachers: 25, students: 90, status: "expansion" },
            { name: "Vitória", lat: -20.2976, lng: -40.2958, teachers: 18, students: 70, status: "expansion" },
            { name: "Natal", lat: -5.7945, lng: -35.2120, teachers: 22, students: 85, status: "expansion" }
        ];
        
        // Ícones personalizados
        const activeIcon = L.divIcon({
            className: 'custom-marker active',
            html: '<div class="marker-inner"><i class="fas fa-graduation-cap"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const expansionIcon = L.divIcon({
            className: 'custom-marker expansion',
            html: '<div class="marker-inner"><i class="fas fa-rocket"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Adicionar marcadores ao mapa
        locations.forEach(location => {
            const icon = location.status === 'active' ? activeIcon : expansionIcon;
            
            const marker = L.marker([location.lat, location.lng], { icon: icon }).addTo(map);
            
            marker.bindPopup(`
                <div class="popup-content">
                    <h3 class="text-lg font-semibold">${location.name}</h3>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div>
                            <span class="text-sm text-gray-600">Professores:</span>
                            <span class="font-medium">${location.teachers}</span>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Alunos:</span>
                            <span class="font-medium">${location.students}</span>
                        </div>
                    </div>
                    <div class="mt-2">
                        <span class="text-xs px-2 py-1 rounded-full ${location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${location.status === 'active' ? 'Área Ativa' : 'Em Expansão'}
                        </span>
                    </div>
                </div>
            `);
            
            marker.on('click', function() {
                updateInfoCard(location);
            });
        });
        
        // Função para atualizar o card de informações
        function updateInfoCard(location) {
            const stateNameElement = document.querySelector('.state-name');
            const teachersCountElement = document.querySelector('.teachers-count');
            const studentsCountElement = document.querySelector('.students-count');
            
            if (stateNameElement) stateNameElement.textContent = location.name;
            if (teachersCountElement) teachersCountElement.textContent = location.teachers;
            if (studentsCountElement) studentsCountElement.textContent = location.students;
        }
        
        // Adicionar estilo CSS para os marcadores
        const style = document.createElement('style');
        style.textContent = `
            .custom-marker {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .marker-inner {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                color: white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .active .marker-inner {
                background-color: #10b981;
            }
            
            .expansion .marker-inner {
                background-color: #f59e0b;
            }
            
            .popup-content {
                padding: 5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inicializar o mapa quando o Leaflet estiver carregado
    if (typeof L !== 'undefined') {
        initializeRealMap();
    } else {
        window.addEventListener('load', initializeRealMap);
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherItem.classList.remove('active');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                } else {
                    answer.style.maxHeight = '0';
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
     });
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.toggle('dark-mode');
            
            // Change icon
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (body.classList.contains('dark-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }
    
    // Chat Widget
    const chatWidget = document.querySelector('.chat-widget');
    const closeChat = document.querySelector('.close-chat');
    
    if (chatWidget && closeChat) {
        closeChat.addEventListener('click', (e) => {
            e.stopPropagation();
            chatWidget.classList.add('minimized');
            
            // After 300ms, show only the icon
            setTimeout(() => {
                chatWidget.innerHTML = '<i class="fab fa-whatsapp text-2xl"></i>';
                chatWidget.classList.add('w-14', 'h-14', 'justify-center');
                chatWidget.classList.remove('px-6', 'py-4', 'space-x-3');
            }, 300);
        });
        
        // Restore chat button when clicked in minimized mode
        chatWidget.addEventListener('click', () => {
            if (chatWidget.classList.contains('w-14')) {
                chatWidget.classList.remove('w-14', 'h-14', 'justify-center', 'minimized');
                chatWidget.classList.add('px-6', 'py-4', 'space-x-3');
                chatWidget.innerHTML = '<i class="fab fa-whatsapp text-2xl"></i><span class="font-medium">Precisa de ajuda? Fale conosco!</span><i class="fas fa-times close-chat"></i>';
                
                // Reattach event listener to the new close button
                const newCloseChat = chatWidget.querySelector('.close-chat');
                if (newCloseChat) {
                    newCloseChat.addEventListener('click', (e) => {
                        e.stopPropagation();
                        chatWidget.classList.add('minimized');
                        
                        setTimeout(() => {
                            chatWidget.innerHTML = '<i class="fab fa-whatsapp text-2xl"></i>';
                            chatWidget.classList.add('w-14', 'h-14', 'justify-center');
                            chatWidget.classList.remove('px-6', 'py-4', 'space-x-3');
                        }, 300);
                    });
                }
            } else {
                // Simulate WhatsApp opening
                window.open('https://wa.me/5575988423960', '_blank');
            }
        });
    }
    
    // Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // Inicialização do Carrossel
    initCarousel();
});

// Função para inicializar o carrossel
function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    if (!carousel) return;
    
    const slidesContainer = carousel.querySelector('.carousel-slides');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const nextButton = carousel.querySelector('.carousel-control.next');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Criar indicadores
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.classList.add('carousel-indicator', 'w-3', 'h-3', 'rounded-full', 'bg-white/50');
        if (i === 0) {
            indicator.classList.add('active', 'bg-white');
        }
        indicator.setAttribute('aria-label', `Slide ${i + 1}`);
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
    
    // Função para ir para um slide específico
    function goToSlide(index) {
        // Garantir que o índice esteja dentro dos limites
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        
        currentIndex = index;
        const translateValue = -currentIndex * 100 + '%';
        slidesContainer.style.transform = `translateX(${translateValue})`;
        
        // Atualizar indicadores
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active', 'bg-white');
                indicator.classList.remove('bg-white/50');
            } else {
                indicator.classList.remove('active', 'bg-white');
                indicator.classList.add('bg-white/50');
            }
        });
        
        // Reiniciar o temporizador de autoplay
        resetAutoplay();
    }
    
    // Funções para os botões de navegação
    function goToPrevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function goToNextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Configurar autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(goToNextSlide, 5000); // Muda a cada 5 segundos
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Adicionar event listeners para os botões
    if (prevButton) {
        prevButton.addEventListener('click', goToPrevSlide);
    }
    if (nextButton) {
        nextButton.addEventListener('click', goToNextSlide);
    }
    
    // Adicionar suporte a gestos de toque (swipe)
    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                goToNextSlide();
            } else {
                // Swipe right - previous slide
                goToPrevSlide();
            }
        }
    }
    
    // Pausar autoplay quando o mouse estiver sobre o carrossel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Iniciar o carrossel
    startAutoplay();
    
    // Ajustar o carrossel em caso de redimensionamento da janela
    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });
}