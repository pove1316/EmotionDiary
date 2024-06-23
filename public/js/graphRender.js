// graphRender.js

function renderGraph(graphData) {
    console.log("Rendering graph with data:", graphData); // 디버깅 메시지 추가
    const container = document.getElementById('cy');
    if (!container) {
        console.error("Container for Cytoscape.js not found!");
        return;
    }
    const cy = cytoscape({
        container: container, // 그래프를 표시할 HTML 요소

        elements: graphData,

        style: [ // 그래프의 스타일 설정
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'width': '20px',
                    'height': '20px',
                    'background-color': '#60a3bc',
                    'color': '#000',
                    'text-valign': 'center',
                    'text-halign': 'center',
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 1,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],

        layout: {
            name: 'cose',
            padding: 10
        }
    });
}
