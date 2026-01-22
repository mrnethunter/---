// ملف المصادقة والإدارة

// التحقق من حالة تسجيل الدخول
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('neonStoreAdminLoggedIn');
    const loginTime = localStorage.getItem('neonStoreAdminLoginTime');
    
    if (!isLoggedIn || !loginTime) {
        return false;
    }
    
    // التحقق من انتهاء الجلسة (24 ساعة)
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        // انتهت الجلسة
        localStorage.removeItem('neonStoreAdminLoggedIn');
        localStorage.removeItem('neonStoreAdminLoginTime');
        return false;
    }
    
    return true;
}

// حماية صفحات الإدارة
function protectAdminPages() {
    if (window.location.pathname.includes('admin.html')) {
        if (!checkAuthStatus()) {
            window.location.href = 'index.html';
        }
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('neonStoreAdminLoggedIn');
    localStorage.removeItem('neonStoreAdminLoginTime');
    window.location.href = 'index.html';
}

// تهيئة نظام المصادقة
document.addEventListener('DOMContentLoaded', function() {
    // حماية صفحات الإدارة
    protectAdminPages();
    
    // إضافة حدث للخروج إذا كان الزر موجوداً
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn && !logoutBtn.hasEventListener) {
        logoutBtn.addEventListener('click', logout);
        logoutBtn.hasEventListener = true;
    }
});

// إنشاء بيانات أولية إذا لم تكن موجودة
function initializeStoreData() {
    // تحقق من وجود بيانات المنتجات
    if (!localStorage.getItem('neonStoreProducts')) {
        const initialProducts = [
            {
                id: 1,
                name: "سماعات الرأس النييون",
                description: "سماعات بجودة صوت عالية مع إضاءة نييون قابلة للتخصيص",
                price: 45,
                category: "electronics",
                stock: 15,
                icon: "fas fa-headphones",
                images: []
            },
            {
                id: 2,
                name: "لوحة المفاتيح الميكانيكية",
                description: "لوحة مفاتيح ميكانيكية مع إضاءة نييون RGB قابلة للبرمجة",
                price: 85,
                category: "electronics",
                stock: 8,
                icon: "fas fa-keyboard",
                images: []
            },
            {
                id: 3,
                name: "ماوس الألعاب",
                description: "ماوس ألعاب بدقة 16000 نقطة في البوصة مع إضاءة نييون",
                price: 55,
                category: "gaming",
                stock: 20,
                icon: "fas fa-mouse",
                images: []
            },
            {
                id: 4,
                name: "شاشة مراقبة نييون",
                description: "شاشة مراقبة 27 بوصة بدقة 4K مع إطار إضاءة نييون",
                price: 320,
                category: "electronics",
                stock: 5,
                icon: "fas fa-desktop",
                images: []
            },
            {
                id: 5,
                name: "مكبرات الصوت النييون",
                description: "مكبرات صوت ستريو مع إضاءة نييون متزامنة مع الموسيقى",
                price: 75,
                category: "electronics",
                stock: 12,
                icon: "fas fa-volume-up",
                images: []
            },
            {
                id: 6,
                name: "شاحن لاسلكي",
                description: "شاحن لاسلكي سريع مع إضاءة نييون مؤشر الشحن",
                price: 30,
                category: "accessories",
                stock: 25,
                icon: "fas fa-bolt",
                images: []
            }
        ];
        
        localStorage.setItem('neonStoreProducts', JSON.stringify(initialProducts));
    }
    
    // تحقق من وجود بيانات الإعدادات
    if (!localStorage.getItem('neonStoreSettings')) {
        const initialSettings = {
            storeName: "نييون ستور",
            storeDescription: "متجر إلكتروني متكامل مع أحدث تقنيات التصميم والعرض",
            contactId: "H9ZI",
            deliveryFee: 3,
            currency: "دينار",
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('neonStoreSettings', JSON.stringify(initialSettings));
    }
}

// تشغيل تهيئة البيانات
initializeStoreData();