// ratings-system.js
class RatingsSystem {
    constructor() {
        this.ratings = JSON.parse(localStorage.getItem('neonStoreRatings')) || {};
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // محاولة إضافة النجوم فوراً
        this.addRatingStars();
        
        // المراقبة للتغييرات في DOM (للمنتجات التي يتم تحميلها ديناميكياً)
        this.setupDOMObserver();
        
        // إضافة معالج للأحداث عند النقر على النجوم
        this.setupEventListeners();
        
        this.initialized = true;
    }

    setupDOMObserver() {
        // مراقبة أي تغييرات في قسم المنتجات
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    setTimeout(() => {
                        this.addRatingStars();
                    }, 100);
                }
            });
        });

        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            observer.observe(productsGrid, {
                childList: true,
                subtree: true
            });
        }
    }

    addRatingStars() {
        document.querySelectorAll('.product-card:not([data-rating-added])').forEach(card => {
            const productId = card.querySelector('.add-to-cart')?.getAttribute('data-id');
            
            if (productId) {
                // وضع علامة أن التقييمات أضيفت
                card.setAttribute('data-rating-added', 'true');
                
                // إنشاء عنصر التقييم
                const ratingContainer = document.createElement('div');
                ratingContainer.className = 'product-rating';
                ratingContainer.innerHTML = this.generateStarsHTML(productId);
                
                // البحث عن مكان مناسب للإضافة (بعد السعر)
                const priceElement = card.querySelector('.product-price');
                if (priceElement) {
                    // إضافة قبل زر إضافة إلى السلة
                    const addToCartBtn = priceElement.nextElementSibling;
                    if (addToCartBtn && addToCartBtn.classList.contains('add-to-cart')) {
                        priceElement.insertAdjacentElement('afterend', ratingContainer);
                    } else {
                        priceElement.insertAdjacentElement('afterend', ratingContainer);
                    }
                }
            }
        });
    }

    generateStarsHTML(productId) {
        const rating = this.getProductRating(productId);
        const average = rating.average || 0;
        const count = rating.count || 0;
        
        let starsHTML = '<div class="stars-container" style="display: inline-block; margin-left: 10px;">';
        
        // عرض النجوم
        for (let i = 1; i <= 5; i++) {
            if (i <= average) {
                starsHTML += '<i class="fas fa-star" style="color: #ff9e00; font-size: 14px;"></i>';
            } else if (i - 0.5 <= average) {
                starsHTML += '<i class="fas fa-star-half-alt" style="color: #ff9e00; font-size: 14px;"></i>';
            } else {
                starsHTML += '<i class="far fa-star" style="color: #adb5bd; font-size: 14px;"></i>';
            }
        }
        
        starsHTML += `</div>`;
        
        // إضافة عدد التقييمات
        if (count > 0) {
            starsHTML += `<span style="color: #adb5bd; font-size: 12px; margin-right: 5px;">(${count})</span>`;
        }
        
        return starsHTML;
    }

    getProductRating(productId) {
        if (this.ratings[productId] && this.ratings[productId].length > 0) {
            const ratings = this.ratings[productId];
            const sum = ratings.reduce((a, b) => a + b, 0);
            const average = sum / ratings.length;
            return { 
                average: parseFloat(average.toFixed(1)), 
                count: ratings.length 
            };
        }
        return { average: 0, count: 0 };
    }

    setupEventListeners() {
        // معالج النقر على النجوم
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('star') || 
                e.target.classList.contains('fa-star') ||
                e.target.closest('.stars-container')) {
                
                const star = e.target.closest('.fa-star, .star') || e.target;
                const productId = star.closest('.product-card')?.querySelector('.add-to-cart')?.getAttribute('data-id');
                
                if (productId) {
                    const value = parseInt(star.getAttribute('data-value') || 5);
                    this.submitRating(productId, value);
                }
            }
        });
    }

    submitRating(productId, rating) {
        if (!this.ratings[productId]) {
            this.ratings[productId] = [];
        }
        
        // إضافة التقييم
        this.ratings[productId].push(rating);
        
        // حفظ في localStorage
        localStorage.setItem('neonStoreRatings', JSON.stringify(this.ratings));
        
        // تحديث العرض
        this.updateProductRating(productId);
        
        // إظهار إشعار
        if (typeof showNotification === 'function') {
            showNotification('شكراً لتقييمك المنتج!', 'success');
        } else {
            alert('شكراً لتقييمك المنتج!');
        }
    }

    updateProductRating(productId) {
        // تحديث النجوم للمنتج المحدد
        const productCard = document.querySelector(`.add-to-cart[data-id="${productId}"]`)?.closest('.product-card');
        if (productCard) {
            const ratingContainer = productCard.querySelector('.product-rating');
            if (ratingContainer) {
                ratingContainer.innerHTML = this.generateStarsHTML(productId);
            }
        }
    }
}

// جعل النظام متاحاً عالمياً
window.RatingsSystem = RatingsSystem;

// بدء النظام بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const ratingsSystem = new RatingsSystem();
        ratingsSystem.init();
    }, 500); // تأخير لضمان تحميل المنتجات
});

// أيضًا بدء النظام عند تغيير الصفحات
window.addEventListener('hashchange', () => {
    setTimeout(() => {
        const ratingsSystem = new RatingsSystem();
        ratingsSystem.init();
    }, 300);
});