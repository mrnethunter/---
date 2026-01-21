// categories-filter.js
class CategoriesFilter {
    constructor() {
        this.categories = ['الكل', 'إلكترونيات', 'إكسسوارات', 'ألعاب', 'ملابس'];
        this.currentCategory = 'الكل';
        this.init();
    }

    init() {
        this.createCategoriesUI();
        this.setupEventListeners();
    }

    createCategoriesUI() {
        const categoriesHTML = `
            <div class="categories-container">
                <div class="categories-buttons">
                    ${this.categories.map(cat => `
                        <button class="category-btn ${cat === 'الكل' ? 'active' : ''}" data-category="${cat}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            const sectionTitle = productsSection.querySelector('.section-title');
            sectionTitle.insertAdjacentHTML('afterend', categoriesHTML);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterByCategory(category);
                this.updateActiveButton(e.target);
            });
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (category === 'الكل') {
                product.style.display = 'block';
            } else {
                const productCategory = product.getAttribute('data-category') || '';
                product.style.display = productCategory.includes(category) ? 'block' : 'none';
            }
        });

        // إشعار بعدد المنتجات المعروضة
        const visibleCount = document.querySelectorAll('.product-card[style*="block"], .product-card:not([style])').length;
        this.showNotification(`عرض ${visibleCount} منتج${visibleCount > 10 ? '' : 'اً'}`);
    }

    updateActiveButton(activeBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    showNotification(message) {
        // يمكن استبدال هذا بنظام الإشعارات الموجود
        console.log(message);
    }
}

// CSS الخاص بالتصنيفات
const categoriesCSS = `
    .categories-container {
        margin: 20px 0 30px;
        text-align: center;
    }
    
    .categories-buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .category-btn {
        padding: 8px 20px;
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 20px;
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .category-btn:hover {
        border-color: var(--galaxy-cyan);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 187, 249, 0.2);
    }
    
    .category-btn.active {
        background: linear-gradient(90deg, var(--galaxy-cyan), var(--galaxy-pink));
        color: var(--galaxy-black);
        border-color: transparent;
        box-shadow: 0 5px 15px rgba(0, 187, 249, 0.3);
    }
    
    @media (max-width: 576px) {
        .categories-buttons {
            gap: 5px;
        }
        
        .category-btn {
            padding: 6px 15px;
            font-size: 0.8rem;
        }
    }
`;

// إضافة CSS
const categoriesStyle = document.createElement('style');
categoriesStyle.textContent = categoriesCSS;
document.head.appendChild(categoriesStyle);

// تهيئة نظام التصنيفات
document.addEventListener('DOMContentLoaded', () => {
    new CategoriesFilter();
});