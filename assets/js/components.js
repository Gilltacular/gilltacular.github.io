/**
 * components.js — Handles dynamic injection of shared components
 * (navbar and footer) across all pages.
 *
 * Placeholder divs with background matching the page background
 * prevent layout shift. Components are fetched and injected on
 * DOMContentLoaded, then interactive features are initialized.
 *
 * Must be loaded BEFORE portfolio.js so dependent features can
 * listen for the 'components:loaded' event.
 */

document.addEventListener('DOMContentLoaded', function () {

    // ================================================================
    // NAVBAR INJECTION
    // ================================================================

    var navbarMount = document.getElementById('navbar-mount');

    if (navbarMount) {
        fetch('/components/navbar.html')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load navbar component');
                }
                return response.text();
            })
            .then(function (html) {
                navbarMount.innerHTML = html;
                initMobileMenu();
                dispatchComponentsLoaded();
            })
            .catch(function (error) {
                console.error('Navbar injection failed:', error);
                dispatchComponentsLoaded();
            });
    } else {
        dispatchComponentsLoaded();
    }

    // ================================================================
    // FOOTER INJECTION (standard footer only — 404 page has custom)
    // ================================================================

    var footerMount = document.getElementById('footer-mount');

    if (footerMount) {
        fetch('/components/footer.html')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load footer component');
                }
                return response.text();
            })
            .then(function (html) {
                footerMount.innerHTML = html;

                // Re-render Feather icons after injection
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            })
            .catch(function (error) {
                console.error('Footer injection failed:', error);
            });
    }

    // ================================================================
    // MOBILE MENU INITIALIZATION
    // Runs after navbar is injected into the DOM
    // ================================================================

    function initMobileMenu() {
        var hamburgerBtn = document.getElementById('hamburger-btn');
        var mobileMenu = document.getElementById('mobile-menu');
        var closeBtn = document.querySelector('.close-menu-btn');

        if (!hamburgerBtn || !mobileMenu) {
            return;
        }

        // Hamburger → Open menu
        hamburgerBtn.addEventListener('click', function () {
            mobileMenu.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        });

        // Close button → Close menu
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        }

        // Nav link click → Close menu
        var menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Escape key → Close menu
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                mobileMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ================================================================
    // DISPATCH EVENT — lets portfolio.js know components are ready
    // ================================================================

    function dispatchComponentsLoaded() {
        document.dispatchEvent(new CustomEvent('components:loaded'));
    }
});