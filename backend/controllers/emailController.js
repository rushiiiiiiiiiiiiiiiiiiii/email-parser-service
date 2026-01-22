const Email = require("../models/Email");

exports.createEmail = async (req, res) => {
  try {
    const { subject, body, sender, received_at } = req.body;

    if (!subject || !body || !sender || !received_at) {
      return res.status(400).json({
        error: "subject, body, sender and received_at are required"
      });
    }

    const email = await Email.create({
      subject,
      body,
      sender,
      received_at
    });

    res.status(201).json(email);
  } catch (error) {
    res.status(500).json({ error: "Failed to create email" });
  }
};

exports.getEmails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const emails = await Email.find()
      .sort({ received_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};

exports.getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }

    res.json(email);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch email" });
  }
};
