// admin.js
document.addEventListener('DOMContentLoaded', async () => {
  const orderListContainer = document.getElementById('orderList');

  try {
    const response = await fetch('/getOrders');
    const orders = await response.json();

    if (orders.length === 0) {
      orderListContainer.textContent = 'No orders found.';
      return;
    }

    const orderList = document.createElement('ul');
    orders.forEach(order => {
      const listItem = document.createElement('li');
      listItem.classList.add('orderListItem');
      const totalPriceText = order.totalPrice !== undefined ? `Total Price: RM ${order.totalPrice.toFixed(2)}` : 'Total Price: Not Available';
      listItem.textContent = `${order.username} ordered ${order.quantity} ${order.dish}(s) from ${order.restaurant}. ${totalPriceText} (${order.orderType})`;
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('deleteBtn');
      deleteButton.textContent = 'Delete Order';
      deleteButton.addEventListener('click', async () => {
        await deleteOrder(order._id);
        listItem.remove();
      });

      listItem.appendChild(deleteButton);
      orderList.appendChild(listItem);
    });

    orderListContainer.appendChild(orderList);
  } catch (error) {
    console.error('Error fetching orders:', error);
    orderListContainer.textContent = 'Error fetching orders.';
  }
});

async function deleteOrder(orderId) {
  try {
    const response = await fetch(`/deleteOrder/${orderId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error deleting order:', error);
  }
}
