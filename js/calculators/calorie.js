// 칼로리 계산기
// 기초대사율(BMR)과 일일 총 에너지 소모량(TDEE) 계산

// 활동 수준별 계수
const ACTIVITY_LEVELS = {
    1.2: '비활동적 (운동 거의 안함)',
    1.375: '가벼운 활동 (주 1-3회 운동)',
    1.55: '보통 활동 (주 3-5회 운동)',
    1.725: '활발한 활동 (주 6-7회 운동)',
    1.9: '매우 활발 (하루 2회 운동 또는 격한 운동)'
};

// Harris-Benedict 수정 공식으로 기초대사율 계산
function calculateBMR(gender, age, height, weight) {
    if (gender === 'male') {
        // 남성: BMR = 88.362 + (13.397 × 체중) + (4.799 × 키) - (5.677 × 나이)
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        // 여성: BMR = 447.593 + (9.247 × 체중) + (3.098 × 키) - (4.330 × 나이)
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
}

// 일일 총 에너지 소모량(TDEE) 계산
function calculateTDEE(bmr, activityLevel) {
    return bmr * parseFloat(activityLevel);
}

// 체중 목표별 칼로리 계산
function calculateGoalCalories(tdee) {
    return {
        maintain: Math.round(tdee), // 체중 유지
        lose: Math.round(tdee - 500), // 체중 감량 (주당 0.5kg)
        gain: Math.round(tdee + 500), // 체중 증량 (주당 0.5kg)
        fastLose: Math.round(tdee - 1000) // 빠른 감량 (주당 1kg)
    };
}

// 숫자 포맷팅
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
}

// 칼로리 계산 및 결과 표시
function performCalorieCalculation() {
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseInt(document.getElementById('height').value);
    const weight = parseInt(document.getElementById('weight').value);
    const activity = document.getElementById('activity').value;
    
    const bmrElement = document.getElementById('bmrValue');
    const tdeeElement = document.getElementById('tdeeValue');
    const breakdownElement = document.getElementById('calorieBreakdown');
    
    // 입력값 검증
    if (!age || !height || !weight) {
        bmrElement.textContent = '0';
        tdeeElement.textContent = '0';
        breakdownElement.innerHTML = '<p class="error">모든 정보를 입력해주세요</p>';
        return;
    }
    
    if (age < 10 || age > 100) {
        breakdownElement.innerHTML = '<p class="error">올바른 나이를 입력하세요 (10-100세)</p>';
        return;
    }
    
    if (height < 100 || height > 250) {
        breakdownElement.innerHTML = '<p class="error">올바른 키를 입력하세요 (100-250cm)</p>';
        return;
    }
    
    if (weight < 30 || weight > 200) {
        breakdownElement.innerHTML = '<p class="error">올바른 체중을 입력하세요 (30-200kg)</p>';
        return;
    }
    
    // BMR 계산
    const bmr = calculateBMR(gender, age, height, weight);
    const tdee = calculateTDEE(bmr, activity);
    const goalCalories = calculateGoalCalories(tdee);
    
    // 결과 표시
    bmrElement.textContent = formatNumber(bmr);
    tdeeElement.textContent = formatNumber(tdee);
    
    // 목표별 칼로리 표시
    const activityLabel = ACTIVITY_LEVELS[parseFloat(activity)];
    
    let breakdownHTML = `
        <div class="activity-info">
            <h4>선택한 활동 수준</h4>
            <p>${activityLabel}</p>
        </div>
        
        <div class="goal-calories">
            <h4>목표별 권장 칼로리</h4>
            <div class="goal-grid">
                <div class="goal-item maintain">
                    <span class="goal-label">체중 유지</span>
                    <span class="goal-value">${formatNumber(goalCalories.maintain)} kcal</span>
                </div>
                <div class="goal-item lose">
                    <span class="goal-label">체중 감량 (주 0.5kg)</span>
                    <span class="goal-value">${formatNumber(goalCalories.lose)} kcal</span>
                </div>
                <div class="goal-item gain">
                    <span class="goal-label">체중 증량 (주 0.5kg)</span>
                    <span class="goal-value">${formatNumber(goalCalories.gain)} kcal</span>
                </div>
            </div>
        </div>
        
        <div class="macro-info">
            <h4>권장 영양소 비율</h4>
            <div class="macro-grid">
                <div class="macro-item">
                    <span class="macro-label">탄수화물</span>
                    <span class="macro-percent">45-65%</span>
                    <span class="macro-calories">${Math.round(goalCalories.maintain * 0.5 / 4)}g</span>
                </div>
                <div class="macro-item">
                    <span class="macro-label">단백질</span>
                    <span class="macro-percent">10-35%</span>
                    <span class="macro-calories">${Math.round(goalCalories.maintain * 0.2 / 4)}g</span>
                </div>
                <div class="macro-item">
                    <span class="macro-label">지방</span>
                    <span class="macro-percent">20-35%</span>
                    <span class="macro-calories">${Math.round(goalCalories.maintain * 0.25 / 9)}g</span>
                </div>
            </div>
        </div>
    `;
    
    breakdownElement.innerHTML = breakdownHTML;
}

// 입력값 실시간 검증
function validateInput(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    
    if (isNaN(value) || value < min || value > max) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const genderSelect = document.getElementById('gender');
    const ageInput = document.getElementById('age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const activitySelect = document.getElementById('activity');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 실시간 계산
    [genderSelect, ageInput, heightInput, weightInput, activitySelect].forEach(input => {
        input.addEventListener('change', function() {
            if (this.type === 'number') {
                validateInput(this);
            }
            
            // 모든 필드가 채워졌을 때만 자동 계산
            if (genderSelect.value && ageInput.value && heightInput.value && 
                weightInput.value && activitySelect.value) {
                performCalorieCalculation();
            }
        });
        
        if (input.type === 'number') {
            input.addEventListener('input', function() {
                validateInput(this);
            });
        }
    });
    
    // 계산 버튼
    calculateBtn.addEventListener('click', performCalorieCalculation);
    
    // Enter 키 지원
    [ageInput, heightInput, weightInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performCalorieCalculation();
            }
        });
    });
});