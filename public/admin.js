    document.addEventListener('DOMContentLoaded', () => {
        createTables();
        loadOrders();
        setInterval(loadOrders, 5000);
    });

    function createTables() {
        const tablesGrid = document.getElementById('tables-grid');
        const tableCount = 16;
        
        tablesGrid.innerHTML = '';
        
        for (let i = 1; i <= tableCount; i++) {
            const tableCard = document.createElement('div');
            tableCard.className = 'table-card';
            tableCard.id = `table-${i}`;
            tableCard.innerHTML = `
                <h3>Masa ${i}</h3>
                <p class="status">Boş</p>
            `;
            
            tableCard.addEventListener('click', () => {
                document.querySelectorAll('.table-card').forEach(card => {
                    card.classList.remove('selected');
                });
                tableCard.classList.add('selected');
                showTableOrder(i);
            });
            
            tablesGrid.appendChild(tableCard);
        }
    }

    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        document.querySelectorAll('.table-card').forEach(table => {
            table.classList.remove('active');
            table.querySelector('.status').textContent = 'Boş';
        });
        
        orders.forEach(order => {
            const tableCard = document.getElementById(`table-${order.tableNumber}`);
            if (tableCard) {
                tableCard.classList.add('active');
                tableCard.querySelector('.status').textContent = 'Sipariş Var';
            }
        });
    }

    function showTableOrder(tableNumber) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = `<h3>Masa ${tableNumber} Siparişleri</h3>`;
        
        const tableOrders = orders.filter(order => parseInt(order.tableNumber) === tableNumber);
        
        if (tableOrders.length > 0) {
            const combinedItems = {};
            tableOrders.forEach(order => {
                order.items.forEach(item => {
                    if (combinedItems[item.name]) {
                        combinedItems[item.name].count++;
                        combinedItems[item.name].total += item.price;
                    } else {
                        combinedItems[item.name] = { count: 1, total: item.price };
                    }
                });
            });
            
            const itemsHTML = Object.entries(combinedItems).map(([name, details]) => 
                `<li>${name} x${details.count} - ${details.total.toFixed(2)} TL</li>`
            ).join('');
            
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <ul>${itemsHTML}</ul>
                <p><strong>Toplam: ${tableOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} TL</strong></p>
                <button onclick="completeOrder('${tableOrders[0].timestamp}', ${tableNumber})">Siparişi Tamamla</button>
            `;
            
            ordersList.appendChild(card);
        } else {
            ordersList.innerHTML += '<p>Bu masada aktif bir sipariş yok.</p>';
        }
    }

    window.completeOrder = (timestamp, tableNumber) => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = orders.filter(order => 
            !(order.timestamp === timestamp && parseInt(order.tableNumber) === tableNumber)
        );
        
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        loadOrders();
        showTableOrder(tableNumber);
    };

    document.addEventListener('DOMContentLoaded', () => {
        const auth = getAuth();
        const logoutButton = document.getElementById('logoutButton');
        
        logoutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log("Çıkış başarılı");
                window.location.href = 'admin-login-screen.html';
            }).catch((error) => {
                console.error('Çıkış yapılırken hata oluştu:', error);
            });
        });
    });
