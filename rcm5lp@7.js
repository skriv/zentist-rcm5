console.log("Hello RCM 5 - v7.0444");
const eventDate = new Date("October 11, 2025"); // target date
const discountFinishDate = new Date("February 28, 2025"); // Discount date
const ONLINE = $('form[data-commerce-product-id="6778a1eeed0c7c259255aac4"]');
const CAMPUS = $('form[data-commerce-product-id="6778a1a71ac6cc156adc2e47"]');
// const TEST = $('#test-btn');

let swiper;
let swPart;
let typeTicket = $("input[name='Type']");
let campusSelect = true;
let dsoSelect = true;
let selectedValue;

const scheduleList = $("#schedule-list");

let allAttendeeData;
let allUTMs;
let organizationName;
let DSOcount;
let attendeesActivity;

// Создаем переменную с нужным форматом
let formattedData;

var buttonInOnlineForm = ONLINE.find(
  'a[data-node-type="commerce-buy-now-button"]'
);
var buttonInCampusForm = CAMPUS.find(
  'a[data-node-type="commerce-buy-now-button"]'
);

ticketName();


$(document).ready(function () {
  console.log("RCM5 is ready");

  // Скрываем элемент с атрибутом plan="online"
  $('[plan="online"]').hide();
  
  // Проверяем наличие переменной ?online в URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('online')) {
    $('[plan="online"]').show(); // Показываем элемент, если переменная есть
  }

  const input = $("#locations");
  if (input.length) {
    input.on("wheel", function (event) {
      event.preventDefault();
    });
  }

  addAttendeeRows(1); // Добавляем одну строку при загрузке страницы
  countdown();
  discountDate();

  changeSchedule();

  viewPreviousSpeakers();

// 




});

//
// ----------- CHANGE SCHEDULE ----------- //
//
function changeSchedule(){
  const day2 = $("#day2-title");
  const dinner = $("#dinner");
  
  // Get all children of scheduleList
  const items = scheduleList.children();
  
  // Check if day2 element exists and scheduleList has at least 5 items
  if(day2.length && items.length >= 5) {
    // Remove day2 from its current position
    day2.detach();
    dinner.detach();
    
    // Insert day2 at the position
    
    scheduleList.children().eq(6).after(day2);
    scheduleList.children().eq(6).after(dinner);

    
  }
  
  // Cache selector for meal items
  const mealItems = $('[data-type="Meal"]');
  const opacity = 0.3;
  
  // Set initial opacity for titles
  mealItems.find('.text-agenda-card-title').css('opacity', opacity);
  
  // Add hover effect using a single hover handler with simpler logic
  mealItems.hover(
    function() { $(this).find('.text-agenda-card-title').css('opacity', '1'); },
    function() { $(this).find('.text-agenda-card-title').css('opacity', opacity); }
  );
}

//
// ----------- PLAYERS ----------- //
//
const players = Plyr.setup(".js-player", {
  controls: [],
});

// Функция для остановки всех видео, кроме выбранного
function stopAllVideos(exceptPlayer) {
  players.forEach(function (player) {
    if (player !== exceptPlayer) {
      player.pause();
    }
  });
}

// Добавьте обработчики событий "play" и "pause" для каждого плеера
players.forEach(function (player, index) {
  player.on("play", function () {
    stopAllVideos(player);
    $(".cover").eq(index).hide(); // Скрываем "cover" для текущего видео
  });

  player.on("pause", function () {
    $(".cover").eq(index).show(); // Показываем "cover" при паузе текущего видео
  });
});

// Добавляем обработчики кликов для каждого "cover" элемента
$(".cover").each(function (index) {
  $(this).click(function () {
    const player = players[index];
    if (player.paused) {
      $(this).hide();
      player.play();
      stopAllVideos(player);
    } else {
      player.pause();
      $(this).show();
    }

    if (swiper) {
      swiper.slideTo(index);
    }
  });
});

//
// ----------- SWIPER SLIDER ----------- //
//
$(".slider-main_component").each(function () {
  let sliderDuration = +$(this).attr("slider-duration") || 300; // Упрощение
  swiper = new Swiper($(this).find(".swiper")[0], {
    speed: sliderDuration,
    loop: false,
    autoHeight: false,
    followFinger: false,
    freeMode: false,
    slideToClickedSlide: false,
    slidesPerView: 1,
    spaceBetween: "4%",
    rewind: false,
    mousewheel: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      480: { slidesPerView: 1, spaceBetween: "4%" },
      768: { slidesPerView: 2, spaceBetween: "4%" },
      992: { slidesPerView: 1.5, spaceBetween: 32 },
    },
    navigation: {
      nextEl: $(this).find(".swiper-next")[0],
      prevEl: $(this).find(".swiper-prev")[0],
      disabledClass: "is-disabled",
    },
    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active",
    initialSlide: 1,
    centeredSlides: true,
  });

  $(this)
    .find(".swiper-slide")
    .on("click", function () {
      swiper.slideTo($(this).index());
    });
});

//
// ----------- SELECT PAYMENT PLAN OPTIONS ----------- //
//
$(".rcm-plan4-wrapper").click(function () {
  $(".rcm-plan4-wrapper").removeClass("active");
  $(this).addClass("active");
  ticketName();
  campusSelect = $(this).text().includes("RCM5 On-Campus");
});

// get a ticket name
function ticketName() {
  var h2Value = $(".rcm-plan4-wrapper.active h2").text();
  typeTicket.val(h2Value);
  $("#pay-btn-name").text(h2Value);
}

//
// ----------- ADD ADDITIONAL ATTENDEES  ----------- //
//
function addAttendeeRows(quantity) {
  // Получаем текущее количество attendee-row
  var currentCount = $(".attendee-row").length;

  // Удаляем лишние строки, если их больше, чем quantity
  if (currentCount > quantity) {
    $(".attendee-row").slice(quantity).remove();
  } else {
    // Добавляем новые строки, если их меньше, чем quantity
    for (var i = currentCount; i < quantity; i++) {
      var str = `<div class='attendee-row'>
            <input type='text' class='form-text-rcm4 white w-input' maxlength='256' name='Attendee ${i}' data-name='Attendee Name ${i}' placeholder='Name' id='attendee ${i}' required>
            <input type='text' class='form-text-rcm4 white w-input' maxlength='256' name='title ${i}' data-name='Attendee Title ${i}' placeholder='Title' id='title ${i}' required>
            <input type='email' class='form-text-rcm4 white w-input' maxlength='256' name='email ${i}' data-name='Attendee Email ${i}' placeholder='Email' id='email ${i}' required>
            <input type='phone' class='form-text-rcm4 white w-input' maxlength='256' name='phone ${i}' data-name='Attendee Phone ${i}' placeholder='Phone' id='phone ${i}' required>
            <input type='text' class='form-text-rcm4 white w-input' maxlength='256' name='dietary ${i}' data-name='Dietary restrictions ${i}' placeholder='Dietary restrictions...' id='dietary ${i}'>
        </div>`;
      $(".add-info").append(str);
    }
  }
}

// collected User Info
function collectAttendeeData() {
  let attendeeData = [];

  $(".attendee-row").each(function () {
    const name = $(this).find("input[name^='Attendee']").val();
    const email = $(this).find("input[type='email']").val();
    const phone = $(this).find("input[type='phone']").val();
    const title = $(this).find("input[name^='title']").val();
    const dietary = $(this).find("input[name^='dietary']").val();

    // Добавляем данные в массив
    attendeeData.push(`${name}, ${email}, ${phone}, ${title}, ${dietary}`);
  });

  attendeesActivity = $("#pre-bootcamp-activity").is(":checked");
  organizationName = $("#Organization").val();
  DSOcount = $("#locations").val();
  allAttendeeData = attendeeData.join("\n");
}


// Обновляем строки при изменении значения поля ввода
$(".rcm-4-quantity").on("input", function () {
  var quantity = parseInt($(this).val());
  addAttendeeRows(quantity);
});

//
// ----------- SUBMIT PAYMENT FORM  ----------- //
//
let form = $(".my-form");
form.on("submit", function (event) {
  event.preventDefault();
  if (dsoSelect) {
    (campusSelect ? buttonInCampusForm : buttonInOnlineForm)[0].click();
  } else {
    $("#registration-wrapper").hide();
    $(".success-message-3 div").html(
      "<div class='text-block-154 text-balanced'>The bootcamp attendance is reserved to Dental Support Organizations DSOs. <br/>For sponsorship opportunities, please send us an email <a href='mailto:growth@zentist.io'>growth@zentist.io</a>.</div>"
    );
  }
  collectAttendeeData();
  collectUTMs();
  setCookies();
});


//
// ----------- COLLECT UTMs  ----------- //
//
function collectUTMs() {
  const urlParams = new URLSearchParams(window.location.search);
  allUTMs = {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_content: urlParams.get('utm_content') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_term: urlParams.get('utm_term') || ''
  };

  // Прямо объединяем значения без фильтрации
  allUTMs = Object.entries(allUTMs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", "); // Используем join для объединения значений

  console.log('UTMs: ')
  console.log(allUTMs);
}

// collectUTMs();

//
// ----------- SET COOKIES  ----------- //
//
function setCookies() {
  const cookieData = {
    org: organizationName,
    locations: DSOcount,
    info: allAttendeeData,
    preEvent: attendeesActivity,
    type: selectedValue,
    utm: allUTMs,
  };

  for (const [key, value] of Object.entries(cookieData)) {
    Cookies.set(key, value, { expires: 365 });
  }
}

//
// ----------- COUNTDOWN  ----------- //
//
function countdown() {
  console.log("countdown");

  // Function to add leading zero
  function addLeadingZero(number) {
    return number;
  }

  // Function to update the countdown
  function updateCountdown() {
    let now = new Date(); // current date and time

    let currentTime = now.getTime();
    let eventTime = eventDate.getTime();

    let remainingTime = eventTime - currentTime;

    let seconds = Math.floor(remainingTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    // Update the elements with the calculated and formatted time
    $("#days").text(addLeadingZero(days));
    $("#hours").text(addLeadingZero(hours));
    $("#minutes").text(addLeadingZero(minutes));
    $("#seconds").text(addLeadingZero(seconds)); // Update seconds with leading zero

    // Recursive call every second
    setTimeout(updateCountdown, 1000);
  }

  // Initial call to start the countdown
  updateCountdown();
}

//
// SELECT TYPE of CUSTOMER
//
function handleSeparateRadioSelection() {
  // Получаем выбранное значение из отдельной группы радиокнопок
  const selectType = $("input[name='type']:checked").val();
  // Проверяем выбранное значение и выводим в консоль
  if (selectType === "DSO/Dental Group") {
    $(".paymentform-wrapper").show();
    $(".vendor-form").hide();
  } else if (selectType === "Vendor") {
    $(".vendor-form").show();
    $(".paymentform-wrapper").hide();
  }

  selectedValue = selectType;
  console.log(selectedValue);
}

// Привязываем функцию к событию изменения радиокнопок отдельной группы
$("input[name='type']").change(handleSeparateRadioSelection);

//
// ----------- HIDE DISCOUTN PROMO CODE ----------- //
//
function discountDate(){
  const currentDate = new Date();

  if (currentDate > discountFinishDate) {
    $(".discount-code").hide(); 
  }
}


// VIEW PREVIOUS SPEAKERS
//
function viewPreviousSpeakers() {
  console.log("viewPreviousSpeakers");
  let sliderTrigger = document.querySelector(".sw.part");
  
  if (sliderTrigger) {
    console.log("Swiper element found, initializing...");
    console.log("Element:", sliderTrigger);
    console.log("Children count:", sliderTrigger.children.length);
    
    // Проверяем структуру Swiper
    const wrapper = sliderTrigger.querySelector('.swiper-wrapper');
    const slides = sliderTrigger.querySelectorAll('.swiper-slide');
    console.log("Wrapper found:", !!wrapper);
    console.log("Slides found:", slides.length);
    
    try {
      swPart = new Swiper(sliderTrigger, {
      grabCursor: true,
      speed: 800,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      slideToClickedSlide: true,
      centeredSlides: true,
      slidesPerView: 5,
      spaceBetween: 16,
      mousewheel: {
        enabled: true,
        forceToAxis: true,
      },
      breakpoints: {
        480: {
          spaceBetween: 16,
          slidesPerView: 2.5,
        },
        767: {
          spaceBetween: 16,
          slidesPerView: "auto",
        },
      },
    });
    
      console.log("Swiper initialized:", swPart);
      console.log("Slides count:", swPart.slides ? swPart.slides.length : "No slides found");
    } catch (error) {
      console.error("Error initializing Swiper:", error);
    }
  } else {
    console.log("Swiper element '.sw.part' not found!");
  }
}

// Create an Intersection Observer to log when #pricing is in view
const pricingSection = document.getElementById('pricing');

if (pricingSection) {
  const stickyBtn = document.getElementById('sticky-btn');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const isVisible = entry.isIntersecting;
      console.log(`#pricing section is ${isVisible ? 'in' : 'not in'} view`);
      stickyBtn.style.display = isVisible ? 'none' : 'flex';
    });
  }, { threshold: 0.1 });

  observer.observe(pricingSection);
}
