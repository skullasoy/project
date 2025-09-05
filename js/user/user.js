// js/user/user.js
import { supabase } from "../../supabase.js";

// ✅ cek login user
export async function checkUserSession(redirect = true) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && redirect) {
    window.location.href = "login.html";
  }
  return user;
}

// ✅ logout
export async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// ✅ util tampilkan notifikasi
export function showAlert(msg, type = "info") {
  const box = document.createElement("div");
  box.className = `alert ${type}`;
  box.innerText = msg;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3000);
}

// ✅ ambil cart dari localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// ✅ simpan cart
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
