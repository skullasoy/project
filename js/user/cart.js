import { checkUserSession, getCart, saveCart, showAlert } from "./user.js";
import { supabase } from "../../supabase.js";

checkUserSession();

const cartTable = document.getElementById("cart-table");
const checkoutBtn = document.getElementById("checkout-btn");

function renderCart() {
  const cart = getCart();
  cartTable.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    cartTable.innerHTML = "<p>Keranjang kosong.</p>";
    return;
  }

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${item.name}</span>
      <input type="number" value="${item.qty}" min="1" data-index="${i}">
      <span>Rp${(item.price * item.qty).toLocaleString()}</span>
    `;
    row.querySelector("input").onchange = (e) => {
      const cart = getCart();
      cart[i].qty = parseInt(e.target.value) || 1;
      saveCart(cart);
      renderCart();
    };
    cartTable.appendChild(row);
  });

  const totalRow = document.createElement("div");
  totalRow.className = "cart-total";
  totalRow.innerHTML = `<strong>Total: Rp${total.toLocaleString()}</strong>`;
  cartTable.appendChild(totalRow);
}

checkoutBtn.onclick = async () => {
  const cart = getCart();
  if (!cart.length) {
    showAlert("Keranjang kosong!", "error");
    return;
  }

  const nama = prompt("Masukkan nama pembeli:");
  const wa = prompt("Masukkan nomor WhatsApp:");
  const tg = prompt("Masukkan username Telegram (opsional):") || null;

  if (!nama || !wa) {
    showAlert("Nama dan WhatsApp wajib diisi!", "error");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const { error } = await supabase.from("orders").insert([{
    user_name: nama,
    whatsapp: wa,
    telegram: tg,
    items: cart,
    status: "pending",
    subtotal
  }]);

  if (error) {
    console.error(error);
    showAlert("Gagal checkout!", "error");
  } else {
    saveCart([]);
    renderCart();
    showAlert("Pesanan berhasil dibuat!", "success");
  }
};

renderCart();
