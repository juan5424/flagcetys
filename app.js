import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVGxvJhnZlY6mPItYG3tZpdoEBBjQ0Wf4",
    authDomain: "marcador12flag.firebaseapp.com",
    databaseURL: "https://marcador12flag-default-rtdb.firebaseio.com",
    projectId: "marcador12flag",
    storageBucket: "marcador12flag.appspot.com",
    messagingSenderId: "586603747677",
    appId: "1:586603747677:web:fc09d1b8ed95787f2bf0b4",
    measurementId: "G-PBC0651YS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sport-specific configurations
const sportConfigs = {
    football: {
        points: [6, 3, 2, 1],
        labels: ['TD', 'FG', '2PT', '1PT']
    },
    basketball: {
        points: [3, 2, 1],
        labels: ['3PT', '2PT', 'FT']
    },
    volleyball: {
        points: [1],
        labels: ['Point']
    }
};

// Database references
const gameStateRef = ref(db, 'gameState');
const homeScoreRef = ref(db, 'gameState/homeScore');
const awayScoreRef = ref(db, 'gameState/awayScore');
const periodRef = ref(db, 'gameState/period');
const sportTypeRef = ref(db, 'gameState/sportType');
const homeTeamRef = ref(db, 'gameState/homeTeam');
const awayTeamRef = ref(db, 'gameState/awayTeam');

// DOM Elements
const homeScoreDisplay = document.getElementById('homeScore');
const awayScoreDisplay = document.getElementById('awayScore');
const periodDisplay = document.getElementById('periodNumber');
const sportSelector = document.getElementById('sportType');
const homeTeamInput = document.getElementById('homeTeamName');
const awayTeamInput = document.getElementById('awayTeamName');
const homeQuickPoints = document.getElementById('homeQuickPoints');
const awayQuickPoints = document.getElementById('awayQuickPoints');

// Format score to always show two digits
const formatScore = (score) => String(score).padStart(2, '0');

// Update quick point buttons based on sport type
function updateQuickPoints(sport) {
    const config = sportConfigs[sport];
    const createButtons = (containerId, team) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        config.points.forEach((points, index) => {
            const button = document.createElement('button');
            button.textContent = `${config.labels[index]} (+${points})`;
            button.onclick = () => updateScore(team + 'Score', points);
            container.appendChild(button);
        });
    };

    createButtons('homeQuickPoints', 'home');
    createButtons('awayQuickPoints', 'away');
}

// Update score in Firebase
function updateScore(scoreType, change) {
    const scoreRef = ref(db, `gameState/${scoreType}`);
    onValue(scoreRef, (snapshot) => {
        const currentScore = snapshot.val() || 0;
        const newScore = Math.max(0, currentScore + change);
        set(scoreRef, newScore);
    }, { onlyOnce: true });
}

// Event Listeners
sportSelector.addEventListener('change', (e) => {
    set(sportTypeRef, e.target.value);
    updateQuickPoints(e.target.value);
});

homeTeamInput.addEventListener('change', (e) => {
    set(homeTeamRef, e.target.value);
});

awayTeamInput.addEventListener('change', (e) => {
    set(awayTeamRef, e.target.value);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    set(gameStateRef, {
        homeScore: 0,
        awayScore: 0,
        period: 1,
        sportType: sportSelector.value,
        homeTeam: homeTeamInput.value,
        awayTeam: awayTeamInput.value
    });
});

document.getElementById('periodUp').addEventListener('click', () => {
    onValue(periodRef, (snapshot) => {
        const currentPeriod = snapshot.val() || 1;
        set(periodRef, currentPeriod + 1);
    }, { onlyOnce: true });
});

document.getElementById('periodDown').addEventListener('click', () => {
    onValue(periodRef, (snapshot) => {
        const currentPeriod = snapshot.val() || 1;
        set(periodRef, Math.max(1, currentPeriod - 1));
    }, { onlyOnce: true });
});

// Real-time updates
onValue(homeScoreRef, (snapshot) => {
    const score = snapshot.val() || 0;
    homeScoreDisplay.textContent = formatScore(score);
});

onValue(awayScoreRef, (snapshot) => {
    const score = snapshot.val() || 0;
    awayScoreDisplay.textContent = formatScore(score);
});

onValue(periodRef, (snapshot) => {
    const period = snapshot.val() || 1;
    periodDisplay.textContent = period;
});

onValue(sportTypeRef, (snapshot) => {
    const sport = snapshot.val() || 'football';
    sportSelector.value = sport;
    updateQuickPoints(sport);
});

onValue(homeTeamRef, (snapshot) => {
    const teamName = snapshot.val() || '';
    homeTeamInput.value = teamName;
});

onValue(awayTeamRef, (snapshot) => {
    const teamName = snapshot.val() || '';
    awayTeamInput.value = teamName;
});

// Initialize the app with football configuration
updateQuickPoints('football');
