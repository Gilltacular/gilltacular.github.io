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

        // Feature: Hero beat animation — start 2s after page load
        setTimeout(function() {
            window.HeroBeats.start();
        }, 2000);

        // Feature: Scroll fade-in animation
        window.ScrollFade.init();
        
        console.log('[PortfolioNav] Initialized');
    }
};

/**
 * HeroBeats — Cycles hero text phases.
 * Beat 1 (5.5s) → Beat 2 (5.5s) → Beat 3 (5.5s) → Static (11s) → Loop
 * 0.8s fade transitions between phases.
 */
window.HeroBeats = {

    PHASES: [
        { phase: 1, duration: 5500 },
        { phase: 2, duration: 5500 },
        { phase: 3, duration: 5500 },
        { phase: 4, duration: 20000 }
    ],

    TRANSITION_MS: 800,

    currentIdx: 0,
    timeoutId: null,
    phaseElements: [],

    /**
     * Shows a specific phase and hides all others.
     */
    showPhase: function(idx) {
        this.phaseElements.forEach(function(el, i) {
            if (i === idx) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    },

    /**
     * Advances to the next phase, then schedules itself again.
     */
    advance: function() {
        // Clear any existing timeout to prevent competing chains
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.currentIdx = (this.currentIdx + 1) % this.PHASES.length;
        this.showPhase(this.currentIdx);

        var duration = this.PHASES[this.currentIdx].duration;
        var self = this;
        this.timeoutId = setTimeout(function() {
            self.advance();
        }, duration);
    },

    /**
     * Starts the beat animation cycle.
     */
    isStarted: false,

    start: function() {
        if (this.isStarted) return;
        this.isStarted = true;

        var container = document.querySelector('.hero-beats');
        if (!container) return;

        this.phaseElements = Array.prototype.slice.call(
            container.querySelectorAll('.hero-phase')
        );

        if (this.phaseElements.length === 0) return;

        // Check reduced motion preference
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            this.phaseElements[0].classList.add('active');
            return;
        }

        // Show first phase immediately
        this.showPhase(0);

        // Schedule first advance after Beat 1 duration
        var self = this;
        this.timeoutId = setTimeout(function() {
            self.advance();
        }, this.PHASES[0].duration);
    }
};

/**
 * ScrollFade — Triggers fade-in animation when sections enter viewport.
 * Uses IntersectionObserver with stagger timing (300ms between elements).
 */
window.ScrollFade = {

    OBSERVER_THRESHOLD: 0.15,  // Trigger when 15% of section visible
    STAGGER_DELAY_MS: 300,
    lastTriggerTime: 0,

    /**
     * Callback fired when observed section crosses threshold.
     */
    onIntersect: function(entries) {
        var self = this;
        var now = Date.now();

        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Stagger: only allow 1 element per STAGGER_DELAY_MS
                if (now - self.lastTriggerTime >= self.STAGGER_DELAY_MS) {
                    entry.target.classList.add('visible');
                    self.lastTriggerTime = now;
                }
            }
        });
    },

    /**
     * Sets up IntersectionObserver on all .scroll-fade elements.
     */
    init: function() {
        var self = this;
        var elements = document.querySelectorAll('.scroll-fade');

        if (elements.length === 0) return;

        var observer = new IntersectionObserver(function(entries) {
            self.onIntersect(entries);
        }, {
            threshold: this.OBSERVER_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'  // Trigger 50px before section fully visible
        });

        elements.forEach(function(el) {
            observer.observe(el);
        });

        console.log('[ScrollFade] Initialized');
    }
};

// Initialize when DOM fully parsed
document.addEventListener('DOMContentLoaded', function() {
    window.PortfolioNav.init();
});