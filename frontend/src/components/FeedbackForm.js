import { useState, useEffect } from "react";
import { Filter } from "bad-words";
import { toast } from "react-toastify";

const FeedbackForm = ({ editFeedback, setEditing, onAdd, onEdit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);

  const filter = new Filter();

  useEffect(() => {
    if (editFeedback) {
      setRating(editFeedback.rating);
      setComment(editFeedback.comment);
      setPhoto(null);
    }
  }, [editFeedback]);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filter.isProfane(comment)) {
      toast.error("Your comment contains inappropriate language.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (photo) {
      formData.append("photo", photo);
    }

    if (editFeedback) {
      onEdit(editFeedback._id, formData);
    } else {
      onAdd(formData);
    }

    setRating(0);
    setComment("");
    setPhoto(null);
    setEditing(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter your feedback"
        rows="4"
        required
      ></textarea>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              color: rating >= star ? "gold" : "gray",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
          >
            &#9733;
          </span>
        ))}
      </div>
      <div>
        <label htmlFor="photo">Upload Photo:</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">
        {editFeedback ? "Update Feedback" : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
