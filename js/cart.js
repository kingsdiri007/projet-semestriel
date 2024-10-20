const cartItemsList = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout-button');

// Function to load and display cart items
function loadCart() {
    // Clear existing cart display
    cartItemsList.innerHTML = '';
    
    // Retrieve game data from local storage
    const cartItems = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cartItem_')) {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                cartItems.push(item);
            } catch (error) {
                console.error('Error parsing cart item:', error);
                localStorage.removeItem(key);
            }
        }
    }

    // Calculate and update total price
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += parseFloat(item.price);
    });
    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;

    // Display game data in the cart
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
        return;
    }

    cartItems.forEach(item => {
        const cartItemElement = document.createElement('li');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <button class="cancel-button">Cancel</button>
        `;

        // Add event listener to the cancel button
        const cancelButton = cartItemElement.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            if (confirm("Do you want to remove this game from your cart?")) {
                const cartItemKey = `cartItem_${item.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
                localStorage.removeItem(cartItemKey);
                loadCart(); // Reload cart display
            }
        });

        cartItemsList.appendChild(cartItemElement);
    });
}

// Handle checkout process
checkoutButton.addEventListener('click', async () => {
    if (localStorage.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const creditCardNumber = prompt("Enter your credit card number");

    if (creditCardNumber && creditCardNumber.length === 16 && /^\d+$/.test(creditCardNumber)) {
        alert("Processing your order...");
        
        // Clear cart items from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('cartItem_')) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        alert("Thank you for your purchase! Your games are ready to download!");
        loadCart(); // Refresh cart display
    } else {
        alert("Please enter a valid 16-digit credit card number.");
    }
});

// Load cart when page loads
loadCart();