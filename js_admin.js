// بيانات لوحة التحكم
let adminOrders = [];
let adminProducts = [];
let adminCustomers = [];
let adminStats = {
    totalOrders: 125,
    totalRevenue: 8450,
    totalProducts: 24,
    totalCustomers: 89,
    newOrders: 5
};

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    checkAdminAuth();
    
    // تهيئة البيانات
    loadAdminData();
    
    // تهيئة العناصر
    initAdminElements();
    
    // تهيئة الرسوم البيانية
    initCharts();
});

// التحقق من تسجيل الدخول
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('neonStoreAdminLoggedIn');
    const loginTime = localStorage.getItem('neonStoreAdminLoginTime');
    
    if (!isLoggedIn || !loginTime) {
        // غير مسجل دخول، إظهار شاشة المصادقة
        document.getElementById('adminAuth').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        return;
    }
    
    // التحقق من انتهاء الجلسة (24 ساعة)
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        // انتهت الجلسة
        localStorage.removeItem('neonStoreAdminLoggedIn');
        localStorage.removeItem('neonStoreAdminLoginTime');
        document.getElementById('adminAuth').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        return;
    }
    
    // مسجل دخول، إظهار لوحة التحكم
    document.getElementById('adminAuth').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

// تهيئة عناصر لوحة التحكم
function initAdminElements() {
    // عناصر المصادقة
    const adminAuthForm = document.getElementById('adminAuthForm');
    const togglePassword = document.getElementById('togglePassword');
    const authPassword = document.getElementById('authPassword');
    
    if (adminAuthForm) {
        adminAuthForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }
    
    if (togglePassword && authPassword) {
        togglePassword.addEventListener('click', function() {
            const type = authPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            authPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // عناصر التنقل
    const adminMenuItems = document.querySelectorAll('.admin-menu a');
    adminMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchAdminTab(tab);
        });
    });
    
    // عناصر الإعدادات
    const settingsMenuItems = document.querySelectorAll('.settings-menu a');
    settingsMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const setting = this.getAttribute('data-setting');
            switchSettingsTab(setting);
        });
    });
    
    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('neonStoreAdminLoggedIn');
            localStorage.removeItem('neonStoreAdminLoginTime');
            window.location.reload();
        });
    }
    
    // زر إضافة منتج
    const addProductModalBtn = document.getElementById('addProductModalBtn');
    const addProductModal = document.getElementById('addProductModal');
    const closeProductModal = document.getElementById('closeProductModal');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    
    if (addProductModalBtn && addProductModal) {
        addProductModalBtn.addEventListener('click', function() {
            addProductModal.classList.add('active');
            document.getElementById('overlay').classList.add('active');
        });
    }
    
    if (closeProductModal) {
        closeProductModal.addEventListener('click', function() {
            addProductModal.classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        });
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            addProductModal.classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        });
    }
    
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddProduct();
        });
    }
    
    // رفع الصور
    const imageUploadArea = document.getElementById('imageUploadArea');
    const browseImagesBtn = document.getElementById('browseImagesBtn');
    const productImages = document.getElementById('productImages');
    
    if (imageUploadArea && productImages) {
        imageUploadArea.addEventListener('click', function() {
            productImages.click();
        });
        
        imageUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#00bbf9';
            this.style.backgroundColor = 'rgba(157, 78, 221, 0.05)';
        });
        
        imageUploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = 'rgba(157, 78, 221, 0.3)';
            this.style.backgroundColor = 'transparent';
        });
        
        imageUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(157, 78, 221, 0.3)';
            this.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            handleImageUpload(files);
        });
    }
    
    if (browseImagesBtn && productImages) {
        browseImagesBtn.addEventListener('click', function() {
            productImages.click();
        });
    }
    
    if (productImages) {
        productImages.addEventListener('change', function() {
            handleImageUpload(this.files);
        });
    }
    
    // فلتر الطلبات
    const orderFilter = document.getElementById('orderFilter');
    if (orderFilter) {
        orderFilter.addEventListener('change', function() {
            filterOrders(this.value);
        });
    }
    
    // فلتر الإحصائيات
    const applyFilter = document.getElementById('applyFilter');
    if (applyFilter) {
        applyFilter.addEventListener('click', function() {
            applyDateFilter();
        });
    }
    
    // حفظ الإعدادات
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }
}

// تحميل بيانات الإدارة
function loadAdminData() {
    // تحميل الطلبات
    const savedOrders = localStorage.getItem('neonStoreOrders');
    adminOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    // تحميل المنتجات
    const savedProducts = localStorage.getItem('neonStoreProducts');
    adminProducts = savedProducts ? JSON.parse(savedProducts) : products;
    
    // تحميل العملاء (نقوم بإنشائها من الطلبات)
    adminCustomers = generateCustomersFromOrders(adminOrders);
    
    // تحديث العداد
    updateOrdersCount();
    
    // عرض البيانات
    displayRecentOrders();
    displayAllOrders();
    displayAdminProducts();
    displayCustomers();
}

// توليد بيانات العملاء من الطلبات
function generateCustomersFromOrders(orders) {
    const customers = [];
    const customerMap = new Map();
    
    orders.forEach(order => {
        if (!customerMap.has(order.phone)) {
            const customer = {
                id: customers.length + 1,
                name: order.customer,
                email: `${order.customer.replace(/\s+/g, '.').toLowerCase()}@example.com`,
                phone: order.phone,
                address: order.address,
                totalOrders: 0,
                totalSpent: 0,
                joinDate: order.date
            };
            customerMap.set(order.phone, customer);
            customers.push(customer);
        }
        
        const customer = customerMap.get(order.phone);
        customer.totalOrders++;
        customer.totalSpent += order.amount;
    });
    
    return customers;
}

// معالجة تسجيل دخول الإدارة
function handleAdminLogin() {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;
    
    // بيانات الدخول (يمكن تغييرها)
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // حفظ حالة الدخول
        localStorage.setItem('neonStoreAdminLoggedIn', 'true');
        localStorage.setItem('neonStoreAdminLoginTime', new Date().toISOString());
        
        // إعادة تحميل الصفحة
        window.location.reload();
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// تبديل تبويبات الإدارة
function switchAdminTab(tabId) {
    // تحديث القائمة
    document.querySelectorAll('.admin-menu a').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`.admin-menu a[data-tab="${tabId}"]`).classList.add('active');
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.admin-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // إظهار المحتوى المحدد
    document.getElementById(`${tabId}Content`).style.display = 'block';
    
    // تحديث الرسوم البيانية إذا كانت صفحة الإحصائيات
    if (tabId === 'analytics') {
        updateCharts();
    }
}

// تبديل تبويبات الإعدادات
function switchSettingsTab(settingId) {
    // تحديث القائمة
    document.querySelectorAll('.settings-menu a').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`.settings-menu a[data-setting="${settingId}"]`).classList.add('active');
    
    // إخفاء جميع الأقسام
    document.querySelectorAll('.setting-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // إظهار القسم المحدد
    document.getElementById(`${settingId}Settings`).style.display = 'block';
}

// تحديث عداد الطلبات الجديدة
function updateOrdersCount() {
    const newOrdersCount = adminOrders.filter(order => order.status === 'new').length;
    const badge = document.getElementById('newOrdersCount');
    if (badge) {
        badge.textContent = newOrdersCount;
        adminStats.newOrders = newOrdersCount;
    }
}

// عرض الطلبات الحديثة
function displayRecentOrders() {
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (!recentOrdersTable) return;
    
    recentOrdersTable.innerHTML = '';
    
    // الحصول على آخر 5 طلبات
    const recentOrders = [...adminOrders].reverse().slice(0, 5);
    
    recentOrders.forEach(order => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(order.status) {
            case 'new':
                statusClass = 'status-new';
                statusText = 'جديد';
                break;
            case 'processing':
                statusClass = 'status-processing';
                statusText = 'قيد المعالجة';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'مكتمل';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                statusText = 'ملغى';
                break;
        }
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.amount} دينار</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="viewOrderDetails(${order.id})">عرض</button>
            </td>
        `;
        
        recentOrdersTable.appendChild(row);
    });
}

// عرض جميع الطلبات
function displayAllOrders() {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;
    
    ordersTable.innerHTML = '';
    
    adminOrders.forEach(order => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(order.status) {
            case 'new':
                statusClass = 'status-new';
                statusText = 'جديد';
                break;
            case 'processing':
                statusClass = 'status-processing';
                statusText = 'قيد المعالجة';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'مكتمل';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                statusText = 'ملغى';
                break;
        }
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.products}</td>
            <td>${order.amount} دينار</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td class="table-actions">
                <button class="action-btn edit-btn" onclick="editOrder(${order.id})">تعديل</button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">حذف</button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
}

// عرض المنتجات في لوحة التحكم
function displayAdminProducts() {
    const productsGridAdmin = document.getElementById('productsGridAdmin');
    if (!productsGridAdmin) return;
    
    productsGridAdmin.innerHTML = '';
    
    adminProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card-admin';
        
        productCard.innerHTML = `
            <div class="product-image-admin">
                ${product.images && product.images.length > 0 ? 
                    `<img src="${product.images[0]}" alt="${product.name}" loading="lazy">` :
                    `<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #00bbf9; font-size: 3rem;">
                        <i class="${product.icon}"></i>
                    </div>`
                }
                <div class="product-overlay">
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="product-info-admin">
                <h4 class="product-title-admin">${product.name}</h4>
                <div class="product-meta">
                    <div class="product-price-admin">${product.price} دينار</div>
                    <div class="product-stock" style="color: ${product.stock > 0 ? '#00d4aa' : '#ff6b6b'}">
                        ${product.stock > 0 ? `${product.stock} قطعة` : 'غير متوفر'}
                    </div>
                </div>
                <p class="product-description-admin">${product.description}</p>
                <div class="product-category">
                    <span style="background: rgba(157, 78, 221, 0.1); color: #9d4edd; padding: 3px 10px; border-radius: 10px; font-size: 0.8rem;">
                        ${getCategoryName(product.category)}
                    </span>
                </div>
            </div>
        `;
        
        productsGridAdmin.appendChild(productCard);
    });
}

// عرض العملاء
function displayCustomers() {
    const customersTable = document.getElementById('customersTable');
    if (!customersTable) return;
    
    customersTable.innerHTML = '';
    
    adminCustomers.forEach(customer => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>${customer.totalSpent} دينار</td>
            <td>${customer.joinDate}</td>
            <td class="table-actions">
                <button class="action-btn edit-btn" onclick="viewCustomer(${customer.id})">عرض</button>
            </td>
        `;
        
        customersTable.appendChild(row);
    });
}

// الحصول على اسم الفئة
function getCategoryName(categoryKey) {
    const categories = {
        'electronics': 'إلكترونيات',
        'accessories': 'إكسسوارات',
        'gaming': 'ألعاب',
        'other': 'أخرى'
    };
    
    return categories[categoryKey] || 'غير مصنف';
}

// معالجة رفع الصور
let uploadedImages = [];

function handleImageUpload(files) {
    const maxFiles = 5;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    // التحقق من عدد الملفات
    if (uploadedImages.length + files.length > maxFiles) {
        showNotification(`يمكنك رفع حتى ${maxFiles} صور فقط`, 'error');
        return;
    }
    
    // معالجة كل ملف
    Array.from(files).forEach(file => {
        // التحقق من نوع الملف
        if (!allowedTypes.includes(file.type)) {
            showNotification(`نوع الملف ${file.name} غير مدعوم`, 'error');
            return;
        }
        
        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`حجم الملف ${file.name} كبير جداً (الحد الأقصى 5MB)`, 'error');
            return;
        }
        
        // قراءة الملف وعرض المعاينة
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedImages.push({
                name: file.name,
                url: e.target.result
            });
            
            updateImagePreview();
        };
        
        reader.readAsDataURL(file);
    });
}

// تحديث معاينة الصور
function updateImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    if (!imagePreview) return;
    
    imagePreview.innerHTML = '';
    
    uploadedImages.forEach((image, index) => {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'preview-image';
        
        previewDiv.innerHTML = `
            <img src="${image.url}" alt="معاينة ${index + 1}">
            <button class="remove-image" onclick="removeImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        imagePreview.appendChild(previewDiv);
    });
}

// إزالة صورة
function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
}

// معالجة إضافة منتج
function handleAddProduct() {
    const name = document.getElementById('productNameAdmin').value;
    const price = parseFloat(document.getElementById('productPriceAdmin').value);
    const category = document.getElementById('productCategoryAdmin').value;
    const description = document.getElementById('productDescriptionAdmin').value;
    const stock = parseInt(document.getElementById('productStockAdmin').value) || 0;
    
    if (!name || !price || !description) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (price <= 0) {
        showNotification('السعر يجب أن يكون أكبر من صفر', 'error');
        return;
    }
    
    // إنشاء المنتج الجديد
    const newProduct = {
        id: adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1,
        name: name,
        price: price,
        category: category,
        description: description,
        stock: stock,
        icon: 'fas fa-box',
        images: uploadedImages.map(img => img.url)
    };
    
    // إضافة المنتج
    adminProducts.push(newProduct);
    
    // حفظ في localStorage
    localStorage.setItem('neonStoreProducts', JSON.stringify(adminProducts));
    
    // تحديث الإحصائيات
    adminStats.totalProducts++;
    
    // إظهار رسالة النجاح
    showNotification('تم إضافة المنتج بنجاح', 'success');
    
    // تحديث العرض
    displayAdminProducts();
    
    // إغلاق النموذج ومسح البيانات
    closeProductModal.click();
    addProductForm.reset();
    uploadedImages = [];
    updateImagePreview();
}

// فلتر الطلبات
function filterOrders(status) {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;
    
    ordersTable.innerHTML = '';
    
    let filteredOrders = adminOrders;
    
    if (status !== 'all') {
        filteredOrders = adminOrders.filter(order => order.status === status);
    }
    
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(order.status) {
            case 'new':
                statusClass = 'status-new';
                statusText = 'جديد';
                break;
            case 'processing':
                statusClass = 'status-processing';
                statusText = 'قيد المعالجة';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'مكتمل';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                statusText = 'ملغى';
                break;
        }
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.products}</td>
            <td>${order.amount} دينار</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td class="table-actions">
                <button class="action-btn edit-btn" onclick="editOrder(${order.id})">تعديل</button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">حذف</button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
}

// تطبيق فلتر التاريخ
function applyDateFilter() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        showNotification('يرجى اختيار تاريخ البدء والانتهاء', 'error');
        return;
    }
    
    // هنا يمكنك تطبيق الفلتر على البيانات
    // في هذا المثال، سنقوم فقط بعرض رسالة
    showNotification(`تم تطبيق الفلتر من ${startDate} إلى ${endDate}`, 'success');
    
    // تحديث الرسوم البيانية حسب التاريخ
    updateCharts(startDate, endDate);
}

// حفظ الإعدادات العامة
function saveGeneralSettings() {
    const storeName = document.getElementById('storeNameSetting').value;
    const storeDescription = document.getElementById('storeDescription').value;
    const contactId = document.getElementById('contactIdSetting').value;
    
    // حفظ الإعدادات في localStorage
    const settings = {
        storeName: storeName,
        storeDescription: storeDescription,
        contactId: contactId,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('neonStoreSettings', JSON.stringify(settings));
    
    showNotification('تم حفظ الإعدادات بنجاح', 'success');
}

// تهيئة الرسوم البيانية
function initCharts() {
    // مخطط المبيعات
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        window.salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
                datasets: [{
                    label: 'المبيعات الشهرية',
                    data: [450, 520, 480, 620, 700, 850, 920],
                    borderColor: '#00bbf9',
                    backgroundColor: 'rgba(0, 187, 249, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        rtl: true,
                        labels: {
                            color: '#f8f9fa'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#adb5bd'
                        },
                        grid: {
                            color: 'rgba(157, 78, 221, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#adb5bd'
                        },
                        grid: {
                            color: 'rgba(157, 78, 221, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // مخطط المنتجات
    const productsCtx = document.getElementById('productsChart');
    if (productsCtx) {
        window.productsChart = new Chart(productsCtx, {
            type: 'doughnut',
            data: {
                labels: ['إلكترونيات', 'إكسسوارات', 'ألعاب', 'أخرى'],
                datasets: [{
                    data: [12, 5, 4, 3],
                    backgroundColor: [
                        '#00bbf9',
                        '#9d4edd',
                        '#00f5d4',
                        '#ff6b9d'
                    ],
                    borderWidth: 1,
                    borderColor: '#0c0c1d'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        rtl: true,
                        labels: {
                            color: '#f8f9fa'
                        }
                    }
                }
            }
        });
    }
}

// تحديث الرسوم البيانية
function updateCharts(startDate, endDate) {
    // في تطبيق حقيقي، هنا يتم تحديث البيانات حسب التاريخ
    // في هذا المثال، سنقوم فقط بتحديث بسيط للعرض
    if (window.salesChart) {
        // تحديث بيانات عشوائية للمثال
        const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 500) + 400);
        window.salesChart.data.datasets[0].data = newData;
        window.salesChart.update();
    }
}

// عرض تفاصيل الطلب
function viewOrderDetails(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // في تطبيق حقيقي، هنا يتم عرض تفاصيل الطلب في نافذة منبثقة
    alert(`تفاصيل الطلب #${order.id}\n\n` +
          `العميل: ${order.customer}\n` +
          `الهاتف: ${order.phone}\n` +
          `العنوان: ${order.address}\n` +
          `المنتجات: ${order.products}\n` +
          `المبلغ: ${order.amount} دينار\n` +
          `الحالة: ${order.status}\n` +
          `التاريخ: ${order.date}\n` +
          `ملاحظات: ${order.notes || 'لا توجد'}`);
}

// تعديل الطلب
function editOrder(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const newStatus = prompt('تغيير حالة الطلب:\n1 - جديد\n2 - قيد المعالجة\n3 - مكتمل\n4 - ملغى\n\nأدخل الرقم:', 
        order.status === 'new' ? '1' : 
        order.status === 'processing' ? '2' : 
        order.status === 'completed' ? '3' : '4');
    
    if (!newStatus) return;
    
    let status;
    switch(newStatus) {
        case '1': status = 'new'; break;
        case '2': status = 'processing'; break;
        case '3': status = 'completed'; break;
        case '4': status = 'cancelled'; break;
        default: return;
    }
    
    order.status = status;
    
    // حفظ التغييرات
    localStorage.setItem('neonStoreOrders', JSON.stringify(adminOrders));
    
    // تحديث العرض
    displayRecentOrders();
    displayAllOrders();
    updateOrdersCount();
    
    showNotification('تم تحديث حالة الطلب بنجاح', 'success');
}

// حذف طلب مع نافذة تأكيد مخصصة
function deleteOrder(orderId) {
    const order = storeData.orders.find(o => o.id === orderId);
    if (!order) return;
    
    // إنشاء نافذة التأكيد
    const deleteModalHTML = `
        <div class="delete-modal-overlay" id="deleteOrderModal">
            <div class="delete-modal">
                <div class="delete-icon">
                    <i class="fas fa-trash-alt"></i>
                </div>
                <h2 class="delete-title">حذف الطلب</h2>
                <p class="delete-message">
                    هل تريد حذف هذا الطلب نهائياً؟<br>
                    سيتم حذف جميع بيانات الطلب #${order.id}
                </p>
                
                <div class="order-info-delete">
                    <h4>تفاصيل الطلب</h4>
                    <p><strong>العميل:</strong> ${order.customer}</p>
                    <p><strong>المبلغ:</strong> ${order.amount} دينار</p>
                    <p><strong>التاريخ:</strong> ${order.date}</p>
                    <p><strong>الحالة:</strong> ${getStatusText(order.status)}</p>
                </div>
                
                <div class="delete-modal-buttons">
                    <button class="modal-btn modal-btn-cancel" id="cancelDeleteOrder">
                        <i class="fas fa-arrow-left"></i>
                        تراجع
                    </button>
                    <button class="modal-btn modal-btn-delete" id="confirmDeleteOrder">
                        <i class="fas fa-trash"></i>
                        حذف الطلب
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة إلى الصفحة
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = deleteModalHTML;
    document.body.appendChild(modalContainer);
    
    // إظهار النافذة مع تأثير
    setTimeout(() => {
        document.getElementById('deleteOrderModal').classList.add('show');
    }, 10);
    
    // إضافة الأحداث للأزرار
    document.getElementById('cancelDeleteOrder').addEventListener('click', function() {
        closeDeleteOrderModal();
    });
    
    document.getElementById('confirmDeleteOrder').addEventListener('click', function() {
        executeOrderDeletion(orderId);
    });
    
    // إغلاق النافذة عند النقر خارجها
    document.getElementById('deleteOrderModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteOrderModal();
        }
    });
    
    // إغلاق النافذة بمفتاح ESC
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            closeDeleteOrderModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    function closeDeleteOrderModal() {
        const modal = document.getElementById('deleteOrderModal');
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.remove();
            }
            document.removeEventListener('keydown', handleEscape);
        }, 300);
    }
    
    function executeOrderDeletion(id) {
        // حذف الطلب من البيانات
        storeData.orders = storeData.orders.filter(o => o.id !== id);
        
        // حفظ التغييرات
        localStorage.setItem('neonStoreOrders', JSON.stringify(storeData.orders));
        
        // إعادة حساب الإحصائيات
        calculateStats();
        
        // تحديث العروض
        updateRecentOrders();
        updateAllOrders();
        updateStatsDisplay();
        
        // إغلاق النافذة
        closeDeleteOrderModal();
        
        // إظهار إشعار النجاح
        showNotification('تم حذف الطلب بنجاح', 'success');
    }
}

// تعديل المنتج
function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    // في تطبيق حقيقي، هنا يتم فتح نموذج التعديل
    // في هذا المثال، سنقوم بعرض رسالة
    showNotification(`تعديل المنتج: ${product.name}`, 'info');
    
    // يمكنك فتح النموذج وتعبئة البيانات هنا
    document.getElementById('productNameAdmin').value = product.name;
    document.getElementById('productPriceAdmin').value = product.price;
    document.getElementById('productCategoryAdmin').value = product.category;
    document.getElementById('productDescriptionAdmin').value = product.description;
    document.getElementById('productStockAdmin').value = product.stock;
    
    // فتح نافذة إضافة المنتج (كصيغة تعديل)
    document.getElementById('addProductModalBtn').click();
}

// حذف منتج مع نافذة تأكيد مخصصة
function deleteProduct(productId) {
    const product = storeData.products.find(p => p.id === productId);
    if (!product) return;
    
    // إنشاء نافذة التأكيد
    const deleteModalHTML = `
        <div class="delete-modal-overlay" id="deleteModal">
            <div class="delete-modal">
                <div class="delete-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 class="delete-title">تأكيد الحذف</h2>
                <p class="delete-message">
                    هل أنت متأكد من حذف هذا المنتج؟<br>
                    هذا الإجراء لا يمكن التراجع عنه
                </p>
                
                <div class="product-info-delete">
                    <h4>${product.name}</h4>
                    <p class="product-price">${product.price} دينار</p>
                    <p style="color: ${product.stock > 0 ? '#00d4aa' : '#ff6b6b'};">
                        ${product.stock > 0 ? `الكمية المتاحة: ${product.stock}` : 'غير متوفر'}
                    </p>
                </div>
                
                <div class="delete-modal-buttons">
                    <button class="modal-btn modal-btn-cancel" id="cancelDelete">
                        <i class="fas fa-times"></i>
                        إلغاء
                    </button>
                    <button class="modal-btn modal-btn-delete" id="confirmDelete">
                        <i class="fas fa-trash"></i>
                        حذف المنتج
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة إلى الصفحة
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = deleteModalHTML;
    document.body.appendChild(modalContainer);
    
    // إظهار النافذة مع تأثير
    setTimeout(() => {
        document.getElementById('deleteModal').classList.add('show');
    }, 10);
    
    // إضافة الأحداث للأزرار
    document.getElementById('cancelDelete').addEventListener('click', function() {
        closeDeleteModal();
    });
    
    document.getElementById('confirmDelete').addEventListener('click', function() {
        executeProductDeletion(productId);
    });
    
    // إغلاق النافذة عند النقر خارجها
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
    
    // إغلاق النافذة بمفتاح ESC
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            closeDeleteModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    function closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.remove();
            }
            document.removeEventListener('keydown', handleEscape);
        }, 300);
    }
    
    function executeProductDeletion(id) {
        // حذف المنتج من البيانات
        storeData.products = storeData.products.filter(p => p.id !== id);
        
        // حفظ التغييرات
        localStorage.setItem('neonStoreProducts', JSON.stringify(storeData.products));
        
        // تحديث العرض
        updateProductsList();
        calculateStats();
        updateStatsDisplay();
        
        // إغلاق النافذة
        closeDeleteModal();
        
        // إظهار إشعار النجاح
        showNotification('تم حذف المنتج بنجاح', 'success');
    }
}

// عرض بيانات العميل
function viewCustomer(customerId) {
    const customer = adminCustomers.find(c => c.id === customerId);
    if (!customer) return;
    
    // في تطبيق حقيقي، هنا يتم عرض تفاصيل العميل
    alert(`تفاصيل العميل\n\n` +
          `الاسم: ${customer.name}\n` +
          `البريد: ${customer.email}\n` +
          `الهاتف: ${customer.phone}\n` +
          `العنوان: ${customer.address}\n` +
          `عدد الطلبات: ${customer.totalOrders}\n` +
          `إجمالي المشتريات: ${customer.totalSpent} دينار\n` +
          `تاريخ التسجيل: ${customer.joinDate}`);
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
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

// تصدير الدوال للاستخدام العام
window.viewOrderDetails = viewOrderDetails;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewCustomer = viewCustomer;
window.removeImage = removeImage;