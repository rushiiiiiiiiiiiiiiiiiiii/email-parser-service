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
    tlsOptions: {
      rejectUnauthorized: false,
    },
    authTimeout: 3000,
  },
};

async function readEmails() {
  let connection;

  try {
    connection = await imaps.connect(config);

    // 🔴 VERY IMPORTANT: handle IMAP socket errors
    connection.imap.on("error", (err) => {
      console.error("IMAP socket error:", err.message);
    });

    await connection.openBox("INBOX");

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
      } catch (emailError) {
        // 👇 email-level failure should NOT crash the service
        console.error("Email read error:", emailError.message);
      }
    }
  } catch (err) {
    console.error("IMAP connection error:", err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch {
        console.warn("IMAP connection already closed");
      }
    }
  }
}

module.exports = readEmails;
