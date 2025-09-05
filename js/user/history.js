// js/user/history.js
import { supabase } from "../../supabase.js";

const historyList = document.getElementById("history-list");

async function loadHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Harus login dulu!");
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await supabase.from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error loading history:", error.message);
    return;
  }

  historyList.innerHTML = data.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.product_name}</td>
      <td>${o.qty}</td>
      <td>Rp ${o.subtotal}</td>
      <td>${o.status}</td>
    </tr>
  `).join("");
}

// realtime update status
supabase.channel('orders-status')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
    loadHistory();
  })
  .subscribe();

loadHistory();
