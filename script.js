document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navigation & Glassmorphism ---
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Change icon to close
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(253, 251, 247, 0.98)'; // Solid cream bg
                navLinks.style.padding = '30px 20px';
                navLinks.style.boxShadow = '0 20px 40px rgba(30, 30, 30, 0.1)';
                
                // Color override for mobile menu
                const links = navLinks.querySelectorAll('a');
                links.forEach(link => {
                    link.style.color = '#1E1E1E';
                    link.style.fontSize = '1.1rem';
                    link.style.marginBottom = '15px';
                });
            } else {
                // Change icon to bars
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                navLinks.style.display = 'none';
            }
        });
    }

    // --- Smooth Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    mobileMenuBtn.click();
                }
            }
        });
    });

    // --- Background Glowing Particles Generation ---
    const createParticles = () => {
        const container = document.getElementById('particles-container');
        if(!container) return;
        
        const particleCount = 25; // Good amount of petals
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random styling for petals
            const size = Math.random() * 8 + 6; // 6px to 14px
            const posX = Math.random() * 100; // 0vw to 100vw
            const delay = Math.random() * 10; // 0s to 10s
            const duration = Math.random() * 10 + 10; // 10s to 20s
            
            // Randomize drift and spin
            const drift = (Math.random() - 0.5) * 200; // -100px to 100px drift
            const spin = Math.random() * 360 + 180; // 180deg to 540deg spin
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}vw`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            // Set CSS variables for the animation
            particle.style.setProperty('--drift', `${drift}vw`);
            particle.style.setProperty('--spin', `${spin}deg`);
            
            container.appendChild(particle);
        }
    };
    
    // Only create particles on wider screens to save mobile performance
    if(window.innerWidth > 768) {
        createParticles();
    }

    // --- Mini Cart & Widgets Interactions ---
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const continueShoppingBtn = document.getElementById('continueShopping');
    const backToTopBtn = document.getElementById('backToTop');

    const openCart = (e) => {
        if (e) e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);

    // Add to cart buttons open sidebar
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Typically add item logic here, then open cart
            openCart();
        });
    });

    // Back to top scroll visibility
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Logo Animations & Interactions ---
    const logos = document.querySelectorAll('.logo');
    
    logos.forEach(logo => {
        logo.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#home') {
                // Prevent default specifically if clicking the logo image area.
                // We'll let the event bubble, but handle brand-name separately if clicked.
                if(!e.target.closest('.brand-name')) {
                    e.preventDefault();
                    
                    // Add ripple class
                    this.classList.add('ripple');
                    
                    // Remove ripple class after animation completes (600ms)
                    setTimeout(() => {
                        this.classList.remove('ripple');
                    }, 600);
                    
                    // Smooth scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Brand Name (Hikari Text) Interaction ---
    const brandNames = document.querySelectorAll('.brand-name');
    brandNames.forEach(brand => {
        brand.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering the logo ripple/scroll
            openCart();
        });
    });

    // --- Background Glitter Generation ---
    const createGlitter = () => {
        const bgEffects = document.querySelector('.bg-effects');
        if(!bgEffects) return;
        
        const glitterCount = 40;
        
        for(let i = 0; i < glitterCount; i++) {
            const glitter = document.createElement('div');
            glitter.classList.add('glitter');
            
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;
            
            glitter.style.left = `${posX}vw`;
            glitter.style.top = `${posY}vh`;
            glitter.style.animationDelay = `${delay}s`;
            glitter.style.animationDuration = `${duration}s`;
            
            bgEffects.appendChild(glitter);
        }
    };

    if(window.innerWidth > 768) {
        createGlitter();
    }

});
