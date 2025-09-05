import { checkUserSession } from "./user.js";
import { supabase } from "../../supabase.js";

checkUserSession();

const historyBox = document.getElementById("history-list");

async function loadHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return console.error(error);

  historyBox.innerHTML = "";
  if (!data.length) {
    historyBox.innerHTML = "<p>Belum ada riwayat pesanan.</p>";
    return;
  }

  data.forEach((o) => {
    const div = document.createElement("div");
    div.className = "history-card";
    div.innerHTML = `
      <h4>Pesanan #${o.id}</h4>
      <p>Status: <b>${o.status}</b></p>
      <p>Total: Rp${o.subtotal.toLocaleString()}</p>
    `;
    historyBox.appendChild(div);
  });
}

// realtime update
supabase.channel("orders-channel")
  .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadHistory)
  .subscribe();

loadHistory();
