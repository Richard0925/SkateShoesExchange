// Emergency fix script - Apply skateboard-inspired UI and optimize layout
function runEmergencyFix() {
  console.log('Applying skateboard-inspired UI and optimizing layout...');

  // Add required fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap';
  document.head.appendChild(fontLink);

  // Add Font Awesome for icons (if not already loaded)
  if (!document.querySelector('link[href*="fontawesome"]')) {
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(iconLink);
  }

  // Add skateboard-inspired style
  const skateStyle = document.createElement('style');
  skateStyle.textContent = `
    :root {
      --black: #121212;
      --off-black: #1a1a1a;
      --dark-gray: #222222;
      --medium-gray: #333333;
      --light-gray: #666666;
      --off-white: #f5f5f5;
      --white: #ffffff;
      --neon-green: #00FF66;
      --neon-blue: #00AAFF;
      --accent-red: #FF3D33;
      
      --heading-font: 'Bebas Neue', sans-serif;
      --body-font: 'Inter', sans-serif;
      
      --space-xs: 0.25rem;
      --space-sm: 0.5rem;
      --space-md: 1rem;
      --space-lg: 1.5rem;
      --space-xl: 2rem;
      --space-xxl: 3rem;
    }
    
    body {
      background-color: var(--off-white) !important;
      color: var(--black) !important;
      font-family: var(--body-font) !important;
      line-height: 1.5 !important;
      margin: 0 !important;
      overflow-x: hidden !important;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font) !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      line-height: 1.2 !important;
      font-weight: 400 !important;
      color: var(--black) !important;
      margin-bottom: var(--space-md) !important;
    }
    
    a {
      color: var(--black) !important;
      text-decoration: none !important;
      transition: color 0.2s ease !important;
    }
    
    a:hover {
      color: var(--neon-green) !important;
    }
    
    /* Layout */
    .container {
      width: 100% !important;
      max-width: 1280px !important;
      margin: 0 auto !important;
      padding: 0 var(--space-md) !important;
    }
    
    /* Header */
    header, .header, .site-header, nav, .navbar {
      background-color: var(--white) !important;
      border-bottom: 1px solid rgba(0,0,0,0.1) !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
    }
    
    .header-container, .navbar-container {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: var(--space-md) 0 !important;
    }
    
    .site-logo, .brand, .navbar-brand {
      font-family: var(--heading-font) !important;
      font-size: 2rem !important;
      text-transform: uppercase !important;
      text-decoration: none !important;
      color: var(--black) !important;
      display: flex !important;
      align-items: center !important;
      gap: var(--space-sm) !important;
    }
    
    /* Button styles */
    button, .btn, .button, a.btn, input[type="submit"] {
      font-family: var(--heading-font) !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      background-color: var(--black) !important;
      color: var(--white) !important;
      border: none !important;
      padding: 0.5rem 1rem !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      font-size: 1rem !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    button:hover, .btn:hover, .button:hover {
      background-color: var(--neon-green) !important;
      color: var(--black) !important;
    }
    
    button.primary, .btn-primary, .button-primary {
      background-color: var(--neon-green) !important;
      color: var(--black) !important;
    }
    
    button.primary:hover, .btn-primary:hover, .button-primary:hover {
      background-color: var(--black) !important;
      color: var(--neon-green) !important;
    }
    
    button.outline, .btn-outline, .button-outline {
      background-color: transparent !important;
      border: 2px solid var(--black) !important;
      color: var(--black) !important;
    }
    
    button.outline:hover, .btn-outline:hover, .button-outline:hover {
      background-color: var(--black) !important;
      color: var(--white) !important;
    }
    
    /* Card grid */
    .grid, .grid-container, .card-grid, .listings-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
      gap: var(--space-lg) !important;
      margin: var(--space-xl) 0 !important;
    }
    
    /* Card styling */
    .card, .listing-card, .product-card {
      background-color: var(--white) !important;
      border: 1px solid rgba(0,0,0,0.1) !important;
      overflow: hidden !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    
    .card:hover, .listing-card:hover, .product-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    
    .card-image, .listing-image, .product-image {
      aspect-ratio: 1 !important;
      overflow: hidden !important;
      position: relative !important;
    }
    
    .card-image img, .listing-image img, .product-image img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      transition: transform 0.3s ease !important;
    }
    
    .card:hover img, .listing-card:hover img, .product-card:hover img {
      transform: scale(1.05) !important;
    }
    
    .card-content, .listing-content, .product-content {
      padding: var(--space-lg) !important;
    }
    
    .card-title, .listing-title, .product-title {
      font-family: var(--heading-font) !important;
      font-size: 1.5rem !important;
      margin-bottom: var(--space-sm) !important;
      line-height: 1.2 !important;
    }
    
    .card-details, .listing-details, .product-details {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: var(--space-sm) !important;
      margin: var(--space-sm) 0 !important;
    }
    
    .card-tag, .tag, .badge {
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      padding: 0.25rem 0.5rem !important;
      background-color: var(--off-white) !important;
      border-radius: 2px !important;
      display: inline-block !important;
    }
    
    /* Search and filter */
    .search-container, .search-form {
      display: flex !important;
      align-items: center !important;
      gap: var(--space-sm) !important;
    }
    
    .search-input-wrapper {
      position: relative !important;
      width: 100% !important;
    }
    
    input[type="text"], input[type="search"], input[type="email"], 
    input[type="password"], input[type="number"], select, textarea {
      padding: 0.5rem 1rem !important;
      border: 1px solid rgba(0,0,0,0.2) !important;
      background-color: var(--white) !important;
      font-family: var(--body-font) !important;
      font-size: 0.875rem !important;
      width: 100% !important;
    }
    
    input:focus, select:focus, textarea:focus {
      outline: none !important;
      border-color: var(--neon-green) !important;
      box-shadow: 0 0 0 2px rgba(0, 255, 102, 0.2) !important;
    }
    
    /* Filter panel */
    .filter-panel, .filter-sidebar, .filter-drawer {
      position: fixed !important;
      top: 0 !important;
      right: -350px !important;
      width: 350px !important;
      height: 100% !important;
      background-color: var(--white) !important;
      box-shadow: 0 0 20px rgba(0,0,0,0.1) !important;
      z-index: 1100 !important;
      overflow-y: auto !important;
      padding: var(--space-xl) !important;
      transition: right 0.3s ease !important;
    }
    
    .filter-panel.open, .filter-sidebar.open, .filter-drawer.open {
      right: 0 !important;
    }
    
    .filter-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: rgba(0,0,0,0.5) !important;
      z-index: 1050 !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: opacity 0.3s ease, visibility 0.3s ease !important;
    }
    
    .filter-overlay.visible {
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    .filter-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      margin-bottom: var(--space-lg) !important;
    }
    
    .filter-close {
      background: none !important;
      border: none !important;
      font-size: 1.5rem !important;
      cursor: pointer !important;
      color: var(--black) !important;
      padding: 0 !important;
    }
    
    .filter-section {
      margin-bottom: var(--space-lg) !important;
    }
    
    .filter-title {
      font-family: var(--heading-font) !important;
      font-size: 1.5rem !important;
      margin-bottom: var(--space-md) !important;
      display: flex !important;
      align-items: center !important;
      gap: var(--space-sm) !important;
    }
    
    .filter-divider {
      height: 1px !important;
      background-color: rgba(0,0,0,0.1) !important;
      margin: var(--space-lg) 0 !important;
    }
    
    /* Footer */
    footer, .footer, .site-footer {
      background-color: var(--off-white) !important;
      border-top: 1px solid rgba(0,0,0,0.1) !important;
      padding: var(--space-xl) 0 !important;
      margin-top: var(--space-xxl) !important;
    }
    
    .footer-content {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      margin-bottom: var(--space-lg) !important;
    }
    
    .footer-logo {
      font-family: var(--heading-font) !important;
      font-size: 1.5rem !important;
      color: var(--black) !important;
    }
    
    .footer-links {
      display: flex !important;
      gap: var(--space-lg) !important;
    }
    
    .footer-link {
      color: var(--black) !important;
      text-decoration: none !important;
    }
    
    .footer-link:hover {
      color: var(--neon-green) !important;
    }
    
    .footer-copyright {
      text-align: center !important;
      font-size: 0.875rem !important;
      color: var(--light-gray) !important;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .grid, .grid-container, .card-grid, .listings-grid {
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)) !important;
      }
      
      .filter-panel, .filter-sidebar, .filter-drawer {
        width: 280px !important;
      }
    }
    
    @media (max-width: 640px) {
      .grid, .grid-container, .card-grid, .listings-grid {
        grid-template-columns: 1fr !important;
      }
      
      .filter-panel, .filter-sidebar, .filter-drawer {
        width: 100% !important;
        right: -100% !important;
      }
      
      .search-container, .search-form {
        flex-direction: column !important;
        align-items: stretch !important;
      }
    }
  `;

  document.head.appendChild(skateStyle);

  // Add filter toggle functionality
  function enhanceFilterToggle() {
    // Find filter buttons
    document.querySelectorAll('button').forEach(button => {
      const text = button.textContent.toLowerCase();
      if (text.includes('filter') || button.innerHTML.includes('filter')) {
        // Make it toggle the filter panel
        button.addEventListener('click', function () {
          toggleFilterPanel();
        });
      }
    });

    // Create filter overlay if it doesn't exist
    if (!document.querySelector('.filter-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'filter-overlay';
      overlay.addEventListener('click', function () {
        closeFilterPanel();
      });
      document.body.appendChild(overlay);
    }

    // Make sure filter panel has proper classes
    document.querySelectorAll('.filter-sidebar, .pixel-sidebar, .filter-drawer').forEach(panel => {
      panel.classList.add('filter-panel');

      // Add close button if not present
      if (!panel.querySelector('.filter-close')) {
        const header = document.createElement('div');
        header.className = 'filter-header';

        const title = document.createElement('h2');
        title.className = 'filter-title';
        title.innerHTML = '<i class="fas fa-filter"></i> Filter';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'filter-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function () {
          closeFilterPanel();
        });

        header.appendChild(title);
        header.appendChild(closeBtn);

        panel.prepend(header);
      }
    });
  }

  // Toggle filter panel
  function toggleFilterPanel() {
    const filterPanel = document.querySelector('.filter-panel');
    const overlay = document.querySelector('.filter-overlay');

    if (filterPanel) {
      if (filterPanel.classList.contains('open')) {
        filterPanel.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      } else {
        filterPanel.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  // Close filter panel
  function closeFilterPanel() {
    const filterPanel = document.querySelector('.filter-panel');
    const overlay = document.querySelector('.filter-overlay');

    if (filterPanel) {
      filterPanel.classList.remove('open');
    }

    if (overlay) {
      overlay.classList.remove('visible');
    }

    document.body.style.overflow = '';
  }

  // Standardize card format
  function standardizeCardFormat() {
    // Find all cards
    document.querySelectorAll('.card, .listing-card, .skate-card, .minimal-card, .pixel-card').forEach(card => {
      // Add standard class
      card.classList.add('card');

      // Find image container
      const imageContainer = card.querySelector('div > img')?.parentElement;
      if (imageContainer) {
        imageContainer.classList.add('card-image');
      }

      // Find title element
      const titleElement = card.querySelector('h3');
      if (titleElement) {
        titleElement.classList.add('card-title');
      }

      // Find or create details container
      let detailsContainer = card.querySelector('.card-details, .skate-card-details');
      if (!detailsContainer) {
        const metaContainer = card.querySelector('.minimal-card-meta, .pixel-tag, .skate-card-tag');
        if (metaContainer) {
          detailsContainer = document.createElement('div');
          detailsContainer.className = 'card-details';
          const metaParent = metaContainer.parentElement;
          metaParent.insertBefore(detailsContainer, metaContainer);

          // Move size, location, date into tags
          const text = metaContainer.textContent;

          // Extract UK size
          const sizeMatch = text.match(/UK\s*(\d+)/i);
          if (sizeMatch) {
            const sizeTag = document.createElement('div');
            sizeTag.className = 'card-tag';
            sizeTag.innerHTML = `<i class="fas fa-ruler"></i> UK ${sizeMatch[1]}`;
            detailsContainer.appendChild(sizeTag);
          }

          // Extract location
          const locationMatch = text.match(/[A-Z]{2,3}/);
          if (locationMatch) {
            const locationTag = document.createElement('div');
            locationTag.className = 'card-tag';
            locationTag.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${locationMatch[0]}`;
            detailsContainer.appendChild(locationTag);
          }

          // Extract date
          const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
          if (dateMatch) {
            const dateTag = document.createElement('div');
            dateTag.className = 'card-tag';
            dateTag.textContent = `${dateMatch[0]}`;
            detailsContainer.appendChild(dateTag);
          }
        }
      }

      // Add swap button if missing
      if (!card.querySelector('button')) {
        // Create container for metadata and button
        const footer = document.createElement('div');
        footer.className = 'card-footer';

        // Extract username if available
        const usernameElement = card.querySelector('[class*="username"], [class*="author"]');
        if (usernameElement) {
          const meta = document.createElement('div');
          meta.className = 'card-meta';
          meta.textContent = usernameElement.textContent;
          footer.appendChild(meta);
        }

        // Add swap button
        const swapButton = document.createElement('button');
        swapButton.className = 'btn btn-sm';
        swapButton.innerHTML = '<i class="fas fa-exchange-alt"></i> Swap';
        footer.appendChild(swapButton);

        // Find content container or append to card
        const contentContainer = card.querySelector('[class*="content"]');
        if (contentContainer) {
          contentContainer.appendChild(footer);
        } else {
          card.appendChild(footer);
        }
      }
    });
  }

  // Add skeleton loaders
  function addSkeletonLoaders() {
    const gridContainers = document.querySelectorAll('.grid, .grid-container, .card-grid, .listings-grid');

    gridContainers.forEach(grid => {
      // Check if container is empty or has an error message
      if (grid.children.length === 0 || (grid.children.length === 1 && grid.children[0].textContent.includes('No results'))) {
        // Add skeleton cards
        for (let i = 0; i < 6; i++) {
          const skeletonCard = document.createElement('div');
          skeletonCard.className = 'skeleton-card';
          skeletonCard.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-title"></div>
              <div class="skeleton-details"></div>
              <div class="skeleton-footer"></div>
            </div>
          `;
          grid.appendChild(skeletonCard);
        }

        // Add skeleton styles if not present
        if (!document.querySelector('style#skeleton-styles')) {
          const skeletonStyle = document.createElement('style');
          skeletonStyle.id = 'skeleton-styles';
          skeletonStyle.textContent = `
            @keyframes shimmer {
              0% { background-position: -468px 0 }
              100% { background-position: 468px 0 }
            }
            
            .skeleton-card {
              background-color: var(--white);
              border: 1px solid rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .skeleton-image {
              aspect-ratio: 1;
              background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
              background-size: 800px 104px;
              animation: shimmer 1.5s infinite linear;
            }
            
            .skeleton-content {
              padding: var(--space-lg);
            }
            
            .skeleton-title {
              height: 24px;
              margin-bottom: var(--space-md);
              background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
              background-size: 800px 104px;
              animation: shimmer 1.5s infinite linear;
            }
            
            .skeleton-details {
              height: 32px;
              margin-bottom: var(--space-md);
              background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
              background-size: 800px 104px;
              animation: shimmer 1.5s infinite linear;
            }
            
            .skeleton-footer {
              height: 20px;
              background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
              background-size: 800px 104px;
              animation: shimmer 1.5s infinite linear;
            }
          `;
          document.head.appendChild(skeletonStyle);
        }
      }
    });
  }

  // Execute everything
  enhanceFilterToggle();
  standardizeCardFormat();
  addSkeletonLoaders();

  console.log('Skateboard-inspired UI applied and layout optimized');
}

// Run on page load
document.addEventListener('DOMContentLoaded', function () {
  // Initial run with delay
  setTimeout(runEmergencyFix, 500);

  // Run again to catch dynamically loaded content
  setTimeout(runEmergencyFix, 2000);
});

// MutationObserver to detect DOM changes
const observeDOM = () => {
  const targetNode = document.body;

  // Observer configuration
  const config = { attributes: false, childList: true, subtree: true };

  // Callback function
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        runEmergencyFix();
        break;
      }
    }
  };

  // Create and start observer
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
};

// Start observing after initial load
setTimeout(observeDOM, 1000);

// Expose function globally
window.runEmergencyFix = runEmergencyFix; 