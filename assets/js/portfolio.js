/**
 * portfolio.js — Portfolio page interactivity.
 * Uses namespace pattern per project architecture decision.
 */
window.PortfolioNav = {
    // CSS classes and IDs
    OVERLAY_ACTIVE_CLASS: 'active',
    HAMBURGER_ID: 'hamburger-btn',
    OVERLAY_ID: 'mobile-menu',
    CLOSE_BTN_CLASS: 'close-menu-btn',
    NAV_ACTIVE_CLASS: 'active',
    HERO_LOADED_CLASS: 'loaded',

    /**
     * Opens or closes the mobile menu overlay.
     * @param {boolean} forceClose — if true, always closes
     */
    toggleMenu: function(forceClose) {
        var overlay = document.getElementById(this.OVERLAY_ID);
        var hamburger = document.getElementById(this.HAMBURGER_ID);

        if (!overlay || !hamburger) return;

        if (forceClose) {
            overlay.classList.remove(this.OVERLAY_ACTIVE_CLASS);
        } else {
            overlay.classList.toggle(this.OVERLAY_ACTIVE_CLASS);
        }

        var isOpen = overlay.classList.contains(this.OVERLAY_ACTIVE_CLASS);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
    },

    /**
     * Highlights the nav link for the section currently in viewport.
     * Uses IntersectionObserver API.
     */
    setupActiveNav: function() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.navbar-nav a[data-nav-target]');

        if (!sections.length || !navLinks.length) return;

        var activeClass = this.NAV_ACTIVE_CLASS;

        // Callback runs when observed sections enter/leave viewport
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Remove active from all nav links
                    navLinks.forEach(function(link) {
                        link.classList.remove(activeClass);
                    });
                    // Add active to matching nav link
                    var target = entry.target.id;
                    navLinks.forEach(function(link) {
                        if (link.getAttribute('data-nav-target') === target) {
                            link.classList.add(activeClass);
                        }
                    });
                }
            });
        }, {
            // Trigger when ~50% of section is visible
            threshold: 0.5
        });

        // Start observing each section
        sections.forEach(function(section) {
            observer.observe(section);
        });
    },

    /**
     * Fades in hero section after background image loads.
     */
    setupHeroFadeIn: function() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        var loadedClass = this.HERO_LOADED_CLASS;

        // Create temporary image to detect when WebP finishes loading
        var img = new Image();
        img.src = '/assets/hero-backgrounds/hero-bg-desktop.webp';

        img.onload = function() {
            hero.classList.add(loadedClass);
        };

        // Fallback: if image fails to load, show hero anyway after 2s
        setTimeout(function() {
            if (!hero.classList.contains(loadedClass)) {
                hero.classList.add(loadedClass);
            }
        }, 2000);
    },

    /**
     * Wires up all event listeners after DOM is ready.
     */
    init: function() {
        var self = this;

        var hamburger = document.querySelector('.hamburger-btn');
        var closeBtn = document.querySelector('.' + this.CLOSE_BTN_CLASS);
        var overlay = document.getElementById(this.OVERLAY_ID);

        if (!hamburger || !overlay) return;

        // Mobile menu: toggle on hamburger click
        hamburger.addEventListener('click', function() {
            self.toggleMenu(false);
        });

        // Mobile menu: close on X button
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                self.toggleMenu(true);
            });
        }

        // Mobile menu: close on nav link click
        var menuLinks = overlay.querySelectorAll('a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                self.toggleMenu(true);
            });
        });

        // Mobile menu: close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                self.toggleMenu(true);
            }
        });

        // Feature: Active nav highlighting
        self.setupActiveNav();

        // Feature: Hero background fade-in
        self.setupHeroFadeIn();

        console.log('[PortfolioNav] Initialized');
    }
};

// Initialize when DOM fully parsed
document.addEventListener('DOMContentLoaded', function() {
    window.PortfolioNav.init();
});