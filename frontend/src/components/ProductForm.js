import { useState } from "react";
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const handleDownloadPDF = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/workouts");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text("Product Report", 14, 22);

    // Add Current Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString(); // e.g., 5/5/2025
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 14, 30);

    // Prepare Table
    const tableColumn = ["Title", "Description", "Price (LKR)", "Quantity"];
    const tableRows = [];

    data.forEach((product) => {
      tableRows.push([
        product.title,
        product.description,
        product.price,
        product.quantity,
      ]);
    });

    autoTable(doc, {
      startY: 38,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 3) {
          const quantityValue = parseInt(data.cell.raw);
          if (quantityValue <= 5) {
            data.cell.styles.textColor = [230, 57, 70]; // 🔴 red
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    doc.save("products.pdf");
  } catch (err) {
    alert("Error generating PDF: " + err.message);
  }
};



const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Real-time validation
  const handleInputChange = (setter, field, value) => {
    setter(value);
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

    setIsUploading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('quantity', quantity);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:4000/api/workouts/', {
        method: 'POST',
        body: formData,
        // Headers are NOT set when using FormData - browser sets them automatically
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to add product.");
      }

      setQrCode(json.qrCode);
      setTitle('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setImage(null);
      setImagePreview('');
      setError(null);
      setEmptyFields([]);
      dispatch({ type: 'CREATE_WORKOUT', payload: json });

      alert("Product added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
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

      <label htmlFor="image">Product Image</label>
      <div className="image-upload-container">
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-upload-input"
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={() => {
                setImage(null);
                setImagePreview('');
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

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

      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Adding Product...' : 'Add Product'}
      </button>

      {error && <div className="error">{error}</div>}



      {/* Download PDF Button */}
      <button type="button" className="download-btn" onClick={handleDownloadPDF}>
        📄 Download All Products as PDF
      </button>
    </form>
  );
};

export default WorkoutForm;