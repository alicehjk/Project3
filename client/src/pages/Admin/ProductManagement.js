import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'bread',
    price: '',
    image: '/images/default-product.jpg',
    available: true,
    ingredients: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i)
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, productData);
      } else {
        await productService.createProduct(productData);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'bread',
        price: '',
        image: '/images/default-product.jpg',
        available: true,
        ingredients: ''
      });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      available: product.available,
      ingredients: product.ingredients?.join(', ') || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'bread',
      price: '',
      image: '/images/default-product.jpg',
      available: true,
      ingredients: ''
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingProduct ? 'Edit' : 'Add'} Product</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="bread">Bread</option>
                    <option value="dessert">Desserts</option>
                    <option value="cake">Cake</option>
                    <option value="special">Special</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="flour, butter, sugar..."
                  />
                </div>

                <div className="col-12 mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="available">
                      Available
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2">
                    {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${product.available ? 'bg-success' : 'bg-secondary'}`}>
                      {product.available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
