// 301 redirect script for old converter URLs to new /converters/ folder
// This maintains SEO value by redirecting search engines and bookmarks to new structure

(function() {
    const converterPages = [
        'length', 'weight', 'temperature', 'acceleration', 'angle', 
        'data', 'volume', 'speed', 'time', 'pressure', 'energy', 
        'power', 'area', 'torque', 'currency', 'force'
    ];
    
    // Get current path
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    const pageName = filename.replace('.html', '');
    
    // Check if we're on a converter page in the root directory (old structure)
    if (converterPages.includes(pageName) && !currentPath.includes('/converters/')) {
        // Redirect to new converters/ folder
        const newPath = window.location.origin + '/converters/' + filename;
        window.location.replace(newPath);
    }
})();
