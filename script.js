// 전역 변수로 파싱된 차량 정보 저장
let parsedVehicles = [];

// 담당 팀 옵션
const teamOptions = ['연출팀', '작가팀', '카메라팀', '동시팀', '거치팀', '폴캠팀'];

// 호차 드롭다운 옵션
const hochaOptions = Array.from({ length: 20 }, (_, i) => `${i + 1}호차`);

// 차량 정보 파싱 함수
function parseCarInfo(text) {
    const carInfoList = [];
    const lines = text.split('\n');

    // 이름(2-3글자), 전화번호, 차량번호 추출
    const regex = /^([가-힣]{2,3})\s+(\d{3}[-\s]?\d{4}[-\s]?\d{4})\s+차번(\d{2,3}[가-힣]\d{4})/;

    lines.forEach(line => {
        const match = line.match(regex);

        if (match) {
            carInfoList.push({
                name: match[1],
                phone: match[2].replace(/[-\s]/g, '-'),
                carNumber: match[3],
                vehicleNumber: null,
                team: null
            });
        }
    });

    return carInfoList;
}

// 드롭다운 생성 함수
function createDropdown(options, selectedValue = null, onChangeCallback = null) {
    const select = document.createElement('select');
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === selectedValue) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });
    if (onChangeCallback) {
        select.addEventListener('change', onChangeCallback);
    }
    return select;
}

// 테이블 생성 함수
function createTable() {
    const resultBody = document.getElementById('resultBody');

    // 테이블 초기화
    resultBody.innerHTML = '';

    parsedVehicles.forEach((vehicle, index) => {
        const row = document.createElement('tr');

        // 호차 셀
        const hochaCell = document.createElement('td');
        const hochaDropdown = createDropdown(
            hochaOptions,
            vehicle.vehicleNumber,
            e => {
                vehicle.vehicleNumber = e.target.value;
            }
        );
        hochaCell.appendChild(hochaDropdown);
        row.appendChild(hochaCell);

        // 이름 셀
        const nameCell = document.createElement('td');
        nameCell.textContent = vehicle.name;
        row.appendChild(nameCell);

        // 번호 셀
        const phoneCell = document.createElement('td');
        phoneCell.textContent = vehicle.phone;
        row.appendChild(phoneCell);

        // 차량번호 셀
        const carNumberCell = document.createElement('td');
        carNumberCell.textContent = vehicle.carNumber;
        row.appendChild(carNumberCell);

        // 팀 선택 셀
        const teamCell = document.createElement('td');
        const teamDropdown = createDropdown(
            teamOptions,
            vehicle.team,
            e => {
                vehicle.team = e.target.value;
            }
        );
        teamCell.appendChild(teamDropdown);
        row.appendChild(teamCell);

        resultBody.appendChild(row);
    });
}

// 정렬 및 완료 함수
function finalizeTable() {
    // 호차 기준 정렬
    parsedVehicles.sort((a, b) => {
        const hochaA = hochaOptions.indexOf(a.vehicleNumber);
        const hochaB = hochaOptions.indexOf(b.vehicleNumber);
        return hochaA - hochaB;
    });

    // 정렬된 데이터로 테이블 재생성
    createTable();

    // 사용자에게 알림
    alert('테이블이 정렬되었습니다.');
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const createTableButton = document.getElementById('createTableButton');
    const sortButton = document.getElementById('sortButton');

    // 테이블 생성 버튼 클릭 이벤트
    createTableButton.addEventListener('click', () => {
        parsedVehicles = parseCarInfo(inputText.value);
        createTable();
    });

    // 정렬 버튼 클릭 이벤트
    sortButton.addEventListener('click', finalizeTable);
});
