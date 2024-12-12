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

// DOM 요소 선택
const inputText = document.getElementById('inputText');
const parseButton = document.getElementById('parseButton');
const resultBody = document.getElementById('resultBody');

// 파싱 버튼 클릭 이벤트
parseButton.addEventListener('click', () => {
    // 입력된 텍스트 가져오기
    const text = inputText.value;
    
    // 파싱 수행
    const results = parseCarInfo(text);
    
    // 테이블 초기화
    resultBody.innerHTML = '';
    
    // 결과를 테이블에 추가
    results.forEach(info => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${info.name}</td>
            <td>${info.phone}</td>
            <td>${info.carNumber}</td>
        `;
        resultBody.appendChild(row);
    });
});
