function saveName() {
    const name = document.getElementById('username').value;
    if (name.trim() !== "") {
        localStorage.setItem("dailyfeelUser", name);
        window.location.href ="dashboard.html";
    } else {
        alert("please enter your name.");
    }
}

function signIn() {
    const username = document.getElementById("username").value.trim();
    if (username) {
      localStorage.setItem("dailyFeelsUser", username);
      // Add a small delay to make sure localStorage is set
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 100);
    } else {
      alert("Please enter your name");
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Load saved preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = darkModeEnabled;
    updateDarkMode(darkModeEnabled);
    
    // Toggle dark mode when switched
    darkModeToggle.addEventListener('change', function() {
        const isDarkMode = this.checked;
        localStorage.setItem('darkMode', isDarkMode);
        updateDarkMode(isDarkMode);
    });

    // Accent Color Picker
    const accentColorPicker = document.getElementById('accent-color');
    const savedColor = localStorage.getItem('accentColor') || '#6c5ce7';
    accentColorPicker.value = savedColor;
    updateAccentColor(savedColor);
    
    accentColorPicker.addEventListener('change', function() {
        localStorage.setItem('accentColor', this.value);
        updateAccentColor(this.value);
    });
});

function updateDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    
    // Update toggle switch color
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty('--toggle-bg', '#424242');
        root.style.setProperty('--toggle-fg', '#f5f5f5');
    } else {
        root.style.setProperty('--toggle-bg', '#e0e0e0');
        root.style.setProperty('--toggle-fg', '#ffffff');
    }
}

function updateAccentColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-light', `${color}1a`);
    
    // Update all elements that use the accent color
    const accentElements = document.querySelectorAll('.accent-color');
    accentElements.forEach(el => {
        el.style.color = color;
    });
    
    const accentBgs = document.querySelectorAll('.accent-bg');
    accentBgs.forEach(el => {
        el.style.backgroundColor = color;
    });
}