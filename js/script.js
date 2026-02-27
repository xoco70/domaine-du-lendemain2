/**
 * DOMAINE DU LENDEMAIN - JavaScript Principal
 * Navigation, animations et interactions
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================
    // NAVIGATION
    // ======================================
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle du menu burger
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu burger quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar qui change au scroll
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // ======================================
    // SCROLL SMOOTH POUR LA NAVIGATION
    // ======================================
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuster pour la hauteur de la navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mise en évidence du lien actif selon la section visible
    const sections = document.querySelectorAll('section[id]');
    const updateActiveLink = () => {
        let currentId = '';
        const scrollY = window.pageYOffset + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentId = `#${sec.getAttribute('id')}`;
            }
        });
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
    
    // ======================================
    // ANIMATIONS AU SCROLL
    // ======================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.domaine-card, .engagement-card, .produit-card, .contact-info, .map-container');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ======================================
    // LAZY LOADING POUR LES IMAGES
    // ======================================
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    
                    // Simuler un chargement progressif
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ======================================
    // GESTION DES BOUTONS CTA
    // ======================================
    
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ajouter un effet visuel au clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Tracking des clics (optionnel)
            const buttonText = this.textContent.trim();
            console.log(`CTA cliqué: ${buttonText}`);
        });
    });
    
    // ======================================
    // VALIDATION DU FORMULAIRE DE CONTACT
    // ======================================
    
    // Gestion des liens de réservation
    const bookingLinks = document.querySelectorAll('a[href*="vinyaqui.fr"], a[href*="kuupanda.com"]');
    
    bookingLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Message de confirmation avant redirection
            const service = this.href.includes('vinyaqui') ? 'Vinyaqui' : 'Kuupanda';
            console.log(`Redirection vers ${service} pour réservation`);
        });
    });
    
    // ======================================
    // ACCESSIBILITÉ
    // ======================================
    
    // Gestion du focus au clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ======================================
    // PERFORMANCE ET OPTIMISATIONS
    // ======================================
    
    // Debounce pour le scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimiser le scroll avec debounce
    const optimizedScroll = debounce(handleNavbarScroll, 10);
    window.removeEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', optimizedScroll);

    // ======================================
    // BANDEAU 18+ & MENTIONS LÉGALES
    // ======================================

    const ageBanner = document.getElementById('age-banner');
    const ageAccept = document.getElementById('age-accept');
    const ageOpen = document.getElementById('age-open');
    const privacyOpen = document.getElementById('privacy-open');

    try {
        if (ageBanner && !localStorage.getItem('ageConfirmed')) {
            ageBanner.hidden = false;
        }
        if (ageAccept) {
            ageAccept.addEventListener('click', () => {
                try {
                    localStorage.setItem('ageConfirmed', 'true');
                } catch (e) {
                    console.warn('Impossible d\'accéder au stockage local pour la confirmation d\'âge.', e);
                }
                if (ageBanner) {
                    ageBanner.remove();
                }
            });
        }
        // Mentions légales affichées dans le footer (plus de modale)
        if (ageOpen && ageBanner) {
            ageOpen.addEventListener('click', (e) => {
                e.preventDefault();
                ageBanner.hidden = false;
            });
        }
        if (privacyOpen) {
            privacyOpen.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Politique de confidentialité : aucune donnée personnelle n\'est stockée côté serveur.');
            });
        }
    } catch (err) {
        console.warn('Bandeau 18+ / légal: ', err);
    }
    
    // ======================================
    // GESTION DES ERREURS
    // ======================================
    
    // Gestion des erreurs d'images
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Image failed to load: ${this.src}`);
            // Afficher une image de secours ou un message
            this.alt = 'Image non disponible';
            this.style.opacity = '0.5';
        });
    });
    
    // ======================================
    // FONCTIONS UTILITAIRES
    // ======================================
    
    /**
     * Fonction pour obtenir la position actuelle du scroll
     * @returns {number} Position Y du scroll
     */
    function getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
    
    /**
     * Fonction pour vérifier si un élément est dans le viewport
     * @param {Element} element - L'élément à vérifier
     * @returns {boolean} True si l'élément est visible
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * Fonction pour animer un compteur (utile pour les statistiques)
     * @param {Element} element - L'élément contenant le nombre
     * @param {number} target - Le nombre cible
     * @param {number} duration - Durée de l'animation en ms
     */
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // ======================================
    // INITIALISATION
    // ======================================
    
    console.log('🍇 Domaine du Lendemain - Site initialisé avec succès!');
    console.log('📱 Navigation responsive activée');
    console.log('✨ Animations au scroll configurées');
    console.log('🌿 Lazy loading des images optimisé');
    
    // Message de bienvenue dans la console
    console.log(`
    🌿 DOMAINE DU LENDEMAIN 🌿
    ========================
    Vigneronne & Herbaliste
    Roussillon - Biodynamie
    Depuis 2018
    
    Contact: mireilleribiere8@gmail.com
    Téléphone: 06 85 82 04 52
    Adresse: 102 Route de Trouillas, 66300 Fourques
    `);
});

// ======================================
// FONCTIONS GLOBALES (ACCESSIBLES PARTOUT)
// ======================================

/**
 * Fonction pour faire défiler vers une section spécifique
 * @param {string} targetId - L'ID de la cible (avec #)
 * @param {number} offset - Décalage en pixels
 */
function scrollToSection(targetId, offset = 80) {
    const target = document.querySelector(targetId);
    if (target) {
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Fonction pour ouvrir/fermer le menu mobile
 */
function toggleMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

/**
 * Fonction pour afficher un message temporaire
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message (success, error, info)
 * @param {number} duration - Durée en ms
 */
function showToast(message, type = 'info', duration = 3000) {
    // Créer l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Styles du toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#7A8471' : type === 'error' ? '#C17767' : '#D4A574'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Raleway', sans-serif;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de sortie
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}
