//frontend/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to view your cart.');
        window.location.href = 'login.html';
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBody = document.getElementById('cart-body');
    const totalAmount = document.getElementById('total-amount');
    const emptyCartMsg = document.getElementById('empty-cart-message');

    // Clear existing cart content
    cartBody.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMsg.style.display = 'table-row';
        totalAmount.textContent = 'Total: ₹0.00';
        return;
    }

    emptyCartMsg.style.display = 'none';

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${itemTotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">X</button></td>
        `;
        cartBody.appendChild(row);
    });

    totalAmount.textContent = `Total: ₹${total.toFixed(2)}`;

    // Remove item from cart
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload(); // Re-render the updated cart
        });
    });
});
