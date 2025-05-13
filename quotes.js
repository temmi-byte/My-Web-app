// Mood-specific quotes database
const moodQuotes = {
    happy: [
        { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { text: "Joy is the simplest form of gratitude.", author: "Karl Barth" }
    ],
    sad: [
        { text: "This feeling will pass. The fear is real but the danger is not.", author: "Cammie McGovern" },
        { text: "You're allowed to feel messed up and inside out. It doesn't mean you're defective.", author: "David Mitchell" },
        { text: "Tears are words that need to be written.", author: "Paulo Coelho" }
    ],
    angry: [
        { text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" },
        { text: "Speak when you are angry and you will make the best speech you will ever regret.", author: "Ambrose Bierce" }
    ],
    stressed: [
        { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
        { text: "It's not the load that breaks you down, it's the way you carry it.", author: "Lou Holtz" }
    ],
    calm: [
        { text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
        { text: "Calm mind brings inner strength and self-confidence.", author: "Dalai Lama" }
    ],
    excited: [
        { text: "Enthusiasm is the electricity of life.", author: "Gordon Parks" },
        { text: "Nothing great was ever achieved without enthusiasm.", author: "Ralph Waldo Emerson" }
    ],
        anxious: [
          { text: "Anxiety is just a reminder that you care deeply about something.", author: "Unknown" },
          { text: "This feeling is temporary. You've survived all your worst days so far.", author: "Unknown" }
        ],
        
        content: [
          { text: "Happiness is not a station you arrive at, but a manner of traveling.", author: "Margaret Lee Runbeck" },
          { text: "Contentment is the only real wealth.", author: "Alfred Nobel" }
        ],
        
        lonely: [
          { text: "Loneliness is the door to self-discovery.", author: "Unknown" },
          { text: "You are never alone. You are eternally connected with everyone.", author: "Amit Ray" }
        ],
        
        grateful: [
          { text: "Gratitude turns what we have into enough.", author: "Aesop" },
          { text: "The more grateful I am, the more beauty I see.", author: "Mary Davis" }
        ]
      };

// Get mood from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const mood = urlParams.get('mood');

// Display today's date
const today = new Date();
document.getElementById('today-date').textContent = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

// Set page title based on mood
if (mood && moodQuotes[mood]) {
    document.getElementById('mood-title').textContent = `Daily ${mood.charAt(0).toUpperCase() + mood.slice(1)} Feels`;
    
    // Get daily quote (consistent for the day using date as seed)
    const quotes = moodQuotes[mood];
    const dailyIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) % quotes.length;
    const dailyQuote = quotes[dailyIndex];
    
    document.getElementById('quote-text').textContent = dailyQuote.text;
    document.getElementById('quote-author').textContent = `— ${dailyQuote.author}`;
    
    // Change background color based on mood
    document.body.style.backgroundColor = getMoodColor(mood);
} else {
    document.getElementById('quote-text').textContent = "Select a mood from the dashboard to see your daily feels!";
}

function getMoodColor(mood) {
    const colors = {
        happy: '#FFF9C4',
        sad: '#E3F2FD',
        angry: '#FFEBEE',
        stressed: '#F3E5F5',
        calm: '#E8F5E9',
        excited: '#FFF3E0'
    };
    return colors[mood] || '#f5f7fa';
}