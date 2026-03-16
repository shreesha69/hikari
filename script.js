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
        
        const particleCount = 12; // Fewer petals for better performance
        
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

    // --- E-COMMERCE LOGIC (Local Storage Backend Simulation) ---

    let cart = JSON.parse(localStorage.getItem('hk_cart')) || [];
    let currentUser = JSON.parse(localStorage.getItem('hk_currentUser')) || null;
    let wishlist = JSON.parse(localStorage.getItem('hk_wishlist')) || [];
    let ratingsData = JSON.parse(localStorage.getItem('hk_ratings')) || {};
    let customProducts = JSON.parse(localStorage.getItem('hk_products')) || [];

    let allProducts = [];

    // --- Backend API Bridge (Preparation for PHP) ---
    const API = {
        getProducts: async () => {
            try {
                // Fetch from PHP API (MySQL Database)
                const response = await fetch('get_products.php');
                if (!response.ok) throw new Error('DB fetch failed');
                const dbProducts = await response.json();
                
                // If DB is empty (first time), fallback to local JSON but show DB is active
                if (dbProducts.length === 0) {
                    console.log("DB empty, fetching from products.json fallback...");
                    const fallback = await fetch('products.json');
                    return await fallback.json();
                }
                return dbProducts;
            } catch (err) {
                console.error("API Error (getProducts):", err);
                // Final fallback to static JSON to keep site running
                const staticResp = await fetch('products.json');
                return await staticResp.json();
            }
        },
        login: async (email, password) => {
            try {
                const response = await fetch('auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', email, password })
                });
                const result = await response.json();
                return { success: result.status === 'success', ...result };
            } catch (err) {
                console.error("Auth Error:", err);
                return { success: false, message: 'Server connection failed' };
            }
        },
        register: async (userData) => {
            try {
                const response = await fetch('auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'register', ...userData })
                });
                const result = await response.json();
                return { success: result.status === 'success', ...result };
            } catch (err) {
                console.error("Auth Error:", err);
                return { success: false, message: 'Server connection failed' };
            }
        },
        createOrder: async (orderData) => {
            try {
                const response = await fetch('orders.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'create', ...orderData })
                });
                const result = await response.json();
                return { success: result.status === 'success', ...result };
            } catch (err) {
                console.error("Order Error:", err);
                return { success: false, message: 'Server connection failed' };
            }
        }
    };

    // Initialize App
    const initApp = async () => {
        try {
            const staticProducts = await API.getProducts();
            allProducts = [...staticProducts, ...customProducts];

            const path = window.location.pathname;
            const filename = path.split('/').pop() || 'index.html';

            if (filename === 'candles.html') {
                renderProductGrid('candles-grid', 'candles');
            } else if (filename === 'lights.html') {
                renderProductGrid('lights-grid', 'lights');
            } else if (filename === 'search.html') {
                handleSearchPage();
            } else if (filename === 'index.html' || filename === '') {
                renderProductGrid('candles-grid', 'candles', 4);
                renderProductGrid('lights-grid', 'lights', 4);
            }

            updateAuthUI();
            updateCartUI();
            updateWishlistUI();
            rebindProductEvents();
        } catch (error) {
            console.error("App Init Error:", error);
        }
    };

    // Run Init
    initApp();

    // 2. DOM Elements
    const searchInput = document.getElementById('searchInput');
    
    // Auth
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    const loggedOutMenu = document.getElementById('loggedOutMenu');
    const loggedInMenu = document.getElementById('loggedInMenu');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const adminLinkContainer = document.getElementById('adminLinkContainer');
    
    // Modals
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const adminModal = document.getElementById('adminModal');
    const ordersModal = document.getElementById('ordersModal');
    const quickViewModal = document.getElementById('quickViewModal');
    const wishlistModal = document.getElementById('wishlistModal');
    const closeModals = document.querySelectorAll('.close-modal, .close-cart');

    // 3. UI Helpers
    const openModal = (modal) => {
        if(!modal) return;
        closeAllModals();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeAllModals = () => {
        const activeModals = [
            loginModal, registerModal, checkoutModal, adminModal, 
            ordersModal, quickViewModal, wishlistModal, cartSidebar, cartOverlay
        ];
        activeModals.forEach(m => {
            if(m) m.classList.remove('active');
        });
        document.body.style.overflow = '';
    };

    closeModals.forEach(btn => btn.addEventListener('click', closeAllModals));

    // Close on Click Outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('cart-overlay')) {
            closeAllModals();
        }
    });

    // Close on ESC Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            // Also close user dropdown if open
            if(userDropdown) userDropdown.classList.remove('active');
        }
    });

    // Update Dropdown UI
    const updateAuthUI = () => {
        if (currentUser) {
            loggedOutMenu.style.display = 'none';
            loggedInMenu.style.display = 'block';
            userNameDisplay.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
            adminLinkContainer.style.display = currentUser.role === 'admin' ? 'block' : 'none';
            userIcon.innerHTML = '<i class="fas fa-user-check" style="color: var(--gold-highlight);"></i>';
        } else {
            loggedOutMenu.style.display = 'block';
            loggedInMenu.style.display = 'none';
            userIcon.innerHTML = '<i class="far fa-user"></i>';
        }
    };

    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu-container')) {
            userDropdown.classList.remove('active');
        }
    });

    // 4. Auth Logic
    const openLoginBtn = document.getElementById('openLogin');
    const openRegisterBtn = document.getElementById('openRegister');
    const switchRegBtn = document.getElementById('switchToRegister');
    const switchLoginBtn = document.getElementById('switchToLogin');

    if(openLoginBtn) openLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
    if(openRegisterBtn) openRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
    if(switchRegBtn) switchRegBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
    if(switchLoginBtn) switchLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            address: document.getElementById('regAddress').value,
            password: document.getElementById('regPassword').value
        };

        const result = await API.register(userData);
        
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('hk_currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeAllModals();
            alert('Registration successful!');
        } else {
            document.getElementById('regError').textContent = result.message || 'Registration failed.';
            document.getElementById('regError').style.display = 'block';
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = await API.login(email, password);
        
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('hk_currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeAllModals();
        } else {
            document.getElementById('loginError').textContent = result.message || 'Invalid credentials.';
            document.getElementById('loginError').style.display = 'block';
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        currentUser = null;
        localStorage.removeItem('hk_currentUser');
        updateAuthUI();
        userDropdown.classList.remove('active');
    });

    // 5. Search Logic & Dynamic Rendering
    const renderProductGrid = (containerId, category = null, limit = null, sortBy = 'default') => {
        const grid = document.getElementById(containerId);
        if(!grid) return;
        
        let filtered = category ? allProducts.filter(p => p.category === category) : allProducts;
        
        // Sorting logic
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        if(limit) filtered = filtered.slice(0, limit);
        
        grid.innerHTML = filtered.map((p, idx) => `
            <div class="product-card luxury-card reveal" style="transition-delay: ${idx * 0.1}s;" data-id="${p.id}" data-category="${p.category}" data-desc="${p.description}">
                <div class="product-img-wrap">
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" 
                         onerror="this.onerror=null; this.src='images/logo.jpeg'; console.log('Image load failed, using fallback.');">
                    <button class="wishlist-heart-btn ${wishlist.some(w => w.id === p.id) ? 'active' : ''}" aria-label="Add to Wishlist" data-id="${p.id}">
                        <i class="${wishlist.some(w => w.id === p.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name quick-view-trigger">${p.name}</h3>
                    <div class="product-rating" data-id="${p.id}">
                        <span class="stars">★★★★★</span> <span class="rating-count">(0)</span>
                    </div>
                    <p class="product-price" data-price="${p.price}">₹${p.price}</p>
                    <button class="btn btn-outline btn-full add-to-cart">Add to Cart</button>
                </div>
            </div>
        `).join('');
        
        // Re-init logic for newly added items
        rebindProductEvents();
    };

    const rebindProductEvents = () => {
        // Add to Cart
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.product-card');
                const id = card.dataset.id;
                const name = card.querySelector('.product-name').textContent;
                const price = card.querySelector('.product-price').textContent;
                addToCart(id, name, price);
            });
        });
        
        // Wishlist
        document.querySelectorAll('.wishlist-heart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                toggleWishlist(id);
            });
        });

        // Quick View
        document.querySelectorAll('.quick-view-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const id = card.dataset.id;
                const prod = allProducts.find(p => p.id === id);
                if(prod) openQuickView(prod);
            });
        });

        // Reveal animations
        const reveals = document.querySelectorAll('.reveal');
        const revealLoop = () => {
            reveals.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) el.classList.add('active');
            });
        };
        window.addEventListener('scroll', revealLoop);
        revealLoop(); // run once
    };

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
        
        // Mobile focus handlers
        searchInput.addEventListener('focus', () => searchInput.parentElement.classList.add('focused'));
        searchInput.addEventListener('blur', () => searchInput.parentElement.classList.remove('focused'));
    }


    // Filter Listeners
    document.querySelectorAll('.product-filter').forEach(select => {
        select.addEventListener('change', (e) => {
            const containerId = e.target.dataset.target;
            const sortBy = e.target.value;
            
            if (containerId === 'search-results-grid') {
                handleSearchPage(sortBy);
            } else {
                const category = containerId.includes('candles') ? 'candles' : 'lights';
                const limit = containerId.includes('grid-4') ? 4 : null;
                renderProductGrid(containerId, category, limit, sortBy);
            }
        });
    });


    const handleSearchPage = (sortBy = 'default') => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q')?.toLowerCase() || '';
        const resultsGrid = document.getElementById('search-results-grid');
        const searchTitle = document.getElementById('search-query-title');
        
        if (searchTitle) searchTitle.textContent = query;
        if (!resultsGrid) return;


        // Smart Search Keywords
        const candleKeywords = ['candle', 'scented', 'aroma', 'wax', 'smell'];
        const lightKeywords = ['light', 'decor', 'lamp', 'lantern', 'fairy', 'led', 'bulb'];

        const isCandleSearch = candleKeywords.some(k => query.includes(k));
        const isLightSearch = lightKeywords.some(k => query.includes(k));

        const filtered = allProducts.filter(p => {
            const name = p.name.toLowerCase();
            const desc = (p.description || '').toLowerCase();
            const cat = p.category;

            let match = name.includes(query) || desc.includes(query);
            if (!match && query.length > 2) {
                if (isCandleSearch && cat === 'candles') match = true;
                if (isLightSearch && cat === 'lights') match = true;
            }
            return match;
        });

        if (filtered.length === 0) {
            resultsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <h3>No products found for "${query}"</h3>
                <p>Try different keywords or browse our categories.</p>
            </div>`;
        } else {
            resultsGrid.innerHTML = filtered.map((p, idx) => `
                <div class="product-card luxury-card reveal active" data-id="${p.id}" data-category="${p.category}">
                    <div class="product-img-wrap">
                        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" 
                             onerror="this.onerror=null; this.src='images/logo.jpeg'; console.log('Image load failed, using fallback.');">
                        <button class="wishlist-heart-btn ${wishlist.some(w => w.id === p.id) ? 'active' : ''}" aria-label="Add to Wishlist" data-id="${p.id}">
                            <i class="${wishlist.some(w => w.id === p.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name quick-view-trigger">${p.name}</h3>
                        <p class="product-price">₹${p.price}</p>
                        <button class="btn btn-outline btn-full add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `).join('');
        }
        rebindProductEvents();
    };

    // 6. Cart Logic
    const cartIcon = document.getElementById('cartOpenBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartBadge = document.getElementById('cartBadge');
    
    // Find subtotal and attach new dynamic ID if needed, or query it
    const cartFooter = document.querySelector('.cart-footer');
    let subtotalSpan = cartFooter.querySelector('.cart-total span:last-child');

    const updateCartUI = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="item-details" style="flex: 1;">
                        <p class="item-name" style="font-weight: 500; margin-bottom: 5px;">${item.name}</p>
                        <p class="item-price" style="color: var(--gold-highlight);">₹${item.price}</p>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn dec-qty" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn inc-qty" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });

        cartBadge.textContent = count;
        subtotalSpan.textContent = `₹${total}`;

        // Bind events
        document.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart[e.target.dataset.index].quantity++;
                saveCart();
            });
        });
        document.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let idx = e.target.dataset.index;
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                } else {
                    cart.splice(idx, 1);
                }
                saveCart();
            });
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(e.currentTarget.dataset.index, 1);
                saveCart();
            });
        });
    };

    const saveCart = () => {
        localStorage.setItem('hk_cart', JSON.stringify(cart));
        updateCartUI();
    };

    const addToCart = (id, name, price) => {
        price = typeof price === 'string' ? parseInt(price.replace('₹', '').replace(',', '')) : price;
        const existing = cart.find(i => i.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        saveCart();
        openModal(cartSidebar); // Open sidebar
        if(cartOverlay) cartOverlay.classList.add('active');
    };

    // Attach to existing 'add-to-cart' buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            const name = card.querySelector('.product-name').textContent;
            const price = card.querySelector('.product-price').textContent;
            addToCart(name, price);
        });
    });

    if (cartIcon) cartIcon.addEventListener('click', (e) => { 
        e.preventDefault(); 
        cartSidebar.classList.add('active');
        if(cartOverlay) cartOverlay.classList.add('active');
    });
    
    // Close cart handles mapped in 'closeAllModals'

    // 7. Checkout Logic
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Pre-fill form if user is logged in
            if (currentUser) {
                document.getElementById('chkName').value = currentUser.name;
                document.getElementById('chkPhone').value = currentUser.phone;
                document.getElementById('chkAddress').value = currentUser.address;
            } else {
                document.getElementById('chkName').value = '';
                document.getElementById('chkPhone').value = '';
                document.getElementById('chkAddress').value = '';
            }

            // Populate summary
            const summaryArea = document.getElementById('checkoutSummaryArea');
            let total = 0;
            let html = '<h4 style="margin-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 10px;">Order Summary</h4>';
            
            cart.forEach(item => {
                html += `
                    <div class="checkout-summary-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `;
                total += item.price * item.quantity;
            });
            
            html += `
                <div class="checkout-total">
                    <span>Total To Pay</span>
                    <span style="color: var(--gold-highlight);">₹${total}</span>
                </div>
            `;
            
            summaryArea.innerHTML = html;
            
            openModal(checkoutModal);
        });
    }

    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        const orderData = {
            id: 'ORD-' + Math.floor(Math.random() * 1000000),
            date: new Date().toLocaleDateString(),
            items: [...cart],
            total: total,
            customerName: document.getElementById('chkName').value,
            customerPhone: document.getElementById('chkPhone').value,
            customerAddress: document.getElementById('chkAddress').value,
            customerEmail: currentUser ? currentUser.email : 'Guest'
        };

        const result = await API.createOrder(orderData);

        if (result.success) {
            cart = [];
            saveCart();
            closeAllModals();
            alert(`Order placed successfully! Your Order ID is ${result.order_id || orderData.id}`);
        } else {
            alert('Failed to place order: ' + (result.message || result.error));
        }
    });

    // 8. Orders History
    document.getElementById('openOrders').addEventListener('click', async (e) => {
        e.preventDefault();
        
        const userOrdersList = document.getElementById('userOrdersList');
        userOrdersList.innerHTML = '<p class="text-center">Loading orders...</p>';
        
        try {
            const response = await fetch(`orders.php?email=${encodeURIComponent(currentUser.email)}`);
            const myOrders = await response.json();
            
            if (!myOrders || myOrders.length === 0) {
                userOrdersList.innerHTML = '<p class="text-center">You have no past orders.</p>';
            } else {
                let html = '';
                myOrders.forEach(ord => {
                    html += `
                        <div class="order-block">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <strong>#${ord.id}</strong>
                                <span style="color: var(--text-muted);">${ord.date}</span>
                            </div>
                            <div style="margin-bottom: 5px;">Status: <span style="color: var(--gold-highlight); font-weight:500;">${ord.status}</span></div>
                            <div style="border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px; font-weight: 500;">
                                Total: ₹${ord.total}
                            </div>
                        </div>
                    `;
                });
                userOrdersList.innerHTML = html;
            }
        } catch (err) {
            console.error("Order Fetch Error:", err);
            userOrdersList.innerHTML = '<p class="text-center">Failed to load orders.</p>';
        }
        
        openModal(ordersModal);
    });

    // 9. Admin Panel Logic
    document.getElementById('openAdmin').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser && currentUser.role === 'admin') {
            renderAdminUsers(); // Default tab
            openModal(adminModal);
        } else {
            alert("Access Denied.");
        }
    });

    // Admin Tabs Navigation
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabs = document.querySelectorAll('.admin-tab');
            const contents = document.querySelectorAll('.admin-tab-content');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            e.currentTarget.classList.add('active');
            const target = e.currentTarget.dataset.tab;
            document.getElementById('admin' + target.charAt(0).toUpperCase() + target.slice(1)).classList.add('active');
            
            if (target === 'users') renderAdminUsers();
            if (target === 'orders') renderAdminOrders();
            if (target === 'products') renderAdminProducts();
        });
    });

    const renderAdminUsers = async () => {
        const container = document.getElementById('adminUsers');
        container.innerHTML = '<p class="text-center">Loading users...</p>';
        try {
            const resp = await fetch('users.php?role=admin');
            const usersList = await resp.json();
            document.getElementById('adminUserCount').textContent = usersList.length;
            
            container.innerHTML = usersList.map(u => `
                <div class="admin-list-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.05); padding: 12px 0;">
                    <div>
                        <h4 style="margin:0; font-size: 1.1rem;">${u.name}</h4>
                        <p style="margin: 3px 0; color: var(--text-muted); font-size: 0.9rem;">${u.email} | ${u.phone || 'N/A'}</p>
                    </div>
                    <span class="role-badge ${u.role}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">${u.role}</span>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = '<p>Error loading users.</p>';
        }
    };

    const renderAdminOrders = async () => {
        const container = document.getElementById('adminOrders');
        container.innerHTML = '<p class="text-center">Loading orders...</p>';
        try {
            const resp = await fetch('orders.php?role=admin');
            const ordersList = await resp.json();
            
            if (ordersList.length === 0) {
                container.innerHTML = '<p>No orders yet.</p>';
                return;
            }

            container.innerHTML = ordersList.map(o => `
                <div class="admin-list-item" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 15px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <h4 style="margin:0;">#${o.id}</h4>
                        <span style="color: var(--gold-highlight); font-weight: 600;">₹${o.total}</span>
                    </div>
                    <p><strong>Customer:</strong> ${o.customerName} (${o.customerEmail})</p>
                    <p><strong>Date:</strong> ${o.date} | <strong>Status:</strong> <span style="color:var(--gold-highlight)">${o.status}</span></p>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = '<p>Error loading orders.</p>';
        }
    };

    // Adding dynamic product
    document.getElementById('adminAddProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('addProductName').value;
        const price = document.getElementById('addProductPrice').value;
        const category = document.getElementById('addProductCategory').value;
        const image = document.getElementById('addProductImage').value;

        const newProd = { id: 'p_' + Date.now(), name, price, category, image };
        customProducts.push(newProd);
        localStorage.setItem('hk_products', JSON.stringify(customProducts));
        
        injectCustomProducts(); // Refresh UI
        renderAdminProducts(); // Refresh Admin list
        e.target.reset();
        alert('Product added! It will appear on the homepage.');
    });

    const renderAdminProducts = () => {
        const listContainer = document.getElementById('adminProductsList');
        if (customProducts.length === 0) {
            listContainer.innerHTML = '<p>No custom products added yet. The default static products stay in place.</p>';
            return;
        }

        let html = '<h4 style="margin-bottom: 15px;">Custom Added Products</h4>';
        customProducts.forEach((p, idx) => {
            html += `
                <div class="admin-list-item" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h5 style="margin:0; font-size: 1rem;">${p.name}</h5>
                        <p style="margin:0; font-size: 0.9rem; color: var(--gold-highlight);">₹${p.price} - ${p.category}</p>
                    </div>
                    <button class="btn btn-outline admin-delete-prod" data-index="${idx}" style="padding: 5px 10px; border-color: #d9534f; color: #d9534f;">Delete</button>
                </div>
            `;
        });
        listContainer.innerHTML = html;

        document.querySelectorAll('.admin-delete-prod').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                customProducts.splice(idx, 1);
                localStorage.setItem('hk_products', JSON.stringify(customProducts));
                injectCustomProducts(); // re-render main UI
                renderAdminProducts(); // re-render admin view
            });
        });
    };

    // 10. Inject Custom Products into DOM
    const injectCustomProducts = () => {
        if(customProducts.length === 0) return;
        
        // Find containers
        const candlesSection = document.querySelector('#candles .product-grid');
        const lightsSection = document.querySelector('#lights .product-grid');
        
        // Remove existing custom products appended previously if re-rendering
        document.querySelectorAll('.custom-injected-prod').forEach(el => el.remove());

        customProducts.forEach(prod => {
            const cardHtml = `
                <div class="product-card luxury-card custom-injected-prod reveal active" data-id="${prod.id}" data-category="${prod.category}">
                    <div class="product-img-wrap">
                        <img src="${prod.image}" alt="${prod.name}" class="product-img" loading="lazy" onerror="this.src='https://source.unsplash.com/featured/800x800?${prod.category === 'candles' ? 'candle' : 'light'}'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${prod.name}</h3>
                        <p class="product-price">₹${prod.price}</p>
                        <button class="btn btn-outline btn-full add-to-cart">Add to Cart</button>
                    </div>
                </div>
            `;
            
            if(prod.category === 'candles' && candlesSection) {
                candlesSection.innerHTML += cardHtml;
            } else if (prod.category === 'lights' && lightsSection) {
                lightsSection.innerHTML += cardHtml;
            }
        });

        // Rebind add-to-cart buttons for newly injected items
        document.querySelectorAll('.custom-injected-prod .add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.product-card');
                const name = card.querySelector('.product-name').textContent;
                const price = card.querySelector('.product-price').textContent;
                addToCart(name, price);
            });
        });
        
        // Let Phase 2 init functions re-bind wishlist/quick view/ratings to injected elements
        initPhase2Logic();
    };

    // Placeholder for Phase 2 Logic integration
    const updateWishlistUI = () => {
        const badge = document.getElementById('wishlistBadge');
        if(badge) badge.textContent = wishlist.length;
    };

    const renderWishlist = () => {
        const container = document.getElementById('wishlistContainer');
        if(!container) return;
        
        if(wishlist.length === 0) {
            container.innerHTML = '<p class="text-center" style="padding: 20px;">Your wishlist is empty.</p>';
            return;
        }

        container.innerHTML = wishlist.map(p => `
            <div class="wishlist-item" style="display: flex; align-items: center; gap: 15px; padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <img src="${p.image}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1;">
                    <p style="font-weight: 500; margin: 0;">${p.name}</p>
                    <p style="color: var(--gold-highlight); margin: 0; font-size: 0.9rem;">₹${p.price}</p>
                </div>
                <button class="btn btn-primary add-to-cart-from-wish" data-id="${p.id}" style="padding: 5px 12px; font-size: 0.8rem;">Add to Cart</button>
                <button class="remove-from-wish" data-id="${p.id}" style="background: none; border: none; color: #d9534f; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
        
        container.querySelectorAll('.add-to-cart-from-wish').forEach(btn => {
            btn.addEventListener('click', () => {
                const prod = wishlist.find(w => w.id === btn.dataset.id);
                if(prod) addToCart(prod.id, prod.name, prod.price);
            });
        });
        
        container.querySelectorAll('.remove-from-wish').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleWishlist(btn.dataset.id);
                renderWishlist();
            });
        });
    };

    if (wishlistOpenBtn) {
        wishlistOpenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderWishlist();
            openModal(wishlistModal);
        });
    }
    // 10. Filter/Sort Logic
    document.querySelectorAll('.product-filter').forEach(select => {
        select.addEventListener('change', (e) => {
            const targetId = e.target.dataset.target;
            const grid = document.getElementById(targetId);
            if(!grid) return;
            
            const cards = Array.from(grid.querySelectorAll('.product-card'));
            const val = e.target.value;
            
            if(val === 'price-low' || val === 'price-high') {
                cards.sort((a, b) => {
                    const pA = parseInt(a.querySelector('.product-price').dataset.price || a.querySelector('.product-price').textContent.replace('₹',''));
                    const pB = parseInt(b.querySelector('.product-price').dataset.price || b.querySelector('.product-price').textContent.replace('₹',''));
                    return val === 'price-low' ? pA - pB : pB - pA;
                });
                cards.forEach(card => grid.appendChild(card));
            }
        });
    });

    // Start Application
    initApp();

    // Quick View Logic
    const openQuickView = (prod) => {
        const qvName = document.getElementById('qvName');
        const qvPrice = document.getElementById('qvPrice');
        const qvDesc = document.getElementById('qvDesc');
        const qvImage = document.getElementById('qvImage');
        
        if(qvName) qvName.textContent = prod.name;
        if(qvPrice) qvPrice.textContent = `₹${prod.price}`;
        if(qvDesc) qvDesc.textContent = prod.description;
        if(qvImage) qvImage.style.backgroundImage = `url(${prod.image})`;
        
        const qvRatingBlock = document.getElementById('qvRating');
        if(qvRatingBlock) {
            const qvStars = qvRatingBlock.querySelector('.stars');
            const qvCount = qvRatingBlock.querySelector('.rating-count');
            const rating = ratingsData[prod.id] || { total: 0, count: 0 };
            const avg = rating.count === 0 ? 5 : Math.round(rating.total / rating.count);
            qvStars.textContent = '★'.repeat(avg) + '☆'.repeat(5 - avg);
            qvCount.textContent = `(${rating.count})`;
        }
        
        const qvAddBtn = document.getElementById('qvAddToCartBtn');
        if(qvAddBtn) {
            qvAddBtn.onclick = () => { 
                addToCart(prod.id, prod.name, prod.price); 
                closeAllModals(); 
            };
        }
        openModal(quickViewModal);
    };

    // Wishlist Toggle
    const toggleWishlist = (id) => {
        const prod = allProducts.find(p => p.id === id);
        if(!prod) return;
        
        const idx = wishlist.findIndex(w => w.id === id);
        if(idx > -1) {
            wishlist.splice(idx, 1);
        } else {
            wishlist.push(prod);
        }
        
        localStorage.setItem('hk_wishlist', JSON.stringify(wishlist));
        updateWishlistUI();
        
        // Update heart icon if visible
        document.querySelectorAll(`.wishlist-heart-btn[data-id="${id}"]`).forEach(btn => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            icon.className = btn.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
        });
    };

    // Back to top
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) backToTopBtn.classList.add('visible');
            else backToTopBtn.classList.remove('visible');
        });
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
