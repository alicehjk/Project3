import React from 'react';

function Locations() {
  const markets = [
    {
      name: "Brea Downtown Farmers Market",
      address: "Birch Street",
      city: "Brea, CA",
      day: "Thursday",
      time: "4:00 PM - 8:00 PM",
      frequency: "Weekly",
      mapLink: "https://maps.google.com/?q=Brea+Downtown+Farmers+Market",
      status: "active"
    },
    {
      name: "Yorba Linda Farmers Market",
      address: "Main Street & Imperial Hwy",
      city: "Yorba Linda, CA",
      day: "Saturday",
      time: "9:00 AM - 1:00 PM",
      frequency: "Weekly",
      mapLink: "https://maps.google.com/?q=Yorba+Linda+Farmers+Market",
      status: "active"
    },
    {
      name: "Mt. SAC Farmers Market",
      address: "1100 N Grand Ave, Lot F10",
      city: "Walnut, CA",
      day: "Saturday",
      time: "8:00 AM - 1:00 PM",
      frequency: "Weekly",
      mapLink: "https://maps.google.com/?q=Mt+SAC+Farmers+Market",
      status: "active"
    },
    {
      name: "Laguna Niguel Farmers Market",
      address: "27241 La Paz Rd, Plaza De La Paz Center",
      city: "Laguna Niguel, CA",
      day: "Sunday",
      time: "8:00 AM - 12:00 PM",
      frequency: "Weekly",
      mapLink: "https://maps.google.com/?q=Laguna+Niguel+Farmers+Market",
      status: "active"
    }
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Where to Find Us</h2>
      <p className="lead text-center mb-5">
        Visit us at these Southern California farmers markets for fresh baked goods
      </p>

      <div className="row">
        {markets.map((market, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{market.name}</h5>
                <hr />
                <p className="mb-2">
                  <strong>Location:</strong><br />
                  {market.address}<br />
                  {market.city}
                </p>
                <p className="mb-2">
                  <strong>Day:</strong> {market.day}
                </p>
                <p className="mb-2">
                  <strong>Time:</strong> {market.time}
                </p>
                <p className="mb-3">
                  <span className="badge bg-success">{market.frequency}</span>
                </p>
                <a
                  href={market.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-4 mb-5">
        <div className="card-body">
          <h5 className="card-title">Pickup Location</h5>
          <p className="mb-2">
            <strong>Address:</strong><br />
            Laguna Niguel, CA 92677
          </p>
          <p className="mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:info@hayanbakery.com">info@hayanbakery.com</a>
          </p>
          <p className="mb-0 text-muted">
            Online orders available for pickup at farmers markets
          </p>
        </div>
      </div>
    </div>
  );
}

export default Locations;
