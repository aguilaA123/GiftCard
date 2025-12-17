import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =======================
// Configuración Firebase
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
const input = document.getElementById("accessCode");
const form = document.querySelector(".code-form");
const flash = document.getElementById("flashMessage");

// =======================
// Formateo automático del código
// =======================
input.addEventListener("input", (e) => {
  let value = e.target.value.replace(/[^0-9]/g, "");
  if (value.length > 8) value = value.slice(0, 8);
  if (value.length > 4) value = value.slice(0, 4) + " - " + value.slice(4);
  e.target.value = value;
});

// =======================
// Verificar código en Firebase
// =======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const code = input.value.replace(/[^0-9]/g, "");

  if (code.length !== 8) {
    showError("Ingresa un código válido");
    return;
  }

  try {
    const ref = doc(db, "GiftCard", code);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      // Actualizar último acceso en Firebase
      await updateDoc(ref, { ultimoAcceso: serverTimestamp() });

      // Redirigir a la página GiftCard con el código en la URL
      window.location.href = `../gift-card/?code=${code}`;
    } else {
      showError("El código no existe");
    }
  } catch (err) {
    console.error(err);
    showError("Error de conexión");
  }
});

// =======================
// Flash message
// =======================
function showError(msg) {
  flash.textContent = msg;
  flash.classList.remove("show", "hide");
  void flash.offsetWidth; // reinicia animación
  flash.classList.add("show");
  setTimeout(() => flash.classList.add("hide"), 2200);
}
