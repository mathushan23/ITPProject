import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import React, { useState, useEffect } from "react";

const DirectPurchase = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatedWorkout, setUpdatedWorkout] = useState(workout);

  // Show alert if stock is low
  useEffect(() => {
    if (updatedWorkout.quantity < 5) {
      alert(`⚠️ Warning! Low stock for "${updatedWorkout.title}". Only ${updatedWorkout.quantity} left.`);
    }
  }, [updatedWorkout.quantity, updatedWorkout.title]);

  // Handle purchase
  const handlePurchase = async () => {
    if (purchaseQty > updatedWorkout.quantity) {
      alert("Not enough stock available!");
      return;
    }

    setLoading(true);
    try {
      const updatedQuantity = updatedWorkout.quantity - purchaseQty;

      const response = await fetch(`/api/workouts/${workout._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: updatedQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      // Update UI after purchase
      const newWorkout = { ...updatedWorkout, quantity: updatedQuantity };
      setUpdatedWorkout(newWorkout);
      dispatch({ type: "UPDATE_WORKOUT", payload: newWorkout });

      alert(`✅ Purchase successful! ${purchaseQty} items bought.`);
    } catch (error) {
      console.error("Purchase error:", error);
      alert("❌ Purchase failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-details">
      <h4>{updatedWorkout.title}</h4>
      <p><strong>Description: </strong> {updatedWorkout.description}</p>
      <p><strong>Price: </strong> ${updatedWorkout.price}</p>
      <p>
        <strong>Available Quantity: </strong> {updatedWorkout.quantity}
        {updatedWorkout.quantity < 5 && <span style={{ color: "red" }}> ⚠️ Low Stock</span>}
      </p>

      <input
        type="number"
        min="1"
        max={updatedWorkout.quantity}
        value={purchaseQty}
        onChange={(e) => setPurchaseQty(Number(e.target.value))}
      />
      <button onClick={handlePurchase} disabled={loading}>
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
};

export default DirectPurchase;
