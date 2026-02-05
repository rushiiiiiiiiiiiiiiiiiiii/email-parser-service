const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const Email = require("../models/Email");

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 3000,
  },
};

async function startEmailListener() {
  let connection;

  try {
    connection = await imaps.connect(config);
    console.log("IMAP connected");

    connection.imap.on("error", err => {
      console.error("IMAP error:", err.message);
    });

    await connection.openBox("INBOX");
    console.log("Inbox opened, waiting for new emails...");

    connection.imap.on("mail", async () => {
      console.log("📩 New email detected");
      await readUnreadEmails(connection);
    });

    await readUnreadEmails(connection);

  } catch (err) {
    console.error("IMAP connection failed:", err.message);
  }
}

async function readUnreadEmails(connection) {
  try {
    const searchCriteria = ["UNSEEN"];
    const fetchOptions = {
      bodies: [""],
      markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const item of messages) {
      try {
        const rawEmail = item.parts[0].body;
        const parsedEmail = await simpleParser(rawEmail);

        const bodyContent =
          parsedEmail.text ||
          parsedEmail.html ||
          "(No email content)";

        await Email.create({
          subject: parsedEmail.subject || "(No Subject)",
          body: bodyContent,
          sender: parsedEmail.from?.text || "Unknown sender",
          received_at: parsedEmail.date || new Date(),
        });

        console.log("✅ Email saved:", parsedEmail.subject);

      } catch (emailError) {
        console.error("Email parse error:", emailError.message);
      }
    }
  } catch (err) {
    console.error("Failed to read emails:", err.message);
  }
}

module.exports = startEmailListener;