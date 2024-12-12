function parseCarInfo(text) {
    // 결과를 저장할 배열
    const carInfoList = [];
    
    // 텍스트를 줄 단위로 분리
    const lines = text.split('\n');
    
    // 이름(2-3글자), 전화번호, 차량번호 추출을 위한 정규표현식
    const regex = /^([가-힣]{2,3})\s*(\d{3}\s*\d{4}\s*\d{4})\s*차번(\d{2,3}[가-힣]\d{4})/;
    
    lines.forEach(line => {
        const match = line.match(regex);
        
        if (match) {
            carInfoList.push({
                name: match[1],
                phone: match[2].replace(/\s/g, '-'),
                carNumber: match[3]
            });
        }
    });
    
    return carInfoList;
}

// 담당 팀 옵션
const teamOptions = [
    '연출팀', 
    '작가팀', 
    '카메라팀', 
    '동시팀', 
    '거치팀', 
    '폴캠팀'
];

// DOM 요소 선택
const inputText = document.getElementById('inputText');
const parseButton = document.getElementById('parseButton');
const resultBody = document.getElementById('resultBody');
const totalVehiclesInput = document.getElementById('totalVehicles');

// 팀 선택 드롭다운 생성 함수
function createTeamDropdown() {
    const select = document.createElement('select');
    teamOptions.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        select.appendChild(option);
    });
    return select;
}

// 파싱 버튼 클릭 이벤트
parseButton.addEventListener('click', () => {
    // 입력된 텍스트 가져오기
    const text = inputText.value;
    
    // 파싱 수행
    const results = parseCarInfo(text);
    
    // 총 차량 수 가져오기
    const totalVehicles = parseInt(totalVehiclesInput.value);
    
    // 결과를 배열에 추가하고 정렬
    const sortedResults = [];
    
    // 최대 totalVehicles 만큼 호차 할당
    results.forEach((info, index) => {
        if (index < totalVehicles) {
            sortedResults.push({
                ...info,
                vehicleNumber: index + 1 // 호차 1부터 시작
            });
        }
    });
    
    // 호차 번호 기준으로 정렬
    sortedResults.sort((a, b) => a.vehicleNumber - b.vehicleNumber);
    
    // 테이블 초기화
    resultBody.innerHTML = '';
    
    // 결과를 테이블에 추가
    sortedResults.forEach(info => {
        const row = document.createElement('tr');
        
        // 호차, 이름, 번호, 차량번호 셀 생성
        const cells = [
            `${info.vehicleNumber}호차`,
            info.name,
            info.phone,
            info.carNumber
        ];
        
        cells.forEach(cellContent => {
            const td = document.createElement('td');
            td.textContent = cellContent;
            row.appendChild(td);
        });
        
        // 담당 팀 드롭다운 셀 추가
        const teamCell = document.createElement('td');
        const teamDropdown = createTeamDropdown();
        teamCell.appendChild(teamDropdown);
        row.appendChild(teamCell);
        
        resultBody.appendChild(row);
    });
});
