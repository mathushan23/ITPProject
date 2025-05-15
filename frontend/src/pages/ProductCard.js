import { useState } from 'react';
import { useCart } from '../context/CartContext';
//import '../css/Product.css';
const ProductCard = ({ product = {} }) => {
  
  const {
    _id = '',
    title = 'Untitled Product',
    description = 'No description available',
    price = 0,
    quantity = 0,
    imageUrl = ''
  } = product;

  const { addToCart } = useCart();
  const [quantityInput, setQuantityInput] = useState(1);

  const handleAddToCart = () => {
    addToCart({ 
      id: _id,
      title,
      price,
      imageUrl,
      quantity: Number(quantityInput)
    });
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {imageUrl ? (
         <img
         className="product-img"
         src={`http://localhost:4000${imageUrl}`}
         alt={title}
         onError={(e) => {
           if (e.target.src.endsWith("/placeholder-image.jpg")) return;
           e.target.src = "/placeholder-image.jpg";
         }}
       />
       
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="product-details">
        <h3>{title}</h3>
        <p className="description">{description}</p>
        <p className="price">
          {price?.toLocaleString?.() || "0"} LKR {/* Safe access */}
        </p>

        <div className="cart-controls">
          <input
            type="number"
            min="1"
            max={quantity}
            value={quantityInput}
            onChange={(e) => {
              const value = Math.max(
                1,
                Math.min(quantity, Number(e.target.value))
              );
              setQuantityInput(value);
            }}
          />
          <button onClick={handleAddToCart} disabled={quantity <= 0}>
            {quantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {quantity <= 5 && quantity > 0 && (
          <p className="stock-warning">Only {quantity} left in stock!</p>
        )}
      </div>
    </div>
  );
};




export default ProductCard;