// toggleOrderSummary.js

document.addEventListener('DOMContentLoaded', () => {
    // Sağ üst köşeye alışveriş sepeti butonu ekle
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-order-summary';
    toggleButton.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    document.body.appendChild(toggleButton);

    // Sipariş özeti seç ve ilk başta gizle
    const orderSummary = document.querySelector('.order-summary');
    orderSummary.style.display = 'none';
    let isVisible = false;

    // Butona tıklayınca görünürlük durumu değiştir
    toggleButton.addEventListener('click', () => {
        isVisible = !isVisible;
        orderSummary.style.display = isVisible ? 'block' : 'none';
    });
});
