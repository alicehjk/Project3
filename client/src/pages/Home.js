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

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3>Sourdough</h3>
              <p>Korean-style sourdough bread</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3>Pastries</h3>
              <p>Sweet and savory baked goods</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3>Order Ahead</h3>
              <p>Place your order for pickup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
