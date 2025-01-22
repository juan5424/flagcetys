// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

// Función para formatear los puntajes a dos dígitos
const formatScore = (score) => (score < 10 ? `0${score}` : score);

// Actualizar puntajes en tiempo real
onValue(homeScoreRef, (snapshot) => {
  const homeScore = snapshot.val() || 0;
  document.getElementById('homeScore').textContent = formatScore(homeScore);
});

onValue(awayScoreRef, (snapshot) => {
  const awayScore = snapshot.val() || 0;
  document.getElementById('awayScore').textContent = formatScore(awayScore);
});

// Función para actualizar puntajes
const updateScore = (teamRef, change) => {
  onValue(teamRef, (snapshot) => {
    const currentScore = snapshot.val() || 0;
    const newScore = Math.max(0, currentScore + change); // Evita puntajes negativos
    set(teamRef, newScore);
  }, { onlyOnce: true });
};

// Manejo de eventos para botones
document.getElementById('homeAdd6').addEventListener('click', () => updateScore(homeScoreRef, 6));
document.getElementById('homeAdd1').addEventListener('click', () => updateScore(homeScoreRef, 1));
document.getElementById('homeAdd2').addEventListener('click', () => updateScore(homeScoreRef, 2));
document.getElementById('homeSubtract6').addEventListener('click', () => updateScore(homeScoreRef, -6));
document.getElementById('homeSubtract1').addEventListener('click', () => updateScore(homeScoreRef, -1));
document.getElementById('homeSubtract2').addEventListener('click', () => updateScore(homeScoreRef, -2));

document.getElementById('awayAdd6').addEventListener('click', () => updateScore(awayScoreRef, 6));
document.getElementById('awayAdd1').addEventListener('click', () => updateScore(awayScoreRef, 1));
document.getElementById('awayAdd2').addEventListener('click', () => updateScore(awayScoreRef, 2));
document.getElementById('awaySubtract6').addEventListener('click', () => updateScore(awayScoreRef, -6));
document.getElementById('awaySubtract1').addEventListener('click', () => updateScore(awayScoreRef, -1));
document.getElementById('awaySubtract2').addEventListener('click', () => updateScore(awayScoreRef, -2));

// Botón para resetear marcadores
document.getElementById('reset').addEventListener('click', () => {
  set(homeScoreRef, 0);
  set(awayScoreRef, 0);
});
