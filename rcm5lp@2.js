console.log("Hello RCM 5");
const eventDate = new Date("September 13, 2025"); // target date
const ONLINE = $('form[data-commerce-product-id="6778a1eeed0c7c259255aac4"]');
const CAMPUS = $('form[data-commerce-product-id="6778a1a71ac6cc156adc2e47"]');

let swiper;
let typeTicket = $("input[name='Type']");
let campusSelect = true;
let dsoSelect = true;
var selectSponsor = $("#select-sponsor");

$("#other-dso").hide();
selectSponsor.hide();
$(".other-wrapper").hide();
$("#locationswrapper").hide();



var buttonInOnlineForm = ONLINE.find(
  'a[data-node-type="commerce-buy-now-button"]'
);
var buttonInCampusForm = CAMPUS.find(
  'a[data-node-type="commerce-buy-now-button"]'
);

ticketName();

$(document).ready(function () {
  console.log("RCM5 is ready");
  addAttendeeRows(1); // Добавляем одну строку при загрузке страницы
  countdown();
});

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
  $(".add-info").empty();
  for (var i = 0; i < quantity; i++) {
    var str = `<div class='attendee-row'>
            <input type='text' class='form-text-rcm4 white w-input' maxlength='256' name='Attendee ${i}' data-name='Attendee Name ${i}' placeholder='Name' id='attendee ${i}' required>
            <input type='email' class='form-text-rcm4 white w-input' maxlength='256' name='email ${i}' data-name='Attendee Email ${i}' placeholder='Email' id='email ${i}' required>
            <input type='phone' class='form-text-rcm4 white w-input' maxlength='256' name='phone ${i}' data-name='Attendee Phone ${i}' placeholder='Phone' id='phone ${i}' required>
        </div>`;
    $(".add-info").append(str);
  }
}

//
// ----------- SELECT TYPE OF CATEGORY  ----------- //
//
$("input[name='Radio']").change(function () {
  var selectedValue = $("input[name='Radio']:checked").val();
  var isDSO = selectedValue === "DSO/Dental Group";
  var isVendor = selectedValue === "Vendor";
  var isOther = selectedValue === "Other";
  var isSponsor = selectedValue === "Sponsor";

  // Hide elements and reset properties
  $(".other-wrapper, #other-dso, #select-sponsor, #locationswrapper").hide();
  $("#other-dso, #select-sponsor, #locations").prop("required", false);

  // Handle specific cases
  if (isOther) {
    $(".other-wrapper, #other-dso").show();
    $("#other-dso").prop("required", true).focus();
  }
  if (isSponsor) {
    selectSponsor.prop("required", true).focus();
    selectSponsor.show();
  }
  if (isDSO){
    $("#locationswrapper").show();
    $("#locations").prop("required", true).focus();
  }

  if (isDSO || isSponsor) {
    dsoSelect = true;
  } else {
    dsoSelect = false;
  }
});

// Обновляем строки при изменении значения поля ввода
$(".rcm-4-quantity").on("input", function () {
  var quantity = parseInt($(this).val());
  addAttendeeRows(quantity);
});

//
// ----------- SUBMIT FORM  ----------- //
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
  var organizationName = $("#Organization").val();
  console.log(organizationName);
  Cookies.set("myCookie", organizationName, { expires: 365 });
});

//
// ----------- COUNTDOWN  ----------- //
//
function countdown() {
  console.log("countdown");

  // Function to add leading zero
  function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
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
