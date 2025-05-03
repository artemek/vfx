function initCarousel(carouselId, navId, autoplaySpeed = 5000) {
    const carousel = document.getElementById(carouselId);
    const navContainer = document.getElementById(navId);
    
    if (!carousel || !navContainer) return;
    
    const slides = carousel.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    const container = carousel.parentElement;
    let currentIndex = 0;
    let interval;
    
    function updateCarousel() {
        const containerWidth = container.offsetWidth;
        carousel.style.width = `${containerWidth * slides.length}px`;
        
        slides.forEach(slide => {
            slide.style.width = `${containerWidth}px`;
            slide.style.height = 'auto';
        });
        
        goToSlide(currentIndex);
    }
    
    function goToSlide(index) {
        const containerWidth = container.offsetWidth;
        carousel.style.transform = `translateX(-${index * containerWidth}px)`;
        
        navContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    function createDots() {
        navContainer.innerHTML = '';
        
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
            
            navContainer.appendChild(dot);
        });
    }
    
    function startAutoplay() {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        }, autoplaySpeed);
    }
    
    function resetAutoplay() {
        clearInterval(interval);
        startAutoplay();
    }
    
    updateCarousel();
    createDots();
    
    window.addEventListener('resize', updateCarousel);
}

function enableImageZoom() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.onclick = closeModal;
    
    const modalImg = document.createElement('img');
    modalImg.className = 'modal-content';
    modalImg.id = 'modal-img';
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    document.querySelectorAll("img").forEach(img => {
        img.classList.add("zoomable");
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = img.src;
        });
    });
}



let modalImages = [];
let currentIndex = 0;

// Создаем кнопки управления программно
window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    if (!modal) return;

    const leftBtn = document.createElement('button');
    leftBtn.className = 'nav-button left';
    leftBtn.innerHTML = '&#10094;';

    const rightBtn = document.createElement('button');
    rightBtn.className = 'nav-button right';
    rightBtn.innerHTML = '&#10095;';

    modal.appendChild(leftBtn);
    modal.appendChild(rightBtn);

    leftBtn.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + modalImages.length) % modalImages.length;
        updateModalImage();
    });

    rightBtn.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % modalImages.length;
        updateModalImage();
    });
});

// Подключение клик-событий к картинкам в .project-media
document.addEventListener('DOMContentLoaded', () => {
    const imgs = document.querySelectorAll('.project-media img');
    modalImages = Array.from(imgs);

    imgs.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            openModal(img);
        });
    });
});

function openModal(imgElement) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    if (!modal || !modalImg) return;

    modal.style.display = 'flex';
    modalImg.src = imgElement.src;
}

function updateModalImage() {
    const modalImg = document.getElementById('modal-img');
    if (!modalImg || !modalImages[currentIndex]) return;

    modalImg.src = modalImages[currentIndex].src;
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}



document.addEventListener('DOMContentLoaded', () => {
    initCarousel('usdCarousel', 'usdCarouselNav');
    initCarousel('proceduralCarousel', 'proceduralCarouselNav');
    initCarousel('PythonCarousel', 'pythonCarouselNav');
    initCarousel('modelsHCarousel', 'modelsHCarouselNav');
    initCarousel('shadingHCarousel', 'shadingHCarouselNav');
    initCarousel('simHCarousel', 'simHCarouselNav');
    enableImageZoom();
});
