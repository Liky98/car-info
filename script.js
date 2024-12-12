// 전역 변수로 파싱된 차량 정보 저장
let parsedVehicles = [];

// 담당 팀 옵션
const teamOptions = [
    '연출팀', 
    '작가팀', 
    '카메라팀', 
    '동시팀', 
    '거치팀', 
    '폴캠팀'
];

function parseCarInfo(text) {
    const carInfoList = [];
    const lines = text.split('\n');
    
    // 이름(2-3글자), 전화번호, 차량번호 추출을 위한 정규표현식
    const regex = /^([가-힣]{2,3})\s*(\d{3}\s*\d{4}\s*\d{4})\s*차번(\d{2,3}[가-힣]\d{4})/;
    
    lines.forEach(line => {
        const match = line.match(regex);
        
        if (match) {
            carInfoList.push({
                name: match[1],
                phone: match[2].replace(/\s/g, '-'),
                carNumber: match[3],
                vehicleNumber: null,
                team: null
            });
        }
    });
    
    return carInfoList;
}

// 팀 선택 드롭다운 생성 함수
function createTeamDropdown(selectedTeam = null) {
    const select = document.createElement('select');
    select.classList.add('team-select');
    
    teamOptions.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        if (team === selectedTeam) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    return select;
}

// 테이블 생성 함수
function createTable() {
    const resultBody = document.getElementById('resultBody');
    const totalVehicles = document.getElementById('totalVehicles').value;
    
    // 테이블 초기화
    resultBody.innerHTML = '';
    
    // 모든 차량에 대해 행 생성
    parsedVehicles.forEach((vehicle, index) => {
        const row = document.createElement('tr');
        
        // 호차 셀
        const vehicleNumberCell = document.createElement('td');
        vehicleNumberCell.textContent = '';
        vehicleNumberCell.classList.add('editable-cell');
        vehicleNumberCell.setAttribute('contenteditable', 'true');
        
        // 이름 셀
        const nameCell = document.createElement('td');
        nameCell.textContent = vehicle.name;
        
        // 번호 셀
        const phoneCell = document.createElement('td');
        phoneCell.textContent = vehicle.phone;
        
        // 차량번호 셀
        const carNumberCell = document.createElement('td');
        carNumberCell.textContent = vehicle.carNumber;
        
        // 팀 선택 셀
        const teamCell = document.createElement('td');
        const teamDropdown = createTeamDropdown();
        teamCell.appendChild(teamDropdown);
        
        // 행에 셀 추가
        row.appendChild(vehicleNumberCell);
        row.appendChild(nameCell);
        row.appendChild(phoneCell);
        row.appendChild(carNumberCell);
        row.appendChild(teamCell);
        
        resultBody.appendChild(row);
    });
}

// 정렬 함수
function sortTable() {
    const resultBody = document.getElementById('resultBody');
    const rows = Array.from(resultBody.querySelectorAll('tr'));
    
    // 호차 정보로 정렬
    const sortedRows = rows.sort((a, b) => {
        const aVehicleNumber = parseInt(a.querySelector('td:first-child').textContent);
        const bVehicleNumber = parseInt(b.querySelector('td:first-child').textContent);
        return aVehicleNumber - bVehicleNumber;
    });
    
    // 정렬된 행 다시 추가
    resultBody.innerHTML = '';
    sortedRows.forEach(row => resultBody.appendChild(row));
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 텍스트 파싱 버튼
    const inputText = document.getElementById('inputText');
    const createTableButton = document.getElementById('createTableButton');
    const sortButton = document.getElementById('sortButton');
    
    // 테이블 생성 버튼 클릭 이벤트
    createTableButton.addEventListener('click', () => {
        // 텍스트 파싱
        parsedVehicles = parseCarInfo(inputText.value);
        
        // 테이블 생성
        createTable();
    });
    
    // 정렬 버튼 클릭 이벤트
    sortButton.addEventListener('click', sortTable);
});
