// gsap.registerPlugin(ScrollTrigger);

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
        opacity: 0.8,
        ease: 'linear'
      }, '<');
    }
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
  



// Initialize Footer with Parallax Effect
document.addEventListener('DOMContentLoaded', () => {
  initFooterParallax();
  initAccordionCSS();
  initButtonCharacterStagger();
});




  