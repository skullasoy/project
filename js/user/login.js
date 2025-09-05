import { supabase } from "../../supabase.js";
import { showAlert } from "./user.js";

const form = document.getElementById("login-form");

form.onsubmit = async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    showAlert("Login gagal!", "error");
  } else {
    showAlert("Login berhasil!", "success");
    window.location.href = "dashboard.html";
  }
};
