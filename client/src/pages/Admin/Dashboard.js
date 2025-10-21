import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Product Management</h5>
              <p className="card-text">Add, edit, or remove products from the catalog</p>
              <Link to="/admin/products" className="btn btn-primary">
                Manage Products
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Management</h5>
              <p className="card-text">View and update order statuses</p>
              <Link to="/admin/orders" className="btn btn-primary">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
