// СЛАЙДЕР ПРОДУКТОВ
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.product-slider');
    
    sliders.forEach((slider, sliderIndex) => {
        const sliderContainer = slider.querySelector('.slider-container');
        const prevBtn = slider.querySelector('.arrow-left');
        const nextBtn = slider.querySelector('.arrow-right');
        const navDots = slider.querySelectorAll('.nav-dot');
        const likeBtn = slider.querySelector('.btn-like');
        const buyBtn = slider.querySelector('.btn-buy');
        const cartBtn = slider.querySelector('.btn-cart');
        
        let currentSlide = 0;
        const totalSlides = 3;
        
        function updateSlider() {
            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            navDots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
        
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.getAttribute('data-index'));
                updateSlider();
            });
        });
    });

    // ВИДЕО ПРИ НАВЕДЕНИИ
    const video = document.querySelector('.background-video');
    if (video) {
        let wasPlaying = false;
        
        const plusesCount = document.querySelector('.pluses-count');
        if (plusesCount) {
            plusesCount.addEventListener('mouseenter', function() {
                if (!wasPlaying) {
                    video.currentTime = 0;
                }
                video.play().catch(e => {
                    console.log("Автовоспроизведение не сработало:", e);
                });
            });

            plusesCount.addEventListener('mouseleave', function() {
                wasPlaying = true;
                video.pause();
            });
        }

        video.addEventListener('ended', function() {
            wasPlaying = false;
        });

        window.addEventListener('load', function() {
            video.currentTime = 0;
            video.pause();
        });
    }
    
    // АНИМАЦИИ ПРИ СКРОЛЛЕ
    const animatedElements = document.querySelectorAll(
        ".animate-left, .animate-right, .animate-top, .animate-bottom"
    );

    function checkVisibility() {
        const screenPosition = window.innerHeight * 0.7;
        
        animatedElements.forEach((element) => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < screenPosition) {
                element.classList.add("visible");
            } else {
                element.classList.remove("visible");
            }
        });
    }

    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);
    checkVisibility();
});

// КНОПКА "НАВЕРХ"
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '▶';
    scrollTopBtn.title = 'Наверх';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let cart = [];
let favorites = [];
let scrollPosition = 0;

// ПОЛУЧИТЬ АКТИВНУЮ ФОТКУ
function getActiveImage(productBlock) {
    const activeDot = productBlock.querySelector('.nav-dot.active');
    if (activeDot) {
        const index = activeDot.dataset.index;
        const imgs = productBlock.querySelectorAll('.slide img');
        if (imgs[index]) {
            return imgs[index].src;
        }
    }
    return productBlock.dataset.img || productBlock.getAttribute('data-img');
}

// ПОКАЗАТЬ ДЕТАЛЬНУЮ СТРАНИЦУ ТОВАРА
function showProductDetail(mainImage, title, price) {
    // Сохраняем текущую позицию скролла
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Сохраняем текущий товар
    window.currentProduct = {
        img: mainImage,
        title: title,
        price: price
    };
    
    // Скрываем контейнер
    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'none';
    }
    
    // Показываем детальную страницу
    const detailPage = document.getElementById('productDetailPage');
    detailPage.style.display = 'block';
    
    // Заполняем данные на детальной странице
    document.getElementById('detailProductMainImg').src = mainImage;
    document.getElementById('detailProductTitle').textContent = title;
    document.getElementById('detailProductPrice').textContent = price;
    
    // Получаем все изображения из активного слайдера
    const activeSlider = document.querySelector('.product-slider[data-title="' + title + '"]');
    if (activeSlider) {
        const slideImages = activeSlider.querySelectorAll('.slide img');
        
        // Заполняем маленькие изображения
        for (let i = 0; i < 3; i++) {
            const smallImgId = 'detailProductImg' + (i + 1);
            const smallImgElement = document.getElementById(smallImgId);
            
            if (smallImgElement && slideImages[i]) {
                smallImgElement.src = slideImages[i].src;
            } else if (smallImgElement && i === 0) {
                // Если есть только одно изображение, дублируем его для всех превью
                smallImgElement.src = mainImage;
            }
        }
    }
}

// ПОКАЗАТЬ ДЕТАЛЬНУЮ СТРАНИЦУ (из кнопки КУПИТЬ в блоке)
function showProductFromBlock(button) {
    const product = button.closest('.product-slider');
    const currentImg = getActiveImage(product);
    const title = product.getAttribute('data-title') || product.dataset.title;
    const price = product.getAttribute('data-price') || product.dataset.price;
    
    showProductDetail(currentImg, title, price);
}

// ВЕРНУТЬСЯ НАЗАД
function goBackToSlider() {
    const detailPage = document.getElementById('productDetailPage');
    detailPage.style.display = 'none';

    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'block';
    }
    
    // Восстанавливаем позицию скролла
    window.scrollTo(0, scrollPosition);
}

// Функция для смены главного изображения при клике на маленькое
function changeMainImage(clickedElement) {
    const smallImage = clickedElement.querySelector('img');
    const mainImage = document.getElementById('detailProductMainImg');
    
    if (smallImage && mainImage) {
        mainImage.src = smallImage.src;
        // Обновляем текущее изображение товара
        if (window.currentProduct) {
            window.currentProduct.img = smallImage.src;
        }
    }
}

// КОРЗИНА
function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    // Создаем оверлей если его нет
    createOverlay('cart');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    removeOverlay('cart');
}

function addToCart(button) {
    const product = button.closest('.product-slider');
    const currentImg = getActiveImage(product);
    const title = product.getAttribute('data-title') || product.dataset.title;
    const price = product.getAttribute('data-price') || product.dataset.price;
    
    // Получаем выбранный размер (если есть)
    const sizeContainer = product.querySelector('.size-buttons');
    let selectedSize = '';
    if (sizeContainer) {
        const selectedBtn = sizeContainer.querySelector('.size-btn.selected');
        if (selectedBtn) {
            selectedSize = selectedBtn.textContent;
        }
    }
    
    // Проверяем, есть ли уже такой товар в корзине
    // Теперь учитываем и размер тоже
    const existingItem = cart.find(item => 
        item.title === title && item.size === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id || 'item-' + Date.now(),
            title: title,
            price: price,
            img: currentImg,
            size: selectedSize, // Добавляем размер
            quantity: 1
        });
    }
    
    showCart();
    openCart();
}

function addToCartFromDetail() {
    if (window.currentProduct) {
        // Получаем выбранный размер из детальной страницы
        let selectedSize = '';
        const sizeContainer = document.querySelector('.product-info-container .size-buttons');
        if (sizeContainer) {
            const selectedBtn = sizeContainer.querySelector('.size-btn.selected');
            if (selectedBtn) {
                selectedSize = selectedBtn.textContent;
            }
        }
        
        // Проверяем, есть ли уже такой товар в корзине (с учетом размера)
        const existingItem = cart.find(item => 
            item.title === window.currentProduct.title && 
            item.size === selectedSize
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: 'detail-' + Date.now(),
                title: window.currentProduct.title,
                price: window.currentProduct.price,
                img: window.currentProduct.img,
                size: selectedSize, // Добавляем размер
                quantity: 1
            });
        }
        
        showCart();
        openCart();
    }
}

function showCart() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotalPrice');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        totalElement.textContent = '0$';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, i) => {
        const price = parseFloat(item.price.replace('$', '').replace('₽', '')) || 0;
        total += price * item.quantity;
        
        // Добавляем отображение размера, если он есть
        const sizeInfo = item.size ? `<p>Размер: ${item.size}</p>` : '';
        
        html += `
            <div class="cart-item">
                <img src="${item.img}">
                <div class="cart-text">
                    <h4>${item.title}</h4>
                    ${sizeInfo}
                    <p>${item.price} × ${item.quantity}</p>
                    <button class="add-button" onclick="removeFromCart(${i})">Удалить</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    totalElement.textContent = total.toFixed(2) + '$';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
}

// Добавьте также обработчик для выбора размера
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для выбора размера на слайдере товаров
    document.querySelectorAll('.product-slider .size-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parent = this.closest('.product-slider').querySelector('.size-buttons');
            if (parent) {
                parent.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
    
    // Обработчик для выбора размера на детальной странице
    document.querySelectorAll('.product-info-container .size-btn').forEach(button => {
        button.addEventListener('click', function() {
            const parent = document.querySelector('.product-info-container .size-buttons');
            if (parent) {
                parent.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
});

// ИЗБРАННОЕ
function openFavorites() {
    document.getElementById('wishlistSidebar').classList.add('active');
    createOverlay('wishlist');
}

function closeFavorites() {
    document.getElementById('wishlistSidebar').classList.remove('active');
    removeOverlay('wishlist');
}

function toggleFavorite(button) {
    const product = button.closest('.product-slider');
    const icon = button.querySelector('i');
    const title = product.getAttribute('data-title') || product.dataset.title;
    const price = product.getAttribute('data-price') || product.dataset.price;
    
    const item = {
        id: product.id || 'fav-' + Date.now(),
        title: title,
        price: price,
        img: getActiveImage(product)
    };
    
    const index = favorites.findIndex(f => f.id === item.id || f.title === item.title);
    
    if (index === -1) {
        favorites.push(item);
        icon.classList.remove('far');
        icon.classList.add('fas');
        // Добавляем класс active для стилизации
        button.classList.add('active');
    } else {
        favorites.splice(index, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
    }
    
    showFavorites();
}

function showFavorites() {
    const container = document.getElementById('wishlistItems');
    
    if (favorites.length === 0) {
        container.innerHTML = '<div class="empty-wishlist">Нет избранных</div>';
        return;
    }
    
    let html = '';
    
    favorites.forEach((item, i) => {
        html += `
            <div class="wishlist-item">
                <img src="${item.img}">
                <div class="wishlist-text">
                    <h4>${item.title}</h4>
                    <p>${item.price}</p>
                    <div class="wishlist-buttons">
                        <button class="add-button" onclick="addFavoriteToCart(${i})">В корзину</button>
                        <button class="add-button" onclick="removeFavorite(${i})">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function removeFavorite(index) {
    const item = favorites[index];
    
    // Обновляем кнопку в основном слайдере
    const product = document.querySelector('.product-slider[data-title="' + item.title + '"]');
    if (product) {
        const icon = product.querySelector('.btn-like i');
        if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        const button = product.querySelector('.btn-like');
        if (button) {
            button.classList.remove('active');
        }
    }
    
    favorites.splice(index, 1);
    showFavorites();
}

function addFavoriteToCart(index) {
    const item = favorites[index];
    
    const existingItem = cart.find(cartItem => cartItem.title === item.title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    showCart();
    openCart();
}

// БУРГЕР МЕНЮ
document.addEventListener('DOMContentLoaded', function() {
    const burgerButton = document.querySelector('.header-button');
    if (burgerButton) {
        const menu = document.querySelector('.header-navigate');
        const icon = burgerButton.querySelector('i');
        
        burgerButton.addEventListener('click', function() {
            menu.classList.toggle('header-navigate-on');
            
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
});

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ОВЕРЛЕЙ
function createOverlay(type) {
    // Удаляем существующие оверлеи
    removeOverlay(type);
    
    const overlay = document.createElement('div');
    overlay.className = type + '-overlay overlay';
    overlay.onclick = function() {
        if (type === 'cart') closeCart();
        if (type === 'wishlist') closeFavorites();
    };
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
}

function removeOverlay(type) {
    const overlay = document.querySelector('.' + type + '-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем обработчики для кнопок в слайдерах
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            addToCart(this);
        };
    });
    
    document.querySelectorAll('.btn-like').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            toggleFavorite(this);
        };
    });
    
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            showProductFromBlock(this);
        };
    });
    
    // Обработчики для слайдов
    document.querySelectorAll('.slide').forEach(slide => {
        slide.onclick = function() {
            const img = this.querySelector('img');
            const product = this.closest('.product-slider');
            if (img && product) {
                showProductDetail(
                    img.src,
                    product.getAttribute('data-title') || product.dataset.title,
                    product.getAttribute('data-price') || product.dataset.price
                );
            }
        };
    });
});