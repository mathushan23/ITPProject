const FeedbackItem = ({ feedback, onEdit, onDelete, isAdmin }) => {
    return (
      <div className="feedback-item">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ color: feedback.rating >= star ? "gold" : "gray" }}
            >
              &#9733;
            </span>
          ))}
        </div>
        <p>{feedback.comment}</p>
        {/* Display uploaded photo if available */}
        {feedback.photo && (
          <img
            src={`http://localhost:4000/uploads/${feedback.photo}`}
            alt="Feedback"
            style={{ maxWidth: "200px" }}
          />
        )}
        {!isAdmin && <button onClick={() => onEdit(feedback)}>Edit</button>}
        <button onClick={() => onDelete(feedback._id)}>Delete</button>
      </div>
    );
  };
  
  export default FeedbackItem;
  