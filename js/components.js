// 동적으로 헤더, 푸터, 변환기 템플릿을 로드하는 함수
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading component from ${filePath}:`, error);
    }
}

// 현재 페이지 경로를 기준으로 루트 경로 계산
function getRootPath() {
    const path = window.location.pathname;
    const depth = path.split('/').filter(p => p && p !== 'index.html').length - 1;
    return depth > 0 ? '../'.repeat(depth) : './';
}

// 현재 페이지에 맞게 active 클래스 추가
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkText = link.textContent.trim();
        
        // 홈 페이지
        if (href && href.endsWith('index.html') && currentPage === 'index.html' && !currentPath.includes('/blog/') && !currentPath.includes('/converters/') && !currentPath.includes('/calculators/')) {
            link.classList.add('active');
        }
        
        // 블로그 페이지들
        if ((currentPage.startsWith('blog-') || currentPath.includes('/blog/')) && linkText === '블로그') {
            link.classList.add('active');
        }
        
        // 변환기 페이지들
        const converterPages = ['length.html', 'weight.html', 'temperature.html', 'acceleration.html', 
                                'angle.html', 'data.html', 'volume.html', 'speed.html', 'time.html', 
                                'pressure.html', 'energy.html', 'power.html', 'area.html', 'torque.html', 
                                'currency.html', 'force.html'];
        if ((converterPages.includes(currentPage) || currentPath.includes('/converters/')) && linkText === '단위 변환기') {
            link.classList.add('active');
        }
        
        // 계산기 페이지들
        const calculatorPages = ['exchange-rate.html', 'discount.html', 'tip.html', 'salary.html', 
                                 'bmi.html', 'calorie.html', 'water.html'];
        if ((calculatorPages.includes(currentPage) || currentPath.includes('/calculators/')) && linkText === '계산기') {
            link.classList.add('active');
        }
    });
}

// 헤더 링크 경로 수정 함수
function fixHeaderLinks() {
    const rootPath = getRootPath();
    const headerLinks = document.querySelectorAll('.header a[href]');
    
    headerLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // # 링크는 수정하지 않음
        if (href === '#') return;
        
        // 이미 http로 시작하는 외부 링크는 수정하지 않음
        if (href.startsWith('http')) return;
        
        // 현재 경로가 루트가 아니면 rootPath 추가
        if (rootPath !== './' && !href.startsWith('../') && !href.startsWith('http')) {
            link.setAttribute('href', rootPath + href);
        }
    });
}

// 페이지 로드 시 헤더와 푸터 삽입
document.addEventListener('DOMContentLoaded', async () => {
    const rootPath = getRootPath();
    
    // 헤더와 푸터 로드
    await loadComponent('header-placeholder', rootPath + 'components/header.html');
    await loadComponent('footer-placeholder', rootPath + 'components/footer.html');
    
    // 변환기 템플릿 로드 (있는 경우만)
    const converterPlaceholder = document.getElementById('converter-placeholder');
    if (converterPlaceholder) {
        await loadComponent('converter-placeholder', rootPath + 'components/converter-template.html');
    }
    
    // 헤더 링크 경로 수정
    fixHeaderLinks();
    
    // 헤더와 푸터가 로드된 후 active 클래스 설정
    setActiveNavLink();
    
    // 헤더가 로드된 후 기존 script.js의 이벤트 리스너 초기화
    // script.js가 이미 로드되어 있다면 재실행
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
});
