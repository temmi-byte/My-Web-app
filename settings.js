document.addEventListener('DOMContentLoaded', function() {
    // Load current settings
    loadSettings();
    
    // Profile settings
    const usernameInput = document.getElementById('username-input');
    usernameInput.value = moodStorage.getUsername();
    usernameInput.addEventListener('change', function() {
        moodStorage.setUsername(this.value);
    });
    
    // Avatar upload
    document.getElementById('avatar-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('avatar-preview').src = event.target.result;
                localStorage.setItem('dailyFeelsAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Load saved avatar if exists
    const savedAvatar = localStorage.getItem('dailyFeelsAvatar');
    if (savedAvatar) {
        document.getElementById('avatar-preview').src = savedAvatar;
    }
    
    // Data export
    document.getElementById('export-data').addEventListener('click', exportData);
    
    // Data import
    document.getElementById('import-data').addEventListener('click', importData);
    
    // Reset data
    document.getElementById('reset-data').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.removeItem('dailyFeelsMoods');
            localStorage.removeItem('dailyFeelsUsername');
            localStorage.removeItem('dailyFeelsAvatar');
            alert('All data has been reset. The app will now refresh.');
            window.location.reload();
        }
    });
    
    // Dark mode toggle
    document.getElementById('dark-mode').addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dailyFeelsDarkMode', this.checked);
    });
    
    // Accent color
    document.getElementById('accent-color').addEventListener('change', function() {
        document.documentElement.style.setProperty('--accent-color', this.value);
        localStorage.setItem('dailyFeelsAccentColor', this.value);
    });
});

function loadSettings() {
    // Dark mode
    const darkMode = localStorage.getItem('dailyFeelsDarkMode') === 'true';
    document.getElementById('dark-mode').checked = darkMode;
    if (darkMode) document.body.classList.add('dark-mode');
    
    // Accent color
    const accentColor = localStorage.getItem('dailyFeelsAccentColor') || '#6c5ce7';
    document.getElementById('accent-color').value = accentColor;
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Daily reminder
    const reminderEnabled = localStorage.getItem('dailyFeelsReminder') !== 'false';
    document.getElementById('daily-reminder').checked = reminderEnabled;
    
    // Reminder time
    const reminderTime = localStorage.getItem('dailyFeelsReminderTime') || '19:00';
    document.getElementById('reminder-time').value = reminderTime;
}

function exportData() {
    const data = {
        username: moodStorage.getUsername(),
        avatar: localStorage.getItem('dailyFeelsAvatar'),
        moods: moodStorage.getMoodHistory(),
        settings: {
            darkMode: localStorage.getItem('dailyFeelsDarkMode'),
            accentColor: localStorage.getItem('dailyFeelsAccentColor')
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-feels-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.username) moodStorage.setUsername(data.username);
                if (data.avatar) localStorage.setItem('dailyFeelsAvatar', data.avatar);
                if (data.moods) localStorage.setItem('dailyFeelsMoods', JSON.stringify(data.moods));
                if (data.settings) {
                    if (data.settings.darkMode) localStorage.setItem('dailyFeelsDarkMode', data.settings.darkMode);
                    if (data.settings.accentColor) localStorage.setItem('dailyFeelsAccentColor', data.settings.accentColor);
                }
                
                alert('Data imported successfully! The app will now refresh.');
                window.location.reload();
            } catch (err) {
                alert('Error importing data: ' + err.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}