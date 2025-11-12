// 환율 계산기
// 주요 통화 간 환율 변환

// 2024년 기준 KRW 대비 환율 (참고용)
const exchangeRates = {
    KRW: { KRW: 1, USD: 0.00074, EUR: 0.00068, JPY: 0.11, CNY: 0.0053, GBP: 0.00059 },
    USD: { KRW: 1350, USD: 1, EUR: 0.92, JPY: 149, CNY: 7.2, GBP: 0.79 },
    EUR: { KRW: 1470, USD: 1.09, EUR: 1, JPY: 162, CNY: 7.85, GBP: 0.86 },
    JPY: { KRW: 9.1, USD: 0.0067, EUR: 0.0062, JPY: 1, CNY: 0.048, GBP: 0.0053 },
    CNY: { KRW: 189, USD: 0.14, EUR: 0.13, JPY: 20.8, CNY: 1, GBP: 0.11 },
    GBP: { KRW: 1700, USD: 1.26, EUR: 1.16, JPY: 188, CNY: 9.1, GBP: 1 }
};

// 숫자 포맷팅 함수
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

// 환율 계산 함수
function calculateExchange() {
    const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (fromAmount === 0) {
        document.getElementById('toAmount').textContent = '0.00';
        document.getElementById('resultText').textContent = '금액을 입력하세요';
        return;
    }
    
    // 환율 계산
    const rate = exchangeRates[fromCurrency][toCurrency];
    const result = fromAmount * rate;
    
    // 결과 표시
    document.getElementById('toAmount').textContent = formatNumber(result);
    document.getElementById('resultText').textContent = 
        `${formatNumber(fromAmount)} ${fromCurrency} = ${formatNumber(result)} ${toCurrency}`;
}

// 통화 교환 함수
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    calculateExchange();
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const fromAmount = document.getElementById('fromAmount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 입력 변경 시 자동 계산
    fromAmount.addEventListener('input', calculateExchange);
    fromCurrency.addEventListener('change', calculateExchange);
    toCurrency.addEventListener('change', calculateExchange);
    
    // 교환 버튼
    swapBtn.addEventListener('click', swapCurrencies);
    
    // 계산 버튼
    calculateBtn.addEventListener('click', calculateExchange);
    
    // 초기 계산
    calculateExchange();
});
