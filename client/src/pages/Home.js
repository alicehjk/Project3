import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-3 mb-4">Hayan Bakery</h1>
        <p className="lead mb-4">
          Fresh Korean breads and pastries baked daily
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Menu
          </Link>
          <Link to="/register" className="btn btn-outline-primary btn-lg">
            Sign Up
          </Link>
        </div>
      </div>

      <div class="container mt-5">
        <div class="row">
          <div class="col-md-4">
            <div class="card">
              <div class="card-body text-center">
                <h3>Milk Bread</h3>
                <p>Korean-style bread</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card">
              <div class="card-body text-center">
                <h3>Pastries</h3>
                <p>Sweet and savory baked goods</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card">
              <div class="card-body text-center">
                <h3>Order Ahead</h3>
                <p>Place your order for pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
