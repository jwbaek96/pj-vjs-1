// 팁 계산기
// 식사 금액, 팁 비율, 인원 수로 총액 계산

// 숫자 포맷팅 함수
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
}

// 팁 계산 함수
function calculateTip() {
    const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
    const tipRate = parseFloat(document.getElementById('tipRate').value) || 0;
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;
    
    if (billAmount === 0) {
        document.getElementById('tipAmount').textContent = '0원';
        document.getElementById('totalAmount').textContent = '0원';
        document.getElementById('perPerson').textContent = '0원';
        return;
    }
    
    // 팁 계산
    const tipAmount = billAmount * (tipRate / 100);
    const totalAmount = billAmount + tipAmount;
    const perPerson = totalAmount / numPeople;
    
    // 결과 표시
    document.getElementById('tipAmount').textContent = formatNumber(tipAmount) + '원';
    document.getElementById('totalAmount').textContent = formatNumber(totalAmount) + '원';
    document.getElementById('perPerson').textContent = formatNumber(perPerson) + '원';
}

// 프리셋 팁 비율 설정
function setTipPreset(rate) {
    document.getElementById('tipRate').value = rate;
    
    // 활성 버튼 표시
    document.querySelectorAll('.tip-preset-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    calculateTip();
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const billAmount = document.getElementById('billAmount');
    const tipRate = document.getElementById('tipRate');
    const numPeople = document.getElementById('numPeople');
    const calculateBtn = document.getElementById('calculateBtn');
    const presetBtns = document.querySelectorAll('.tip-preset-btn');
    
    // 입력 변경 시 자동 계산
    billAmount.addEventListener('input', calculateTip);
    tipRate.addEventListener('input', calculateTip);
    numPeople.addEventListener('input', calculateTip);
    
    // 프리셋 버튼
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tipValue = this.getAttribute('data-tip');
            setTipPreset(tipValue);
        });
    });
    
    // 계산 버튼
    calculateBtn.addEventListener('click', calculateTip);
    
    // 초기 계산
    calculateTip();
});
