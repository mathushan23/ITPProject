import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const MyVerticallyCenteredModal = ({ show, onHide, workout }) => {
  const { dispatch } = useWorkoutsContext();
  
  // State for the workout form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState(null);

  // Prefill form when modal opens
  useEffect(() => {
    if (workout) {
      setTitle(workout.title);
      setDescription(workout.description);
      setPrice(workout.price);
      setQuantity(workout.quantity);
    }
  }, [workout]);

  
// Handle Update Task
const updateTask = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  const updatedWorkout = {
    title,
    description,
    price,
    quantity,
    updatedAt: new Date().toISOString(), // Add current timestamp
  };

  console.log("Updating workout:", workout._id, updatedWorkout);

  const response = await fetch(`/api/workouts/${workout._id}`, {
    method: "PUT",
    body: JSON.stringify(updatedWorkout),
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json();

  if (!response.ok) {
    console.error("Error updating workout:", json.error);
    setError(json.error);
  } else {
    console.log("Workout updated successfully:", json);
    dispatch({ type: "UPDATE_WORKOUT", payload: json }); // Update context
    onHide(); // Close modal
  }
};


  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateTask}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>

          {error && <div className="error text-danger">{error}</div>}
          
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Stock
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MyVerticallyCenteredModal;
