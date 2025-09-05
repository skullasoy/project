// js/admin/admin-products.js
import { supabase } from "../../supabase.js";

// Elemen DOM
const productList = document.getElementById("product-list");
const addForm = document.getElementById("add-product-form");

// ✅ Load produk
async function loadProducts() {
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) {
    console.error("Gagal load produk:", error.message);
    return;
  }

  productList.innerHTML = "";
  data.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>Rp ${p.price}</td>
      <td><img src="${p.image_url}" alt="${p.name}" width="50"></td>
      <td>
        <button onclick="deleteProduct(${p.id})">Hapus</button>
      </td>
    `;
    productList.appendChild(tr);
  });
}

// ✅ Tambah produk
addForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = parseInt(document.getElementById("product-price").value);
  const image_url = document.getElementById("product-image").value;

  const { error } = await supabase.from("products").insert([{ name, price, image_url }]);
  if (error) {
    alert("Gagal tambah produk: " + error.message);
  } else {
    alert("Produk berhasil ditambahkan!");
    addForm.reset();
    loadProducts();
  }
});

// ✅ Hapus produk
window.deleteProduct = async function (id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    alert("Gagal hapus produk: " + error.message);
  } else {
    alert("Produk berhasil dihapus!");
    loadProducts();
  }
};

// Jalankan saat halaman dibuka
loadProducts();
