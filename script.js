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

// 포맷에 맞춰 텍스트 생성 함수
function generateFormattedText(parsedVehicles) {
    // 텍스트의 시작 부분
    let formattedText = `현장에서의 배차 구분을 위해 아래와 같이 임의로 호차를 구분할 예정입니다. 각 기장님들은 호차 확인해주시면 감사하겠습니다!\n\n`;

    // 차량 정보 순회
    parsedVehicles.forEach(vehicle => {
        formattedText += `${vehicle.vehicleNumber}호차\n`;
        formattedText += `[이름] : ${vehicle.name}\n`;
        formattedText += `[차량번호] : ${vehicle.carNumber}\n\n`;
    });

    return formattedText;
}

// 테이블의 데이터로부터 포맷에 맞는 텍스트 생성 및 출력
function createFormattedTextFromTable() {
    const rows = document.querySelectorAll('#resultBody tr');
    const formattedVehicles = [];

    rows.forEach(row => {
        const hocha = row.querySelector('td:nth-child(1) select').value.replace('호차', ''); // 호차 값
        const name = row.querySelector('td:nth-child(2)').textContent.trim();
        const carNumber = row.querySelector('td:nth-child(4)').textContent.trim();

        if (name && carNumber) {
            formattedVehicles.push({
                vehicleNumber: hocha,
                name: name,
                carNumber: carNumber
            });
        }
    });

    // 호차 기준으로 정렬
    formattedVehicles.sort((a, b) => parseInt(a.vehicleNumber) - parseInt(b.vehicleNumber));

    // 포맷에 맞는 텍스트 생성
    const formattedText = generateFormattedText(formattedVehicles);

    // 텍스트 출력 (예: 콘솔 또는 화면 표시)
    console.log(formattedText);
    alert(formattedText); // 또는 원하는 방식으로 표시
}

// 이벤트 리스너에 추가 (예: 버튼 클릭 시 실행)
const exportButton = document.createElement('button');
exportButton.textContent = '텍스트 출력';
document.querySelector('.controls').appendChild(exportButton);

exportButton.addEventListener('click', createFormattedTextFromTable);
