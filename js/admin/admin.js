// js/admin/admin.js
import { supabase } from "../../supabase.js";

// ✅ Cek apakah user sudah login & role admin
async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("Anda belum login sebagai admin!");
    window.location.href = "login.html";
    return;
  }

  // cek role admin
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    alert("Anda tidak memiliki akses admin!");
    window.location.href = "login.html";
  }
}

// ✅ Logout function
export async function adminLogout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// Jalankan proteksi di semua halaman admin (kecuali login.html)
if (!window.location.pathname.endsWith("login.html")) {
  checkAdmin();
}
