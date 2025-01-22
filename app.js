// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Configuración de Firebase
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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias a la base de datos
const homeScoreRef = ref(db, 'scoreboard/home');
const awayScoreRef = ref(db, 'scoreboard/away');

// Actualizar puntajes en tiempo real
onValue(homeScoreRef, (snapshot) => {
  const homeScore = snapshot.val();
  document.getElementById('homeScore').textContent = homeScore || 0;
});

onValue(awayScoreRef, (snapshot) => {
  const awayScore = snapshot.val();
  document.getElementById('awayScore').textContent = awayScore || 0;
});

// Funciones para actualizar puntajes
const updateScore = (teamRef, change) => {
  onValue(teamRef, (snapshot) => {
    const currentScore = snapshot.val() || 0;
    const newScore = Math.max(0, currentScore + change); // Evita puntajes negativos
    set(teamRef, newScore);
  }, { onlyOnce: true });
};

// Manejo de eventos para botones
document.getElementById('homeAdd6').addEventListener('click', () => updateScore(homeScoreRef, 6));
document.getElementById('homeAdd2').addEventListener('click', () => updateScore(homeScoreRef, 2));
document.getElementById('homeSubtract').addEventListener('click', () => updateScore(homeScoreRef, -1));

document.getElementById('awayAdd6').addEventListener('click', () => updateScore(awayScoreRef, 6));
document.getElementById('awayAdd2').addEventListener('click', () => updateScore(awayScoreRef, 2));
document.getElementById('awaySubtract').addEventListener('click', () => updateScore(awayScoreRef, -1));
