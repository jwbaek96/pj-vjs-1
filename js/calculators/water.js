// 물 섭취량 계산기
// 체중, 활동량, 환경 조건을 고려한 개인별 수분 필요량 계산

// 활동 수준별 계수
const ACTIVITY_MULTIPLIERS = {
    low: 30,      // 낮은 활동 - 체중 1kg당 30ml
    moderate: 33, // 보통 활동 - 체중 1kg당 33ml  
    high: 36,     // 높은 활동 - 체중 1kg당 36ml
    intense: 40   // 매우 높은 활동 - 체중 1kg당 40ml
};

// 기후/환경별 추가 계수
const CLIMATE_MULTIPLIERS = {
    cool: 1.0,     // 시원한 날씨
    moderate: 1.1, // 보통 날씨
    warm: 1.2,     // 따뜻한 날씨
    hot: 1.4       // 더운 날씨
};

// 활동 수준 설명
const ACTIVITY_DESCRIPTIONS = {
    low: '낮음 (사무직, 집에서 휴식)',
    moderate: '보통 (일상적인 활동)',
    high: '높음 (규칙적인 운동)',
    intense: '매우 높음 (격한 운동, 육체 노동)'
};

// 기후 설명
const CLIMATE_DESCRIPTIONS = {
    cool: '시원함 (20°C 이하)',
    moderate: '보통 (20-25°C)',
    warm: '따뜻함 (25-30°C)',
    hot: '더움 (30°C 이상)'
};

// 기본 수분 필요량 계산
function calculateBaseWaterIntake(weight, activityLevel) {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
    return (weight * multiplier) / 1000; // 리터 단위로 변환
}

// 환경 조건에 따른 추가 수분량 계산
function adjustForClimate(baseAmount, climate) {
    const multiplier = CLIMATE_MULTIPLIERS[climate];
    return baseAmount * multiplier;
}

// 운동으로 인한 추가 수분량 계산
function calculateExerciseWaterIntake(exerciseMinutes) {
    // 운동 1시간당 500-750ml 추가, 평균 625ml 사용
    return (exerciseMinutes / 60) * 0.625; // 리터 단위
}

// 음식에서 얻는 수분량 계산 (총 수분량의 약 20%)
function calculateFoodWaterIntake(totalWater) {
    return totalWater * 0.2;
}

// 실제 마셔야 할 물의 양 계산
function calculateDrinkingWater(totalWater, foodWater) {
    return totalWater - foodWater;
}

// 컵 단위로 변환 (1컵 = 약 200ml)
function convertToCups(liters) {
    return Math.round((liters * 1000) / 200);
}

// 숫자 포맷팅
function formatLiters(liters) {
    return Math.round(liters * 10) / 10; // 소수점 첫째자리
}

// 수분 섭취 팁 생성
function generateWaterTips(totalWater, drinkingWater, activityLevel, climate) {
    const cups = convertToCups(drinkingWater);
    let tips = [];
    
    // 기본 팁
    tips.push(`하루에 물 ${cups}컵 (약 ${formatLiters(drinkingWater)}L)을 마시세요`);
    
    // 활동량별 팁
    if (activityLevel === 'intense') {
        tips.push('💪 격한 운동을 하시니 운동 전후로 충분한 수분 보충을 잊지 마세요');
    } else if (activityLevel === 'high') {
        tips.push('🏃‍♂️ 규칙적인 운동 시 운동 30분 전후로 물을 마시세요');
    }
    
    // 날씨별 팁
    if (climate === 'hot') {
        tips.push('🌡️ 더운 날씨에는 갈증을 느끼기 전에 미리 수분을 보충하세요');
        tips.push('🧊 차가운 물이나 얼음물로 체온을 낮추는 것도 도움이 됩니다');
    } else if (climate === 'warm') {
        tips.push('☀️ 따뜻한 날씨에는 평소보다 자주 물을 마시세요');
    }
    
    // 일반적인 팁
    tips.push('⏰ 2-3시간마다 규칙적으로 물을 마시는 습관을 기르세요');
    tips.push('📱 수분 섭취 알림 앱을 활용해보세요');
    
    if (totalWater > 3.5) {
        tips.push('⚠️ 수분량이 많으니 한 번에 많이 마시지 말고 조금씩 나누어 드세요');
    }
    
    return tips;
}

// 물 섭취량 계산 및 결과 표시
function performWaterCalculation() {
    const weight = parseFloat(document.getElementById('weight').value);
    const activity = document.getElementById('activity').value;
    const climate = document.getElementById('climate').value;
    const exercise = parseInt(document.getElementById('exercise').value) || 0;
    
    const waterAmountElement = document.getElementById('waterAmount');
    const plainWaterElement = document.getElementById('plainWater');
    const foodWaterElement = document.getElementById('foodWater');
    const waterTipsElement = document.getElementById('waterTips');
    
    // 입력값 검증
    if (!weight) {
        waterAmountElement.textContent = '0.0';
        plainWaterElement.textContent = '0L';
        foodWaterElement.textContent = '0L';
        waterTipsElement.innerHTML = '<p class="error">체중을 입력해주세요</p>';
        return;
    }
    
    if (weight < 30 || weight > 200) {
        waterTipsElement.innerHTML = '<p class="error">올바른 체중을 입력하세요 (30-200kg)</p>';
        return;
    }
    
    if (exercise > 480) {
        waterTipsElement.innerHTML = '<p class="error">운동 시간은 하루 8시간을 넘을 수 없습니다</p>';
        return;
    }
    
    // 수분량 계산
    const baseWater = calculateBaseWaterIntake(weight, activity);
    const climateAdjustedWater = adjustForClimate(baseWater, climate);
    const exerciseWater = calculateExerciseWaterIntake(exercise);
    const totalWater = climateAdjustedWater + exerciseWater;
    
    const foodWater = calculateFoodWaterIntake(totalWater);
    const drinkingWater = calculateDrinkingWater(totalWater, foodWater);
    
    // 결과 표시
    waterAmountElement.textContent = formatLiters(totalWater);
    plainWaterElement.textContent = formatLiters(drinkingWater) + 'L';
    foodWaterElement.textContent = formatLiters(foodWater) + 'L';
    
    // 팁 생성 및 표시
    const tips = generateWaterTips(totalWater, drinkingWater, activity, climate);
    let tipsHTML = '<h4>💡 개인 맞춤 수분 섭취 팁</h4><ul>';
    tips.forEach(tip => {
        tipsHTML += `<li>${tip}</li>`;
    });
    tipsHTML += '</ul>';
    
    // 추가 정보
    tipsHTML += '<div class="calculation-info">';
    tipsHTML += `<p><strong>계산 근거:</strong></p>`;
    tipsHTML += `<p>• 기본량: ${formatLiters(baseWater)}L (${ACTIVITY_DESCRIPTIONS[activity]})</p>`;
    tipsHTML += `<p>• 환경 조정: ${formatLiters(climateAdjustedWater)}L (${CLIMATE_DESCRIPTIONS[climate]})</p>`;
    if (exercise > 0) {
        tipsHTML += `<p>• 운동 추가: +${formatLiters(exerciseWater)}L (${exercise}분 운동)</p>`;
    }
    tipsHTML += '</div>';
    
    waterTipsElement.innerHTML = tipsHTML;
}

// 입력값 실시간 검증
function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (isNaN(value) || value < min || value > max) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('weight');
    const activitySelect = document.getElementById('activity');
    const climateSelect = document.getElementById('climate');
    const exerciseInput = document.getElementById('exercise');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // 실시간 계산
    [weightInput, activitySelect, climateSelect, exerciseInput].forEach(input => {
        input.addEventListener('change', function() {
            if (this.type === 'number') {
                validateInput(this);
            }
            
            // 체중이 입력되었을 때만 자동 계산
            if (weightInput.value) {
                performWaterCalculation();
            }
        });
        
        if (input.type === 'number') {
            input.addEventListener('input', function() {
                validateInput(this);
            });
        }
    });
    
    // 계산 버튼
    calculateBtn.addEventListener('click', performWaterCalculation);
    
    // Enter 키 지원
    [weightInput, exerciseInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performWaterCalculation();
            }
        });
    });
});