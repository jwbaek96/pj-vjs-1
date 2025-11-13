// 블로그용 동적 컴포넌트 로더
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

// 블로그 페이지용 루트 경로 계산 (항상 한 단계 상위)
function getRootPath() {
    return '../';
}

// 현재 페이지에 맞게 active 클래스 추가
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkText = link.textContent.trim();
        
        // 블로그 페이지들 (/blog/ 경로에 있는 경우)
        if (currentPath.includes('/blog/') && linkText === '블로그') {
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
    
    // 헤더와 푸터가 로드된 후 active 클래스 설정
    setActiveNavLink();
    
    // 모바일 메뉴 토글 기능 초기화
    initializeMobileMenu();
});

// 모바일 메뉴 토글 기능
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            
            // 햄버거 아이콘 애니메이션
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
        
        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });
    }
    
    // 드롭다운 메뉴 토글 (모바일)
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.nextElementSibling;
            if (dropdown && dropdown.classList.contains('mobile-dropdown-menu')) {
                dropdown.classList.toggle('active');
                
                // 아이콘 회전
                const icon = toggle.querySelector('.dropdown-icon');
                if (icon) {
                    icon.style.transform = dropdown.classList.contains('active') 
                        ? 'rotate(180deg)' 
                        : 'rotate(0deg)';
                }
            }
        });
    });
}