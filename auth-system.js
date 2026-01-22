// auth-system.js
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('neonStoreUsers')) || [];
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.createAuthUI();
        this.setupEventListeners();
    }

    checkLoginStatus() {
        const loggedInUser = localStorage.getItem('neonStoreCurrentUser');
        if (loggedInUser) {
            this.currentUser = JSON.parse(loggedInUser);
            console.log('User is logged in:', this.currentUser.name);
        }
    }

    createAuthUI() {
        // إنشاء واجهة المصادقة في الهيدر
        const authHTML = this.currentUser 
            ? this.createLoggedInUI()
            : this.createLoginButton();

        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertAdjacentHTML('beforeend', authHTML);
        }
    }

    createLoginButton() {
        return `
            <div class="auth-container">
                <button class="auth-btn login-btn" id="loginBtn">
                    <i class="fas fa-user"></i>
                    <span>تسجيل الدخول</span>
                </button>
                <button class="auth-btn register-btn" id="registerBtn">
                    <i class="fas fa-user-plus"></i>
                    <span>إنشاء حساب</span>
                </button>
            </div>
        `;
    }

    createLoggedInUI() {
        return `
            <div class="auth-container logged-in">
                <div class="user-menu">
                    <button class="user-btn" id="userMenuBtn">
                        <i class="fas fa-user-circle"></i>
                        <span>${this.currentUser.name}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="#" class="dropdown-item" data-action="profile">
                            <i class="fas fa-user"></i> حسابي
                        </a>
                        <a href="#" class="dropdown-item" data-action="orders">
                            <i class="fas fa-shopping-bag"></i> طلباتي
                        </a>
                        <a href="#" class="dropdown-item" data-action="wishlist">
                            <i class="fas fa-heart"></i> المفضلة
                        </a>
                        <a href="#" class="dropdown-item" data-action="settings">
                            <i class="fas fa-cog"></i> الإعدادات
                        </a>
                        <hr>
                        <a href="#" class="dropdown-item logout" data-action="logout">
                            <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // أحداث أزرار التسجيل/الدخول
        document.addEventListener('click', (e) => {
            if (e.target.closest('#loginBtn')) {
                this.openLoginModal();
            } else if (e.target.closest('#registerBtn')) {
                this.openRegisterModal();
            } else if (e.target.closest('#userMenuBtn')) {
                this.toggleUserDropdown();
            } else if (e.target.closest('.user-dropdown a')) {
                const action = e.target.closest('a').getAttribute('data-action');
                this.handleUserAction(action);
                e.preventDefault();
            }
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown && !e.target.closest('.user-menu')) {
                dropdown.classList.remove('show');
            }
        });
    }

    openLoginModal() {
        const loginHTML = `
            <div class="auth-modal" id="loginModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-sign-in-alt"></i> تسجيل الدخول</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="loginEmail">البريد الإلكتروني</label>
                                <input type="email" id="loginEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">كلمة المرور</label>
                                <input type="password" id="loginPassword" required>
                            </div>
                            <button type="submit" class="submit-btn">تسجيل الدخول</button>
                        </form>
                        <div class="auth-links">
                            <a href="#" class="switch-auth" data-type="register">إنشاء حساب جديد</a>
                            <a href="#" class="forgot-password">نسيت كلمة المرور؟</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', loginHTML);
        this.setupAuthModalEvents('login');
    }

    openRegisterModal() {
        const registerHTML = `
            <div class="auth-modal" id="registerModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-user-plus"></i> إنشاء حساب جديد</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="regName">الاسم الكامل</label>
                                <input type="text" id="regName" required>
                            </div>
                            <div class="form-group">
                                <label for="regEmail">البريد الإلكتروني</label>
                                <input type="email" id="regEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="regPhone">رقم الهاتف</label>
                                <input type="tel" id="regPhone">
                            </div>
                            <div class="form-group">
                                <label for="regPassword">كلمة المرور</label>
                                <input type="password" id="regPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="regConfirmPassword">تأكيد كلمة المرور</label>
                                <input type="password" id="regConfirmPassword" required>
                            </div>
                            <button type="submit" class="submit-btn">إنشاء حساب</button>
                        </form>
                        <div class="auth-links">
                            <a href="#" class="switch-auth" data-type="login">لديك حساب؟ سجل الدخول</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', registerHTML);
        this.setupAuthModalEvents('register');
    }

    setupAuthModalEvents(type) {
        const modal = document.getElementById(`${type}Modal`);
        const closeBtn = modal.querySelector('.close-modal');
        const switchBtn = modal.querySelector('.switch-auth');
        
        closeBtn.addEventListener('click', () => this.closeAuthModal(type));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeAuthModal(type);
        });

        if (switchBtn) {
            switchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeAuthModal(type);
                const switchTo = e.target.getAttribute('data-type');
                if (switchTo === 'login') this.openLoginModal();
                else this.openRegisterModal();
            });
        }

        const form = document.getElementById(`${type}Form`);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (type === 'login') this.handleLogin();
            else this.handleRegister();
        });
    }

    closeAuthModal(type) {
        const modal = document.getElementById(`${type}Modal`);
        if (modal) {
            modal.remove();
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('neonStoreCurrentUser', JSON.stringify(user));
            
            this.closeAuthModal('login');
            this.updateAuthUI();
            
            // إشعار بنجاح التسجيل
            if (typeof showNotification === 'function') {
                showNotification(`مرحباً بعودتك ${user.name}!`, 'success');
            }
        } else {
            alert('بيانات الدخول غير صحيحة!');
        }
    }

    handleRegister() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('كلمة المرور غير متطابقة!');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            alert('هذا البريد الإلكتروني مستخدم بالفعل!');
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password,
            joinDate: new Date().toISOString(),
            orders: [],
            wishlist: []
        };

        this.users.push(newUser);
        localStorage.setItem('neonStoreUsers', JSON.stringify(this.users));

        this.currentUser = newUser;
        localStorage.setItem('neonStoreCurrentUser', JSON.stringify(newUser));

        this.closeAuthModal('register');
        this.updateAuthUI();

        if (typeof showNotification === 'function') {
            showNotification(`مرحباً ${name}! تم إنشاء حسابك بنجاح.`, 'success');
        }
    }

    updateAuthUI() {
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            authContainer.remove();
            this.createAuthUI();
            this.setupEventListeners();
        }
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    handleUserAction(action) {
        switch (action) {
            case 'profile':
                this.openUserProfile();
                break;
            case 'orders':
                this.openUserOrders();
                break;
            case 'wishlist':
                this.openWishlist();
                break;
            case 'settings':
                this.openSettings();
                break;
            case 'logout':
                this.logout();
                break;
        }
    }

    openUserProfile() {
        alert('صفحة الحساب الشخصي (قيد التطوير)');
    }

    openUserOrders() {
        alert('صفحة الطلبات (قيد التطوير)');
    }

    openWishlist() {
        alert('صفحة المفضلة (قيد التطوير)');
    }

    openSettings() {
        alert('صفحة الإعدادات (قيد التطوير)');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('neonStoreCurrentUser');
        this.updateAuthUI();
        
        if (typeof showNotification === 'function') {
            showNotification('تم تسجيل الخروج بنجاح', 'info');
        }
    }
}

// CSS الخاص بنظام المصادقة
const authCSS = `
    .auth-container {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .auth-btn {
        padding: 8px 15px;
        border-radius: 20px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
        font-size: 0.9rem;
    }
    
    .login-btn {
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid rgba(157, 78, 221, 0.3);
        color: var(--text-light);
    }
    
    .login-btn:hover {
        border-color: var(--galaxy-cyan);
        transform: translateY(-2px);
    }
    
    .register-btn {
        background: linear-gradient(90deg, var(--galaxy-cyan), var(--galaxy-pink));
        color: var(--galaxy-black);
        border: none;
    }
    
    .register-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 187, 249, 0.3);
    }
    
    .logged-in .user-menu {
        position: relative;
    }
    
    .user-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 15px;
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 20px;
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s;
        font-size: 0.9rem;
    }
    
    .user-btn:hover {
        border-color: var(--galaxy-cyan);
    }
    
    .user-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--galaxy-dark);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 10px;
        margin-top: 5px;
        min-width: 200px;
        display: none;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }
    
    .user-dropdown.show {
        display: block;
        animation: dropdownSlide 0.3s ease;
    }
    
    @keyframes dropdownSlide {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 15px;
        color: var(--text-light);
        text-decoration: none;
        transition: background 0.3s;
        border-bottom: 1px solid rgba(157, 78, 221, 0.1);
    }
    
    .dropdown-item:last-child {
        border-bottom: none;
    }
    
    .dropdown-item:hover {
        background: rgba(157, 78, 221, 0.1);
    }
    
    .dropdown-item.logout {
        color: var(--danger);
    }
    
    .dropdown-item i {
        width: 20px;
        text-align: center;
    }
    
    .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(12, 12, 29, 0.8);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    }
    
    .auth-modal .modal-content {
        background: var(--galaxy-dark);
        border-radius: 15px;
        width: 90%;
        max-width: 400px;
        border: 1px solid rgba(157, 78, 221, 0.3);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: modalSlide 0.3s ease;
    }
    
    @keyframes modalSlide {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid rgba(157, 78, 221, 0.3);
    }
    
    .modal-header h3 {
        color: var(--galaxy-cyan);
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: var(--text-light);
        font-size: 24px;
        cursor: pointer;
        transition: color 0.3s;
    }
    
    .close-modal:hover {
        color: var(--galaxy-pink);
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        color: var(--text-light);
        font-size: 0.9rem;
    }
    
    .form-group input {
        width: 100%;
        padding: 10px 15px;
        background: rgba(26, 26, 46, 0.5);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 5px;
        color: var(--text-light);
        font-size: 1rem;
        transition: all 0.3s;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--galaxy-cyan);
        box-shadow: 0 0 0 2px rgba(0, 187, 249, 0.2);
    }
    
    .submit-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(90deg, var(--galaxy-cyan), var(--galaxy-pink));
        color: var(--galaxy-black);
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 10px;
    }
    
    .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 187, 249, 0.3);
    }
    
    .auth-links {
        margin-top: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .auth-links a {
        color: var(--galaxy-cyan);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s;
    }
    
    .auth-links a:hover {
        color: var(--galaxy-pink);
    }
    
    @media (max-width: 768px) {
        .auth-container {
            gap: 5px;
        }
        
        .auth-btn span {
            display: none;
        }
        
        .auth-btn {
            padding: 8px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            justify-content: center;
        }
        
        .user-btn span {
            display: none;
        }
        
        .user-dropdown {
            left: auto;
            right: 0;
        }
    }
`;

// إضافة CSS
const authStyle = document.createElement('style');
authStyle.textContent = authCSS;
document.head.appendChild(authStyle);

// تهيئة نظام المصادقة
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});