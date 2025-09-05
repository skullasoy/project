import { supabase } from "../../supabase.js";
import { showAlert } from "./user.js";

const form = document.getElementById("register-form");

form.onsubmit = async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    showAlert("Registrasi gagal!", "error");
  } else {
    showAlert("Registrasi berhasil, silakan login!", "success");
    window.location.href = "login.html";
  }
};
