import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  Button,
  Box,
  Typography,
} from "@mui/material";

const Mail = ({ setMailVerified }) => {
  const [form, setForm] = useState({
    email: "thamizh5253@gmail.com",
  });
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [otp, setOtp] = useState(["", "", "", ""]); // Array for 4-digit OTP
  const [verified, setVerified] = useState(false); // Track if email is verified

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/send-otp", {
        email: form.email,
      });
      if (response.data.success) {
        setOtpSent(true);
        setVerified(false); // Reset verification state when new OTP is sent
        alert("OTP sent to " + form.email);
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Allow only single digit per box
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const confirmOtp = async () => {
    const enteredOtp = otp.join(""); // Combine OTP digits

    try {
      const response = await axios.post(
        "http://localhost:3000/api/verify-otp",
        {
          email: form.email,
          otp: enteredOtp,
        }
      );
      if (response.data.success) {
        setVerified(true);
        setMailVerified(true);
        alert("Email verified successfully!");
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <Box>
      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleInputChange}
        type="email"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                variant="contained"
                color="primary"
                onClick={sendOtp}
                disabled={!form.email || verified} // Disable if email is empty or already verified
                size="small"
              >
                Send OTP
              </Button>
            </InputAdornment>
          ),
        }}
      />

      <Typography
        variant="body2"
        color={verified ? "green" : "red"}
        sx={{ mt: 1 }}
      >
        {verified ? "Mail verified" : "Mail not verified"}
      </Typography>

      {otpSent && !verified && (
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              inputProps={{ maxLength: 1 }}
              sx={{ width: 40, textAlign: "center" }}
            />
          ))}
        </Box>
      )}

      {otpSent && !verified && (
        <Button
          variant="contained"
          color="primary"
          onClick={confirmOtp}
          sx={{ mt: 2 }}
        >
          Confirm
        </Button>
      )}
    </Box>
  );
};

export default Mail;
