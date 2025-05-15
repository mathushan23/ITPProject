import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify"; // Import Toastify

const ManualPurchaseForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);

  const formRef = useRef();
  const quantityRef = useRef();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/workouts");
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

  // Update total amount
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

      // Update UI
      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct
            ? { ...p, quantity: p.quantity - purchaseQuantity }
            : p
        )
      );

      setSelectedProduct("");
      setQuantity("");
      setTotalAmount(0);
      setError(null);
      setEmptyFields([]);
      toast.success("Purchase successful!"); // Toastify success message
    } catch (err) {
      setError(err.message);
      toast.error("Purchase failed. Please try again."); // Toastify error message
    }
  };

  // Live QR Code Scanner
  useEffect(() => {
    let scanner;
    if (scannerActive) {
      scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

      scanner.render(
        (decodedText) => {
          const product = products.find((p) => p.barcode === decodedText);
          if (product) {
            setSelectedProduct(product._id);
            setQuantity("1");
            setScannerActive(false);
            scanner.clear();
            setError(null);
            formRef.current?.scrollIntoView({ behavior: "smooth" });
            quantityRef.current?.focus();
          } else {
            setError("Product not found!");
          }
        },
        (error) => console.log("QR Scan Error:", error)
      );
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scannerActive, products]);

  // Image Upload QR Handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("qr-reader-temp");

    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      const product = products.find((p) => p.barcode === decodedText);
      if (product) {
        setSelectedProduct(product._id);
        setQuantity("1");
        setError(null);
        formRef.current?.scrollIntoView({ behavior: "smooth" });
        quantityRef.current?.focus();
      } else {
        setError("Product not found from image QR.");
      }
    } catch (err) {
      setError("Could not read QR code from image.");
      console.error(err);
    }
  };

  return (
    <form className="purchase-form" onSubmit={handleSubmit} ref={formRef}>
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

      {selectedProduct && (
        <div className="qr-preview" style={{ marginTop: "10px" }}>
          <p>QR Code for this product:</p>
          <img
            src={products.find((p) => p._id === selectedProduct)?.qrCode}
            alt="Product QR Code"
            style={{ width: "150px", marginTop: "10px" }}
          />
        </div>
      )}

      {selectedProduct && (
        <div
          className="product-info"
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h4>Selected Product Details</h4>
          <p><strong>Name:</strong> {products.find(p => p._id === selectedProduct)?.title}</p>
          <p><strong>Price:</strong> {products.find(p => p._id === selectedProduct)?.price} LKR</p>
          <p><strong>Stock Available:</strong> {products.find(p => p._id === selectedProduct)?.quantity}</p>
          <p><strong>Selected Quantity:</strong> {quantity}</p>
        </div>
      )}

      <label htmlFor="quantity">Quantity</label>
      <input
        ref={quantityRef}
        id="quantity"
        type="number"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
        className={emptyFields.includes("quantity") ? "error" : ""}
        placeholder="Enter quantity"
      />

      <p className="total-amount">Total Amount: {totalAmount.toFixed(2)} LKR</p>

      <button type="button" onClick={() => setScannerActive(true)}>
        Scan Live QR Code
      </button>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginTop: "10px" }} 
      />

      {scannerActive && <div id="qr-reader" style={{ marginTop: "20px" }}></div>}
      <div id="qr-reader-temp" style={{ display: "none" }}></div>

      <button type="submit">Confirm Purchase</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ManualPurchaseForm;
