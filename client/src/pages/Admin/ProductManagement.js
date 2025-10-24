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
    image: '/images/default-product.svg',
    available: true,
    ingredients: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('available', formData.available);

      const ingredients = formData.ingredients.split(',').map(i => i.trim()).filter(i => i);
      formDataToSend.append('ingredients', JSON.stringify(ingredients));

      // Add image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (!editingProduct) {
        formDataToSend.append('image', formData.image);
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formDataToSend);
      } else {
        await productService.createProduct(formDataToSend);
      }

      setShowForm(false);
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      setFormData({
        name: '',
        description: '',
        category: 'bread',
        price: '',
        image: '/images/default-product.svg',
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
    // Set the existing image as preview when editing
    if (product.image) {
      setImagePreview(product.image);
    }
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
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      category: 'bread',
      price: '',
      image: '/images/default-product.svg',
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
                  <label className="form-label">Upload Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">Upload an image (max 5MB)</small>
                </div>

                {imagePreview && (
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      {editingProduct && !imageFile ? 'Current Image' : 'Image Preview'}
                    </label>
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                        className="border rounded"
                        onError={(e) => {
                          if (!e.target.src.includes('default-product.svg')) {
                            e.target.onerror = null;
                            e.target.src = '/images/default-product.svg';
                          }
                        }}
                      />
                    </div>
                    {editingProduct && !imageFile && (
                      <small className="text-muted d-block mt-2">
                        Upload a new image to replace the current one
                      </small>
                    )}
                  </div>
                )}

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
                <th>Image</th>
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
                  <td>
                    <img
                      src={product.image || '/images/default-product.svg'}
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      className="rounded"
                      onError={(e) => {
                        if (!e.target.src.includes('default-product.svg')) {
                          e.target.onerror = null;
                          e.target.src = '/images/default-product.svg';
                        }
                      }}
                    />
                  </td>
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
