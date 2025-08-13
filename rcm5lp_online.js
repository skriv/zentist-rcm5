console.log("Online RCM5 Local Payment");
const ONLINE = $('form[data-commerce-product-id="6778a1eeed0c7c259255aac4"]');
// const TEST = $('#test-btn');


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

ticketName();


$(document).ready(function () {


  const input = $("#locations");
  if (input.length) {
    input.on("wheel", function (event) {
      event.preventDefault();
    });
  }

  addAttendeeRows(1); // Добавляем одну строку при загрузке страницы


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
