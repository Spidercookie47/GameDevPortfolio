// Fetches partials/navbar.html and injects it into #navbar-placeholder.
// Because it's root-relative ("/partials/navbar.html"), this works the
// same on every page no matter how deep it is in your folder structure.

fetch('/navbar.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not load navbar: ' + response.status);
        }
        return response.text();
    })
    .then(html => {
        const placeholder = document.getElementById('navbar-placeholder');
        if (!placeholder) {
            console.error('navbar-loader.js: no element with id="navbar-placeholder" found on this page.');
            return;
        }
        placeholder.innerHTML = html;
        initNavbarScrollEffect();
    })
    .catch(err => {
        console.error(err);
    });

// Adds/removes the .scrolled class on the navbar based on scroll position.
// Runs AFTER the navbar is injected, since the element doesn't exist before that.
function initNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 50; // pixels scrolled before switching style

    function updateNavbarState() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbarState);
    updateNavbarState(); // run once immediately in case the page loads pre-scrolled
}