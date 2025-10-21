import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    specialInstructions: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.pickupDate || !formData.pickupTime) {
      setError('Please select pickup date and time');
      return;
    }

    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const now = new Date();

    if (pickupDateTime <= now) {
      setError('Pickup time must be in the future');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal(),
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        specialInstructions: formData.specialInstructions
      };

      await orderService.createOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              {cart.map((item) => (
                <div key={item.product._id} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>${getTotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pickup Details</h5>
              <hr />

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="pickupDate" className="form-label">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="pickupDate"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={minDate}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="pickupTime" className="form-label">
                    Pickup Time *
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="pickupTime"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">Store hours: 7:00 AM - 7:00 PM</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="specialInstructions" className="form-label">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="specialInstructions"
                    name="specialInstructions"
                    rows="3"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="Any special requests or dietary restrictions..."
                  ></textarea>
                  <small className="text-muted">
                    {formData.specialInstructions.length}/500 characters
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Store Info</h5>
              <hr />
              <p className="mb-2">
                <strong>Address:</strong><br />
                123 Bakery Lane<br />
                Irvine, CA 92618
              </p>
              <p className="mb-2">
                <strong>Phone:</strong><br />
                (949) 555-0123
              </p>
              <p className="mb-0">
                <strong>Hours:</strong><br />
                Mon-Sun: 7:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
