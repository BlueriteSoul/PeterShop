// Import Lit components that are directly used in index.html or need to be registered
import '../components/product-card.js';
import '../components/shopping-cart.js';
// cart-item.js is imported by shopping-cart.js

const productListingElement = document.getElementById('product-listing');
const shoppingCartElement = document.querySelector('shopping-cart');

// --- State Management ---
let products = [];
let cart = []; // Array of { productId, name, price, quantity }

// --- Backend API Hooks (Placeholders) ---
async function fetchProductsFromServer() {
  // Placeholder: Replace with actual API call
  console.log('Attempting to fetch products from server (using mock)...');
  try {
    const response = await fetch('../data/products.json'); // Relative to js/app.js
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Products fetched successfully (from mock).');
    return data;
  } catch (error) {
    console.error("Could not fetch products (from mock):", error);
    productListingElement.innerHTML = '<p>Error loading products. Please try again later.</p>';
    return []; // Return empty array on error
  }
}

async function submitOrderToServer(cartData) {
  // Placeholder: Replace with actual API call
  console.log('Attempting to submit order to server...');
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate API call
      if (cartData && cartData.items && cartData.items.length > 0) {
        console.log('Order submitted successfully (simulated):', cartData);
        resolve({ success: true, orderId: `mockOrder_${Date.now()}`, message: 'Order placed successfully!' });
      } else {
        console.error('Order submission failed (simulated): Cart is empty.');
        reject({ success: false, message: 'Cannot submit an empty cart.' });
      }
    }, 1000);
  });
}

// --- Product Rendering ---
function renderProducts() {
  if (!productListingElement) {
    console.error('Product listing element not found.');
    return;
  }
  productListingElement.innerHTML = ''; // Clear existing products

  if (products.length === 0) {
      productListingElement.innerHTML = '<p>No products available at the moment.</p>';
      return;
  }

  products.forEach(product => {
    const productCard = document.createElement('product-card');
    productCard.productId = product.id;
    productCard.name = product.name;
    productCard.price = product.price;
    productCard.imageUrl = product.imageUrl;
    productCard.description = product.description;
    productListingElement.appendChild(productCard);
  });
}

// --- Cart Management ---
function addToCart(product) {
  const existingItem = cart.find(item => item.productId === product.productId);
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.push({ ...product });
  }
  updateCartDisplay();
}

function updateCartItemQuantity(productId, newQuantity) {
  const itemIndex = cart.findIndex(item => item.productId === productId);
  if (itemIndex > -1) {
    if (newQuantity > 0) {
      cart[itemIndex].quantity = newQuantity;
    } else {
      // If quantity is 0 or less, remove the item
      cart.splice(itemIndex, 1);
    }
    updateCartDisplay();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  updateCartDisplay();
}

function updateCartDisplay() {
  if (shoppingCartElement) {
    shoppingCartElement.items = [...cart]; // Pass a new array to trigger Lit's property update
  } else {
    console.error('Shopping cart element not found.');
  }
}

// --- Event Listeners ---
document.addEventListener('add-to-cart', (event) => {
  console.log('Add to cart event received:', event.detail);
  addToCart(event.detail);
});

document.addEventListener('update-quantity', (event) => {
  console.log('Update quantity event received:', event.detail);
  updateCartItemQuantity(event.detail.productId, event.detail.quantity);
});

document.addEventListener('remove-item', (event) => {
  console.log('Remove item event received:', event.detail);
  removeFromCart(event.detail.productId);
});

document.addEventListener('checkout', async (event) => {
  console.log('Checkout event received:', event.detail);
  if (event.detail.items.length === 0) {
    alert('Your cart is empty. Add some products before checking out.');
    return;
  }
  try {
    const result = await submitOrderToServer(event.detail);
    alert(`Server response: ${result.message}`);
    if (result.success) {
      cart = []; // Clear cart on successful order
      updateCartDisplay();
      // Potentially redirect to an order confirmation page
    }
  } catch (error) {
    alert(`Error submitting order: ${error.message || 'Please try again.'}`);
  }
});


// --- Initialization ---
async function initializeApp() {
  products = await fetchProductsFromServer();
  renderProducts();
  updateCartDisplay(); // Initialize cart display (it will be empty)

  // Ensure shopping cart element is available before trying to set properties or add listeners
  if (!shoppingCartElement) {
    console.error("Shopping cart custom element not found in the DOM on init.");
  }
}

// Start the application
initializeApp();
