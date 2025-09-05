// js/user/cart.js
import { supabase } from "../../supabase.js";

const cartList = document.getElementById("cart-list");
const checkoutBtn = document.getElementById("checkout");

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartList.innerHTML = cart.map((item, i) => `
    <tr>
      <td>${item.name}</td>
      <td><input type="number" value="${item.qty}" min="1" onchange="updateQty(${i}, this.value)"></td>
      <td>Rp ${item.price * item.qty}</td>
      <td><button onclick="removeItem(${i})">Hapus</button></td>
    </tr>
  `).join("");
}

window.updateQty = function (index, qty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].qty = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
};

window.removeItem = function (index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
};

checkoutBtn?.addEventListener("click", async () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return alert("Keranjang kosong!");

  const username = prompt("Masukkan nama pembeli:");
  const whatsapp = prompt("Masukkan nomor WhatsApp:");
  const telegram = prompt("Masukkan username Telegram (opsional):");

  if (!username || !whatsapp) {
    alert("Data tidak lengkap!");
    return;
  }

  for (let item of cart) {
    await supabase.from("orders").insert([{
      user_id: supabase.auth.getUser().data?.user?.id,
      username,
      whatsapp,
      telegram,
      product_id: item.id,
      product_name: item.name,
      qty: item.qty,
      subtotal: item.price * item.qty,
      status: "pending"
    }]);
  }

  localStorage.removeItem("cart");
  alert("Pesanan berhasil dibuat!");
  window.location.href = "history.html";
});

loadCart();
