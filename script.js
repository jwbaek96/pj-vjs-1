// ===================================
// CONVERSION DATA CONSTANTS
// ===================================

const CONVERSION_DATA = {
    length: {
        name: '길이',
        units: {
            meter: { name: '미터 (m)', toBase: 1 },
            kilometer: { name: '킬로미터 (km)', toBase: 1000 },
            centimeter: { name: '센티미터 (cm)', toBase: 0.01 },
            millimeter: { name: '밀리미터 (mm)', toBase: 0.001 },
            mile: { name: '마일 (mi)', toBase: 1609.344 },
            yard: { name: '야드 (yd)', toBase: 0.9144 },
            foot: { name: '피트 (ft)', toBase: 0.3048 },
            inch: { name: '인치 (in)', toBase: 0.0254 }
        }
    },
    weight: {
        name: '무게',
        units: {
            kilogram: { name: '킬로그램 (kg)', toBase: 1 },
            gram: { name: '그램 (g)', toBase: 0.001 },
            milligram: { name: '밀리그램 (mg)', toBase: 0.000001 },
            ton: { name: '톤 (t)', toBase: 1000 },
            pound: { name: '파운드 (lb)', toBase: 0.453592 },
            ounce: { name: '온스 (oz)', toBase: 0.0283495 },
            stone: { name: '스톤 (st)', toBase: 6.35029 }
        }
    },
    temperature: {
        name: '온도',
        units: {
            celsius: { name: '섭씨 (°C)' },
            fahrenheit: { name: '화씨 (°F)' },
            kelvin: { name: '켈빈 (K)' }
        },
        // Temperature conversion requires special handling (non-linear)
        convert: (value, from, to) => {
            // First convert to Celsius as base
            let celsius;
            switch(from) {
                case 'celsius':
                    celsius = value;
                    break;
                case 'fahrenheit':
                    celsius = (value - 32) * 5/9;
                    break;
                case 'kelvin':
                    celsius = value - 273.15;
                    break;
                default:
                    return NaN;
            }
            
            // Then convert from Celsius to target unit
            switch(to) {
                case 'celsius':
                    return celsius;
                case 'fahrenheit':
                    return celsius * 9/5 + 32;
                case 'kelvin':
                    return celsius + 273.15;
                default:
                    return NaN;
            }
        }
    }
};

// ===================================
// DOM ELEMENTS
// ===================================

const elements = {
    inputValue: document.getElementById('inputValue'),
    outputValue: document.getElementById('outputValue'),
    fromUnit: document.getElementById('fromUnit'),
    toUnit: document.getElementById('toUnit'),
    resultText: document.getElementById('resultText'),
    swapButton: document.getElementById('swapButton'),
    tabButtons: document.querySelectorAll('.tab-button'),
    hamburger: document.getElementById('hamburger'),
    mainNav: document.getElementById('mainNav'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    navLinks: document.querySelectorAll('.nav-link'),
    dropdownItems: document.querySelectorAll('.nav-item-dropdown')
};

// ===================================
// STATE MANAGEMENT
// ===================================

let currentCategory = 'length';

// ===================================
// INITIALIZATION
// ===================================

function init() {
    // Load initial category
    loadCategory(currentCategory);
    
    // Attach event listeners
    attachEventListeners();
    
    // Perform initial conversion
    updateConversion();
}

// ===================================
// CATEGORY MANAGEMENT
// ===================================

function loadCategory(category) {
    currentCategory = category;
    const categoryData = CONVERSION_DATA[category];
    
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
    if (category === 'temperature') {
        return categoryData.convert(numValue, fromUnit, toUnit);
    }
    
    // Linear conversion for length and weight
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
    
    // Format result (show 2-3 decimal places, remove trailing zeros)
    let formattedResult;
    if (isNaN(result)) {
        formattedResult = '0';
    } else {
        // Round to 3 decimal places, then remove trailing zeros
        formattedResult = parseFloat(result.toFixed(3)).toString();
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

function handleTabClick(event) {
    const button = event.currentTarget;
    const category = button.dataset.category;
    
    // Update active tab styling
    elements.tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    
    // Load new category
    loadCategory(category);
}

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
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (!hamburger || !mainNav || !sidebarOverlay) return;
    
    const isOpen = mainNav.classList.contains('active');
    
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (!hamburger || !mainNav || !sidebarOverlay) return;
    
    mainNav.classList.add('active');
    sidebarOverlay.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', '메뉴 닫기');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (!hamburger || !mainNav || !sidebarOverlay) return;
    
    mainNav.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', '메뉴 열기');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Navigation initialization function (called after dynamic header load)
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mainNav = document.getElementById('mainNav');
            if (mainNav && mainNav.classList.contains('active')) {
                closeMenu();
            }
        }
    });
    
    // Mobile dropdown toggle
    dropdownItems.forEach(item => {
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

function attachEventListeners() {
    // Tab button clicks
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });
    
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
    
    // Initialize navigation after header is loaded
    initializeNavigation();
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Format number with appropriate precision
function formatNumber(num, decimals = 3) {
    if (isNaN(num)) return '0';
    
    // For very large or very small numbers, use exponential notation
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(2);
    }
    
    // Otherwise use fixed decimal places, removing trailing zeros
    return parseFloat(num.toFixed(decimals)).toString();
}

// ===================================
// START APPLICATION
// ===================================

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for input events (optional, for better performance)
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to input if needed (currently not used, but available)
// elements.inputValue.addEventListener('input', debounce(updateConversion, 100));

// ===================================
// EXPORT FOR TESTING (if needed)
// ===================================

// For potential future testing or module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertValue,
        CONVERSION_DATA
    };
}
