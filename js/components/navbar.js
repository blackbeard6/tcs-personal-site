/**
 * Navbar functionality
 * Handles hamburger menu toggle for mobile
 * Called after component is loaded
 */
function initNavbar() {
    const hamburger = document.querySelector(".hamburger");
    const hamburgerContainer = document.querySelector(".navbar-hamburger");
    if (!hamburger || !hamburgerContainer) return; // Navbar not loaded yet

    const mobileOverlay = document.querySelector(".mobile-menu-overlay");
    const mobileLinks = document.querySelectorAll(".mobile-menu-link");

    hamburgerContainer.addEventListener("click", toggleMobileMenu);
    mobileLinks.forEach(function(link) {
        link.addEventListener("click", closeMobileMenu);
    });

    function toggleMobileMenu() {
        hamburger.classList.toggle("active");
        if (mobileOverlay) {
            mobileOverlay.classList.toggle("active");
        }
    }

    function closeMobileMenu() {
        hamburger.classList.remove("active");
        if (mobileOverlay) {
            mobileOverlay.classList.remove("active");
        }
    }
}

// Make available globally for component loader
window.initNavbar = initNavbar;
