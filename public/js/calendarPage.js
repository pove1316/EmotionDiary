// calendarPage.js

document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('calendar-page').style.display = 'none';
    document.getElementById('start-menu').style.display = 'block';
});

document.getElementById('back-to-calendar').addEventListener('click', () => {
    document.getElementById('record-detail').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';
    document.getElementById('back-button').style.display = 'block';
});

document.getElementById('show-graph-button').addEventListener('click', () => {
    const modal = document.getElementById('graph-modal');
    modal.style.display = 'block';
    renderGraphInModal(); // 모달 창이 열릴 때 그래프를 렌더링
});

document.querySelector('.close-button').addEventListener('click', () => {
    const modal = document.getElementById('graph-modal');
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('graph-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

function renderCalendar() {
    fetch('/api/records')
    .then(response => response.json())
    .then(data => {
        const records = data.records;
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        const months = {};
        records.forEach(record => {
            const date = new Date(record.date);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const day = date.getDate();
            
            if (!months[year]) months[year] = {};
            if (!months[year][month]) months[year][month] = [];
            
            months[year][month].push({ day, record });
        });

        Object.keys(months).forEach(year => {
            Object.keys(months[year]).forEach(month => {
                const monthDiv = document.createElement('div');
                monthDiv.classList.add('calendar-month');
                monthDiv.innerHTML = `<h3>${month} ${year}</h3>`;
                
                const grid = document.createElement('div');
                grid.classList.add('calendar-grid');
                
                months[year][month].forEach(({ day, record }) => {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('calendar-day');
                    dayDiv.innerText = day;
                    
                    if (record) {
                        dayDiv.classList.add('recorded');
                        dayDiv.addEventListener('click', () => showRecord(record));
                    }
                    
                    grid.appendChild(dayDiv);
                });
                
                monthDiv.appendChild(grid);
                calendar.appendChild(monthDiv);
            });
        });
    })
    .catch(error => console.error('Error:', error));
}

let currentGraphData = null;

function showRecord(record) {
    document.getElementById('calendar').style.display = 'none';
    document.getElementById('record-detail').style.display = 'block';
    document.getElementById('back-button').style.display = 'none';
    
    document.getElementById('record-text').innerText = `User: ${record.userText}\nAI: ${record.aiText}`;
    document.getElementById('record-audio').src = record.audioUrl;

    // 그래프 데이터 로드 및 렌더링
    currentGraphData = {
        nodes: [
            { data: { id: 'emotion1', label: '불안' } },
            { data: { id: 'emotion2', label: '슬픔' } },
            { data: { id: 'cause1', label: '업무 스트레스' } },
            { data: { id: 'cause2', label: '수면 부족' } },
            { data: { id: 'cause3', label: '개인 문제' } },
            { data: { id: 'cause4', label: '건강 염려' } },
            { data: { id: 'cause5', label: '재정 걱정' } }
        ],
        edges: [
            { data: { source: 'emotion1', target: 'cause1', label: '원인' } },
            { data: { source: 'emotion1', target: 'cause2', label: '원인' } },
            { data: { source: 'emotion1', target: 'cause3', label: '원인' } },
            { data: { source: 'emotion2', target: 'cause4', label: '원인' } },
            { data: { source: 'emotion2', target: 'cause5', label: '원인' } },
            { data: { source: 'emotion2', target: 'cause1', label: '원인' } }
        ]
    };
    
    console.log("Show record:", record); // 디버깅 메시지 추가
    console.log("Graph data:", currentGraphData); // 디버깅 메시지 추가
}

function renderGraphInModal() {
    if (currentGraphData) {
        renderGraph(currentGraphData);
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});
