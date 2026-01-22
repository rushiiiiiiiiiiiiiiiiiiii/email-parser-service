import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function EmailDetail() {
  const { id } = useParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/emails/${id}`)
      .then(res => res.json())
      .then(data => setEmail(data))
      .catch(err => console.error("Failed to load email", err));
  }, [id]);

  if (!email) {
    return <p style={{ padding: "20px" }}>Loading email...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <button onClick={() => window.history.back()}>
        ← Back
      </button>

      <h2>{email.subject}</h2>

      <p style={{ fontSize: "13px", color: "#666" }}>
        From: {email.sender} <br />
        Received: {new Date(email.received_at).toLocaleString()}
      </p>

      <hr />

      <div style={{ whiteSpace: "pre-wrap" }}>
        {email.body}
      </div>
    </div>
  );
}

export default EmailDetail;
