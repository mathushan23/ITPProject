import { useEffect, useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import ProductCard from '../pages/ProductCard'; // Make sure the ProductCard component is defined and correctly handles the product prop

//import '../css/Product.css';


const Product = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/workouts');
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || 'Failed to fetch products');
        }

        dispatch({ type: 'SET_WORKOUTS', payload: json });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error" style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;

  // Live search filter based on title
  const filteredProducts = workouts
    ? workouts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className={`products-page ${theme}`}>
      {/* Top bar with heading, search, and theme toggle button */}
      <div
        className="top-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Our Products</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
              width: '250px',
            }}
          />
          <button onClick={toggleTheme} className="theme-toggle-btn" style={{ padding: '8px', fontSize: '16px' }}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>

      {/* Display filtered products */}
      <div className="products-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default Product;
