// Product data
const products = [
    {
        id: 1,
        name: "Holo-Watch X9",
        price: 599.99,
        originalPrice: 799.99,
        image: "holo.jpeg",
        category: "electronics",
        specs: [
            "Holographic Display",
            "Health Monitoring",
            "Water Resistant",
            "7-day Battery Life"
        ],
        reviews: [
            {
                user: "TechEnthusiast",
                comment: "This watch is amazing! The holographic display is crystal clear.",
                rating: 5
            },
            {
                user: "GadgetLover",
                comment: "Best smartwatch I've ever owned. Battery life is impressive.",
                rating: 4.5
            }
        ]
    },
    {
        id: 2,
        name: "Smart Fridge",
        price: 1499.99,
        originalPrice: 1999.99,
        image: "smart.png",
        category: "home",
        specs: [
            "Smart Cooling Technology",
            "Energy Efficient",
            "Voice Control",
            "Food Inventory Tracking"
        ],
        reviews: [
            {
                user: "HomeChef",
                comment: "This fridge keeps everything at the perfect temperature. Love the smart features!",
                rating: 4.5
            }
        ]
    },
    {
        id: 3,
        name: "Neural Headphones",
        price: 349.99,
        originalPrice: 449.99,
        image: "headphones.png",
        category: "electronics",
        specs: [
            "Noise Cancellation",
            "Brainwave Sensing",
            "30-hour Battery",
            "Adaptive Sound"
        ],
        reviews: [
            {
                user: "Audiophile",
                comment: "The sound quality is incredible! The neural features are mind-blowing.",
                rating: 5
            }
        ]
    },
    {
        id: 4,
        name: "Smart Oven Pro",
        price: 799.99,
        originalPrice: 999.99,
        image: "ovenpro.png",
        category: "home",
        specs: [
            "Precision Cooking",
            "App Control",
            "Self-Cleaning",
            "Recipe Suggestions"
        ],
        reviews: [
            {
                user: "CookingPro",
                comment: "This oven has revolutionized my cooking. Perfect results every time!",
                rating: 4.5
            }
        ]
    }
];

let filteredProducts = [...products];

// Render products on the main page
function renderProducts() {
    const productsSection = document.getElementById('products-section');
    productsSection.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsSection.innerHTML = '<p style="text-align: center; padding: 40px; font-size: 18px; color: white;">No products found matching your criteria.</p>';
        return;
    }
    // product page
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        productCard.innerHTML = `
             <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price-container">
                <span class="price">₹${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
        `;
        
        productsSection.appendChild(productCard);
    });
}

// Show product details
function showProductDetail(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    currentProduct = product;
    
    const productDetailContainer = document.getElementById('product-detail-container');
    productDetailContainer.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <h1>${product.name}</h1>
            <div class="product-price-container">
                <span class="product-price">₹${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="product-original-price">₹${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            
            <div class="product-specs">
                <h2>Specifications</h2>
                <ul class="specs-list">
                    ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="divider"></div>
            
            <div class="product-reviews">
                <h2>Customer Reviews</h2>
                ${product.reviews.map(review => `
                    <div class="review-item">
                        <strong>${review.user}</strong>
                        <p>${review.comment}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="product-actions">
                <button class="add-to-cart-btn" id="add-to-cart-detail">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="buy-now-detail-btn" id="buy-now-detail">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>
        </div>
    `;
    // product page end
    
    // Add event listeners to the new buttons
    document.getElementById('add-to-cart-detail').addEventListener('click', () => {
        addToCart(product);
    });
    
    // Buy Now button in product detail
    document.getElementById('buy-now-detail').addEventListener('click', () => {
        // Clear cart first
        cart = [];
        
        // Add the product to cart
        addToCart(product);
        
        // Show customer form
        showCart();
        showCustomerForm();
        
        // Reset form validation
        resetFormValidation();
    });
    
    // Show the product detail page
    document.getElementById('product-detail-page').classList.add('active');
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    renderProducts();
}

// Filter products by category
function filterProductsByCategory() {
    searchProducts(); // This will handle both search and category filtering
}