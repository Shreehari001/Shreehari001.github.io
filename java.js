'use strict';

// Preload all images to prevent reloading when scrolling
function preloadImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      const imgObj = new Image();
      imgObj.src = src;
      imgObj.onload = () => {
        img.style.opacity = '1'; // Show image after it's loaded
      };
    }
  });
}

// Add image preloading to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
  preloadImages();
  
  // Initialize navigation elements
  const btnNavEl = document.querySelector(".btn-mobile-nav");
  const headerEl = document.querySelector(".header");
  const mainNavList = document.querySelector(".main-nav-list");
  
  if (btnNavEl && headerEl) {
    btnNavEl.addEventListener("click", function () {
      headerEl.classList.toggle("nav-open");
      const isNavOpen = headerEl.classList.contains("nav-open");
      btnNavEl.setAttribute('aria-expanded', isNavOpen);
      if (mainNavList) { // Ensure mainNavList exists
          mainNavList.setAttribute('aria-hidden', !isNavOpen);
      }
    });
  }

  // Add animations (fade-in, float)
  // This part of the script seems fine, assuming elements with .fade-in and .float exist or will be added.
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(element => {
    element.style.opacity = '0'; // Start invisible
    // Simple fade-in, could be enhanced with IntersectionObserver too
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease-in-out';
      element.style.opacity = '1';
    }, 500); // Delay before starting fade-in
  });

  // Add introduction animation
  const introduction = document.querySelector('.introduction');
  if (introduction) {
    // Just ensure the element exists, the animation is handled by CSS
    introduction.style.opacity = '1';
  }

  const floatElements = document.querySelectorAll('.float');
  floatElements.forEach(element => {
    // Ensure the @keyframes float is defined in CSS
    element.style.animation = 'float 3s ease-in-out infinite';
  });

  // Add scroll animations for .smooth-scroll elements
  const scrollElements = document.querySelectorAll('.smooth-scroll');
  if (scrollElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: unobserve after visible to save resources if animation is one-time
            // observer.unobserve(entry.target); 
          } else {
            // Optional: remove 'visible' if you want elements to hide again when scrolled out
            // entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    scrollElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Smooth scrolling animation
  const allLinks = document.querySelectorAll('a[href^="#"], .main-nav-link[href*="/"]'); // Select internal hash links and nav links for closing nav

  allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      let isInternalHashLink = href && href.startsWith("#") && href !== "#";
      let isTopLink = href === "#";

      if (isInternalHashLink) {
        e.preventDefault();
        const sectionEl = document.querySelector(href);
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: "smooth" });
        }
      } else if (isTopLink) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      // Close mobile navigation if it's open and the link is a main-nav-link
      if (link.classList.contains("main-nav-link") && headerEl && headerEl.classList.contains("nav-open")) {
        headerEl.classList.remove("nav-open"); // Use remove instead of toggle
        if (btnNavEl) btnNavEl.setAttribute('aria-expanded', 'false');
        if (mainNavList) mainNavList.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Sticky navigation observer
  // Observe an element at the top of the main content. '.empty' contains the introduction.
  const heroContentToObserve = document.querySelector(".hero-introduction .empty"); 

  if (heroContentToObserve) { // Check if the element to observe exists
    const stickyNavObserver = new IntersectionObserver(
      function (entries) {
        const entry = entries[0];
        if (!entry.isIntersecting && window.scrollY > 0) { // Check scrollY to avoid triggering if already at top
          document.body.classList.add("body-scrolled-for-sticky"); // Use a more specific class for body
        } else {
          document.body.classList.remove("body-scrolled-for-sticky");
        }
      },
      {
        root: null, // observing relative to viewport
        threshold: 0, // when the element is not visible at all (leaves viewport)
        rootMargin: "-80px", // offset from the top, effectively when top of element is 80px above viewport top
      }
    );
    stickyNavObserver.observe(heroContentToObserve);
  }
  
  // The original inline script for header scroll class is also good.
  // This IntersectionObserver is another way to handle sticky, often more performant.
  // If you keep the inline script, ensure `document.body.classList.add("sticky")` isn't conflicting.
  // The inline script adds 'scrolled' to 'header.sticky'. This observer adds to 'body'.
  // I'll assume the inline script is primary for the header's visual change.
  // This observer could be used for other "is page scrolled" logic if needed.
  // For clarity, I've renamed the class it adds to body to avoid confusion with header's "sticky" class.
});