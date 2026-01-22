const express = require("express");
const router = express.Router();
const {
  createEmail,
  getEmails,
  getEmailById
} = require("../controllers/emailController");

router.post("/", createEmail);   
router.get("/", getEmails);       
router.get("/:id", getEmailById); 

module.exports = router;
