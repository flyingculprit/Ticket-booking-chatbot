const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/museum-booking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  city: String,
  date: String,
  time: String,
  members: Number,
  email: { type: String, required: true, unique: true },
});
const User = mongoose.model("User", userSchema);

// OTP schema and model
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpiresAt: Date,
});
const Otp = mongoose.model("Otp", otpSchema);

// Email transport configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "your@gmail.com",
    pass: "password",
  },
});

// Generate a 4-digit random OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// API to send confirmation email with OTP
app.post("/send-email", async (req, res) => {
  const { name, city, date, time, members, email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    // Update or create user in the database
    await User.findOneAndUpdate(
      { email },
      { name, city, date, time, members },
      { upsert: true, new: true }
    );
  } catch (error) {
    return res.status(500).send("Error saving user data or OTP");
  }

  // Email content with OTP included
  const mailOptions = {
    from: "thamizhmass057@gmail.com",
    to: email,
    subject: "Museum Ticket Booking Confirmation",
    text: `Dear ${name},\n\nYour ticket for the ${city} museum has been successfully booked for ${date} at ${time}.\nTotal members: ${members}.\n\nThank you for booking with us!\n\nBest Regards,\nMuseum Team`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email");
    }
    return res.status(200).send("Email sent : " + info.response);
  });
});
// Send OTP endpoint
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  // Validate the email input
  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Set OTP expiration time (10 minutes from now)
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store email, OTP, and expiration time in the database
  try {
    await Otp.findOneAndUpdate(
      { email: email },
      {
        otp,
        otpExpiresAt,
      },
      { upsert: true, new: true }
    );

    // Send email with the OTP
    await transporter.sendMail({
      from: "thamizhmass057@gmail.com",
      to: email,
      subject: "Your OTP Code for Account Activation",
      text: `Hello,

Thank you for visiting our booking platform!

To activate your account, please use the following OTP code:

Your OTP: ${otp}

Please note, this OTP will expire in 10 minutes.

Best regards,
The Booking Platform Team`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error storing OTP or sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});

app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, error: "Email and OTP are required" });
  }

  try {
    // Find the OTP record by email
    const otpRecord = await Otp.findOne({ email });

    // Check if OTP record exists, OTP matches, and it hasn't expired
    if (
      otpRecord &&
      otpRecord.otp === otp &&
      otpRecord.otpExpiresAt > new Date()
    ) {
      otpRecord.otp = null;
      otpRecord.otpExpiresAt = null;
      await otpRecord.save();
      // Clear OTP and expiration from the database after successful verification
      // await Otp.deleteOne({ email });
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      // OTP is incorrect or expired
      return res.json({ success: false, error: "Incorrect or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Error verifying OTP" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB connection
// mongoose
//   .connect("mongodb://localhost:27017/museum-booking", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

// // User schema and model
// const userSchema = new mongoose.Schema({
//   name: String,
//   city: String,
//   date: String,
//   time: String,
//   members: Number,
//   email: { type: String, required: true, unique: true },
//   otp: String,
//   otpExpiresAt: Date,
// });
// const OTPs = {};
// const User = mongoose.model("User", userSchema);

// // Email transport configuration
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "thamizhmass057@gmail.com",
//     pass: "egdd narw nrmp wjgc",
//   },
// });

// // Generate a 4-digit random OTP
// function generateOTP() {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// }

// // API to send confirmation email with OTP
// app.post("/send-email", async (req, res) => {
//   const { name, city, date, time, members, email } = req.body;
//   console.log(date, time);
//   if (!email) {
//     return res.status(400).send("Email is required");
//   }

//   // Generate OTP and expiration time (5 minutes from now)
//   const otp = generateOTP();
//   const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//   // Update or create user in database
//   try {
//     await User.findOneAndUpdate(
//       { email },
//       { name, city, date, time, members, otp, otpExpiresAt },
//       { upsert: true, new: true }
//     );
//   } catch (error) {
//     return res.status(500).send("Error saving user data");
//   }

//   // Email content with OTP included
//   const mailOptions = {
//     from: "thamizhmass057@gmail.com",
//     to: email,
//     subject: "Museum Ticket Booking Confirmation",
//     text: `Dear ${name},\n\nYour ticket for the ${city} museum has been successfully booked for ${date} at ${time}.\nTotal members: ${members}.\n\nYour OTP for verification is: ${otp}. It will expire in 5 minutes.\n\nThank you for booking with us!\n\nBest Regards,\nMuseum Team`,
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send("Error sending email");
//     }
//     return res.status(200).send("Email sent with OTP: " + info.response);
//   });
// });

// // Send OTP endpoint
// app.post("/api/send-otp", async (req, res) => {
//   const { email } = req.body;

//   // Validate the email input
//   if (!email) {
//     return res.status(400).json({ success: false, error: "Email is required" });
//   }

//   // Generate a 4-digit OTP
//   const otp = Math.floor(1000 + Math.random() * 9000).toString();

//   // Set OTP expiration time (10 minutes from now)
//   const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//   // Store email, OTP, and expiration time in the database
//   try {
//     await User.findOneAndUpdate(
//       { email },
//       {
//         otp,
//         otpExpiresAt,
//       },
//       { upsert: true, new: true }
//     );

//     // Send email with the OTP
//     await transporter.sendMail({
//       from: "thamizhmass057@gmail.com",
//       to: email,
//       subject: "Your OTP Code for Account Activation",
//       text: `Hello,

// Thank you for visiting our booking platform!

// To activate your account, please use the following OTP code:

// Your OTP: ${otp}

// Please note, this OTP will expire in 10 minutes.

// Best regards,
// The Booking Platform Team`,
//     });

//     res.json({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error storing OTP or sending email:", error);
//     res.status(500).json({ success: false, error: "Failed to send OTP" });
//   }
// });

// app.post("/api/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   // Validate input
//   if (!email || !otp) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Email and OTP are required" });
//   }

//   try {
//     // Find the user in the database by email
//     const user = await User.findOne({ email });

//     // Check if the user and OTP exist, if the OTP matches, and if it's not expired
//     if (user && user.otp === otp && user.otpExpiresAt > new Date()) {
//       // OTP is correct and not expired
//       // Clear OTP and expiration from the database after successful verification
//       user.otp = null;
//       user.otpExpiresAt = null;
//       await user.save();

//       return res.json({ success: true, message: "OTP verified successfully" });
//     } else {
//       // OTP is incorrect or expired
//       return res.json({ success: false, error: "Incorrect or expired OTP" });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Error verifying OTP" });
//   }
// });

// // API to verify OTP
// app.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });

//     if (!user || !user.otp || Date.now() > user.otpExpiresAt) {
//       return res.status(400).send("OTP not found or has expired");
//     }

//     // Verify OTP
//     if (otp === user.otp) {
//       // Clear OTP fields after successful verification
//       user.otp = null;
//       user.otpExpiresAt = null;
//       await user.save();
//       return res.status(200).send("OTP verified successfully");
//     } else {
//       return res.status(400).send("Invalid OTP");
//     }
//   } catch (error) {
//     return res.status(500).send("Error verifying OTP");
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
