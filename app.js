// Set username from localStorage or default
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('dailyFeelsUsername') || 'User';
    document.getElementById('username').textContent = username;
    
    // You can add more dashboard-specific functionality here
    // For example: loading mood history, calculating stats, etc.
});

// Initialize all charts
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Mini trend chart
    const miniCtx = document.getElementById('miniTrendChart').getContext('2d');
    new Chart(miniCtx, {
        type: 'line',
        data: {
            labels: Array(7).fill(''),
            datasets: [{
                data: [3, 4, 2, 5, 4, 3, 4],
                borderColor: '#6c5ce7',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
    
    // Main liquidity chart
    const liquidityCtx = document.getElementById('moodLiquidityChart').getContext('2d');
    new Chart(liquidityCtx, {
        type: 'line',
        data: {
            labels: Array(24).fill(0).map((_,i) => `${i}:00`),
            datasets: [{
                data: [65,68,72,70,68,65,63,60,65,70,72,75,72,70,68,65,63,65,68,70,72,70,68,65],
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.05)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: getChartOptions('Mood Index')
    });
    
    // Dominance chart
    const dominanceCtx = document.getElementById('dominanceChart').getContext('2d');
    new Chart(dominanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Happy', 'Calm', 'Neutral', 'Stressed', 'Sad'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#00b894',
                    '#0984e3',
                    '#fdcb6e',
                    '#e17055',
                    '#d63031'
                ],
                borderWidth: 0
            }]
        },
        options: getChartOptions('', true)
    });
    
    // Initialize other charts similarly...
});

function getChartOptions(title, hideAxes = false) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: !!title, text: title }
        },
        scales: {
            x: { 
                display: !hideAxes,
                grid: { display: false }
            },
            y: { 
                display: !hideAxes,
                grid: { 
                    color: 'rgba(0,0,0,0.05)',
                    drawBorder: false
                }
            }
        },
        elements: {
            point: { radius: 0 }
        }
    };
}