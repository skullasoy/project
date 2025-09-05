// js/admin/admin-orders.js
import { supabase } from "../../supabase.js";

// Elemen DOM
const pendingTable = document.getElementById("pending-orders");
const doneTable = document.getElementById("done-orders");
const canceledTable = document.getElementById("canceled-orders");

// ✅ Load pesanan
async function loadOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, users(email)")
    .order("id", { ascending: false });

  if (error) {
    console.error("Gagal load pesanan:", error.message);
    return;
  }

  pendingTable.innerHTML = "";
  doneTable.innerHTML = "";
  canceledTable.innerHTML = "";

  data.forEach((order) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.users?.email || "N/A"}</td>
      <td>${order.whatsapp || "-"}</td>
      <td>${order.product_name}</td>
      <td>${order.quantity}</td>
      <td>Rp ${order.total_price}</td>
      <td>${order.status}</td>
      ${
        order.status === "pending"
          ? `<td>
              <button onclick="updateOrder(${order.id}, 'done')">Selesai</button>
              <button onclick="updateOrder(${order.id}, 'canceled')">Batal</button>
             </td>`
          : ""
      }
    `;

    if (order.status === "pending") pendingTable.appendChild(tr);
    else if (order.status === "done") doneTable.appendChild(tr);
    else if (order.status === "canceled") canceledTable.appendChild(tr);
  });
}

// ✅ Update status pesanan
window.updateOrder = async function (id, status) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) {
    alert("Gagal update pesanan: " + error.message);
  } else {
    alert("Pesanan berhasil diupdate!");
    loadOrders();
  }
};

// Jalankan saat halaman dibuka
loadOrders();
