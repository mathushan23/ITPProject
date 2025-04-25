import { useState } from "react";
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [qrCode, setQrCode] = useState(null);  // State to hold the generated QR code

  // Real-time validation
  const handleInputChange = (setter, field, value) => {
    setter(value);

    // Reset errors for the field when user types
    setEmptyFields((prev) => prev.filter((f) => f !== field));
    if (error) setError(null);
  };

  const validateForm = () => {
    let errors = [];
    let validationError = null;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const numPrice = Number(price);
    const numQuantity = Number(quantity);

    // Required fields
    if (!trimmedTitle) errors.push("title");
    if (!trimmedDescription) errors.push("description");
    if (!price) errors.push("price");
    if (!quantity) errors.push("quantity");

    // Title & Description validation
    if (trimmedTitle.length < 3 || trimmedTitle.length > 50) {
      validationError = "Title must be between 3 and 50 characters.";
      errors.push("title");
    }
    if (trimmedDescription.length < 5 || trimmedDescription.length > 200) {
      validationError = "Description must be between 5 and 200 characters.";
      errors.push("description");
    }

    // Price validation
    if (isNaN(numPrice) || numPrice <= 0) {
      validationError = "Price must be a positive number.";
      errors.push("price");
    }

    // Quantity validation
    if (!Number.isInteger(numQuantity) || numQuantity <= 0) {
      validationError = "Quantity must be a positive integer.";
      errors.push("quantity");
    }

    if (errors.length > 0) {
      setEmptyFields(errors);
      setError(validationError || "Please fill in all fields correctly.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const product = { 
      title: title.trim(), 
      description: description.trim(), 
      price: Number(price), 
      quantity: Number(quantity) 
    };

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to add product.");
      }

      // Set QR code after product is created
      setQrCode(json.qrCode);  // Assuming your API returns the QR code URL

      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setError(null);
      setEmptyFields([]);
      dispatch({ type: 'CREATE_WORKOUT', payload: json });

      alert("Product added successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new Product</h3>

      <label htmlFor="title">Product name</label>
      <input
        id="title"
        type="text"
        onChange={(e) => handleInputChange(setTitle, "title", e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
        placeholder="Enter product name (3-50 characters)"
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        onChange={(e) => handleInputChange(setDescription, "description", e.target.value)}
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}
        placeholder="Enter product description (5-200 characters)"
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        onChange={(e) => handleInputChange(setPrice, "price", e.target.value)}
        value={price}
        className={emptyFields.includes('price') ? 'error' : ''}
        placeholder="Enter a positive price"
      />

      <label htmlFor="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        onChange={(e) => handleInputChange(setQuantity, "quantity", e.target.value)}
        value={quantity}
        className={emptyFields.includes('quantity') ? 'error' : ''}
        placeholder="Enter a positive quantity"
      />

      <button type="submit">Add Product</button>

      {error && <div className="error">{error}</div>}

      {qrCode && (
        <div>
          <h4>QR Code for {title}</h4>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </form>
  );
};

export default WorkoutForm;
