import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import MyVerticallyCenteredModal from "./updateTask";
import { Button } from "react-bootstrap";
import React, { useState } from "react";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [modalShow, setModalShow] = useState(false);

  const deleteWorkout = async () => {
    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: "DELETE",
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  return (
    <>
      <div className="workout-details">
        <h4>{workout.title}</h4>
        <p>
          <strong>Description: </strong> {workout.description}
        </p>

        <p>
          <strong>Price: </strong> {workout.price}
        </p>

        <p>
          <strong>Quantity: </strong> {workout.quantity}
        </p>
        <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>

        {/* Delete Button */}
        <span className="material-symbols-outlined" onClick={deleteWorkout}>
          Delete
        </span>

        {/* Update Button */}
        <Button onClick={() => setModalShow(true)}>
          <i className="bi bi-pencil-square"></i> Edit
        </Button>
      </div>

      {/* Update Modal */}
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        workout={workout} // Pass workout details
      />
    </>
  );
};

export default WorkoutDetails;
