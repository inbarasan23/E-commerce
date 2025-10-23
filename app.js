// Initialize the app
function init() {
    renderProducts();
    setupEventListeners();
    updateCartCount();
    loadCartFromStorage();
}

// Setup event listeners
function setupEventListeners() {
    // Product card click
    document.getElementById('products-section').addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            showProductDetail(productCard.dataset.id);
        }
    });
    
    // Back to products
    document.getElementById('back-to-products').addEventListener('click', () => {
        document.getElementById('product-detail-page').classList.remove('active');
    });
    
    // Cart icon click
    document.getElementById('cart-icon').addEventListener('click', showCart);
    
    // Close cart
    document.getElementById('close-cart').addEventListener('click', hideCart);
    document.getElementById('overlay').addEventListener('click', hideCart);
    
    // Clear cart
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    
    // CHECKOUT BUTTON
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Add some products first!');
            return;
        }
        showCustomerForm();
        resetFormValidation();
    });
    
    // Customer form submission
    document.getElementById('submit-order').addEventListener('click', () => {
        if (validateForm()) {
            showPaymentOptions();
        }
    });
    
    // Real-time form validation
    document.getElementById('customer-name').addEventListener('input', () => {
        if (document.getElementById('customer-name').value.trim()) {
            document.getElementById('customer-name').classList.remove('error');
            document.getElementById('name-error').classList.remove('show');
        }
    });
    
    document.getElementById('customer-email').addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (document.getElementById('customer-email').value.trim() && emailRegex.test(document.getElementById('customer-email').value)) {
            document.getElementById('customer-email').classList.remove('error');
            document.getElementById('email-error').classList.remove('show');
        }
    });
    
    document.getElementById('customer-phone').addEventListener('input', () => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (document.getElementById('customer-phone').value.trim() && phoneRegex.test(document.getElementById('customer-phone').value.replace(/\D/g, ''))) {
            document.getElementById('customer-phone').classList.remove('error');
            document.getElementById('phone-error').classList.remove('show');
        }
    });
    
    document.getElementById('customer-address').addEventListener('input', () => {
        if (document.getElementById('customer-address').value.trim()) {
            document.getElementById('customer-address').classList.remove('error');
            document.getElementById('address-error').classList.remove('show');
        }
    });
    
    // Back to form from payment
    document.getElementById('back-to-form').addEventListener('click', () => {
        showCustomerForm();
    });
    
    // Payment method selection
    document.getElementById('gpay-btn').addEventListener('click', () => {
        selectedPaymentMethod = 'Google Pay';
        document.getElementById('gpay-btn').classList.add('selected');
        document.getElementById('cod-btn').classList.remove('selected');
        showQRScanner();
    });
    
    document.getElementById('cod-btn').addEventListener('click', () => {
        selectedPaymentMethod = 'Cash on Delivery';
        document.getElementById('cod-btn').classList.add('selected');
        document.getElementById('gpay-btn').classList.remove('selected');
        showSuccessModal();
    });
    
    // Back to payment from QR
    document.getElementById('back-to-payment').addEventListener('click', () => {
        showPaymentOptions();
    });
    
    // Confirm payment
    document.getElementById('confirm-payment').addEventListener('click', showSuccessModal);
    
    // Cancel order
    document.getElementById('cancel-order').addEventListener('click', () => {
        hideCart();
    });
    
    // Continue shopping
    document.getElementById('continue-shopping').addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('active');
    });
    
    // Search functionality
    document.getElementById('search-btn').addEventListener('click', searchProducts);
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // Category filter
    document.getElementById('category-filter').addEventListener('change', filterProductsByCategory);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);