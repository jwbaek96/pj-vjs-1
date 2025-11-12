// 급여 계산기
// 세전 급여로 4대보험 및 세금 공제 후 실수령액 계산

// 2024년 기준 요율
const RATES = {
    nationalPension: 0.045,      // 국민연금 4.5%
    healthInsurance: 0.03545,    // 건강보험 3.545%
    longTermCare: 0.1295,        // 장기요양 12.95% (건강보험의)
    employmentInsurance: 0.009   // 고용보험 0.9%
};

// 간이세액표 (간단 버전 - 부양가족 1명 기준)
const TAX_TABLE = [
    { min: 0, max: 1060000, rate: 0, deduction: 0 },
    { min: 1060000, max: 2100000, rate: 0.04, deduction: 42400 },
    { min: 2100000, max: 3160000, rate: 0.05, deduction: 63400 },
    { min: 3160000, max: 5000000, rate: 0.07, deduction: 126600 },
    { min: 5000000, max: 10000000, rate: 0.10, deduction: 276600 },
    { min: 10000000, max: Infinity, rate: 0.15, deduction: 776600 }
];

// 숫자 포맷팅 함수
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
}

// 간이세액 계산 함수
function calculateIncomeTax(monthlySalary, dependents) {
    // 부양가족 수에 따른 공제 (간단 버전)
    const deduction = (dependents - 1) * 150000;
    const taxableIncome = Math.max(0, monthlySalary - deduction);
    
    // 세액 구간 찾기
    let tax = 0;
    for (const bracket of TAX_TABLE) {
        if (taxableIncome >= bracket.min && taxableIncome < bracket.max) {
            tax = taxableIncome * bracket.rate - bracket.deduction;
            break;
        }
    }
    
    return Math.max(0, tax);
}

// 급여 계산 함수
function calculateSalary() {
    const salaryType = document.getElementById('salaryType').value;
    const grossSalary = parseFloat(document.getElementById('grossSalary').value) || 0;
    const dependents = parseInt(document.getElementById('dependents').value) || 1;
    
    // 월급으로 환산
    let monthlySalary = grossSalary;
    if (salaryType === 'yearly') {
        monthlySalary = grossSalary / 12;
    }
    
    if (monthlySalary === 0) {
        // 모든 결과를 0으로
        document.getElementById('nationalPension').textContent = '0원';
        document.getElementById('healthInsurance').textContent = '0원';
        document.getElementById('longTermCare').textContent = '0원';
        document.getElementById('employmentInsurance').textContent = '0원';
        document.getElementById('incomeTax').textContent = '0원';
        document.getElementById('localTax').textContent = '0원';
        document.getElementById('totalDeduction').textContent = '0원';
        document.getElementById('netSalary').textContent = '0원';
        return;
    }
    
    // 4대보험 계산
    const nationalPension = Math.min(monthlySalary * RATES.nationalPension, 248850); // 상한액
    const healthInsurance = monthlySalary * RATES.healthInsurance;
    const longTermCare = healthInsurance * RATES.longTermCare;
    const employmentInsurance = monthlySalary * RATES.employmentInsurance;
    
    // 소득세 및 지방소득세 계산
    const incomeTax = calculateIncomeTax(monthlySalary, dependents);
    const localTax = incomeTax * 0.1;
    
    // 총 공제액 및 실수령액
    const totalDeduction = nationalPension + healthInsurance + longTermCare + 
                          employmentInsurance + incomeTax + localTax;
    const netSalary = monthlySalary - totalDeduction;
    
    // 결과 표시
    document.getElementById('nationalPension').textContent = formatNumber(nationalPension) + '원';
    document.getElementById('healthInsurance').textContent = formatNumber(healthInsurance) + '원';
    document.getElementById('longTermCare').textContent = formatNumber(longTermCare) + '원';
    document.getElementById('employmentInsurance').textContent = formatNumber(employmentInsurance) + '원';
    document.getElementById('incomeTax').textContent = formatNumber(incomeTax) + '원';
    document.getElementById('localTax').textContent = formatNumber(localTax) + '원';
    document.getElementById('totalDeduction').textContent = formatNumber(totalDeduction) + '원';
    document.getElementById('netSalary').textContent = formatNumber(netSalary) + '원';
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const salaryType = document.getElementById('salaryType');
    const grossSalary = document.getElementById('grossSalary');
    const dependents = document.getElementById('dependents');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 급여 유형 변경 시
    salaryType.addEventListener('change', function() {
        if (this.value === 'yearly') {
            grossSalary.placeholder = '연봉 입력';
            grossSalary.value = '36000000';
        } else {
            grossSalary.placeholder = '월급 입력';
            grossSalary.value = '3000000';
        }
        calculateSalary();
    });
    
    // 입력 변경 시 자동 계산
    grossSalary.addEventListener('input', calculateSalary);
    dependents.addEventListener('input', calculateSalary);
    
    // 계산 버튼
    calculateBtn.addEventListener('click', calculateSalary);
    
    // 초기 계산
    calculateSalary();
});
