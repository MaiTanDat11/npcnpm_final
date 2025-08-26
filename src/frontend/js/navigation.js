/**
 * Navigation utility for role-based routing
 */
import { TokenManager } from './hybrid-api.js';

export class NavigationManager {
    /**
     * Get the appropriate home URL based on user role
     */
    static getHomeUrl() {
        try {
            const currentUser = TokenManager.getCurrentUser();
            
            if (!currentUser || !TokenManager.isAuthenticated()) {
                return '/'; // Guest/index page
            }
            
            switch (currentUser.role) {
                case 'organizer':
                    return 'organizer-dashboard.html';
                case 'user':
                    return 'dashboard.html';
                case 'admin':
                    return 'admin-dashboard.html'; // In case admin dashboard exists
                default:
                    return 'dashboard.html'; // Default to user dashboard
            }
        } catch (error) {
            console.error('Error determining home URL:', error);
            return '/'; // Fallback to guest page
        }
    }

    /**
     * Navigate to home based on user role
     */
    static goHome() {
        window.location.href = this.getHomeUrl();
    }

    /**
     * Initialize home navigation for all home buttons on the page
     */
    static initializeHomeNavigation() {
        // Find all home navigation elements
        const homeButtons = document.querySelectorAll([
            '.home-button',
            '[onclick*="window.location.href=\'/\'"]',
            '[onclick*="window.location.href=\'dashboard.html\'"]',
            '[onclick*="window.location.href=\'organizer-dashboard.html\'"]',
            '.nav-item[onclick*="index.html"]',
            '.nav-item[onclick*="dashboard.html"]'
        ].join(','));

        homeButtons.forEach(button => {
            // Remove existing onclick handlers
            button.removeAttribute('onclick');
            
            // Add new role-based navigation
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.goHome();
            });
            
            // Make sure it's clickable
            button.style.cursor = 'pointer';
        });
    }

    /**
     * Update home navigation links to be role-aware
     */
    static updateHomeLinks() {
        const homeUrl = this.getHomeUrl();
        
        // Update href attributes for home links
        const homeLinks = document.querySelectorAll([
            'a[href="/"]',
            'a[href="index.html"]',
            'a[href="dashboard.html"]',
            'a[href="organizer-dashboard.html"]'
        ].join(','));

        homeLinks.forEach(link => {
            link.href = homeUrl;
        });
    }

    /**
     * Get the appropriate dashboard URL for navigation breadcrumbs
     */
    static getDashboardUrl() {
        return this.getHomeUrl();
    }

    /**
     * Redirect to appropriate dashboard after login
     */
    static redirectAfterLogin(userRole) {
        switch (userRole) {
            case 'organizer':
                window.location.href = 'organizer-dashboard.html';
                break;
            case 'user':
                window.location.href = 'dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
            default:
                window.location.href = 'dashboard.html';
        }
    }

    /**
     * Check if current user has access to a page
     */
    static checkPageAccess(requiredRole) {
        const currentUser = TokenManager.getCurrentUser();
        
        if (!currentUser || !TokenManager.isAuthenticated()) {
            return false;
        }
        
        if (requiredRole === 'any') {
            return true;
        }
        
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(currentUser.role);
        }
        
        return currentUser.role === requiredRole;
    }

    /**
     * Redirect unauthorized users
     */
    static redirectUnauthorized() {
        const currentUser = TokenManager.getCurrentUser();

        if (!currentUser || !TokenManager.isAuthenticated()) {
            window.location.href = 'login.html';
        } else {
            this.goHome();
        }
    }

    /**
     * Initialize header navigation for nav items
     */
    static initializeHeaderNavigation() {
        console.log('🔗 Initializing header navigation...');

        // Find all nav-item elements
        const navItems = document.querySelectorAll('.nav-item');
        console.log(`✅ Found ${navItems.length} nav items`);

        navItems.forEach((item, index) => {
            const spanText = item.querySelector('.nav-text, span')?.textContent?.trim();
            console.log(`🔗 Processing nav item ${index + 1}: "${spanText}"`);

            if (!spanText) {
                console.log(`⚠️ No span text found for nav item ${index + 1}`);
                return;
            }

            // Add cursor pointer style
            item.style.cursor = 'pointer';
            item.style.transition = 'opacity 0.2s ease';

            // Add hover effect
            item.addEventListener('mouseenter', () => {
                item.style.opacity = '0.7';
            });

            item.addEventListener('mouseleave', () => {
                item.style.opacity = '1';
            });

            // Add click handler based on text content
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🖱️ Nav item clicked: "${spanText}"`);

                switch(spanText) {
                    case 'Hỗ trợ':
                        console.log('🔄 Navigating to support.html');
                        window.location.href = 'support.html';
                        break;
                    case 'Thông tin':
                        console.log('🔄 Navigating to usage-information.html');
                        window.location.href = 'usage-information.html';
                        break;
                    default:
                        console.log('❓ Unknown nav item:', spanText);
                }
            });
        });

        console.log(`✅ Header navigation initialized for ${navItems.length} items`);
    }

    /**
     * Initialize logo navigation
     */
    static initializeLogoNavigation() {
        console.log('🏷️ Initializing logo navigation...');

        // Find all potential logo elements
        const logoSelectors = [
            '.footer-thumbnail',
            '.footer-logo-placeholder',
            '.logo',
            '.brand-logo',
            '.footer-thumbnail img',
            '.footer-section.preview .footer-thumbnail'
        ];

        let logoElements = [];
        for (const selector of logoSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                logoElements = [...logoElements, ...elements];
                console.log(`✅ Found ${elements.length} logo elements with selector: ${selector}`);
            }
        }

        if (logoElements.length === 0) {
            console.log('⚠️ No logo elements found');
            return;
        }

        logoElements.forEach((logo, index) => {
            console.log(`🏷️ Processing logo element ${index + 1}`);

            // Add cursor pointer style
            logo.style.cursor = 'pointer';
            logo.style.transition = 'all 0.3s ease';

            // Add hover effect
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.05)';
                logo.style.opacity = '0.8';
            });

            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
                logo.style.opacity = '1';
            });

            // Add click handler
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Logo clicked - navigating to team members page');
                window.location.href = 'team-members.html';
            });
        });

        console.log(`✅ Logo navigation initialized for ${logoElements.length} elements`);
    }

    /**
     * Initialize footer navigation for info items
     */
    static initializeFooterNavigation() {
        console.log('🔗 Initializing footer navigation...');

        // Try multiple selectors to find footer info items
        const selectors = [
            '.footer-section.info .info-item',
            '.info-item',
            '.footer-section .info-item'
        ];

        let footerInfoItems = [];
        for (const selector of selectors) {
            footerInfoItems = document.querySelectorAll(selector);
            if (footerInfoItems.length > 0) {
                console.log(`✅ Found ${footerInfoItems.length} footer items with selector: ${selector}`);
                break;
            }
        }

        if (footerInfoItems.length === 0) {
            console.log('⚠️ No footer info items found');
            return;
        }

        footerInfoItems.forEach((item, index) => {
            const spanText = item.querySelector('span')?.textContent?.trim();
            console.log(`🔗 Processing footer item ${index + 1}: "${spanText}"`);

            if (!spanText) {
                console.log(`⚠️ No span text found for item ${index + 1}`);
                return;
            }

            // Add cursor pointer style
            item.style.cursor = 'pointer';
            item.style.transition = 'opacity 0.2s ease';

            // Add hover effect
            item.addEventListener('mouseenter', () => {
                item.style.opacity = '0.7';
            });

            item.addEventListener('mouseleave', () => {
                item.style.opacity = '1';
            });

            // Add click handler based on text content
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`🖱️ Footer item clicked: "${spanText}"`);

                switch(spanText) {
                    case 'Thông tin sử dụng':
                        console.log('🔄 Navigating to usage-information.html');
                        window.location.href = 'usage-information.html';
                        break;
                    case 'Chính sách bảo mật':
                        console.log('🔄 Navigating to privacy-policy.html');
                        window.location.href = 'privacy-policy.html';
                        break;
                    case 'Điều khoản sử dụng':
                        console.log('🔄 Navigating to terms-of-use.html');
                        window.location.href = 'terms-of-use.html';
                        break;
                    default:
                        console.log('❓ Unknown footer item:', spanText);
                }
            });
        });

        console.log(`✅ Footer navigation initialized for ${footerInfoItems.length} items`);
    }
}

// Auto-initialize navigation when the script loads
document.addEventListener('DOMContentLoaded', function() {
    NavigationManager.initializeHomeNavigation();
    NavigationManager.updateHomeLinks();
    NavigationManager.initializeHeaderNavigation();
    NavigationManager.initializeLogoNavigation();
    NavigationManager.initializeFooterNavigation();
});

// Also initialize when the page is fully loaded (for dynamic content)
window.addEventListener('load', function() {
    NavigationManager.initializeHomeNavigation();
    NavigationManager.updateHomeLinks();
    NavigationManager.initializeHeaderNavigation();
    NavigationManager.initializeLogoNavigation();
    NavigationManager.initializeFooterNavigation();
});

// Export for global use
window.NavigationManager = NavigationManager;

// Add manual test functions for debugging
window.testHeaderNavigation = function() {
    console.log('🧪 Manual header navigation test...');
    NavigationManager.initializeHeaderNavigation();
};

window.testLogoNavigation = function() {
    console.log('🧪 Manual logo navigation test...');
    NavigationManager.initializeLogoNavigation();
};

window.testFooterNavigation = function() {
    console.log('🧪 Manual footer navigation test...');
    NavigationManager.initializeFooterNavigation();
};

window.testAllNavigation = function() {
    console.log('🧪 Manual navigation test for all elements...');
    NavigationManager.initializeHeaderNavigation();
    NavigationManager.initializeLogoNavigation();
    NavigationManager.initializeFooterNavigation();
};
