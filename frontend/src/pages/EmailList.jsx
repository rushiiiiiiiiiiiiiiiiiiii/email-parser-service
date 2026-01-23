import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/emails`)
      .then(res => res.json())
      .then(data => {
        setEmails(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load emails", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Parsed Emails</h1>

      {loading && <p>Loading emails...</p>}

      {!loading && emails.length === 0 && <p>No emails found.</p>}

      {!loading &&
        emails.map(email => (
          <div
            key={email._id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "10px",
              cursor: "pointer",
              background: "#fff"
            }}
            onClick={() => navigate(`/email/${email._id}`)}
          >
            <strong>{email.subject}</strong>
            <div style={{ fontSize: "12px", color: "#666" }}>
              From: {email.sender}
            </div>
          </div>
        ))}
    </div>
  );
}

export default EmailList;
