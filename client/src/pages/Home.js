import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const markets = [
    {
      name: "Brea Downtown Farmers Market",
      location: "Birch Street, Brea",
      day: "Thursday",
      time: "4:00 PM - 8:00 PM"
    },
    {
      name: "Yorba Linda Farmers Market",
      location: "Main St & Imperial Hwy",
      day: "Saturday",
      time: "9:00 AM - 1:00 PM"
    },
    {
      name: "Mt. SAC Farmers Market",
      location: "1100 N Grand Ave, Walnut",
      day: "Saturday",
      time: "8:00 AM - 1:00 PM"
    },
    {
      name: "Laguna Niguel Farmers Market",
      location: "27241 La Paz Rd",
      day: "Sunday",
      time: "8:00 AM - 12:00 PM"
    }
  ];

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-3 mb-4">Hayan Bakery</h1>
        <p className="lead mb-4">
          Fresh Korean breads and desserts baked daily
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Menu
          </Link>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h3>Milk Bread</h3>
              <p>Korean-style bread</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h3>Desserts</h3>
              <p>Sweet baked goods</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h3>Order Ahead</h3>
              <p>Place your order for pickup</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">Where to Find Us</h2>
        <p className="text-center text-muted mb-4">
          Visit us at these Southern California farmers markets
        </p>

        <div className="row">
          {markets.map((market, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{market.name}</h5>
                  <p className="mb-1">
                    <strong>Location:</strong> {market.location}
                  </p>
                  <p className="mb-1">
                    <strong>{market.day}</strong> {market.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-4 mb-5">
          <div className="card-body text-center">
            <h5 className="card-title">Pickup Location</h5>
            <p className="mb-1">Laguna Niguel, CA 92677</p>
            <p className="mb-0">Email: info@hayanbakery.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
