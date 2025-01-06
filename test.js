let activeVideo = null; // Текущее активное видео
let players = {}; // Хранилище экземпляров YouTube API

// Остановка всех видео, кроме активного
function stopAllVideosExceptActive() {
    Object.keys(players).forEach((id) => {
        if (players[id] !== activeVideo) {
            players[id].pauseVideo();
        }
    });
}

// Определяем индекс слайда вручную
function getSlideIndex(iframe) {
    const slide = iframe.closest('.swiper-slide');
    const slides = Array.from(document.querySelectorAll('.swiper-slide'));
    return slides.indexOf(slide); // Возвращает индекс слайда
}

// Настройка YouTube API
function setupYouTubePlayers() {
    const iframes = document.querySelectorAll('.youtube-video');
    iframes.forEach((iframe, index) => {
        const id = `player-${index}`;
        iframe.id = id;

        // Создаем экземпляр YouTube Player
        players[id] = new YT.Player(id, {
            events: {
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        activeVideo = players[id]; // Устанавливаем активное видео
                        stopAllVideosExceptActive(); // Останавливаем другие видео

                        // Центрируем слайд, где играет это видео
                        const slideIndex = getSlideIndex(iframe);
                        if (slideIndex !== -1) {
                            swiper.slideTo(slideIndex); // Центрируем активный слайд
                        }
                    }
                },
            },
        });
    });
}

// Загрузка YouTube API
function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = setupYouTubePlayers;
}
loadYouTubeAPI();

// Инициализация Swiper
const swiper = new Swiper('.swiper', {
    loop: false,
    centeredSlides: true, // Центрирование активного слайда
    // slidesPerView: 1.5, // Видимые слайды
    spaceBetween: 32,
    speed: 400,
    breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 20, followFinger: true, freeMode: true },
        768: { slidesPerView: 2, spaceBetween: 20 },
        992: { slidesPerView: 1.5, spaceBetween: 32 },
      },
    navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev",
    },
    on: {
        slideChange: () => {
            stopAllVideosExceptActive(); // Останавливаем все видео при переключении слайда
        },
    },
});