document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do Carrossel
    initCarousel();
    
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
    
    // Theme Toggle with localStorage persistence
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        document.documentElement.classList.add('dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle dark class
            body.classList.toggle('dark');
            document.documentElement.classList.toggle('dark');
            
            // Save preference
            if (body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
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
                document.querySelector('.close-chat').addEventListener('click', (e) => {
                    e.stopPropagation();
                    chatWidget.classList.add('minimized');
                    
                    setTimeout(() => {
                        chatWidget.innerHTML = '<i class="fab fa-whatsapp text-2xl"></i>';
                        chatWidget.classList.add('w-14', 'h-14', 'justify-center');
                        chatWidget.classList.remove('px-6', 'py-4', 'space-x-3');
                    }, 300);
                });
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
    
    // Counters Animation
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;
    
    function animateCounters() {
        if (hasAnimated) return;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 20);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Animate counters when they come into view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
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
    prevButton.addEventListener('click', goToPrevSlide);
    nextButton.addEventListener('click', goToNextSlide);
    
    // Adicionar suporte a gestos de toque (swipe)
    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Mínimo de pixels para considerar um swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > swipeThreshold) {
            // Swipe para a direita (voltar)
            goToPrevSlide();
        } else if (swipeDistance < -swipeThreshold) {
            // Swipe para a esquerda (avançar)
            goToNextSlide();
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