// js/user/register.js
import { supabase } from "../../supabase.js";

const form = document.getElementById("register-form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const telegram = document.getElementById("telegram").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, whatsapp, telegram, role: "user" } }
  });

  if (error) {
    alert("Register gagal: " + error.message);
  } else {
    alert("Register berhasil! Silakan login.");
    window.location.href = "login.html";
  }
});
