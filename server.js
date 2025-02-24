require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Secure CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://accredian-frontend-task-roan-nine.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ Allow cookies if needed
  })
);

app.use(express.json());

const prisma = new PrismaClient();

// ✅ Database Connection Debugging
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
})();

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Debugging Logs for CORS Issues
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.path);
  console.log("Headers:", req.headers);
  next();
});

// ✅ Referral API
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
      subject: "Y
