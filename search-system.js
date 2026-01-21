// search-system.js
class SearchSystem {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.init();
    }

    init() {
        this.createSearchUI();
        this.setupEventListeners();
    }

    createSearchUI() {
        // إنشاء حقل البحث
        const searchHTML = `
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="ابحث عن منتج..." />
                <i class="fas fa-search search-icon"></i>
                <div class="search-results" id="searchResults"></div>
            </div>
        `;

        // إضافة البحث إلى الهيدر
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertAdjacentHTML('afterbegin', searchHTML);
        }

        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => this.showAllProducts());
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.searchResults.style.display = 'none';
            }
        });
    }

    handleSearch(query) {
        const normalizedQuery = query.trim().toLowerCase();
        
        if (normalizedQuery.length < 2) {
            this.searchResults.style.display = 'none';
            return;
        }

        const products = JSON.parse(localStorage.getItem('neonStoreProducts')) || [];
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery)
        );

        this.displayResults(filtered);
    }

    displayResults(products) {
        if (products.length === 0) {
            this.searchResults.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
            this.searchResults.style.display = 'block';
            return;
        }

        const resultsHTML = products.map(product => `
            <div class="search-result-item" data-id="${product.id}">
                <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" />
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.description.substring(0, 60)}...</p>
                    <span class="price">${product.price} دينار</span>
                </div>
            </div>
        `).join('');

        this.searchResults.innerHTML = resultsHTML;
        this.searchResults.style.display = 'block';

        // إضافة أحداث النقر على النتائج
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.getAttribute('data-id');
                this.openProductDetails(productId);
            });
        });
    }

    showAllProducts() {
        const products = JSON.parse(localStorage.getItem('neonStoreProducts')) || [];
        if (products.length > 0) {
            this.displayResults(products.slice(0, 5));
        }
    }

    openProductDetails(productId) {
        window.location.href = `product-details.html?id=${productId}`;
    }
}

// CSS الخاص بالبحث
const searchCSS = `
    .search-container {
        position: relative;
        width: 300px;
    }
    
    #searchInput {
        width: 100%;
        padding: 10px 40px 10px 15px;
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 25px;
        color: var(--text-light);
        font-size: 1rem;
        transition: all 0.3s;
    }
    
    #searchInput:focus {
        outline: none;
        border-color: var(--galaxy-cyan);
        box-shadow: 0 0 15px rgba(0, 187, 249, 0.3);
    }
    
    .search-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--galaxy-cyan);
        cursor: pointer;
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--galaxy-dark);
        border: 1px solid rgba(157, 78, 221, 0.3);
        border-radius: 10px;
        margin-top: 5px;
        max-height: 400px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .search-result-item {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid rgba(157, 78, 221, 0.1);
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .search-result-item:hover {
        background: rgba(157, 78, 221, 0.1);
    }
    
    .search-result-item img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 5px;
        margin-left: 10px;
    }
    
    .search-result-info {
        flex: 1;
    }
    
    .search-result-info h4 {
        color: var(--text-light);
        margin-bottom: 5px;
        font-size: 0.9rem;
    }
    
    .search-result-info p {
        color: var(--text-gray);
        font-size: 0.8rem;
        margin-bottom: 5px;
    }
    
    .price {
        color: var(--galaxy-green);
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .no-results {
        padding: 20px;
        text-align: center;
        color: var(--text-gray);
    }
    
    @media (max-width: 768px) {
        .search-container {
            width: 200px;
        }
    }
    
    @media (max-width: 576px) {
        .search-container {
            width: 150px;
        }
    }
`;

// إضافة CSS إلى الصفحة
const style = document.createElement('style');
style.textContent = searchCSS;
document.head.appendChild(style);

// تهيئة نظام البحث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new SearchSystem();
});