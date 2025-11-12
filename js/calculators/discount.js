// 할인 계산기
// 원가와 할인율로 최종 가격 계산

// 숫자 포맷팅 함수
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
}

// 할인 계산 함수
function calculateDiscount() {
    const originalPrice = parseFloat(document.getElementById('originalPrice').value) || 0;
    const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;
    
    if (originalPrice === 0) {
        document.getElementById('discountAmount').textContent = '0원';
        document.getElementById('finalPrice').textContent = '0원';
        return;
    }
    
    // 할인 금액 계산
    const discountAmount = originalPrice * (discountRate / 100);
    const finalPrice = originalPrice - discountAmount;
    
    // 결과 표시
    document.getElementById('discountAmount').textContent = formatNumber(discountAmount) + '원';
    document.getElementById('finalPrice').textContent = formatNumber(finalPrice) + '원';
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const originalPrice = document.getElementById('originalPrice');
    const discountRate = document.getElementById('discountRate');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 입력 변경 시 자동 계산
    originalPrice.addEventListener('input', calculateDiscount);
    discountRate.addEventListener('input', calculateDiscount);
    
    // 계산 버튼
    calculateBtn.addEventListener('click', calculateDiscount);
    
    // 초기 계산
    calculateDiscount();
});
