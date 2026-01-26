/**
 * Component includes loader
 * Loads header and footer components based on page language
 */
(function() {
    'use strict';

    // Determine if we're on an English page (in /en/ directory)
    const isEnglish = window.location.pathname.includes('/en/');

    // Set the base path for components
    const basePath = isEnglish ? '../components/' : 'components/';

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
    document.addEventListener('DOMContentLoaded', function() {
        // Load header and footer based on language
        loadComponent(`header-${lang}`, 'header-placeholder');
        loadComponent(`footer-${lang}`, 'footer-placeholder');
    });
})();
