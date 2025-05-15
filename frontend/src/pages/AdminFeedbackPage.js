import { useState, useEffect } from "react";
import { getFeedbacks, deleteFeedback } from "../api";
import FeedbackItem from "../components/FeedbackItem";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = await getFeedbacks();
      setFeedbacks(data);
    };
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    const result = await deleteFeedback(id);
    if (result) {
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Admin Feedbacks", 14, 22);
    doc.setFontSize(12);

    const tableData = feedbacks.map((f, index) => [
      index + 1,
      f.user || "Anonymous",
      f.comment || "No comment",
      new Date(f.date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["#", "User", "Comment", "Date"]],
      body: tableData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [220, 53, 69] }, // Bootstrap red
    });

    doc.save("feedbacks.pdf");
  };

  // Styles
  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const headingStyle = {
    fontSize: "32px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center",
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px",
  };

  const buttonStyle = {
    backgroundColor: "#dc3545", // Bootstrap red
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "25px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  };

  const noFeedbackStyle = {
    fontSize: "18px",
    color: "#777",
    textAlign: "center",
    padding: "20px",
    border: "1px dashed #ccc",
    backgroundColor: "#fff",
    borderRadius: "8px",
  };

  const listContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    paddingRight: "10px",
  };

  const feedbackCardStyle = {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Admin Feedbacks</h2>
      {feedbacks.length > 0 && (
        <button style={buttonStyle} onClick={generatePDF}>
          Generate PDF
        </button>
      )}
      {feedbacks.length === 0 ? (
        <p style={noFeedbackStyle}>No feedback available.</p>
      ) : (
        <div style={listContainerStyle}>
          {feedbacks.map((feedback) => (
            <div key={feedback._id} style={feedbackCardStyle}>
              <FeedbackItem
                feedback={feedback}
                onDelete={handleDelete}
                isAdmin={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
