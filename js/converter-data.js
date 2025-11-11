// ===================================
// COMPREHENSIVE CONVERSION DATA
// ===================================

const CONVERSION_DATA = {
    length: {
        name: '길이',
        icon: '📏',
        units: {
            meter: { name: '미터 (m)', toBase: 1 },
            kilometer: { name: '킬로미터 (km)', toBase: 1000 },
            centimeter: { name: '센티미터 (cm)', toBase: 0.01 },
            millimeter: { name: '밀리미터 (mm)', toBase: 0.001 },
            mile: { name: '마일 (mi)', toBase: 1609.344 },
            yard: { name: '야드 (yd)', toBase: 0.9144 },
            foot: { name: '피트 (ft)', toBase: 0.3048 },
            inch: { name: '인치 (in)', toBase: 0.0254 },
            nauticalMile: { name: '해리 (nmi)', toBase: 1852 }
        }
    },
    weight: {
        name: '무게',
        icon: '⚖️',
        units: {
            kilogram: { name: '킬로그램 (kg)', toBase: 1 },
            gram: { name: '그램 (g)', toBase: 0.001 },
            milligram: { name: '밀리그램 (mg)', toBase: 0.000001 },
            ton: { name: '톤 (t)', toBase: 1000 },
            pound: { name: '파운드 (lb)', toBase: 0.453592 },
            ounce: { name: '온스 (oz)', toBase: 0.0283495 },
            stone: { name: '스톤 (st)', toBase: 6.35029 }
        }
    },
    temperature: {
        name: '온도',
        icon: '🌡️',
        units: {
            celsius: { name: '섭씨 (°C)' },
            fahrenheit: { name: '화씨 (°F)' },
            kelvin: { name: '켈빈 (K)' }
        },
        convert: (value, from, to) => {
            let celsius;
            switch(from) {
                case 'celsius': celsius = value; break;
                case 'fahrenheit': celsius = (value - 32) * 5/9; break;
                case 'kelvin': celsius = value - 273.15; break;
                default: return NaN;
            }
            switch(to) {
                case 'celsius': return celsius;
                case 'fahrenheit': return celsius * 9/5 + 32;
                case 'kelvin': return celsius + 273.15;
                default: return NaN;
            }
        }
    },
    acceleration: {
        name: '가속',
        icon: '🚀',
        units: {
            meterPerSecondSquared: { name: '미터/초² (m/s²)', toBase: 1 },
            kilometerPerHourSquared: { name: '킬로미터/시² (km/h²)', toBase: 0.0000771605 },
            footPerSecondSquared: { name: '피트/초² (ft/s²)', toBase: 0.3048 },
            gForce: { name: '중력가속도 (g)', toBase: 9.80665 },
            galileo: { name: '갈릴레오 (Gal)', toBase: 0.01 }
        }
    },
    angle: {
        name: '각도',
        icon: '📐',
        units: {
            degree: { name: '도 (°)', toBase: 1 },
            radian: { name: '라디안 (rad)', toBase: 57.2957795 },
            gradian: { name: '그라디안 (grad)', toBase: 0.9 },
            arcminute: { name: '분 (′)', toBase: 0.0166667 },
            arcsecond: { name: '초 (″)', toBase: 0.000277778 }
        }
    },
    data: {
        name: '데이터 크기',
        icon: '💾',
        units: {
            byte: { name: '바이트 (B)', toBase: 1 },
            kilobyte: { name: '킬로바이트 (KB)', toBase: 1024 },
            megabyte: { name: '메가바이트 (MB)', toBase: 1048576 },
            gigabyte: { name: '기가바이트 (GB)', toBase: 1073741824 },
            terabyte: { name: '테라바이트 (TB)', toBase: 1099511627776 },
            petabyte: { name: '페타바이트 (PB)', toBase: 1125899906842624 },
            bit: { name: '비트 (bit)', toBase: 0.125 },
            kilobit: { name: '킬로비트 (Kbit)', toBase: 128 },
            megabit: { name: '메가비트 (Mbit)', toBase: 131072 },
            gigabit: { name: '기가비트 (Gbit)', toBase: 134217728 }
        }
    },
    volume: {
        name: '부피',
        icon: '📦',
        units: {
            liter: { name: '리터 (L)', toBase: 1 },
            milliliter: { name: '밀리리터 (mL)', toBase: 0.001 },
            cubicMeter: { name: '세제곱미터 (m³)', toBase: 1000 },
            cubicCentimeter: { name: '세제곱센티미터 (cm³)', toBase: 0.001 },
            gallon: { name: '갤런 (gal)', toBase: 3.78541 },
            quart: { name: '쿼트 (qt)', toBase: 0.946353 },
            pint: { name: '파인트 (pt)', toBase: 0.473176 },
            cup: { name: '컵 (cup)', toBase: 0.236588 },
            fluidOunce: { name: '액량온스 (fl oz)', toBase: 0.0295735 },
            tablespoon: { name: '테이블스푼 (Tbsp)', toBase: 0.0147868 },
            teaspoon: { name: '티스푼 (tsp)', toBase: 0.00492892 }
        }
    },
    speed: {
        name: '속도',
        icon: '🚗',
        units: {
            meterPerSecond: { name: '미터/초 (m/s)', toBase: 1 },
            kilometerPerHour: { name: '킬로미터/시 (km/h)', toBase: 0.277778 },
            milePerHour: { name: '마일/시 (mph)', toBase: 0.44704 },
            footPerSecond: { name: '피트/초 (ft/s)', toBase: 0.3048 },
            knot: { name: '노트 (knot)', toBase: 0.514444 },
            mach: { name: '마하 (Mach)', toBase: 343 }
        }
    },
    time: {
        name: '시간',
        icon: '⏰',
        units: {
            second: { name: '초 (s)', toBase: 1 },
            minute: { name: '분 (min)', toBase: 60 },
            hour: { name: '시간 (h)', toBase: 3600 },
            day: { name: '일 (day)', toBase: 86400 },
            week: { name: '주 (week)', toBase: 604800 },
            month: { name: '월 (month)', toBase: 2629746 },
            year: { name: '년 (year)', toBase: 31556952 },
            millisecond: { name: '밀리초 (ms)', toBase: 0.001 },
            microsecond: { name: '마이크로초 (μs)', toBase: 0.000001 },
            nanosecond: { name: '나노초 (ns)', toBase: 0.000000001 }
        }
    },
    pressure: {
        name: '압력',
        icon: '🔧',
        units: {
            pascal: { name: '파스칼 (Pa)', toBase: 1 },
            kilopascal: { name: '킬로파스칼 (kPa)', toBase: 1000 },
            bar: { name: '바 (bar)', toBase: 100000 },
            atmosphere: { name: '기압 (atm)', toBase: 101325 },
            psi: { name: 'PSI (psi)', toBase: 6894.76 },
            torr: { name: '토르 (Torr)', toBase: 133.322 },
            mmHg: { name: '밀리미터 수은주 (mmHg)', toBase: 133.322 }
        }
    },
    energy: {
        name: '에너지',
        icon: '⚡',
        units: {
            joule: { name: '줄 (J)', toBase: 1 },
            kilojoule: { name: '킬로줄 (kJ)', toBase: 1000 },
            calorie: { name: '칼로리 (cal)', toBase: 4.184 },
            kilocalorie: { name: '킬로칼로리 (kcal)', toBase: 4184 },
            wattHour: { name: '와트시 (Wh)', toBase: 3600 },
            kilowattHour: { name: '킬로와트시 (kWh)', toBase: 3600000 },
            electronvolt: { name: '전자볼트 (eV)', toBase: 1.60218e-19 },
            btu: { name: 'BTU (BTU)', toBase: 1055.06 }
        }
    },
    power: {
        name: '전력',
        icon: '⚡',
        units: {
            watt: { name: '와트 (W)', toBase: 1 },
            kilowatt: { name: '킬로와트 (kW)', toBase: 1000 },
            megawatt: { name: '메가와트 (MW)', toBase: 1000000 },
            horsepower: { name: '마력 (hp)', toBase: 745.7 },
            btuPerHour: { name: 'BTU/시 (BTU/h)', toBase: 0.293071 }
        }
    },
    area: {
        name: '면적',
        icon: '🗺️',
        units: {
            squareMeter: { name: '제곱미터 (m²)', toBase: 1 },
            squareKilometer: { name: '제곱킬로미터 (km²)', toBase: 1000000 },
            squareCentimeter: { name: '제곱센티미터 (cm²)', toBase: 0.0001 },
            squareMile: { name: '제곱마일 (mi²)', toBase: 2589988.11 },
            squareYard: { name: '제곱야드 (yd²)', toBase: 0.836127 },
            squareFoot: { name: '제곱피트 (ft²)', toBase: 0.092903 },
            squareInch: { name: '제곱인치 (in²)', toBase: 0.00064516 },
            hectare: { name: '헥타르 (ha)', toBase: 10000 },
            acre: { name: '에이커 (acre)', toBase: 4046.86 },
            pyeong: { name: '평 (평)', toBase: 3.30579 }
        }
    },
    torque: {
        name: '토크',
        icon: '🔩',
        units: {
            newtonMeter: { name: '뉴턴미터 (N⋅m)', toBase: 1 },
            kilogramForceMeter: { name: '킬로그램힘미터 (kgf⋅m)', toBase: 9.80665 },
            poundForceFoot: { name: '파운드힘피트 (lbf⋅ft)', toBase: 1.35582 },
            poundForceInch: { name: '파운드힘인치 (lbf⋅in)', toBase: 0.112985 }
        }
    },
    currency: {
        name: '통화',
        icon: '💲',
        note: '실시간 환율을 사용하려면 API 키가 필요합니다.',
        units: {
            krw: { name: '대한민국 원 (KRW)', toBase: 1 },
            usd: { name: '미국 달러 (USD)', toBase: 1300 },
            eur: { name: '유로 (EUR)', toBase: 1400 },
            jpy: { name: '일본 엔 (JPY)', toBase: 9 },
            cny: { name: '중국 위안 (CNY)', toBase: 180 },
            gbp: { name: '영국 파운드 (GBP)', toBase: 1650 }
        }
    },
    force: {
        name: '힘',
        icon: '🔨',
        units: {
            newton: { name: '뉴턴 (N)', toBase: 1 },
            kilonewton: { name: '킬로뉴턴 (kN)', toBase: 1000 },
            kilogramForce: { name: '킬로그램힘 (kgf)', toBase: 9.80665 },
            poundForce: { name: '파운드힘 (lbf)', toBase: 4.44822 },
            dyne: { name: '다인 (dyn)', toBase: 0.00001 }
        }
    }
};
