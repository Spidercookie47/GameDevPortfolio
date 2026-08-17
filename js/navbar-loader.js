// Fetches partials/navbar.html and injects it into #navbar-placeholder.
//
// Instead of a hardcoded path, this figures out its own location on the
// page (via document.currentScript.src) and builds the fetch path relative
// to that. This means the SAME script works correctly whether it's loaded
// from the site root, one folder deep (ProjectPersonal/), or from inside
// a GitHub Pages subfolder like /GameDevPortfolio/ — no per-page config needed.

const scriptURL = document.currentScript.src;
const siteBasePath = scriptURL.replace(/js\/navbar-loader\.js.*$/, '');

fetch(siteBasePath + 'js/navbar.html')
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
        rewriteNavbarLinks(placeholder, siteBasePath);
        initNavbarScrollEffect();
    })
    .catch(err => {
        console.error(err);
    });

// The navbar partial is written with plain filenames (e.g. "PortfolioGameDev.html"),
// which only resolve correctly if the CURRENT PAGE is at the site root. Since this
// navbar gets injected into pages at different folder depths, this rewrites each
// link's href by prepending the same siteBasePath used for the fetch above —
// skipping external links (http/https) and pure anchor links (#something).
function rewriteNavbarLinks(container, basePath) {
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        const isExternal = /^https?:\/\//i.test(href);
        const isAnchorOnly = href.startsWith('#');
        if (!isExternal && !isAnchorOnly) {
            link.setAttribute('href', basePath + href);
        }
    });
}

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
