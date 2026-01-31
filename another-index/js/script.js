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
        
        likeBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
        
        cartBtn.addEventListener('click', function() {
            alert('Товар добавлен в корзину!');
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
// Сохраняем позицию скролла
let scrollPosition = 0;

// Функция для показа детальной страницы товара
function showProductFromBlock(button) {
    // Сохраняем текущую позицию скролла
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Находим ближайший родительский слайдер
    const sliderBlock = button.closest('.product-slider');
    
    // Получаем данные из data-атрибутов слайдера
    const mainImage = sliderBlock.getAttribute('data-img');
    const title = sliderBlock.getAttribute('data-title');
    const price = sliderBlock.getAttribute('data-price');
    
    // Находим все изображения в слайдере
    const slideImages = sliderBlock.querySelectorAll('.slide img');
    const images = [];
    slideImages.forEach(img => {
        images.push(img.src);
    });
    
    // Скрываем контейнер (если он существует)
    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'none';
    }
    
    // Показываем детальную страницу
    const detailPage = document.getElementById('productDetailPage');
    detailPage.style.display = 'block';
    
    // Заполняем данные на детальной странице
    document.getElementById('detailProductMainImg').src = images[0] || mainImage;
    document.getElementById('detailProductTitle').textContent = title;
    document.getElementById('detailProductPrice').textContent = price;
    
    // Заполняем маленькие изображения
    for (let i = 0; i < 3; i++) {
        const smallImgId = 'detailProductImg' + (i + 1);
        const smallImgElement = document.getElementById(smallImgId);
        
        if (smallImgElement && images[i]) {
            smallImgElement.src = images[i];
        }
    }
}

// Функция для возврата назад к слайдерам
function goBackToSlider() {
    const detailPage = document.getElementById('productDetailPage');
    detailPage.style.display = 'none';

    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'block';
    }
    
    window.scrollTo(0, scrollPosition);
}

// Функция для смены главного изображения при клике на маленькое
function changeMainImage(clickedElement) {
    const smallImage = clickedElement.querySelector('img');
    const mainImage = document.getElementById('detailProductMainImg');
    
    if (smallImage && mainImage) {
        mainImage.src = smallImage.src;
    }
}



const burgerButton = document.querySelector('.header-button');
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




