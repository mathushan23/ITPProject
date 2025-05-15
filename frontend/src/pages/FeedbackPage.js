import { useState, useEffect } from "react";
import {
  getFeedbacks,
  addFeedback,
  updateFeedback,
  deleteFeedback,
} from "../api";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackItem from "../components/FeedbackItem";
import { Filter } from "bad-words";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackPage = () => {
  const filter = new Filter();

  const [feedbacks, setFeedbacks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = await getFeedbacks();
      setFeedbacks(data);
    };
    fetchFeedbacks();
    setIsAdmin(false); // For demonstration
  }, []);

  const handleAddFeedback = async (formData) => {
    const newFeedback = await addFeedback(formData);
    if (newFeedback) {
      setFeedbacks([...feedbacks, newFeedback]);
      toast.success("✅ Feedback submitted successfully!");
    }
  };

  const handleEditFeedback = async (id, formData) => {
    const updatedFeedback = await updateFeedback(id, formData);
    if (updatedFeedback) {
      setFeedbacks(feedbacks.map((f) => (f._id === id ? updatedFeedback : f)));
      toast.success("✏️ Feedback updated successfully!");
    }
    setEditing(null);
  };

  const handleDeleteFeedback = async (id) => {
    const result = await deleteFeedback(id);
    if (result) {
      setFeedbacks(feedbacks.filter((f) => f._id !== id));
      toast.info("🗑️ Feedback deleted.");
    }
  };

  return (
    <>
      {/* Bootstrap CSS via CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">Give Your Feedback</h2>
          <p className="text-muted">We value your thoughts and opinions!</p>
        </div>

        <div className="card shadow-sm p-4 bg-light mb-4">
          <FeedbackForm
            editFeedback={editing}
            setEditing={setEditing}
            onAdd={handleAddFeedback}
            onEdit={handleEditFeedback}
          />
        </div>

        <h4 className="fw-semibold border-bottom pb-2 mb-3">Your Feedbacks</h4>

        {feedbacks.length === 0 ? (
          <div className="alert alert-info">No feedback available.</div>
        ) : (
          <div className="row g-4">
            {feedbacks.map((feedback) => (
              <div className="col-md-6 col-lg-4" key={feedback._id}>
                <FeedbackItem
                  feedback={feedback}
                  onEdit={setEditing}
                  onDelete={handleDeleteFeedback}
                  isAdmin={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
    </>
  );
};

export default FeedbackPage;
