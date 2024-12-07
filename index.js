let timer;
let startTime;
let elapsedTime = 0;
let mistakes = 0;
let isTestRunning = false;

const quoteText = document.getElementById('quote');
const quoteInput = document.getElementById('quote-input');
const timerDisplay = document.getElementById('timer');
const mistakesDisplay = document.getElementById('mistakes');
const accuracyDisplay = document.getElementById('accuracy');
const wpmDisplay = document.getElementById('wpm');
const startButton = document.getElementById('start-test');
const stopButton = document.getElementById('stop-test');

// Fetch a random quote from the Quotable API
async function getRandomQuote() {
    try {
        const response = await fetch('https://api.quotable.io/quotes?foo=bar');
        
        // Check if the request was successful (status code 200)
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }

        const data = await response.json();
        return data.content; // The actual quote text
    } catch (error) {
        console.error('Error fetching quote:', error);
        return 'Error fetching quote. Please try again.'; // Fallback message
    }
}

async function startTest() {
    // Fetch a random quote from the API
    const randomQuote = await getRandomQuote();
    quoteText.textContent = randomQuote;
    
    // Show stop button and hide start button
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';

    // Start the timer
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);

    // Reset variables
    elapsedTime = 0;
    mistakes = 0;
    isTestRunning = true;
}

function updateTimer() {
    if (isTestRunning) {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `${elapsedTime}s`;
    }
}

function displayResult() {
    isTestRunning = false;
    clearInterval(timer);

    // Calculate mistakes
    const typedText = quoteInput.value.trim();
    mistakes = countMistakes(quoteText.textContent, typedText);
    mistakesDisplay.textContent = mistakes;

    // Calculate speed (words per minute)
    const timeInMinutes = elapsedTime / 60;
    const wordsTyped = typedText.split(' ').length;
    const speed = Math.floor(wordsTyped / timeInMinutes);
    wpmDisplay.textContent = `${speed} WPM`;

    // Calculate accuracy
    const accuracy = calculateAccuracy(quoteText.textContent, typedText);
    accuracyDisplay.textContent = `${accuracy}%`;

    // Hide stop button and show start button again
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
}

function countMistakes(originalText, typedText) {
    let mistakes = 0;
    const originalWords = originalText.split(' ');
    const typedWords = typedText.split(' ');

    for (let i = 0; i < originalWords.length; i++) {
        if (originalWords[i] !== typedWords[i]) {
            mistakes++;
        }
    }
    return mistakes;
}

function calculateAccuracy(originalText, typedText) {
    const originalWords = originalText.split(' ').length;
    const typedWords = typedText.split(' ').length;
    
    const correctWords = originalWords - mistakes;
    return Math.floor((correctWords / originalWords) * 100);
}
