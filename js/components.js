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
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
        // 블로그 페이지들은 blog.html 또는 blog/index.html을 active로 표시
        if ((currentPage.startsWith('blog-') || window.location.pathname.includes('/blog/')) 
            && (href === 'blog.html' || href === 'blog/index.html' || href === '../blog/index.html')) {
            link.classList.add('active');
        }
        // 변환기 페이지들은 단위 변환기를 active로 표시
        const converterPages = ['length.html', 'weight.html', 'temperature.html', 'acceleration.html', 
                                'angle.html', 'data.html', 'volume.html', 'speed.html', 'time.html', 
                                'pressure.html', 'energy.html', 'power.html', 'area.html', 'torque.html', 
                                'currency.html', 'force.html'];
        if (converterPages.includes(currentPage) && link.textContent.trim() === '단위 변환기') {
            link.classList.add('active');
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
    
    // 헤더와 푸터가 로드된 후 active 클래스 설정
    setActiveNavLink();
    
    // 헤더가 로드된 후 기존 script.js의 이벤트 리스너 초기화
    // script.js가 이미 로드되어 있다면 재실행
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
});
