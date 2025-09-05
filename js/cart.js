// Shopping cart functionality for Snacks Point
console.log('Cart module loaded');

// Cart state
let cart = JSON.parse(localStorage.getItem('snacksPointCart')) || [];

// DOM elements
const cartCountElement = document.getElementById('cart-count');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// Cart functions
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = `${totalItems} Items`;
    }
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2);
    }
    return total;
}

function saveCart() {
    localStorage.setItem('snacksPointCart', JSON.stringify(cart));
}

function addToCart(itemId, itemName, itemPrice) {
    // Find existing item
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: parseFloat(itemPrice),
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Show feedback
    showAddToCartFeedback(itemName);
    
    console.log('Added to cart:', itemName, cart);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateItemQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                <div class="cart-item-info">
                    <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${item.name}</h4>
                    <p style="color: #6b7280; font-size: 0.875rem;">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="quantity-controls" style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})" 
                                style="width: 32px; height: 32px; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer;">-</button>
                        <span style="min-width: 2rem; text-align: center; font-weight: 600;">${item.quantity}</span>
                        <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})" 
                                style="width: 32px; height: 32px; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer;">+</button>
                    </div>
                    <div class="item-total" style="font-weight: 600; color: #4A90E2; min-width: 4rem; text-align: right;">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button onclick="removeFromCart('${item.id}')" 
                            style="color: #ef4444; background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0.25rem;">&times;</button>
                </div>
            </div>
        `).join('');
    }
    
    updateCartTotal();
}

function showAddToCartFeedback(itemName) {
    // Find the specific button that was clicked using the itemName
    const allButtons = document.querySelectorAll('.add-to-cart-btn');
    
    allButtons.forEach(btn => {
        // Check if this button's onclick contains the itemName
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(itemName.replace(' ', '-').toLowerCase())) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ Added!';
            btn.style.background = '#10b981';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#4A90E2';
                btn.disabled = false;
            }, 1500);
        }
    });
}

function openCartModal() {
    if (cartModal) {
        updateCartDisplay();
        cartModal.style.display = 'flex';
    }
}

function closeCartModal() {
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

// Make functions global so HTML onclick can access them
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateItemQuantity = updateItemQuantity;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.clearCart = clearCart;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartDisplay();
    
    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
});

// Export cart functions for other modules
window.CartAPI = {
    getCart: () => cart,
    getCartCount: () => cart.reduce((total, item) => total + item.quantity, 0),
    getCartTotal: () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
};