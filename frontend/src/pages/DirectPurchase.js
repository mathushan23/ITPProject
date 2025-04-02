import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const ManualPurchaseForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);

  // Fetch available products and stock
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/workouts"); // Updated API route
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          throw new Error("Failed to load products");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);

  // Update total amount when quantity or selected product changes
  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find((p) => p._id === selectedProduct);
      if (product) {
        setTotalAmount(Number(quantity) * product.price);
      }
    } else {
      setTotalAmount(0);
    }
  }, [selectedProduct, quantity, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity) {
      setEmptyFields(["selectedProduct", "quantity"]);
      setError("Please select a product and enter a valid quantity.");
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    const purchaseQuantity = Number(quantity);

    if (!product) {
      setError("Selected product not found.");
      return;
    }

    if (isNaN(purchaseQuantity) || purchaseQuantity <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    if (purchaseQuantity > product.quantity) {
      setError(`Insufficient stock! Only ${product.quantity} available.`);
      return;
    }

    try {
      const response = await fetch(`/api/workouts/${selectedProduct}/purchase`, {
        method: "POST",
        body: JSON.stringify({ quantity: purchaseQuantity, totalAmount }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process purchase.");
      }

      // Update UI: Reduce stock in the frontend state
      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct ? { ...p, stock: p.stock - purchaseQuantity } : p
        )
      );

      // Reset form
      setSelectedProduct("");
      setQuantity("");
      setTotalAmount(0);
      setError(null);
      setEmptyFields([]);
      alert("Purchase successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  // QR Scanner Setup
  useEffect(() => {
    let scanner;
    if (scannerActive) {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

      scanner.render(
        (decodedText) => {
          const product = products.find((p) => p.barcode === decodedText);
          if (product) {
            setSelectedProduct(product._id);
            setScannerActive(false);
            scanner.clear();
          } else {
            setError("Product not found!");
          }
        },
        (error) => {
          console.log("QR Scan Error:", error);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scannerActive, products]);

  return (
    <form className="purchase-form" onSubmit={handleSubmit}>
      <h3>Manual Purchase</h3>

      <label htmlFor="product">Select Product</label>
      <select
        id="product"
        onChange={(e) => setSelectedProduct(e.target.value)}
        value={selectedProduct}
        className={emptyFields.includes("selectedProduct") ? "error" : ""}
      >
        <option value="">-- Choose a Product --</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.title} (Stock: {product.quantity}, Price: {product.price} LKR)
          </option>
        ))}
      </select>

      <p>
        <label htmlFor="quantity">Quantity</label>
      </p>
      <input
        id="quantity"
        type="number"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
        className={emptyFields.includes("quantity") ? "error" : ""}
        placeholder="Enter quantity"
      />

      <p className="total-amount">Total Amount: {totalAmount.toFixed(2)} LKR</p>

      <button type="button" onClick={() => setScannerActive(true)}>
        Scan QR Code
      </button>

      {scannerActive && <div id="qr-reader"></div>}

      <button type="submit">Confirm Purchase</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ManualPurchaseForm;
