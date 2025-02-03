document.addEventListener('DOMContentLoaded', () => {
    // URL'den masa numarasını al
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table');
    
    if (tableNumber) {
        document.getElementById('table-number').textContent = tableNumber;
    } else {
        window.location.href = 'error.html'; // Masa numarası yoksa hata sayfasına yönlendir
    }

    // Sekme değiştirme işlevselliği
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Aktif sekmeyi değiştir
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Menü bölümünü değiştir
            menuSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === category) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Menüyü yükle
    loadMenu();

    // Sipariş takibi için
    let currentOrder = [];

    function loadMenu() {
        Object.keys(menuData).forEach(category => {
            const section = document.getElementById(category);
            
            menuData[category].forEach(item => {
                const itemElement = createMenuItem(item);
                section.appendChild(itemElement);
            });
        });
    }

    function createMenuItem(item) {             //resimleri oluşturduğumuz ve isim
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="menu-image">` : ''}
            <h3>${item.name}</h3>
            <p>${item.price.toFixed(2)} TL</p>
            <button onclick="addToOrder(${item.id})">Sepete Ekle</button>
        `;
        return div;
    }
    

    // Sepete ekleme fonksiyonu
    window.addToOrder = (itemId) => {
        let item = null;
        
        // Menüde ürünü bul
        Object.values(menuData).forEach(category => {
            const found = category.find(i => i.id === itemId);
            if (found) item = found;
        });

        if (item) {
            currentOrder.push(item);
            updateOrderSummary();
        }
    };

    function updateOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const totalAmount = document.getElementById('total-amount');
        
        orderItems.innerHTML = '';
        let total = 0;

        // Siparişleri ürün bazında grupla
        const groupedItems = currentOrder.reduce((acc, item) => {
            if (!acc[item.id]) {
                acc[item.id] = {
                    ...item,
                    quantity: 1
                };
            } else {
                acc[item.id].quantity += 1;
            }
            return acc;
        }, {});

        // Gruplanmış siparişleri göster
        Object.values(groupedItems).forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <div class="order-item-details">
                    <span class="item-name">${item.name}</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="item-price">${(item.price * item.quantity).toFixed(2)} TL</span>
                    <button class="delete-btn" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            orderItems.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        totalAmount.textContent = `${total.toFixed(2)} TL`;

        // Sepet boşsa temizle butonunu göster/gizle
        const clearButton = document.getElementById('clear-cart');
        if (Object.keys(groupedItems).length > 0) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
    }

    // Miktar güncelleme fonksiyonu
    window.updateQuantity = (itemId, change) => {
        const itemIndex = currentOrder.findIndex(item => item.id === itemId);
        
        if (change === -1) {
            // Eğer ürün varsa bir tane azalt
            currentOrder = currentOrder.filter((item, index) => {
                if (item.id === itemId) {
                    return index !== itemIndex;
                }
                return true;
            });
        } else if (change === 1) {
            // Ürünü bir tane artır
            const item = Object.values(menuData)
                .flat()
                .find(item => item.id === itemId);
            if (item) {
                currentOrder.push(item);
            }
        }
        
        updateOrderSummary();
    };

    // Ürünü tamamen kaldır
    window.removeItem = (itemId) => {
        currentOrder = currentOrder.filter(item => item.id !== itemId);
        updateOrderSummary();
    };

    // Sepeti temizle
    window.clearCart = () => {
        currentOrder = [];
        updateOrderSummary();
    };

    // Sipariş onaylama
    document.getElementById('submit-order').addEventListener('click', () => {
        if (currentOrder.length === 0) {
            alert('Lütfen sipariş vermek için ürün ekleyin!');
            return;
        }

        const order = {
            tableNumber,
            items: currentOrder,
            total: currentOrder.reduce((sum, item) => sum + item.price, 0),
            status: 'new',
            timestamp: new Date().toISOString()
        };

        // Siparişi localStorage'a kaydet
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Siparişi sıfırla
        currentOrder = [];
        updateOrderSummary();
        alert('Siparişiniz alındı!');
    });
});

