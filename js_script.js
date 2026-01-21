// بيانات المنتجات
let products = [
    {
        id: 1,
        name: "سماعات الرأس النيون",
        description: "سماعات بجودة صوت عالية مع إضاءة نيون قابلة للتخصيص",
        price: 45,
        category: "electronics",
        stock: 15,
        icon: "fas fa-headphones",
        images: []
    },
    {
        id: 2,
        name: "لوحة المفاتيح الميكانيكية",
        description: "لوحة مفاتيح ميكانيكية مع إضاءة نيون RGB قابلة للبرمجة",
        price: 85,
        category: "electronics",
        stock: 8,
        icon: "fas fa-keyboard",
        images: []
    },
    {
        id: 3,
        name: "ماوس الألعاب",
        description: "ماوس ألعاب بدقة 16000 نقطة في البوصة مع إضاءة نيون",
        price: 55,
        category: "gaming",
        stock: 20,
        icon: "fas fa-mouse",
        images: []
    },
    {
        id: 4,
        name: "شاشة مراقبة نيون",
        description: "شاشة مراقبة 27 بوصة بدقة 4K مع إطار إضاءة نيون",
        price: 320,
        category: "electronics",
        stock: 5,
        icon: "fas fa-desktop",
        images: []
    },
    {
        id: 5,
        name: "مكبرات الصوت النيون",
        description: "مكبرات صوت ستريو مع إضاءة نيون متزامنة مع الموسيقى",
        price: 75,
        category: "electronics",
        stock: 12,
        icon: "fas fa-volume-up",
        images: []
    },
    {
        id: 6,
        name: "شاحن لاسلكي",
        description: "شاحن لاسلكي سريع مع إضاءة نيون مؤشر الشحن",
        price: 30,
        category: "accessories",
        stock: 25,
        icon: "fas fa-bolt",
        images: []
    }
];

// بيانات سلة التسوق
let cart = [];

// بيانات الطلبات
let orders = [
    {
        id: 1001,
        customer: "أحمد محمد",
        phone: "0791234567",
        address: "عمان - شارع المدينة المنورة",
        date: "2023-10-15",
        products: "سماعات الرأس النيون، ماوس الألعاب",
        amount: 100,
        status: "new",
        notes: "التوصيل بعد الساعة 5 مساءً"
    }
];

// تهيئة DOM بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة عناصر DOM
    initElements();
    
    // عرض المنتجات
    if (document.getElementById('productsGrid')) {
        displayProducts();
    }
    
    // تهيئة السلة
    loadCart();
    
    // تهيئة أحداث FAQ
    initFAQ();
    
    // تهيئة أحداث التواصل
    initContactForm();
});

// تهيئة عناصر DOM
function initElements() {
    // عناصر السلة
    window.cartToggle = document.getElementById('cartToggle');
    window.closeCart = document.getElementById('closeCart');
    window.cartSidebar = document.getElementById('cartSidebar');
    window.overlay = document.getElementById('overlay');
    window.cartItems = document.getElementById('cartItems');
    window.cartTotal = document.getElementById('cartTotal');
    window.cartCount = document.querySelector('.cart-count');
    window.checkoutCash = document.getElementById('checkoutCash');
    window.checkoutContact = document.getElementById('checkoutContact');
    
    // عناصر نموذج الطلب
    window.checkoutModal = document.getElementById('checkoutModal');
    window.closeCheckoutModal = document.getElementById('closeCheckoutModal');
    window.checkoutForm = document.getElementById('checkoutForm');
    
    // عناصر لوحة التحكم
    window.adminAccess = document.getElementById('adminAccess');
    window.adminAccessFooter = document.getElementById('adminAccessFooter');
    window.adminLoginModal = document.getElementById('adminLoginModal');
    window.closeAdminModal = document.getElementById('closeAdminModal');
    window.adminLoginForm = document.getElementById('adminLoginForm');
    
    // إضافة الأحداث
    if (cartToggle) cartToggle.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', closeAllModals);
    
    if (checkoutCash) checkoutCash.addEventListener('click', openCheckoutForm);
    if (checkoutContact) checkoutContact.addEventListener('click', contactOrder);
    
    if (closeCheckoutModal) closeCheckoutModal.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    if (checkoutForm) checkoutForm.addEventListener('submit', submitOrder);
    
    if (adminAccess) adminAccess.addEventListener('click', function(e) {
        e.preventDefault();
        openAdminLogin();
    });
    
    if (adminAccessFooter) adminAccessFooter.addEventListener('click', function(e) {
        e.preventDefault();
        openAdminLogin();
    });
    
    if (closeAdminModal) closeAdminModal.addEventListener('click', function() {
        adminLoginModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    if (adminLoginForm) adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitAdminLogin();
    });
}

// عرض المنتجات
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                ${product.images && product.images.length > 0 ? 
                    `<img src="${product.images[0]}" alt="${product.name}" loading="lazy">` :
                    `<i class="${product.icon}"></i>`
                }
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} دينار</div>
                <div class="product-stock" style="color: ${product.stock > 0 ? '#00d4aa' : '#ff6b6b'}; font-size: 0.9rem; margin-bottom: 10px;">
                    ${product.stock > 0 ? `متوفر (${product.stock})` : 'غير متوفر'}
                </div>
                <button class="add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> ${product.stock > 0 ? 'إضافة إلى السلة' : 'غير متوفر'}
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // إضافة حدث النقر لأزرار إضافة إلى السلة
    document.querySelectorAll('.add-to-cart:not([disabled])').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// إضافة منتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product || product.stock === 0) {
        showNotification('هذا المنتج غير متوفر حالياً', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('لا يمكن إضافة المزيد من هذا المنتج', 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            icon: product.icon
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} تمت إضافته إلى السلة`, 'success');
    
    // فتح السلة تلقائياً
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
}

// حفظ السلة في localStorage
function saveCart() {
    localStorage.setItem('neonStoreCart', JSON.stringify(cart));
}

// تحميل السلة من localStorage
function loadCart() {
    const savedCart = localStorage.getItem('neonStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// تحديث عرض السلة
function updateCartDisplay() {
    if (!cartItems || !cartTotal || !cartCount) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    let totalCount = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        totalCount += item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}">` :
                    `<i class="${item.icon}"></i>`
                }
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} دينار</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">حذف</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `${total} دينار`;
    cartCount.textContent = totalCount;
    
    // إضافة الأحداث للأزرار في السلة
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(productId);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            increaseQuantity(productId);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// تقليل كمية المنتج في السلة
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartDisplay();
}

// زيادة كمية المنتج في السلة
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item && product) {
        if (item.quantity >= product.stock) {
            showNotification('لا يمكن إضافة المزيد من هذا المنتج', 'error');
            return;
        }
        item.quantity++;
    }
    
    saveCart();
    updateCartDisplay();
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('تم إزالة المنتج من السلة', 'success');
}

// فتح/إغلاق السلة
function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// فتح نموذج إتمام الطلب
function openCheckoutForm() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف منتجات أولاً.', 'error');
        return;
    }
    
    // تحديث ملخص الطلب
    const orderSummary = document.getElementById('orderSummary');
    const modalTotal = document.getElementById('modalTotal');
    
    if (orderSummary && modalTotal) {
        let summaryHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            summaryHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${itemTotal} دينار</span>
                </div>
            `;
        });
        
        orderSummary.innerHTML = summaryHTML;
        modalTotal.textContent = `${total} دينار`;
    }
    
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
}

// إرسال الطلب
function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const notes = document.getElementById('customerNotes').value;
    
    if (!name || !phone || !address) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // إنشاء طلب جديد
    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1002,
        customer: name,
        phone: phone,
        address: address,
        date: new Date().toISOString().split('T')[0],
        products: cart.map(item => `${item.name} × ${item.quantity}`).join('، '),
        amount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        status: 'new',
        notes: notes
    };
    
    // حفظ الطلب في localStorage
    orders.push(newOrder);
    localStorage.setItem('neonStoreOrders', JSON.stringify(orders));
    
    // تحديث المخزون
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    
    // تحديث المنتجات في localStorage
    localStorage.setItem('neonStoreProducts', JSON.stringify(products));
    
    // إظهار رسالة النجاح
    showNotification(`تم تأكيد طلبك بنجاح! رقم الطلب: #${newOrder.id}`, 'success');
    
    // إغلاق النماذج ومسح السلة
    checkoutModal.classList.remove('active');
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    
    // مسح السلة
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // مسح النموذج
    checkoutForm.reset();
    
    // تحديث عرض المنتجات
    if (document.getElementById('productsGrid')) {
        displayProducts();
    }
}

// التواصل للطلب
function contactOrder() {
    if (cart.length === 0) {
        showNotification('السلة فارغة. أضف منتجات أولاً.', 'error');
        return;
    }
    
    // إنشاء تفاصيل الطلب
    let orderDetails = "تفاصيل الطلب:\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderDetails += `${index + 1}. ${item.name} - ${item.quantity} × ${item.price} دينار = ${itemTotal} دينار\n`;
    });
    
    orderDetails += `\nالإجمالي: ${total} دينار`;
    
    // حفظ الطلب في مسودة
    const draftOrder = {
        items: cart,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('neonStoreDraftOrder', JSON.stringify(draftOrder));
    
    showNotification(`يمكنك التواصل على المعرف H9ZI لتأكيد طلبك. تم حفظ تفاصيل الطلب.`, 'success');
    
    // عرض تفاصيل الطلب للمستخدم
    alert(orderDetails + "\n\nيمكنك التواصل على المعرف H9ZI لتأكيد طلبك.");
}

// فتح تسجيل دخول الإدارة
function openAdminLogin() {
    adminLoginModal.classList.add('active');
    overlay.classList.add('active');
}

// إرسال تسجيل دخول الإدارة
function submitAdminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // بيانات الدخول (يمكن تغييرها)
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // حفظ حالة الدخول
        localStorage.setItem('neonStoreAdminLoggedIn', 'true');
        localStorage.setItem('neonStoreAdminLoginTime', new Date().toISOString());
        
        // توجيه إلى لوحة التحكم
        window.location.href = 'admin.html';
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// تهيئة الأسئلة الشائعة
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // إغلاق جميع العناصر الأخرى
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // تبديل العنصر الحالي
            item.classList.toggle('active');
        });
    });
}

// تهيئة نموذج التواصل
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            if (!name || !email || !subject || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // في تطبيق حقيقي، هنا يتم إرسال الرسالة إلى الخادم
            // في هذا المثال، سنقوم بحفظها في localStorage
            
            const contactMessage = {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
                date: new Date().toISOString()
            };
            
            // الحصول على الرسائل الحالية
            let messages = JSON.parse(localStorage.getItem('neonStoreContactMessages')) || [];
            messages.push(contactMessage);
            
            // حفظ الرسائل
            localStorage.setItem('neonStoreContactMessages', JSON.stringify(messages));
            
            // إظهار رسالة النجاح
            showNotification('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.', 'success');
            
            // مسح النموذج
            contactForm.reset();
        });
    }
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 4000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// إغلاق جميع النماذج
function closeAllModals() {
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (checkoutModal) checkoutModal.classList.remove('active');
    if (adminLoginModal) adminLoginModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// التمرير إلى المنتجات
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// تهيئة الصور الافتراضية إذا لم تكن موجودة
function initDefaultImages() {
    // هذا دالة مساعدة لضمان وجود الصور
    // في تطبيق حقيقي، ستكون الصور مخزنة على الخادم
}

// تصدير الدوال للاستخدام العام
window.addToCart = addToCart;
window.scrollToProducts = scrollToProducts;
window.toggleCart = toggleCart;