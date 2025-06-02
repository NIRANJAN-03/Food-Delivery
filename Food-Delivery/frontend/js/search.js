document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  const searchBox = document.getElementById('searchBox');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page refresh

    const query = searchBox.value.trim();
    if (!query) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/restaurants/search?item=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error('Failed to fetch restaurants');

      const restaurants = await response.json();

      const container = document.getElementById('restaurants-list');
      container.innerHTML = '';

      if (restaurants.length === 0) {
        container.innerHTML = '<p>No restaurants found for this item.</p>';
        return;
      }

      restaurants.forEach((restaurant) => {
        const div = document.createElement('div');
        div.className = 'restaurant-card';
        div.innerHTML = `
          <h3>${restaurant.name}</h3>
          <p><strong>Cuisine:</strong> ${restaurant.cuisine_type}</p>
          <p><strong>Delivery Time:</strong> ${restaurant.delivery_time || 'N/A'}</p>
          <button onclick="location.href='menu.html?restaurant_id=${restaurant.id}'">View Menu</button>
        `;
        container.appendChild(div);
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  });
});
