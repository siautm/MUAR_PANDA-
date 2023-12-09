// order.js
document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  const usernameInput = document.getElementById('username');
  const restaurantDropdown = document.getElementById('restaurant');
  const menuDropdown = document.getElementById('menu');

  // Map restaurant options to their respective menus
  const menus = {
    FungWongXian: ['Spicy Grilled Fish', 'Nasi Lemak', 'Honey Lemon Chicken', 'Chinese Fried Rice', 'Sweet Grilled Fish', 'Taoshi Grilled Fish'],
    PizzaHut: ['Thin N Crispy Pepperoni', 'Vegan Pizza', 'Pepperoni', 'Hawaiian Chicken Pizza', 'Aloha Chicken Pizza', 'Cheesy Carbonara Spaghetti'],
    HaiXingSeafood: ['Asam FIsh', 'Fried Octopus', 'KangKung', 'Fried Chicken', 'Spicy Sauce Chicken', 'Tauhu'],
  };

  // Update menu options based on the selected restaurant
  restaurantDropdown.addEventListener('change', () => {
    const selectedRestaurant = restaurantDropdown.value;
    const menuOptions = menus[selectedRestaurant] || [];
    updateDropdownOptions(menuDropdown, menuOptions);
  });

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const restaurant = restaurantDropdown.value;
    const dish = menuDropdown.value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const orderType = document.getElementById('orderType').value;

    const totalPrice = calculateTotalPrice(restaurant, dish, quantity);
    
    try {
      const response = await fetch('/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, restaurant, dish, quantity, orderType, totalPrice }),
      });

      const data = await response.json();
      alert(data.message);
      //window.location.href = '/main.html';
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  });

  // Initial setup of menu options
  const initialRestaurant = restaurantDropdown.value;
  const initialMenuOptions = menus[initialRestaurant] || [];
  updateDropdownOptions(menuDropdown, initialMenuOptions);
});

function updateDropdownOptions(dropdown, options) {
  // Clear existing options
  dropdown.innerHTML = '';

  // Add new options
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    dropdown.appendChild(optionElement);
  })
}

function calculateTotalPrice(restaurant, dish, quantity) {
  // Implement your pricing logic based on the selected restaurant and dish
  // For simplicity, we'll use a placeholder pricing logic
  const placeholderPrices = {
    FungWongXian: { 'Spicy Grilled Fish': 22, 'Nasi Lemak': 6, 'Honey Lemon Chicken':16,'Chinese Fried Rice':10,'Sweet Grilled Fish':22, 'Taoshi Grilled Fish':22 },
    PizzaHut: { 'Thin N Crispy Pepperoni': 22, 'Vegan Pizza': 26, 'Pepperoni':28, 'Hawaiian Chicken Pizza':32,'Aloha Chicken Pizza':32,'Cheesy Carbonara Spaghetti':18 },
    HaiXingSeafood: { 'Asam FIsh': 45, 'Fried Octopus': 28, 'KangKung':16,'Fried Chicken':20,'Spicy Sauce Chicken':22,'Tauhu':14 },
  };

  const price = placeholderPrices[restaurant]?.[dish] || 0;
  return price * quantity;
}
