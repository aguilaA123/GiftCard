import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =======================
// Config Firebase
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyBzrJdHVSlpStM82oyh5CwrvE_sbqfXAnM",
  authDomain: "gift-card-16353.firebaseapp.com",
  projectId: "gift-card-16353",
  storageBucket: "gift-card-16353.firebasestorage.app",
  messagingSenderId: "93910560278",
  appId: "1:93910560278:web:616c5d2ec41b59cc824f37"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// DOM
// =======================
const usedCodeDiv = document.getElementById("usedCode");
const correoEl = document.getElementById("correo");
const passwordEl = document.getElementById("password");
const perfilEl = document.getElementById("perfil");
const pinEl = document.getElementById("pin");
const inicioEl = document.getElementById("inicio");
const estadoEl = document.getElementById("estadoText");
const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const emailBtn = document.getElementById("receiveEmailBtn");
const emailForm = document.getElementById("emailForm");
const emailInput = document.getElementById("emailInput");
const emailSubmit = document.getElementById("emailSubmit");

// =======================
// Leer código de la URL
// =======================
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) usedCodeDiv.textContent = "No se proporcionó código en la URL.";

// =======================
// Botón correo
// =======================
emailBtn.addEventListener("click", () => {
  emailForm.classList.toggle("hidden");
});

emailSubmit.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) return;

  const ref = doc(db, "GiftCard", code);
  await updateDoc(ref, { CorreoCliente: email });
  emailForm.classList.add("hidden");
  emailInput.value = "";
});

// =======================
// Datos en tiempo real
// =======================
function loadData() {
  const ref = doc(db, "GiftCard", code);

  onSnapshot(ref, async (snap) => {
    if (!snap.exists()) {
      usedCodeDiv.textContent = "Código no encontrado.";
      return;
    }

    const data = snap.data();
    usedCodeDiv.textContent = `Código: ${code}`;

    // Guardar fecha actual si Inicio está vacío o "00/00/00"
    let now = new Date();
    const today = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getFullYear()).slice(-2)}`;
    let inicioFecha = data.Inicio;
    if (!inicioFecha || inicioFecha === "00/00/00") {
      inicioFecha = today;
      await updateDoc(ref, { Inicio: inicioFecha });
    }

    // Mostrar datos
    correoEl.textContent = data.Correo || "—";
    passwordEl.textContent = data.Contraseña || "—";
    perfilEl.textContent = data.Perfil || "—";
    pinEl.textContent = data.PIN || "—";
    inicioEl.textContent = inicioFecha;

    // Estado
    let estado = data.Estado || "Off";
    if (estado === "On") {
      estadoEl.textContent = "Activo";
      estadoEl.className = "activo";
    } else if (estado === "Ver") {
      estadoEl.textContent = "Progreso";
      estadoEl.className = "progreso";
    } else {
      estadoEl.textContent = "Desactivado";
      estadoEl.className = "desactivado";
    }

    // Texto principal según datos
    if (data.Correo && data.Contraseña && data.Perfil && data.PIN) {
      mainTitle.textContent = "Cuenta Activada";
      mainSubtitle.textContent = "Ingrese los datos mostrados en pantalla para acceder a su cuenta en la plataforma que tiene su GiftCard.";
      emailBtn.style.display = "none";
    } else {
      mainTitle.textContent = "Cuenta en Progreso";
      mainSubtitle.innerHTML = "Su cuenta aún se está generando. Puede recibir notificaciones rápidas por correo.";
      emailBtn.style.display = "block";
    }
  });
}

loadData();
