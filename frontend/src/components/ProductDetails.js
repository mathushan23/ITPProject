import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import MyVerticallyCenteredModal from "./updateTask";
import { Button, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasShownLowStockToast = useRef(false);

  // Toast Notification for Low Stock
  useEffect(() => {
    if (workout.quantity < 5 && !hasShownLowStockToast.current) {
      toast.warning(`Warning! Low stock for "${workout.title}". Only ${workout.quantity} left.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      hasShownLowStockToast.current = true;
    }
  }, [workout.quantity, workout.title]);

  const deleteWorkout = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${workout.title}"? This action cannot be undone.`);

    if (isConfirmed) {
      setIsDeleting(true);
      const response = await fetch(`/api/workouts/${workout._id}`, {
        method: "DELETE",
      });
      const json = await response.json();

      setIsDeleting(false);

      if (response.ok) {
        dispatch({ type: "DELETE_WORKOUT", payload: json });
        toast.success(`"${workout.title}" has been successfully deleted!`);
      } else {
        toast.error("Failed to delete workout. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="workout-details">

        {/* Product Image */}
        {workout.imageUrl && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={workout.imageUrl}
              alt={workout.title}
              style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "8px" }}
            />
          </div>
        )}

        <h4>{workout.title}</h4>

        <p>
          <strong>Description: </strong> {workout.description}
        </p>

        <p>
          <strong>Price: </strong> {workout.price} LKR
        </p>

        <p>
          <strong>Quantity: </strong> {workout.quantity}
        </p>

        <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>

        {/* Delete Button */}
        <Button className="material-symbols-outlined" variant="danger" onClick={deleteWorkout} disabled={isDeleting}>
          {isDeleting ? <Spinner animation="border" size="sm" /> : <i className="bi bi-trash"></i>} Delete
        </Button>

        {/* Update Button */}
        <Button onClick={() => setModalShow(true)}>
          <i className="bi bi-pencil-square"></i> Edit
        </Button>

        {/* Low Stock Warning */}
        {workout.quantity < 5 && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Warning: Low stock for "{workout.title}"! Only {workout.quantity} left.
          </p>
        )}
      </div>

      {/* Update Modal */}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        workout={workout}
      />
    </>
  );
};

export default WorkoutDetails;
