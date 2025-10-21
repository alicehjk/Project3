import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      completed: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Order Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <label className="form-label">Filter by Status:</label>
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <div className="row">
          {filteredOrders.map((order) => (
            <div key={order._id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5 className="card-title">
                        Order #{order._id.slice(-8)}
                        <span className={`badge bg-${getStatusColor(order.status)} ms-2`}>
                          {order.status.toUpperCase()}
                        </span>
                      </h5>
                      <p className="mb-1">
                        <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
                      </p>
                      <p className="mb-1">
                        <strong>Pickup:</strong> {formatDate(order.pickupDate)} at {order.pickupTime}
                      </p>
                      <p className="mb-1">
                        <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="mb-1">
                        <strong>Ordered:</strong> {formatDate(order.createdAt)}
                      </p>

                      <hr />

                      <h6>Items:</h6>
                      <ul className="list-unstyled">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product?.name || 'Product'} x {item.quantity} - ${item.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>

                      {order.specialInstructions && (
                        <>
                          <hr />
                          <p className="mb-0">
                            <strong>Special Instructions:</strong> {order.specialInstructions}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Update Status:</label>
                      <select
                        className="form-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
