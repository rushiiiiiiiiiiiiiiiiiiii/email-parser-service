require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const readEmails = require("./imap/readEmails");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {
  readEmails().catch(err => {
    console.error("Email read error:", err.message);
  });
}, 60000);
