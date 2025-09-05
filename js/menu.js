console.log('Menu module loaded');

let currentCategory = 'burger';
let favorites = JSON.parse(localStorage.getItem('snacksPointFavorites')) || [];

const MENU = {
  burger: [
    { id: 'cheese-burger', name: 'Cheese Burger', price: 13, rating: 4.7, img: 'https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2503,h_2503,c_limit/Smashburger-recipe-120219.jpg' },
    { id: 'hamburger-fries', name: 'Hamburger with Fries', price: 13, rating: 4.6, img: 'https://www.lifesatomato.com/wp-content/uploads/2022/08/Copycat-McDonalds-Hamburger.jpg' },
    { id: 'elk-burger', name: 'White Cheddar Elk Burger', price: 15, rating: 4.5, img: 'https://thehonestbison.com/wp-content/uploads/white-cheddar-elk-burger-with-mustard-aioli-recipe-1200x675.jpg' }
  ],
  pizza: [
    { id: 'margherita', name: 'Margherita', price: 12, rating: 4.7, img: 'https://patekpackaging.com/cdn/shop/files/9-inch-Pizza-Paper-Plate-With-Pizza.jpg?v=1700687146' },
    { id: 'mushroom-pepperoni-pizza', name: 'Pepperoni and Mushroom Pizza', price: 14, rating: 4.8, img: 'https://i0.wp.com/farm8.staticflickr.com/7419/8862339175_a026517c96_z.jpg' },
    { id: 'veggie', name: 'Veggie', price: 13, rating: 4.6, img: 'https://images.freeimages.com/variants/KVTZe48MvSyJ2xrLrWx3Ky6W/624f0dc1dff9bdccab032f93c33e79de78481770e79e21d3b0469daf51f02797' }
  ],
  ricebowl: [
    { id: 'teriyaki-chicken-bowl', name: 'Teriyaki Chicken Bowl', price: 12, rating: 4.5, img: 'https://modernmealmakeover.com/wp-content/uploads/2020/10/IMG_6548-4.jpg' },
    { id: 'spicy-tofu-bowl', name: 'Spicy Tofu Bowl', price: 11, rating: 4.4, img: 'https://www.thissavoryvegan.com/wp-content/uploads/2021/04/sweet-spicy-tofu-bowls-2-500x375.jpg' },
    { id: 'beef-bowl', name: 'Chicken Bowl', price: 12, rating: 4.5, img: 'https://winniesbalance.com/wp-content/uploads/2020/07/Sweet-Korean-Rice-Bowl.jpg' }
    
  ],
  desserts: [
    { id: 'cheesecake', name: 'Burnt Basque Cheesecake', price: 7, rating: 4.8, img: 'https://ultimateomnoms.com/wp-content/uploads/2024/02/2024-02-04-BruleedCheesecake-5044-scaled.jpg' },
    { id: 'matcha-brownie', name: 'Matcha Choocolate Chip Brownie', price: 6, rating: 4.7, img: 'https://www.texanerin.com/content/uploads/2023/03/matcha-brownies-1200-photo.jpg' }
  ]
};

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html';
}

function buildCard({ id, name, price, rating, img }) {
  const isFav = favorites.includes(id);
  return `
    <article class="food-item-card" data-item-id="${id}">
      <div class="food-image-container">
        <img src="${img}" alt="${name}" class="food-image">
        <button class="favorite-btn" onclick="toggleFavorite('${id}')">
          <span class="heart-icon" style="color:${isFav ? '#ef4444' : 'inherit'}">${isFav ? '❤️' : '♡'}</span>
        </button>
        <div class="rating-badge">
          <span class="stars">★</span>
          <span class="rating-number">${rating}</span>
        </div>
      </div>
      <div class="food-info">
        <h3 class="food-name">${name}</h3>
        <div class="food-meta">
          <span class="food-price">Price: $${price}</span>
        </div>
        <div class="food-actions">
          <button class="add-to-cart-btn btn btn-primary" onclick="enhancedAddToCart('${id}', '${name.replace(/'/g, "\\'")}', ${price}, this)">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderCategory(categoryKey) {
  const titleEl = document.getElementById('category-title');
  const gridEl = document.getElementById('food-items-grid');
  if (!titleEl || !gridEl) return;
  const items = MENU[categoryKey] || [];
  titleEl.textContent = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
  gridEl.innerHTML = items.map(buildCard).join('');
}

function switchCategory(category) {
  showCategoryLoading();
  setTimeout(() => {
    currentCategory = category;
    document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[onclick="switchCategory('${category}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
    renderCategory(category);
    hideCategoryLoading();
    showToast(`Loaded ${category} menu`, 'success');
  }, 800);
}

function showCategoryLoading() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  const overlay = document.createElement('div');
  overlay.id = 'category-loading';
  overlay.style.cssText = `
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.8);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; z-index: 50;
  `;
  overlay.innerHTML = `
    <div style="width:40px;height:40px;border:4px solid #e5e7eb;border-top:4px solid #4A90E2;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <p style="margin-top:1rem;color:#6b7280;">Loading menu...</p>
  `;
  if (getComputedStyle(mainContent).position === 'static') {
    mainContent.style.position = 'relative';
  }
  mainContent.appendChild(overlay);
}

function hideCategoryLoading() {
  const overlay = document.getElementById('category-loading');
  if (overlay) overlay.remove();
}

function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:1000;
      display:flex;flex-direction:column;gap:0.5rem;
    `;
    document.body.appendChild(container);
  }
  const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#4A90E2' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    background:${colors[type] || colors.info};color:white;
    padding:1rem 1.5rem;border-radius:0.5rem;
    box-shadow:0 4px 6px rgba(0,0,0,0.1);
    transform:translateX(100%);transition:transform 0.3s ease-out;
    max-width:300px;display:flex;align-items:center;justify-content:space-between;gap:1rem;
  `;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;font-size:1.2rem;padding:0;">&times;</button>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 100);
  setTimeout(() => { toast.remove(); }, duration);
}

function enhancedAddToCart(itemId, itemName, itemPrice, button) {
  const original = button.innerHTML;
  button.innerHTML = '<div style="width:1rem;height:1rem;border:2px solid transparent;border-top:2px solid currentColor;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;"></div>';
  button.disabled = true;
  setTimeout(() => {
    addToCart(itemId, itemName, itemPrice);
    button.innerHTML = '✓ Added to Cart!';
    button.style.background = '#10b981';
    showToast(`${itemName} added to cart!`, 'success');
    setTimeout(() => {
      button.innerHTML = original;
      button.style.background = '#4A90E2';
      button.disabled = false;
    }, 2000);
  }, 1000);
}

function initializeSearch() {
  const btn = document.querySelector('.search-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const term = prompt('Search for food items:');
      if (term) performSearch(term);
    });
  }
}

function performSearch(term) {
  const cards = document.querySelectorAll('.food-item-card');
  cards.forEach(card => {
    const name = card.querySelector('.food-name').textContent.toLowerCase();
    card.style.display = name.includes(term.toLowerCase()) ? 'block' : 'none';
  });
  showToast(`Search results for "${term}"`, 'info');
}

function initializeFavorites() {
  favorites.forEach(id => {
    const heart = document.querySelector(`[onclick="toggleFavorite('${id}')"] .heart-icon`);
    if (heart) {
      heart.textContent = '❤️';
      heart.style.color = '#ef4444';
    }
  });
}

function toggleFavorite(itemId) {
  const heart = document.querySelector(`[onclick="toggleFavorite('${itemId}')"] .heart-icon`);
  if (favorites.includes(itemId)) {
    favorites = favorites.filter(id => id !== itemId);
    if (heart) { heart.textContent = '♡'; heart.style.color = 'inherit'; }
  } else {
    favorites.push(itemId);
    if (heart) { heart.textContent = '❤️'; heart.style.color = '#ef4444'; }
  }
  localStorage.setItem('snacksPointFavorites', JSON.stringify(favorites));
}

window.logout = logout;
window.switchCategory = switchCategory;
window.toggleFavorite = toggleFavorite;
window.showToast = showToast;
window.enhancedAddToCart = enhancedAddToCart;

document.addEventListener('DOMContentLoaded', () => {
  renderCategory(currentCategory);
  initializeFavorites();
  initializeSearch();
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
  }
});

const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
