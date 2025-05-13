document.addEventListener('DOMContentLoaded', function() {
    // Get all mood entries
    const allMoods = moodStorage.getMoodHistory();
    
    // Set up period filtering
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateHistoryDisplay(this.dataset.period);
        });
    });

    // Initial display
    updateHistoryDisplay('all');

    // Set up mood chart
    setupMoodChart(allMoods);
});

function updateHistoryDisplay(period) {
    let filteredMoods = moodStorage.getMoodHistory();
    const now = new Date();
    
    if (period === 'month') {
        filteredMoods = filteredMoods.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() && 
                   entryDate.getFullYear() === now.getFullYear();
        });
    } else if (period === 'week') {
        filteredMoods = filteredMoods.filter(entry => {
            const entryDate = new Date(entry.date);
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            return entryDate >= weekStart;
        });
    }
    
    renderMoodList(filteredMoods);
    updateMoodChart(filteredMoods);
}

function renderMoodList(moods) {
    const container = document.getElementById('mood-entries');
    container.innerHTML = '';
    
    if (moods.length === 0) {
        container.innerHTML = '<p class="no-entries">No mood entries found</p>';
        return;
    }
    
    moods.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(entry => {
        const entryDate = new Date(entry.date);
        const moodEmoji = getMoodEmoji(entry.mood);
        
        const entryEl = document.createElement('div');
        entryEl.className = 'mood-entry';
        entryEl.innerHTML = `
            <div class="mood-emoji">${moodEmoji}</div>
            <div class="mood-info">
                <span class="mood-name">${entry.mood}</span>
                <span class="mood-date">${entryDate.toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            </div>
        `;
        container.appendChild(entryEl);
    });
}

function setupMoodChart(allMoods) {
    const ctx = document.getElementById('moodChart').getContext('2d');
    window.moodChart = new Chart(ctx, {
        type: 'line',
        data: getChartData(allMoods),
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            // Convert numeric mood values back to names
                            const moods = ['Very Low', 'Low', 'Neutral', 'High', 'Very High'];
                            return moods[value] || '';
                        }
                    }
                }
            }
        }
    });
}

function updateMoodChart(moods) {
    if (window.moodChart) {
        window.moodChart.data = getChartData(moods);
        window.moodChart.update();
    }
}

function getChartData(moods) {
    // Group by date and calculate average mood for the day
    const moodValues = {
        'Happy': 4,
        'Excited': 4,
        'Content': 3,
        'Calm': 3,
        'Neutral': 2,
        'Anxious': 1,
        'Sad': 1,
        'Angry': 0,
        'Stressed': 0
    };
    
    const dailyAverages = {};
    moods.forEach(entry => {
        const date = new Date(entry.date).toDateString();
        if (!dailyAverages[date]) {
            dailyAverages[date] = {
                sum: 0,
                count: 0
            };
        }
        dailyAverages[date].sum += moodValues[entry.mood] || 2;
        dailyAverages[date].count++;
    });
    
    const sortedDates = Object.keys(dailyAverages).sort();
    
    return {
        labels: sortedDates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: 'Mood Level',
            data: sortedDates.map(date => dailyAverages[date].sum / dailyAverages[date].count),
            borderColor: '#6c5ce7',
            backgroundColor: 'rgba(108, 92, 231, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };
}

function getMoodEmoji(mood) {
    const emojis = {
        'Happy': '😊',
        'Sad': '😢',
        'Angry': '😠',
        'Stressed': '😫',
        'Calm': '😌',
        'Excited': '🤩',
        'Anxious': '😟',
        'Content': '🙂'
    };
    return emojis[mood] || '❓';
}