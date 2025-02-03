import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';

// Firebase SDK'dan gerekli işlevleri ekliyoruz
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCswpNttnouhwxPIckJ8Ghtz-ad1v9yPg8",
  authDomain: "qrmenu-e6f00.firebaseapp.com",
  projectId: "qrmenu-e6f00",
  storageBucket: "qrmenu-e6f00.firebasestorage.app",
  messagingSenderId: "405734980611",
  appId: "1:405734980611:web:fdd1f2b71bf2bc7bba6236",
  measurementId: "G-E4X38T03YN"
};

// Firebase'i başlatıyoruz
const app = initializeApp(firebaseConfig);

// Firestore'u başlatıyoruz
const db = getFirestore(app);

// Masaya sipariş ekleme fonksiyonu
async function addOrder(tableId, orderDetails) {
  try {
    const tableRef = doc(db, "tables", tableId);
    await setDoc(tableRef, { 
      orders: orderDetails,
      timestamp: new Date().toISOString() // Siparişin zaman bilgisi
    }, { merge: true });
    console.log(`Masa ${tableId} için sipariş başarıyla kaydedildi!`);
  } catch (error) {
    console.error("Sipariş eklerken bir hata oluştu:", error);
  }
}

// Masadan sipariş alma fonksiyonu
async function getOrders(tableId) {
  try {
    const tableRef = doc(db, "tables", tableId);
    const tableDoc = await getDoc(tableRef);
    if (tableDoc.exists()) {
      console.log(`Masa ${tableId} siparişleri:`, tableDoc.data().orders);
    } else {
      console.log(`Masa ${tableId} için sipariş bulunmuyor.`);
    }
  } catch (error) {
    console.error("Siparişleri alırken bir hata oluştu:", error);
  }
}

// Tüm masaların siparişlerini çekme fonksiyonu
async function getAllOrders() {
  try {
    const tablesRef = collection(db, "tables");
    const querySnapshot = await getDocs(tablesRef);
    querySnapshot.forEach((doc) => {
      console.log(`Masa ${doc.id}:`, doc.data());
    });
  } catch (error) {
    console.error("Tüm siparişleri çekerken bir hata oluştu:", error);
  }
}

// Test için örnek çağrılar
// addOrder("table1", ["Pizza", "Coke"]);
// getOrders("table1");
// getAllOrders();

// HTML içeriği
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>QR Menu Order</h1>
    <div class="card">
      <button id="addOrder" type="button">Sipariş Ekle</button>
      <button id="getOrder" type="button">Siparişleri Göster</button>
    </div>
    <p class="read-the-docs">
      Firebase bağlantısını test etmek için butonları kullanabilirsiniz.
    </p>
  </div>
`;

// Butonlara event listener ekliyoruz
document.querySelector('#addOrder').addEventListener('click', () => {
  addOrder("table1", ["Burger", "Fries"]);
});

document.querySelector('#getOrder').addEventListener('click', () => {
  getOrders("table1");
});

setupCounter(document.querySelector('#counter'));
