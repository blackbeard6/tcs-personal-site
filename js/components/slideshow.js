/**
 * Slideshow functionality
 * Auto-rotating image carousel
 */
(function() {
    'use strict';

    let slideIndex = 0;
    let slideshowTimer = null;

    function showSlides() {
        const slides = document.getElementsByClassName("mySlides");
        if (slides.length === 0) return;

        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            slides[i].classList.remove("active-slide");
        }

        // Advance index
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        // Show current slide
        slides[slideIndex - 1].style.display = "flex";
        slides[slideIndex - 1].classList.add("active-slide");

        // Schedule next slide
        slideshowTimer = setTimeout(showSlides, 4000);
    }

    function initSlideshow() {
        const slides = document.getElementsByClassName("mySlides");
        if (slides.length > 0) {
            showSlides();
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideshow);
    } else {
        initSlideshow();
    }

    // Expose for potential external control
    window.initSlideshow = initSlideshow;
})();
