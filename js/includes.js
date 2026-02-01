/**
 * Component includes loader
 * Loads header, footer and form components based on page language
 */
(function() {
    'use strict';

    // Determine if we're on an English page (in /en/ directory)
    const isEnglish = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

    // Use absolute path for components (works regardless of page depth)
    const basePath = '/components/';

    // Determine which language components to load
    const lang = isEnglish ? 'en' : 'nl';

    /**
     * Load a component into a placeholder element
     * @param {string} componentName - Name of component (e.g., 'header-nl')
     * @param {string} placeholderId - ID of placeholder element
     */
    async function loadComponent(componentName, placeholderId) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        try {
            const response = await fetch(`${basePath}${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}: ${response.status}`);
            }
            const html = await response.text();
            placeholder.innerHTML = html;
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }

    // Load components when DOM is ready
    document.addEventListener('DOMContentLoaded', async function() {
        // Load all components in parallel, wait for all to finish
        await Promise.all([
            loadComponent(`header-${lang}`, 'header-placeholder'),
            loadComponent(`footer-${lang}`, 'footer-placeholder'),
            loadComponent(`form-${lang}`, 'form-placeholder')
        ]);

        // Signal that all components are in the DOM
        document.dispatchEvent(new Event('components-loaded'));
    });
})();
