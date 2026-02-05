require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const startEmailListener = require("./imap/readEmails");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startEmailListener().catch(err => {
  console.error("Failed to start email listener:", err.message);
});
