// ===================================
// UNIVERSAL CONVERTER SCRIPT
// ===================================

let currentCategory = '';
const elements = {};

function initConverter(category) {
    currentCategory = category;
    
    // Get DOM elements
    elements.inputValue = document.getElementById('inputValue');
    elements.outputValue = document.getElementById('outputValue');
    elements.fromUnit = document.getElementById('fromUnit');
    elements.toUnit = document.getElementById('toUnit');
    elements.resultText = document.getElementById('resultText');
    elements.swapButton = document.getElementById('swapButton');
    elements.hamburger = document.getElementById('hamburger');
    elements.mainNav = document.getElementById('mainNav');
    elements.sidebarOverlay = document.getElementById('sidebarOverlay');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    
    // Load category units
    loadCategory(category);
    
    // Attach event listeners
    attachEventListeners();
    
    // Perform initial conversion
    updateConversion();
}

// ===================================
// CATEGORY MANAGEMENT
// ===================================

function loadCategory(category) {
    const categoryData = CONVERSION_DATA[category];
    
    if (!categoryData) {
        console.error('Category not found:', category);
        return;
    }
    
    // Clear existing options
    elements.fromUnit.innerHTML = '';
    elements.toUnit.innerHTML = '';
    
    // Populate dropdowns with units
    const units = Object.keys(categoryData.units);
    units.forEach((unitKey, index) => {
        const unitData = categoryData.units[unitKey];
        
        // Create options for "from" dropdown
        const fromOption = document.createElement('option');
        fromOption.value = unitKey;
        fromOption.textContent = unitData.name;
        elements.fromUnit.appendChild(fromOption);
        
        // Create options for "to" dropdown
        const toOption = document.createElement('option');
        toOption.value = unitKey;
        toOption.textContent = unitData.name;
        elements.toUnit.appendChild(toOption);
    });
    
    // Set default selections (first and second unit)
    if (units.length > 1) {
        elements.fromUnit.selectedIndex = 0;
        elements.toUnit.selectedIndex = 1;
    }
    
    // Update conversion after loading category
    updateConversion();
}

// ===================================
// CONVERSION LOGIC
// ===================================

function convertValue(value, fromUnit, toUnit, category) {
    // Handle empty or invalid input
    if (value === '' || isNaN(value)) {
        return 0;
    }
    
    const numValue = parseFloat(value);
    const categoryData = CONVERSION_DATA[category];
    
    // Special handling for temperature (non-linear conversion)
    if (category === 'temperature' && categoryData.convert) {
        return categoryData.convert(numValue, fromUnit, toUnit);
    }
    
    // Linear conversion for other units
    // Convert to base unit, then to target unit
    const fromRate = categoryData.units[fromUnit].toBase;
    const toRate = categoryData.units[toUnit].toBase;
    
    const baseValue = numValue * fromRate;
    const result = baseValue / toRate;
    
    return result;
}

function updateConversion() {
    const inputVal = elements.inputValue.value;
    const fromUnit = elements.fromUnit.value;
    const toUnit = elements.toUnit.value;
    
    // Perform conversion
    const result = convertValue(inputVal, fromUnit, toUnit, currentCategory);
    
    // Format result
    let formattedResult;
    if (isNaN(result)) {
        formattedResult = '0';
    } else {
        formattedResult = formatNumber(result);
    }
    
    // Update output display
    elements.outputValue.textContent = formattedResult;
    
    // Update result text with full description
    if (inputVal === '' || inputVal === '0' || isNaN(inputVal)) {
        elements.resultText.textContent = '변환 결과가 여기에 표시됩니다';
    } else {
        const fromUnitName = CONVERSION_DATA[currentCategory].units[fromUnit].name;
        const toUnitName = CONVERSION_DATA[currentCategory].units[toUnit].name;
        elements.resultText.textContent = `${inputVal} ${fromUnitName} = ${formattedResult} ${toUnitName}`;
    }
}

// ===================================
// EVENT HANDLERS
// ===================================

function handleSwap() {
    // Swap the selected units
    const fromIndex = elements.fromUnit.selectedIndex;
    const toIndex = elements.toUnit.selectedIndex;
    
    elements.fromUnit.selectedIndex = toIndex;
    elements.toUnit.selectedIndex = fromIndex;
    
    // Swap the input and output values
    const inputVal = elements.inputValue.value;
    const outputVal = elements.outputValue.textContent;
    
    elements.inputValue.value = outputVal;
    
    // Trigger conversion update
    updateConversion();
}

// ===================================
// MOBILE MENU HANDLERS
// ===================================

function toggleMenu() {
    const isOpen = elements.mainNav.classList.contains('active');
    
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    elements.mainNav.classList.add('active');
    elements.sidebarOverlay.classList.add('active');
    elements.hamburger.classList.add('active');
    elements.hamburger.setAttribute('aria-expanded', 'true');
    elements.hamburger.setAttribute('aria-label', '메뉴 닫기');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    elements.mainNav.classList.remove('active');
    elements.sidebarOverlay.classList.remove('active');
    elements.hamburger.classList.remove('active');
    elements.hamburger.setAttribute('aria-expanded', 'false');
    elements.hamburger.setAttribute('aria-label', '메뉴 열기');
    document.body.style.overflow = '';
}

function attachEventListeners() {
    // Input field changes (real-time conversion)
    elements.inputValue.addEventListener('input', updateConversion);
    
    // Unit dropdown changes
    elements.fromUnit.addEventListener('change', updateConversion);
    elements.toUnit.addEventListener('change', updateConversion);
    
    // Swap button click
    elements.swapButton.addEventListener('click', handleSwap);
    
    // Keyboard support for swap (Enter or Space)
    elements.swapButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSwap();
        }
    });
    
    // Hamburger menu toggle
    elements.hamburger.addEventListener('click', toggleMenu);
    
    // Sidebar overlay click (close menu)
    elements.sidebarOverlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking nav links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Mobile dropdown toggle
    elements.dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatNumber(num, decimals = 3) {
    if (isNaN(num)) return '0';
    
    // For very large or very small numbers, use exponential notation
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(2);
    }
    
    // Otherwise use fixed decimal places, removing trailing zeros
    return parseFloat(num.toFixed(decimals)).toString();
}
