// Cart functionality
let cart = [];
let selectedPaymentMethod = '';

// Add to cart function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    renderCartItems();
    saveCartToStorage();
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id != id);
    updateCartCount();
    renderCartItems();
    saveCartToStorage();
}

// Increase item quantity
function increaseQuantity(id) {
    const item = cart.find(item => item.id == id);
    if (item) {
        item.quantity += 1;
        updateCartCount();
        renderCartItems();
        saveCartToStorage();
    }
}

// Decrease item quantity
function decreaseQuantity(id) {
    const item = cart.find(item => item.id == id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartCount();
            renderCartItems();
            saveCartToStorage();
        }
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('inbashop_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('inbashop_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        renderCartItems();
    }
}

// Save purchase to localStorage
function savePurchaseToStorage(orderData) {
    const purchases = JSON.parse(localStorage.getItem('inbashop_purchases') || '[]');
    purchases.push({
        ...orderData,
        id: Date.now(),
        date: new Date().toISOString()
    });
    localStorage.setItem('inbashop_purchases', JSON.stringify(purchases));
}

// Update cart count in the header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
        // Reset total to 0 when cart is empty
        document.getElementById('cart-total-price').textContent = '0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="item-price">₹${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            decreaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            removeFromCart(id);
        });
    });
    
    // Update total price
    updateCartTotal();
}

// Update cart total - FIXED CALCULATION
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-price').textContent = total.toFixed(2);
    return total; // Return the total for use elsewhere
}

// Show cart sidebar
function showCart() {
    renderCartItems();
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide cart sidebar
function hideCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Hide all forms
    document.getElementById('customer-form').classList.remove('active');
    document.getElementById('payment-options').classList.remove('active');
    document.getElementById('qr-scanner').classList.remove('active');
}

// Show customer form
function showCustomerForm() {
    document.getElementById('customer-form').classList.add('active');
    document.getElementById('payment-options').classList.remove('active');
    document.getElementById('qr-scanner').classList.remove('active');
}

// Show payment options
function showPaymentOptions() {
    document.getElementById('payment-options').classList.add('active');
    document.getElementById('customer-form').classList.remove('active');
    document.getElementById('qr-scanner').classList.remove('active');
}

// Show QR scanner
function showQRScanner() {
    document.getElementById('qr-scanner').classList.add('active');
    document.getElementById('payment-options').classList.remove('active');
    document.getElementById('customer-form').classList.remove('active');
    
    // Update QR code with total amount
    const total = updateCartTotal(); // Get the correct total
    document.querySelector('.qr-code img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9790487064@ybl&pn=InbaShop&am=${total}&cu=INR`;
    
    // Simulate payment processing
    const processing = document.querySelector('.processing');
    const successMessage = document.querySelector('.success-message');
    
    // Reset UI state
    processing.style.display = 'flex';
    successMessage.style.display = 'none';
    
    // Simulate waiting for payment confirmation
    setTimeout(() => {
        processing.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Enable the confirm payment button
        document.getElementById('confirm-payment').disabled = false;
    }, 3000);
}

// Show success modal
function showSuccessModal() {
    // Save purchase to localStorage
    const total = updateCartTotal();
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerPhone = document.getElementById('customer-phone');
    const customerAddress = document.getElementById('customer-address');
    const customerBio = document.getElementById('customer-bio');
    
    const orderData = {
        items: [...cart],
        total: total,
        customer: {
            name: customerName.value,
            email: customerEmail.value,
            phone: customerPhone.value,
            address: customerAddress.value,
            bio: customerBio.value
        },
        paymentMethod: selectedPaymentMethod,
        status: 'completed'
    };
    
    savePurchaseToStorage(orderData);
    
    document.getElementById('success-modal').classList.add('active');
    hideCart();
    
    // Set order details
    document.getElementById('order-total').textContent = total.toFixed(2);
    document.getElementById('payment-method').textContent = selectedPaymentMethod;
    
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('<br>');
    
    document.getElementById('order-summary').innerHTML = orderSummary;
    
    // Clear cart after successful purchase
    cart = [];
    updateCartCount();
    saveCartToStorage();
}

// Form validation
function validateForm() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerPhone = document.getElementById('customer-phone');
    const customerAddress = document.getElementById('customer-address');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const addressError = document.getElementById('address-error');
    
    let isValid = true;
    
    // Reset errors
    resetFormValidation();
    
    // Name validation
    if (!customerName.value.trim()) {
        customerName.classList.add('error');
        nameError.classList.add('show');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.value.trim() || !emailRegex.test(customerEmail.value)) {
        customerEmail.classList.add('error');
        emailError.classList.add('show');
        isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!customerPhone.value.trim() || !phoneRegex.test(customerPhone.value.replace(/\D/g, ''))) {
        customerPhone.classList.add('error');
        phoneError.classList.add('show');
        isValid = false;
    }
    
    // Address validation
    if (!customerAddress.value.trim()) {
        customerAddress.classList.add('error');
        addressError.classList.add('show');
        isValid = false;
    }
    
    return isValid;
}

// Reset form validation
function resetFormValidation() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerPhone = document.getElementById('customer-phone');
    const customerAddress = document.getElementById('customer-address');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const addressError = document.getElementById('address-error');
    
    customerName.classList.remove('error');
    customerEmail.classList.remove('error');
    customerPhone.classList.remove('error');
    customerAddress.classList.remove('error');
    
    nameError.classList.remove('show');
    emailError.classList.remove('show');
    phoneError.classList.remove('show');
    addressError.classList.remove('show');
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartCount();
    renderCartItems();
    saveCartToStorage();
}