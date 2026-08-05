/**
 * portfolio.js - portfolio page interactivity.
 * Uses namespace pattern per project architecture decision.
*/

window.PortfolioNav= {
    //CSS class that toggles overlay visibility
    OVERLAY_ACTIVE_CLASS: 'active',

    //DOM element Identification
    HAMBURGER_ID:   'hamburger-btn',
    OVERLAY_ID:     'mobile-menu',
    CLOSE_BTN_CLASS:'close-menu-btn',


    /**
     * Opens of closes the mobile menu overlay
     * @param {boolean} forceClose- if true, always closes (used by link clicks)
    */

    toggleMenu: function(forceClose) {
        var overlay = document.getElementById(this.OVERLAY_ID);
        var hamburger = document.getElementById(this.HAMBURGER_ID);

        if(!overlay || !hamburger) return;

        if (forceClose) {
            overlay.classList.remove(this.OVERLAY_ACTIVE_CLASS);
        } else {
            overlay.classList.toggle(this.OVERLAY_ACTIVE_CLASS);
        }

        // Update aria-expanded to reflect current state
        var isOpen = overlay.classList.contains(this.OVERLAY_ACTIVE_CLASS);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
    },

    /**
     *  Event Listeners activated when DOM is ready
    */

    init: function() {
        var self = this;

        var hamburger = document.querySelector('.hamburger-btn');
        var closeBtn = document.querySelector('.' + this.CLOSE_BTN_CLASS);
        var overlay = document.getElementById(this.OVERLAY_ID);

        if (!hamburger || !overlay) return;

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function() {
            self.toggleMenu(false);
        });

        // Close menu on close button click (x)
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                self.toggleMenu(true);
            });
        }

        // Close menu if any nav link inside overlay is clicked
        var menuLinks = overlay.querySelectorAll('a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                self.toggleMenu(true);
            });
        });

        // Close menu on escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                self.toggleMenu(true);
            }
        });

        console.log('[PortfolioNav] Initialized');
    }
};

// Initialize when DOM fully parsed

document.addEventListener('DOMContentLoaded', function() {
    window.PortfolioNav.init();
});