// Daily Feels - Mood Data Management
const moodStorage = {
    // User Management
    getUsername() {
        return localStorage.getItem('dailyFeelsUsername') || 'User';
    },

    setUsername(name) {
        localStorage.setItem('dailyFeelsUsername', name.trim());
    },

    // Mood Entry Management
    getMoodHistory() {
        return JSON.parse(localStorage.getItem('dailyFeelsMoods') || '[]');
    },

    addMoodEntry(mood, date = new Date()) {
        const history = this.getMoodHistory();
        history.push({
            mood,
            date: date.toISOString(),
            timestamp: date.getTime()
        });
        localStorage.setItem('dailyFeelsMoods', JSON.stringify(history));
    },

    // Mood Analysis
    getRecentMoods(limit = 5) {
        const history = this.getMoodHistory();
        return history
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    },

    getCurrentStreak() {
        const history = this.getMoodHistory();
        if (history.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneDay = 86400000;
        
        // Sort newest first
        const sorted = history.sort((a, b) => b.timestamp - a.timestamp);
        
        // Check if today has an entry
        const lastEntryDate = new Date(sorted[0].timestamp);
        lastEntryDate.setHours(0, 0, 0, 0);
        
        if ((today - lastEntryDate) === 0) streak = 1;
        
        // Count consecutive days
        for (let i = 1; i < sorted.length; i++) {
            const currentDate = new Date(sorted[i].timestamp);
            currentDate.setHours(0, 0, 0, 0);
            const prevDate = new Date(sorted[i-1].timestamp);
            prevDate.setHours(0, 0, 0, 0);
            
            const daysBetween = (prevDate - currentDate) / oneDay;
            
            if (daysBetween === 1) {
                streak++;
            } else if (daysBetween > 1) {
                break;
            }
        }
        
        return streak;
    },

    getMoodFrequency() {
        const history = this.getMoodHistory();
        const frequency = {};
        
        history.forEach(entry => {
            frequency[entry.mood] = (frequency[entry.mood] || 0) + 1;
        });
        
        return frequency;
    },

    getMostFrequentMood() {
        const frequency = this.getMoodFrequency();
        let maxCount = 0;
        let mostFrequent = '';
        
        for (const mood in frequency) {
            if (frequency[mood] > maxCount) {
                maxCount = frequency[mood];
                mostFrequent = mood;
            }
        }
        
        const totalEntries = this.getMoodHistory().length;
        return {
            mood: mostFrequent,
            count: maxCount,
            percentage: totalEntries > 0 ? Math.round((maxCount / totalEntries) * 100) : 0
        };
    },

    getTimeOfDayPatterns() {
        const history = this.getMoodHistory();
        const times = {
            morning: { positive: 0, total: 0 },
            afternoon: { positive: 0, total: 0 },
            evening: { positive: 0, total: 0 },
            night: { positive: 0, total: 0 }
        };
        
        const positiveMoods = ['Happy', 'Excited', 'Content', 'Calm'];
        
        history.forEach(entry => {
            const date = new Date(entry.timestamp);
            const hours = date.getHours();
            let timeOfDay;
            
            if (hours >= 5 && hours < 12) timeOfDay = 'morning';
            else if (hours >= 12 && hours < 17) timeOfDay = 'afternoon';
            else if (hours >= 17 && hours < 22) timeOfDay = 'evening';
            else timeOfDay = 'night';
            
            times[timeOfDay].total++;
            if (positiveMoods.includes(entry.mood)) {
                times[timeOfDay].positive++;
            }
        });
        
        // Calculate percentages
        for (const time in times) {
            times[time].percentage = times[time].total > 0 
                ? Math.round((times[time].positive / times[time].total) * 100)
                : 0;
        }
        
        return times;
    },

    getBestTimeOfDay() {
        const patterns = this.getTimeOfDayPatterns();
        let bestTime = '';
        let highestPercentage = 0;
        
        for (const time in patterns) {
            if (patterns[time].percentage > highestPercentage) {
                highestPercentage = patterns[time].percentage;
                bestTime = time;
            }
        }
        
        return {
            time: bestTime,
            percentage: highestPercentage
        };
    }
};

// Make sure to initialize if empty
if (!localStorage.getItem('dailyFeelsMoods')) {
    localStorage.setItem('dailyFeelsMoods', JSON.stringify([]));
}
if (!localStorage.getItem('dailyFeelsUsername')) {
    localStorage.setItem('dailyFeelsUsername', 'User');
}