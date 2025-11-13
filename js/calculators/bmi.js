// BMI 계산기
// Body Mass Index 계산 및 비만도 판정

// BMI 분류 (아시아인 기준)
const BMI_CATEGORIES = {
    UNDERWEIGHT: { min: 0, max: 18.5, label: '저체중', class: 'bmi-underweight', color: '#74c0fc' },
    NORMAL: { min: 18.5, max: 23.0, label: '정상', class: 'bmi-normal', color: '#51cf66' },
    OVERWEIGHT: { min: 23.0, max: 25.0, label: '과체중', class: 'bmi-overweight', color: '#ffd43b' },
    OBESE1: { min: 25.0, max: 30.0, label: '비만 1단계', class: 'bmi-obese1', color: '#ff8787' },
    OBESE2: { min: 30.0, max: 999, label: '비만 2단계', class: 'bmi-obese2', color: '#ff6b6b' }
};

// BMI 계산 함수
function calculateBMI(height, weight) {
    if (!height || !weight || height <= 0 || weight <= 0) {
        return null;
    }
    
    // 키를 미터로 변환
    const heightInMeters = height / 100;
    
    // BMI = 체중(kg) / 키(m)²
    const bmi = weight / (heightInMeters * heightInMeters);
    
    return Math.round(bmi * 10) / 10; // 소수점 첫째자리까지
}

// BMI 카테고리 분류
function getBMICategory(bmi) {
    for (const [key, category] of Object.entries(BMI_CATEGORIES)) {
        if (bmi >= category.min && bmi < category.max) {
            return category;
        }
    }
    return BMI_CATEGORIES.OBESE2; // 기본값
}

// 이상적인 체중 범위 계산
function getIdealWeightRange(height) {
    if (!height || height <= 0) return null;
    
    const heightInMeters = height / 100;
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 22.9 * heightInMeters * heightInMeters;
    
    return {
        min: Math.round(minWeight * 10) / 10,
        max: Math.round(maxWeight * 10) / 10
    };
}

// BMI 계산 및 결과 표시
function performBMICalculation() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiValueElement = document.getElementById('bmiValue');
    const bmiCategoryElement = document.getElementById('bmiCategory');
    
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    
    // 입력값 검증
    if (!height || !weight) {
        bmiValueElement.textContent = '0.0';
        bmiCategoryElement.innerHTML = '키와 체중을 입력하세요';
        bmiCategoryElement.className = 'bmi-category';
        return;
    }
    
    if (height < 50 || height > 250) {
        bmiCategoryElement.innerHTML = '올바른 키를 입력하세요 (50-250cm)';
        bmiCategoryElement.className = 'bmi-category error';
        return;
    }
    
    if (weight < 10 || weight > 300) {
        bmiCategoryElement.innerHTML = '올바른 체중을 입력하세요 (10-300kg)';
        bmiCategoryElement.className = 'bmi-category error';
        return;
    }
    
    // BMI 계산
    const bmi = calculateBMI(height, weight);
    const category = getBMICategory(bmi);
    const idealWeight = getIdealWeightRange(height);
    
    // 결과 표시
    bmiValueElement.textContent = bmi.toString();
    
    // BMI 카테고리 및 추가 정보 표시
    let categoryHTML = `
        <div class="bmi-status ${category.class}">
            <span class="status-label">${category.label}</span>
        </div>
    `;
    
    if (idealWeight) {
        categoryHTML += `
            <div class="bmi-info">
                <p>이상적인 체중 범위: ${idealWeight.min}kg - ${idealWeight.max}kg</p>
        `;
        
        // 현재 체중과 이상 체중 비교
        if (bmi < 18.5) {
            const weightToGain = idealWeight.min - weight;
            categoryHTML += `<p class="advice">💡 ${Math.abs(weightToGain).toFixed(1)}kg 정도 체중 증가를 권장합니다.</p>`;
        } else if (bmi > 22.9) {
            const weightToLose = weight - idealWeight.max;
            categoryHTML += `<p class="advice">💡 ${Math.abs(weightToLose).toFixed(1)}kg 정도 체중 감량을 권장합니다.</p>`;
        } else {
            categoryHTML += `<p class="advice">✅ 건강한 체중을 유지하고 계십니다!</p>`;
        }
        
        categoryHTML += `</div>`;
    }
    
    bmiCategoryElement.innerHTML = categoryHTML;
    bmiCategoryElement.className = `bmi-category ${category.class}`;
    
    // BMI 테이블에서 해당 범위 하이라이트
    highlightBMIRange(category.class);
}

// BMI 테이블에서 해당 범위 하이라이트
function highlightBMIRange(categoryClass) {
    // 기존 하이라이트 제거
    document.querySelectorAll('.bmi-row').forEach(row => {
        row.classList.remove('active');
    });
    
    // 해당 범위 하이라이트
    const targetRow = document.querySelector(`.${categoryClass}`);
    if (targetRow) {
        targetRow.classList.add('active');
    }
}

// 입력값 실시간 검증
function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (value < min || value > max) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 실시간 계산
    heightInput.addEventListener('input', function() {
        validateInput(this);
        if (heightInput.value && weightInput.value) {
            performBMICalculation();
        }
    });
    
    weightInput.addEventListener('input', function() {
        validateInput(this);
        if (heightInput.value && weightInput.value) {
            performBMICalculation();
        }
    });
    
    // 계산 버튼
    calculateBtn.addEventListener('click', performBMICalculation);
    
    // Enter 키 지원
    [heightInput, weightInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performBMICalculation();
            }
        });
    });
});