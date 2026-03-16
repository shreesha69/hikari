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

    // --- E-COMMERCE LOGIC (Local Storage Backend Simulation) ---

    // 1. Data Store Initialization
    // 1. Data Store Initialization
    let cart = JSON.parse(localStorage.getItem('hk_cart')) || [];
    let users = JSON.parse(localStorage.getItem('hk_users')) || [
        { name: 'Admin User', email: 'admin@hikari.com', password: 'admin', role: 'admin', phone: '0000', address: 'Hikari HQ' }
    ];
    let currentUser = JSON.parse(localStorage.getItem('hk_currentUser')) || null;
    let orders = JSON.parse(localStorage.getItem('hk_orders')) || [];
    let customProducts = JSON.parse(localStorage.getItem('hk_products')) || [];
    let wishlist = JSON.parse(localStorage.getItem('hk_wishlist')) || [];
    let ratingsData = JSON.parse(localStorage.getItem('hk_ratings')) || {};

    let allProducts = [];

    // --- Backend API Bridge (Preparation for PHP) ---
    const API = {
        getProducts: async () => {
            try {
                // Future: const response = await fetch('api/get_products.php');
                const response = await fetch('products.json');
                return await response.json();
            } catch (err) {
                console.error("API Error (getProducts):", err);
                return [];
            }
        },
        login: async (email, password) => {
            // Future: return fetch('api/login.php', { method: 'POST', body: JSON.stringify({email, password}) });
            const user = users.find(u => u.email === email && u.password === password);
            return user ? { success: true, user } : { success: false, message: 'Invalid credentials' };
        },
        register: async (userData) => {
            // Future: return fetch('api/register.php', { method: 'POST', body: JSON.stringify(userData) });
            if (users.find(u => u.email === userData.email)) return { success: false, message: 'Email exists' };
            users.push(userData);
            localStorage.setItem('hk_users', JSON.stringify(users));
            return { success: true, user: userData };
        },
        createOrder: async (orderData) => {
            // Future: return fetch('api/create_order.php', { method: 'POST', body: JSON.stringify(orderData) });
            orders.push(orderData);
            localStorage.setItem('hk_orders', JSON.stringify(orders));
            return { success: true };
        }
    };

    // Initialize App
    const initApp = async () => {
        const staticProducts = await API.getProducts();
        allProducts = [...staticProducts, ...customProducts];

        // Run dependent logic
        const path = window.location.pathname;
        if (path.includes('candles.html')) {
            renderProductGrid('candles-grid', 'candles');
        } else if (path.includes('lights.html')) {
            renderProductGrid('lights-grid', 'lights');
        } else if (path.includes('search.html')) {
            handleSearchPage();
        } else {
            // Index or other
            renderProductGrid('candles-grid', 'candles', 4);
            renderProductGrid('lights-grid', 'lights', 4);
        }

        updateAuthUI();
        updateCartUI();
        updateWishlistUI();
        rebindProductEvents();
    };

    // Admin account exists by default if not created
    if (!users.find(u => u.email === 'admin@hikari.com')) {
        users.push({
            id: 'u_admin', name: 'Admin', email: 'admin@hikari.com',
            phone: '0000000000', address: 'Hikari HQ',
            password: 'admin', role: 'admin'
        });
        localStorage.setItem('hk_users', JSON.stringify(users));
    }

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
    document.getElementById('openLogin').addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
    document.getElementById('openRegister').addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
    document.getElementById('switchToRegister').addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
    document.getElementById('switchToLogin').addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const address = document.getElementById('regAddress').value;
        const password = document.getElementById('regPassword').value;

        if (users.find(u => u.email === email)) {
            document.getElementById('regError').textContent = 'Email already exists.';
            document.getElementById('regError').style.display = 'block';
            return;
        }

        const newUser = { id: 'u_' + Date.now(), name, email, phone, address, password, role: 'user' };
        users.push(newUser);
        localStorage.setItem('hk_users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('hk_currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeAllModals();
        alert('Registration successful!');
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('hk_currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeAllModals();
        } else {
            document.getElementById('loginError').textContent = 'Invalid credentials.';
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
    const renderProductGrid = (containerId, category = null, limit = null) => {
        const grid = document.getElementById(containerId);
        if(!grid) return;
        
        let filtered = category ? allProducts.filter(p => p.category === category) : allProducts;
        if(limit) filtered = filtered.slice(0, limit);
        
        grid.innerHTML = filtered.map((p, idx) => `
            <div class="product-card luxury-card reveal" style="transition-delay: ${idx * 0.1}s;" data-id="${p.id}" data-category="${p.category}" data-desc="${p.description}">
                <div class="product-img-wrap">
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://source.unsplash.com/featured/800x800?${p.category === 'candles' ? 'luxury,candle' : 'luxury,lighting'}'">
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
                const name = card.querySelector('.product-name').textContent;
                const price = card.querySelector('.product-price').textContent;
                addToCart(name, price);
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
        
        // Mobile alignment fix handler
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('focused');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('focused');
        });
    }

    const handleSearchPage = () => {
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
                        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://source.unsplash.com/featured/800x800?${p.category === 'candles' ? 'luxury,candle' : 'luxury,lighting'}'">
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

    const addToCart = (name, price) => {
        price = parseInt(price.replace('₹', '').replace(',', ''));
        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
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

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        let total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        const newOrder = {
            id: 'ORD-' + Math.floor(Math.random() * 1000000),
            date: new Date().toLocaleDateString(),
            items: [...cart],
            total: total,
            customerName: document.getElementById('chkName').value,
            customerPhone: document.getElementById('chkPhone').value,
            customerAddress: document.getElementById('chkAddress').value,
            customerEmail: currentUser ? currentUser.email : 'Guest'
        };

        orders.push(newOrder);
        localStorage.setItem('hk_orders', JSON.stringify(orders));

        cart = [];
        saveCart();
        closeAllModals();
        alert(`Order placed successfully! Your Order ID is ${newOrder.id}`);
    });

    // 8. Orders History
    document.getElementById('openOrders').addEventListener('click', (e) => {
        e.preventDefault();
        
        const userOrdersList = document.getElementById('userOrdersList');
        const myOrders = orders.filter(o => o.customerEmail === currentUser.email);
        
        if (myOrders.length === 0) {
            userOrdersList.innerHTML = '<p class="text-center">You have no past orders.</p>';
        } else {
            let html = '';
            myOrders.reverse().forEach(ord => {
                let itemsList = ord.items.map(i => `${i.quantity}x ${i.name}`).join('<br>');
                html += `
                    <div class="order-block">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <strong>${ord.id}</strong>
                            <span style="color: var(--text-muted);">${ord.date}</span>
                        </div>
                        <div class="order-items-list">${itemsList}</div>
                        <div style="border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px; font-weight: 500;">
                            Total: ₹${ord.total}
                        </div>
                    </div>
                `;
            });
            userOrdersList.innerHTML = html;
        }
        openModal(ordersModal);
    });

    // 9. Admin Panel Logic
    document.getElementById('openAdmin').addEventListener('click', (e) => {
        e.preventDefault();
        renderAdminData();
        openModal(adminModal);
    });

    const renderAdminData = () => {
        // Users
        document.getElementById('adminUserCount').textContent = users.length;
        let usersHtml = '';
        users.forEach(u => {
            usersHtml += `
                <div class="admin-list-item">
                    <h4>${u.name} ${u.role === 'admin' ? '<span style="font-size: 0.8rem; background: var(--gold-highlight); color: white; padding: 2px 6px; border-radius: 4px;">Admin</span>' : ''}</h4>
                    <p><strong>Email:</strong> ${u.email}</p>
                    <p><strong>Phone:</strong> ${u.phone}</p>
                    <p><strong>Address:</strong> ${u.address}</p>
                </div>
            `;
        });
        document.getElementById('adminUsers').innerHTML = usersHtml;

        // Orders
        let ordersHtml = '';
        if(orders.length === 0) {
            ordersHtml = '<p>No orders yet.</p>';
        } else {
            [...orders].reverse().forEach(o => {
                let items = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
                ordersHtml += `
                    <div class="admin-list-item">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <h4 style="margin:0;">${o.id}</h4>
                            <span style="color: var(--gold-highlight); font-weight: 500;">₹${o.total}</span>
                        </div>
                        <p><strong>Date:</strong> ${o.date}</p>
                        <p><strong>Customer:</strong> ${o.customerName} (${o.customerEmail})</p>
                        <p><strong>Address:</strong> ${o.customerAddress}</p>
                        <p style="margin-top:8px; padding-top:8px; border-top: 1px solid rgba(0,0,0,0.05);"><strong>Items:</strong> ${items}</p>
                    </div>
                `;
            });
        }
        document.getElementById('adminOrders').innerHTML = ordersHtml;

        // Render Custom Products List (optional extra functionality)
        renderAdminProducts();
    };

    // Admin Tabs Navigation
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            
            const targetId = 'admin' + e.target.dataset.tab.charAt(0).toUpperCase() + e.target.dataset.tab.slice(1);
            document.getElementById(targetId).classList.add('active');
        });
    });

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
                if(prod) addToCart(prod.name, `₹${prod.price}`);
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
        
        const qvAddBtn = document.getElementById('qvAddToCart');
        if(qvAddBtn) {
            qvAddBtn.onclick = () => { addToCart(prod.name, `₹${prod.price}`); closeAllModals(); };
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
