document.addEventListener('DOMContentLoaded', function() {
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
            body.classList.toggle('dark');
            
            // Change icon
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (body.classList.contains('dark')) {
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
    
    if (chatWidget) {
        chatWidget.addEventListener('click', () => {
            // Open WhatsApp chat
            window.open('https://wa.me/5575988423960?text=Olá! Gostaria de saber mais sobre o HELP.', '_blank');
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', (e) => {
            e.stopPropagation();
            chatWidget.classList.add('minimized');
            
            // After 300ms, show only the icon
            setTimeout(() => {
                chatWidget.innerHTML = '<i class="fab fa-whatsapp text-2xl"></i>';
                chatWidget.classList.remove('minimized');
            }, 300);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize Leaflet Map
    if (typeof L !== 'undefined' && document.getElementById('real-map')) {
        // Initialize the map
        const map = L.map('real-map').setView([-12.9714, -38.5014], 6);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Cities data with coordinates
        const cities = [
            { name: 'Salvador', lat: -12.9714, lng: -38.5014, teachers: 45, students: 120, status: 'active' },
            { name: 'Feira de Santana', lat: -12.2664, lng: -38.9663, teachers: 23, students: 67, status: 'active' },
            { name: 'Vitória da Conquista', lat: -14.8619, lng: -40.8444, teachers: 18, students: 45, status: 'active' },
            { name: 'Camaçari', lat: -12.6997, lng: -38.3243, teachers: 15, students: 38, status: 'expanding' },
            { name: 'Juazeiro', lat: -9.4111, lng: -40.4986, teachers: 12, students: 29, status: 'expanding' },
            { name: 'Lauro de Freitas', lat: -12.8944, lng: -38.3222, teachers: 8, students: 22, status: 'expanding' },
            { name: 'Ilhéus', lat: -14.7880, lng: -39.0339, teachers: 10, students: 25, status: 'active' },
            { name: 'Jequié', lat: -13.8587, lng: -40.0831, teachers: 7, students: 18, status: 'expanding' },
            { name: 'Teixeira de Freitas', lat: -17.5392, lng: -39.7378, teachers: 5, students: 14, status: 'expanding' },
            { name: 'Alagoinhas', lat: -12.1355, lng: -38.4183, teachers: 9, students: 21, status: 'active' }
        ];
        
        // Add markers for each city
        cities.forEach(city => {
            const color = city.status === 'active' ? '#10b981' : '#f59e0b';
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);
            
            // Add click event to marker
            marker.on('click', function() {
                // Update info card
                const stateName = document.querySelector('.state-name');
                const teachersCount = document.querySelector('.teachers-count');
                const studentsCount = document.querySelector('.students-count');
                
                if (stateName) stateName.textContent = city.name;
                if (teachersCount) teachersCount.textContent = city.teachers;
                if (studentsCount) studentsCount.textContent = city.students;
            });
            
            // Add popup
            marker.bindPopup(`
                <div class="text-center">
                    <h3 class="font-semibold text-lg">${city.name}</h3>
                    <p class="text-sm text-gray-600">${city.teachers} professores • ${city.students} alunos</p>
                    <span class="inline-block px-2 py-1 text-xs rounded-full ${
                        city.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }">
                        ${city.status === 'active' ? 'Ativo' : 'Em Expansão'}
                    </span>
                </div>
            `);
        });
    }
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.step, .testimonial-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
    
    // Mobile menu toggle (if needed)
    const mobileMenuButton = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-content]');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');
        
        if (heroImage) {
            const speed = scrolled * 0.5;
            heroImage.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Add custom CSS for animations
const style = document.createElement('style');
style.textContent = `
    .custom-marker {
        background: transparent !important;
        border: none !important;
    }
    
    .faq-answer {
        transition: max-height 0.3s ease-out;
    }
    
    .faq-question i {
        transition: transform 0.3s ease;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);