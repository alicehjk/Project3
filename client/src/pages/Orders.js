import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      completed: 'success',
      cancelled: 'danger'
    };

    return `bg-${statusColors[status] || 'secondary'}`;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Orders</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title">Order #{order._id.slice(-8)}</h5>
                      <p className="card-text mb-1">
                        <strong>Pickup:</strong> {formatDate(order.pickupDate)} at {order.pickupTime}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Ordered:</strong> {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
