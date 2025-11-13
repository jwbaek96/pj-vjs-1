// 환율 계산기
// 주요 통화 간 환율 변환 (실시간 API 사용)

// 환율 데이터 저장
let exchangeRates = null;
let lastUpdated = null;

// 실시간 환율 가져오기 (ExchangeRate-API 무료 사용)
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://open.exchangerate-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
            exchangeRates = data.rates;
            lastUpdated = new Date(data.time_last_update_utc);
            updateLastUpdatedText();
            return true;
        }
    } catch (error) {
        console.error('환율 정보를 가져오는데 실패했습니다:', error);
        // 실패 시 기본 환율 사용
        useFallbackRates();
    }
    return false;
}

// API 실패 시 기본 환율 사용
function useFallbackRates() {
    exchangeRates = {
        KRW: 1350,
        USD: 1,
        EUR: 0.92,
        JPY: 149,
        CNY: 7.2,
        GBP: 0.79
    };
    lastUpdated = null;
}

// 마지막 업데이트 시간 표시
function updateLastUpdatedText() {
    const infoText = document.querySelector('.calc-info-text');
    if (infoText && lastUpdated) {
        const timeStr = lastUpdated.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        infoText.textContent = `※ 실시간 환율 (마지막 업데이트: ${timeStr})`;
    }
}

// 숫자 포맷팅 함수
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

// 환율 계산 함수
function calculateExchange() {
    if (!exchangeRates) {
        document.getElementById('resultText').textContent = '환율 정보를 불러오는 중...';
        return;
    }
    
    const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (fromAmount === 0) {
        document.getElementById('toAmount').textContent = '0.00';
        document.getElementById('resultText').textContent = '금액을 입력하세요';
        return;
    }
    
    // USD 기준으로 환율 계산
    // fromCurrency -> USD -> toCurrency
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    
    let result;
    if (fromCurrency === 'USD') {
        result = fromAmount * toRate;
    } else if (toCurrency === 'USD') {
        result = fromAmount / fromRate;
    } else {
        // 다른 통화 간 변환: from -> USD -> to
        const usdAmount = fromAmount / fromRate;
        result = usdAmount * toRate;
    }
    
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
document.addEventListener('DOMContentLoaded', async function() {
    const fromAmount = document.getElementById('fromAmount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 실시간 환율 가져오기
    await fetchExchangeRates();
    
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
