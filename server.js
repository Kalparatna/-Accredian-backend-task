require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Secure CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Local development frontend
  "https://your-frontend-domain.vercel.app", // Deployed frontend domain
];

app.use(
  cors({
    origin: allowedOrigins, // Restrict to trusted domains
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(express.json());

const prisma = new PrismaClient();

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API to handle referrals
app.post("/api/referrals", async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

  if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newReferral = await prisma.referral.create({
      data: { referrerName, referrerEmail, refereeName, refereeEmail },
    });

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: refereeEmail,
      subject: "You Have Been Referred!",
      text: `${referrerName} referred you for a great opportunity!`,
    });

    res.status(201).json(newReferral);
  } catch (error) {
    res.status(500).json({ error: "Error saving referral" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
