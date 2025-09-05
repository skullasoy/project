// js/user/dashboard.js
import { supabase } from "../../supabase.js";

const productList = document.getElementById("product-list");
const announcementList = document.getElementById("announcement-list");

// ✅ load announcement
async function loadAnnouncements() {
  const { data, error } = await supabase.from("announcements").select("*").order("id", { ascending: false });
  if (error) {
    console.error("Error loading announcements:", error.message);
    return;
  }
  announcementList.innerHTML = data.map(a => `
    <div class="card">
      <h3>${a.title}</h3>
      <p>${a.content}</p>
    </div>
  `).join("");
}

// ✅ load produk
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) {
    console.error("Error loading products:", error.message);
    return;
  }

  productList.innerHTML = data.map(p => `
    <div class="card">
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Rp ${p.price}</p>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Masukkan Keranjang</button>
      <button onclick="buyNow(${p.id}, '${p.name}', ${p.price})">Buy</button>
    </div>
  `).join("");
}

// ✅ simpan keranjang ke localStorage
window.addToCart = function (id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk masuk ke keranjang!");
};

// ✅ langsung beli
window.buyNow = function (id, name, price) {
  const username = prompt("Masukkan nama pembeli:");
  const whatsapp = prompt("Masukkan nomor WhatsApp:");
  const telegram = prompt("Masukkan username Telegram (opsional):");

  if (!username || !whatsapp) {
    alert("Data tidak lengkap!");
    return;
  }

  supabase.from("orders").insert([{
    user_id: supabase.auth.getUser().data?.user?.id,
    username,
    whatsapp,
    telegram,
    product_id: id,
    product_name: name,
    qty: 1,
    subtotal: price,
    status: "pending"
  }]).then(({ error }) => {
    if (error) {
      alert("Gagal membuat pesanan: " + error.message);
    } else {
      alert("Pesanan berhasil dibuat!");
      window.location.href = "history.html";
    }
  });
};

// load saat pertama kali
loadAnnouncements();
loadProducts();
