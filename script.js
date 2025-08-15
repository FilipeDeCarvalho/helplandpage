document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('dark-mode');
        
        // Change icon
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
    
    // Chat Widget
    const chatButton = document.querySelector('.chat-button');
    const closeChat = document.querySelector('.close-chat');
    
    closeChat.addEventListener('click', (e) => {
        e.stopPropagation();
        chatButton.classList.add('minimized');
        
        // After 300ms, show only the icon
        setTimeout(() => {
            chatButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
            chatButton.classList.add('icon-only');
        }, 300);
    });
    
    // Restore chat button when clicked in icon-only mode
    chatButton.addEventListener('click', () => {
        if (chatButton.classList.contains('icon-only')) {
            chatButton.classList.remove('icon-only');
            chatButton.classList.remove('minimized');
            chatButton.innerHTML = '<i class="fab fa-whatsapp"></i><span>Precisa de ajuda? Fale conosco!</span><i class="fas fa-times close-chat"></i>';
            
            // Reattach event listener to the new close button
            document.querySelector('.close-chat').addEventListener('click', (e) => {
                e.stopPropagation();
                chatButton.classList.add('minimized');
                
                setTimeout(() => {
                    chatButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
                    chatButton.classList.add('icon-only');
                }, 300);
            });
        } else {
            // Simulate WhatsApp opening
            window.open('https://wa.me/5575988423960', '_blank');
        }
    });
    
    // Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
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
    
    // Inicialização do mapa interativo real
    function initializeRealMap() {
        const mapContainer = document.getElementById('real-map');
        if (!mapContainer) return;
        
        // Inicializar o mapa centrado no Brasil
        const map = L.map('real-map').setView([-14.2350, -51.9253], 4);
        
        // Adicionar camada de tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Dados das cidades onde a empresa atua
        const locations = [
            { name: 'São Paulo', coords: [-23.5505, -46.6333], teachers: 150, students: 300, active: true },
            { name: 'Rio de Janeiro', coords: [-22.9068, -43.1729], teachers: 80, students: 180, active: true },
            { name: 'Belo Horizonte', coords: [-19.9167, -43.9345], teachers: 60, students: 120, active: true },
            { name: 'Salvador', coords: [-12.9714, -38.5014], teachers: 45, students: 90, active: true },
            { name: 'Curitiba', coords: [-25.4284, -49.2733], teachers: 35, students: 70, active: true },
            { name: 'Porto Alegre', coords: [-30.0346, -51.2177], teachers: 40, students: 85, active: true },
            { name: 'Recife', coords: [-8.0476, -34.8770], teachers: 35, students: 75, active: true },
            { name: 'Fortaleza', coords: [-3.7172, -38.5433], teachers: 30, students: 60, active: true },
            { name: 'Florianópolis', coords: [-27.5954, -48.5480], teachers: 25, students: 50, active: true },
            { name: 'Goiânia', coords: [-16.6869, -49.2648], teachers: 30, students: 65, active: true },
            { name: 'Brasília', coords: [-15.8267, -47.9218], teachers: 20, students: 45, active: true },
            { name: 'Vitória', coords: [-20.3155, -40.3128], teachers: 15, students: 35, active: true },
            { name: 'Manaus', coords: [-3.1190, -60.0217], teachers: 8, students: 20, active: false },
            { name: 'Belém', coords: [-1.4558, -48.5044], teachers: 12, students: 30, active: false },
            { name: 'Campo Grande', coords: [-20.4697, -54.6201], teachers: 18, students: 40, active: false },
            { name: 'Cuiabá', coords: [-15.6014, -56.0979], teachers: 22, students: 45, active: false }
        ];
        
        // Criar ícones personalizados
        const activeIcon = L.divIcon({
            className: 'custom-marker active-marker',
            html: '<div class="marker-inner"><i class="fas fa-graduation-cap"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const expandingIcon = L.divIcon({
            className: 'custom-marker expanding-marker',
            html: '<div class="marker-inner"><i class="fas fa-clock"></i></div>',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5]
        });
        
        // Adicionar marcadores para cada localização
        locations.forEach(location => {
            const marker = L.marker(location.coords, {
                icon: location.active ? activeIcon : expandingIcon
            }).addTo(map);
            
            // Criar popup com informações
            const popupContent = `
                <div class="map-popup">
                    <h3>${location.name}</h3>
                    <div class="popup-stats">
                        <div class="stat">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>${location.teachers} professores</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-user-graduate"></i>
                            <span>${location.students} alunos</span>
                        </div>
                    </div>
                    <div class="status ${location.active ? 'active' : 'expanding'}">
                        ${location.active ? '✅ Área Ativa' : '🚀 Em Expansão'}
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Atualizar info card ao clicar no marcador
            marker.on('click', () => {
                updateInfoCard(location.name, location.teachers, location.students);
            });
        });
        
        // Função para atualizar o card de informações
        function updateInfoCard(name, teachers, students) {
            const infoCard = document.querySelector('.info-card');
            const stateNameElement = document.querySelector('.state-name');
            const teachersCountElement = document.querySelector('.teachers-count');
            const studentsCountElement = document.querySelector('.students-count');
            
            if (stateNameElement) stateNameElement.textContent = name;
            if (teachersCountElement) teachersCountElement.textContent = teachers;
            if (studentsCountElement) studentsCountElement.textContent = students;
            if (infoCard) infoCard.style.display = 'block';
        }
    }
    
    // Inicializar mapa real se existir
    if (document.getElementById('real-map')) {
        // Aguardar o Leaflet carregar completamente
        if (typeof L !== 'undefined') {
            initializeRealMap();
        } else {
            window.addEventListener('load', initializeRealMap);
        }
    }

    // Add animation classes when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.step, .testimonial-card, .faq-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .step, .testimonial-card, .faq-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .step.animate, .testimonial-card.animate, .faq-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .dark-mode {
            background-color: #121212;
            color: #f0f0f0;
        }
        
        .dark-mode header {
            background-color: #1e1e1e;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .logo a {
            color: #64b5f6;
        }
        
        .dark-mode nav ul li a {
            color: #f0f0f0;
        }
        
        .dark-mode nav ul li a:hover {
            color: #64b5f6;
        }
        
        .dark-mode .how-it-works, 
        .dark-mode .faq {
            background-color: #1e1e1e;
        }
        
        .dark-mode .testimonials {
            background-color: #121212;
        }
        
        .dark-mode .step,
        .dark-mode .faq-question {
            background-color: #2d2d2d;
        }
        
        .dark-mode .testimonial-card {
            background-color: #2d2d2d;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .how-it-works h2,
        .dark-mode .testimonials h2,
        .dark-mode .faq h2,
        .dark-mode .step h3,
        .dark-mode .testimonial-card h3,
        .dark-mode .faq-question h3 {
            color: #64b5f6;
        }
        
        .dark-mode .step-icon {
            background-color: #3d3d3d;
        }
        
        .dark-mode .step-icon i {
            color: #64b5f6;
        }
        
        .dark-mode .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .chat-button.minimized {
            transform: scale(0.8);
            opacity: 0.8;
        }
        
        .chat-button.icon-only {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            justify-content: center;
            padding: 0;
        }
    `;
    document.head.appendChild(style);
});