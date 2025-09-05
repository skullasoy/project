import { checkUserSession, getCart, saveCart, showAlert } from "./user.js";
import { supabase } from "../../supabase.js";

checkUserSession(false); // boleh lihat walau belum login

const productList = document.getElementById("product-list");
const announcementBox = document.getElementById("announcement");

// ✅ load produk
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return console.error(error);

  if (!data.length) {
    productList.innerHTML = "<p>Tidak ada produk.</p>";
    return;
  }

  productList.innerHTML = "";
  data.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Rp${p.price.toLocaleString()}</p>
      <button class="buy-btn">BUY</button>
      <button class="cart-btn">+ Keranjang</button>
    `;
    card.querySelector(".buy-btn").onclick = () => buyNow(p);
    card.querySelector(".cart-btn").onclick = () => addToCart(p);
    productList.appendChild(card);
  });
}

// ✅ tambah ke cart
function addToCart(product) {
  const cart = getCart();
  const found = cart.find((c) => c.id === product.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showAlert("Produk ditambahkan ke keranjang!", "success");
}

// ✅ langsung beli
async function buyNow(product) {
  const nama = prompt("Masukkan nama pembeli:");
  const wa = prompt("Masukkan nomor WhatsApp:");
  const tg = prompt("Masukkan username Telegram (opsional):") || null;

  if (!nama || !wa) {
    showAlert("Nama dan WhatsApp wajib diisi!", "error");
    return;
  }

  const { error } = await supabase.from("orders").insert([{
    user_name: nama,
    whatsapp: wa,
    telegram: tg,
    items: [{ id: product.id, name: product.name, price: product.price, qty: 1 }],
    status: "pending",
    subtotal: product.price
  }]);

  if (error) {
    console.error(error);
    showAlert("Gagal checkout!", "error");
  } else {
    showAlert("Pesanan berhasil dibuat!", "success");
  }
}

// ✅ load announcement
async function loadAnnouncement() {
  const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(1);
  if (data && data.length) {
    announcementBox.innerHTML = `<p><b>Pengumuman:</b> ${data[0].message}</p>`;
  }
}

loadProducts();
loadAnnouncement();
