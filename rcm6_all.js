console.log("rcm6_allpages.js loaded");


function initDynamicCurrentYear() {  
    const currentYear = new Date().getFullYear();
    const currentYearElements = document.querySelectorAll('[data-current-year]');
    currentYearElements.forEach(currentYearElement => {
      currentYearElement.textContent = currentYear;
    });
  }

  function initFooterParallax(){
    document.querySelectorAll('[data-footer-parallax]').forEach(el => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'clamp(top bottom)',
          end: 'clamp(top top)',
          scrub: true
        }
      });
    
      const inner = el.querySelector('[data-footer-parallax-inner]');
      const dark  = el.querySelector('[data-footer-parallax-dark]');
    
      if (inner) {
        tl.from(inner, {
          yPercent: -25,
          ease: 'linear'
        });
      }
    
      if (dark) {
        tl.from(dark, {
          opacity: 0.1,
          ease: 'linear'
        }, '<');
      }
    });
  }

  function initButtonCharacterStagger() {
    const offsetIncrement = 0.01; // Transition offset increment in seconds
    const buttons = document.querySelectorAll('[data-button-animate-chars]');
  
    buttons.forEach(button => {
      const text = button.textContent; // Get the button's text content
      button.innerHTML = ''; // Clear the original content
  
      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.transitionDelay = `${index * offsetIncrement}s`;
  
        // Handle spaces explicitly
        if (char === ' ') {
          span.style.whiteSpace = 'pre'; // Preserve space width
        }
  
        button.appendChild(span);
      });
    });
  }




document.addEventListener("DOMContentLoaded", () => {
    initFooterParallax();
    initButtonCharacterStagger();
    initDynamicCurrentYear();
  });


