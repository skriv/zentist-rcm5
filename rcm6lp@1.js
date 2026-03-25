console.log("Hello RCM 6 - v2");
const eventDate = new Date("August 30, 2026"); // target date
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

  const input = $("#locations");
  if (input.length) {
    input.on("wheel", function (event) {
      event.preventDefault();
    });
  }

  addAttendeeRows(1); // Добавляем одну строку при загрузке страницы
  // countdown();
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
const players = Plyr.setup('.plyr__video-embed', {
  controls: ['play', 'current-time', 'duration'],
});
//
// const players = Plyr.setup(".js-player", {
//   controls: [],
// });

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
// ----------- SELECT PAYMENT PLAN OPTIONS ----------- //
//
$(".rcm-plan4-wrapper").click(function () {
  $(".rcm-plan4-wrapper").removeClass("active");
  $(this).addClass("active");
  ticketName();
  campusSelect = $(this).text().includes("RCM6 On-Campus");
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
  selectedValue = typeTicket.val();
  console.log("Тип покупки:", selectedValue);
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



function initDraggableMarquee() {
  const wrappers = document.querySelectorAll("[data-draggable-marquee-init]");

  const getNumberAttr = (el, name, fallback) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };

  wrappers.forEach((wrapper) => {
    if (wrapper.getAttribute("data-draggable-marquee-init") === "initialized") return;

    const collection = wrapper.querySelector("[data-draggable-marquee-collection]");
    const list = wrapper.querySelector("[data-draggable-marquee-list]");
    if (!collection || !list) return;

    const duration = getNumberAttr(wrapper, "data-duration", 20);
    const multiplier = getNumberAttr(wrapper, "data-multiplier", 40);
    const sensitivity = getNumberAttr(wrapper, "data-sensitivity", 0.01);

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
    if (!wrapperWidth || !listWidth) return;

    // Make enough duplicates to cover screen
    const minRequiredWidth = wrapperWidth + listWidth + 2;
    while (collection.scrollWidth < minRequiredWidth) {
      const listClone = list.cloneNode(true);
      listClone.setAttribute("data-draggable-marquee-clone", "");
      listClone.setAttribute("aria-hidden", "true");
      collection.appendChild(listClone);
    }

    const wrapX = gsap.utils.wrap(-listWidth, 0);
    
    gsap.set(collection, { x: 0 });
    
    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: "none",
      repeat: -1,
      onReverseComplete: () => marqueeLoop.progress(1),
      modifiers: {
        x: (x) => wrapX(parseFloat(x)) + "px"
      },
    });
    
    // Direction can be used for css + set initial direction on load
    const initialDirectionAttr = (wrapper.getAttribute("data-direction") || "left").toLowerCase();
    const baseDirection = initialDirectionAttr === "right" ? -1 : 1;
    
    const timeScale = { value: 1 };
    
    timeScale.value = baseDirection;
    wrapper.setAttribute("data-direction", baseDirection < 0 ? "right" : "left");
    
    if (baseDirection < 0) marqueeLoop.progress(1);
    
    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
      wrapper.setAttribute("data-direction", timeScale.value < 0 ? "right" : "left");
    }
    
    applyTimeScale();

    // Drag observer
    const marqueeObserver = Observer.create({
      target: wrapper,
      type: "pointer,touch",
      preventDefault: true,
      debounce: false,
      onChangeX: (observerEvent) => {
        let velocityTimeScale = observerEvent.velocityX * -sensitivity;
        velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, velocityTimeScale);

        gsap.killTweensOf(timeScale);

        const restingDirection = velocityTimeScale < 0 ? -1 : 1;

        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true })
          .to(timeScale, { value: restingDirection, duration: 1.0 });
      }
    });

    // Pause marquee when scrolled out of view
    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onEnterBack: () => { marqueeLoop.resume(); applyTimeScale(); marqueeObserver.enable(); },
      onLeave: () => { marqueeLoop.pause(); marqueeObserver.disable(); },
      onLeaveBack: () => { marqueeLoop.pause(); marqueeObserver.disable(); }
    });
    
    wrapper.setAttribute("data-draggable-marquee-init", "initialized");
  });
}


function initCountdown(){
  var reg={items:[],timer:null};

  function parseIso(root){
    var s=root.getAttribute('data-countdown-date')||'';
    var m=s.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{1,2}):(\d{2})$/);
    if(!m) return null;
    var y=+m[1],mo=+m[2]-1,d=+m[3],h=+m[4],mi=+m[5];
    var t=Date.UTC(y,mo,d,h,mi,0,0);
    var off=+(root.getAttribute('data-countdown-timezone-offset')||0);
    if(off) t-=off*3600000;
    var dt=new Date(t);
    if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==mo||dt.getUTCDate()!==d) return null;
    return t;
  }

  function splitByUnits(ms,u){
    var secs=Math.max(0,Math.floor(ms/1000));
    var out={years:0,months:0,weeks:0,days:0,hours:0,minutes:0,seconds:0,done:ms<=0};
    var seq=[['years',31536000],['months',2592000],['weeks',604800],['days',86400],['hours',3600],['minutes',60],['seconds',1]];
    for(var i=0;i<seq.length;i++){
      var k=seq[i][0],len=seq[i][1];
      if(u[k]){ out[k]=Math.floor(secs/len); secs%=len; }
    }
    return out;
  }

  var sing={years:'year',months:'month',weeks:'week',days:'day',hours:'hour',minutes:'minute',seconds:'second'};
  var abbr={years:['yr.','yrs.'],months:['mo.','mos.'],weeks:['wk.','wks.'],days:['day','days'],hours:['hr.','hrs.'],minutes:['min.','mins.'],seconds:['sec.','secs.']};
  function lab(k,v,f){
    if(f==='plain') return ''+v;
    if(f==='short') return v+(k==='months'?'mo':k[0]);
    if(f==='abbr'){ var a=abbr[k]; return v+' '+a[v===1?0:1]; }
    return v+' '+(v===1?sing[k]:k);
  }

  function make(root){
    var u={}, order=['years','months','weeks','days','hours','minutes','seconds'];
    root.querySelectorAll('[data-countdown-update]').forEach(function(n){
      var k=(n.getAttribute('data-countdown-update')||'').toLowerCase();
      if(order.indexOf(k)>-1) u[k]=n;
    });
    var tgt=parseIso(root);
    if(tgt==null){
      root.setAttribute('data-countdown-status','error');
      var first=null; for(var i=0;i<order.length;i++){ if(u[order[i]]){ first=u[order[i]]; break; } }
      if(first) first.textContent='Invalid Date, use: 2026-03-21 11:36';
      order.forEach(function(k){ var n=u[k]; if(n&&n!==first) n.textContent=''; });
      return null;
    }
    var f=(root.getAttribute('data-countdown-format')||'plain').toLowerCase();

    var inst={
      root:root,tgt:tgt,f:f,u:u,st:null,done:false,
      render:function(ms){
        var d=splitByUnits(ms,this.u);
        this.done=d.done;
        this.root.setAttribute('data-countdown-status', d.done?'finished':'active');
        if(this.u.years)   this.u.years.textContent   = lab('years',d.years,this.f);
        if(this.u.months)  this.u.months.textContent  = lab('months',d.months,this.f);
        if(this.u.weeks)   this.u.weeks.textContent   = lab('weeks',d.weeks,this.f);
        if(this.u.days)    this.u.days.textContent    = lab('days',d.days,this.f);
        if(this.u.hours)   this.u.hours.textContent   = lab('hours',d.hours,this.f);
        if(this.u.minutes) this.u.minutes.textContent = lab('minutes',d.minutes,this.f);
        if(this.u.seconds) this.u.seconds.textContent = lab('seconds',d.seconds,this.f);
      },
      tickMin:function(nowMs){
        if(this.done) return;
        this.render(this.tgt-nowMs);
        if(this.u.seconds && !this.done && !this.st) this.startSec();
        if(this.done) this.stopSec();
      },
      startSec:function(){
        var self=this;
        function t(){
          if(self.done) return self.stopSec();
          var ms=self.tgt-Date.now();
          if(ms<=0){ self.render(0); return self.stopSec(); }
          self.render(ms);
        }
        t(); self.st=setInterval(t,1000);
      },
      stopSec:function(){ if(this.st){ clearInterval(this.st); this.st=null; } }
    };
    root.__cd=inst;
    return inst;
  }

  function startMinTimer(){
    if(reg.timer) return;
    reg.timer=setInterval(function(){
      var now=Date.now();
      for(var i=0;i<reg.items.length;i++) reg.items[i].tickMin(now);
    },60000);
    var now=Date.now();
    for(var j=0;j<reg.items.length;j++) reg.items[j].tickMin(now);
  }

  document.querySelectorAll('[data-countdown-date]').forEach(function(root){
    var inst=make(root);
    if(inst) reg.items.push(inst);
  });
  if(reg.items.length) startMinTimer();
}




function initSwiperSlider() {  
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");
  
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if(!swiperSliderWrap) return;
    
    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    
    const swiper = new Swiper(swiperSliderWrap, {
      slidesPerView: 1.25,
      speed: 600,
      mousewheel: false,
      grabCursor: false,
      breakpoints: {
        // when window width is >= 480px
        480: {
          slidesPerView: 1.8,
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 2.2,
        }
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },    
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },      
    });    
    
  });
}



function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      
      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}




function initImageCycle() {
  document.querySelectorAll("[data-image-cycle]").forEach(cycleElement => {
    const items = cycleElement.querySelectorAll("[data-image-cycle-item]");
    if (items.length < 2) return;

    let currentIndex = 0;
    let intervalId;

    // Get optional custom duration (in seconds), fallback to 2000ms
    const attrValue = cycleElement.getAttribute("data-image-cycle");
    const duration = attrValue && !isNaN(attrValue) ? parseFloat(attrValue) * 1000 : 2000;
    const isTwoItems = items.length === 2;

    // Initial state
    items.forEach((item, i) => {
      item.setAttribute("data-image-cycle-item", i === 0 ? "active" : "not-active");
    });

    function cycleImages() {
      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % items.length;

      items[prevIndex].setAttribute("data-image-cycle-item", "previous");

      if (!isTwoItems) {
        setTimeout(() => {
          items[prevIndex].setAttribute("data-image-cycle-item", "not-active");
        }, duration);
      }

      items[currentIndex].setAttribute("data-image-cycle-item", "active");
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !intervalId) {
        intervalId = setInterval(cycleImages, duration);
      } else {
        clearInterval(intervalId);
        intervalId = null;
      }
    }, { threshold: 0 });

    observer.observe(cycleElement);
  });
}


// Example backend-friendly stats JSON (key-value)
const RCM_STATS = {
  RCM1: {
    attendees: 30,
    speakers: 10,
    sponsors: 0,
    unique_dsos: 14,
    total_practices: 241,
    online_attendees: 26
  },
  RCM2: {
    attendees: 133,
    speakers: 13,
    sponsors: 11,
    unique_dsos: 44,
    total_practices: 1321,
    online_attendees: 15
  },
  RCM3: {
    attendees: 158,
    speakers: 29,
    sponsors: 16,
    unique_dsos: 64,
    total_practices: 3193,
    online_attendees: 36
  },
  RCM4: {
    attendees: 234,
    speakers: 26,
    sponsors: 20,
    unique_dsos: 80,
    total_practices: 5598,
    online_attendees: 48
  },
  RCM5: {
    attendees: 241,
    speakers: 23,
    sponsors: 20,
    unique_dsos: 78,
    total_practices: 5125,
    online_attendees: 30
  }
};


function enrichDerivedStats(stats) {
  return {
    ...stats
  };
}

/**
 * Map your data-format to NumberFlow Intl.NumberFormatOptions
 */
function getNumberFlowFormat(el, value) {
  const fmt = el.getAttribute("data-format") || "number";

  // Defaults
  const locales = el.getAttribute("data-locales") || "en-US";

  if (typeof value !== "number") return { locales, format: null };

  if (fmt === "raw") {
    // still show as number, just no special rounding; keep full precision
    return { locales, format: { maximumFractionDigits: 20 } };
  }

  if (fmt === "int") {
    return { locales, format: { maximumFractionDigits: 0 } };
  }

  // "number" (default): nice display, keep 0–1 decimals (for derived metric)
  return { locales, format: { maximumFractionDigits: 1 } };
}

// Store created <number-flow> elements so we can update fast
const flowByEl = new WeakMap();

function ensureNumberFlow(el, initialValue) {
  // If already initialized — return existing
  const existing = flowByEl.get(el);
  if (existing) return existing;

  // Create NumberFlow web component
  const flow = document.createElement("number-flow");

  // Optional: smoother visuals + stable widths (prevents shifting)
  flow.style.fontVariantNumeric = "tabular-nums";
  flow.style.display = "inline-block";

  // Apply locales + format
  const { locales, format } = getNumberFlowFormat(el, initialValue);
  if (locales) flow.locales = locales;
  if (format) flow.format = format;

  // Replace element content with the component
  el.textContent = "";
  el.appendChild(flow);

  // First update sets initial value (and hydrates component)
  flow.update(typeof initialValue === "number" ? initialValue : 0); // first call sets initial value  [oai_citation:2‡NumberFlow](https://number-flow.barvian.me/vanilla)

  flowByEl.set(el, flow);
  return flow;
}

function renderStatsFromJson({ groupId = "RCM1", root = document } = {}) {
  const base = RCM_STATS[groupId];
  if (!base) return;

  const stats = enrichDerivedStats(base);

  root.querySelectorAll("[data-stat-group]").forEach((groupEl) => {
    groupEl.querySelectorAll("[data-stat]").forEach((el) => {
      const key = el.getAttribute("data-stat");
      if (!key || !(key in stats)) return;

      const value = stats[key];

      // Set opacity to 0.3 if value is 0
      el.style.opacity = value === 0 ? "0.15" : "1";

      // Initialize NumberFlow once per element, then just update
      const flow = ensureNumberFlow(el, value);

      // If you want format to re-evaluate when period changes (usually not needed),
      // you could re-apply format here based on value:
      const { locales, format } = getNumberFlowFormat(el, value);
      if (locales) flow.locales = locales;
      if (format) flow.format = format;

      // This triggers animation on changes  [oai_citation:3‡NumberFlow](https://number-flow.barvian.me/vanilla)
      flow.update(typeof value === "number" ? value : 0);
    });
  });
}

function setActivePeriodUI(period, root = document) {
  root.querySelectorAll("[data-stat-period]").forEach((btn) => {
    const isActive = btn.getAttribute("data-stat-period") === period;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function initStatPeriodSwitching({ defaultPeriod = "RCM1", root = document } = {}) {
  renderStatsFromJson({ groupId: defaultPeriod, root });
  setActivePeriodUI(defaultPeriod, root);

  root.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-stat-period]");
    if (!trigger) return;

    const period = trigger.getAttribute("data-stat-period");
    if (!period || !RCM_STATS[period]) return;

    renderStatsFromJson({ groupId: period, root });
    setActivePeriodUI(period, root);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initDraggableMarquee();
  initSwiperSlider();
  initAccordionCSS();
  initImageCycle();
  initStatPeriodSwitching({ defaultPeriod: "RCM5" });
});
