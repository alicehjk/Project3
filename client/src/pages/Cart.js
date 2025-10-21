import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Add some delicious items from our menu</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Shopping Cart</h2>

      <div className="row">
        <div className="col-lg-8">
          {cart.map((item) => (
            <div key={item.product._id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="img-fluid rounded"
                      style={{ height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h5>{item.product.name}</h5>
                    <p className="text-muted mb-0">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="mb-2">
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </p>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (estimate):</span>
                <span>${(getTotal() * 0.0925).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${(getTotal() * 1.0925).toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
