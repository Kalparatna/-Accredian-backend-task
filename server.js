require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Fix: Secure CORS Configuration (No Duplicate Import)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://accredian-frontend-task-roan-nine.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  // ✅ Allow credentials like cookies if needed
  })
);

// ✅ Fix: Enable Preflight Requests (OPTIONS method)
app.options("*", cors());

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

// ✅ Fix: Add Debugging Logs for CORS Issues
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.path);
  console.log("Headers:", req.headers);
  next();
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
    console.error("Referral Error:", error);
    res.status(500).json({ error: "Error saving referral" });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).send("✅ Database connected!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).send("Database connection failed.");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
