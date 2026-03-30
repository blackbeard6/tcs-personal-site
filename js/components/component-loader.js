/**
 * Component Loader
 * Loads HTML fragments into elements with data-component attribute
 * Works with static hosting (GitHub Pages)
 */
(function() {
    'use strict';

    /**
     * Determine base path based on current page depth
     * Handles pages at different directory levels
     */
    function getBasePath() {
        const path = window.location.pathname;
        // Count directory depth (subtract 1 for the filename itself)
        const segments = path.split('/').filter(s => s.length > 0);
        // If path ends with / or index.html, adjust
        const depth = segments.length - (path.endsWith('/') ? 0 : 1);
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    }

    /**
     * Load a single component into target element
     */
    async function loadComponent(element) {
        const componentName = element.getAttribute('data-component');
        const basePath = getBasePath();
        const componentPath = basePath + 'components/' + componentName + '.html';

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error('Component not found: ' + componentName);
            }

            let html = await response.text();

            // Fix relative paths in the component HTML
            // Handle href attributes (but not anchors or external links)
            html = html.replace(/href="(?!http|#|mailto:)([^"]+)"/g, function(match, path) {
                return 'href="' + basePath + path + '"';
            });
            // Handle src attributes (but not data URIs or external)
            html = html.replace(/src="(?!http|data:)([^"]+)"/g, function(match, path) {
                return 'src="' + basePath + path + '"';
            });

            element.innerHTML = html;

            // Dispatch event for post-load initialization
            element.dispatchEvent(new CustomEvent('component-loaded', {
                bubbles: true,
                detail: { name: componentName }
            }));

        } catch (error) {
            console.error('Failed to load component:', error);
            element.innerHTML = '<!-- Component load failed: ' + componentName + ' -->';
        }
    }

    /**
     * Initialize all components on page
     */
    function initComponents() {
        const components = document.querySelectorAll('[data-component]');
        const promises = Array.from(components).map(loadComponent);

        Promise.all(promises).then(function() {
            // All components loaded - initialize interactive behaviors
            if (typeof window.initNavbar === 'function') {
                window.initNavbar();
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();
