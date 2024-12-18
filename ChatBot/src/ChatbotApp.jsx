import React, { useState, useEffect } from "react";
import ChatBot from "react-chatbotify";
import axios from "axios";
import Modal from "./Payment";
import "./App.css";

{
  /* <button onClick={openModal}>Open Modal</button> */
}

const MyChatBot = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    // console.log("open modal");
    // sendOtpEmail(form);
    // sendConfirmationEmail(form);
  };
  const closeModal = () => setModalOpen(false);

  const [form, setForm] = useState({});
  const [citySelected, setCitySelected] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (otpSent) {
      console.log("OTP Sent status updated:", otpSent);
    }
  }, [otpSent]);

  // useEffect(() => {
  //   console.log(otpSent, "OTP Sent status updated");
  //   setOtpSent(true);
  //   // Additional actions can be added here if needed when otpSent changes
  // }, [otpSent]); // This will run every time otpSent is updated

  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
    color: "white", // Updated font color to white
    backgroundColor: "#4e2a84", // Updated background color to purple
    textAlign: "left",
  };

  const inputStyle = {
    padding: "5px",
    borderRadius: "5px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    marginTop: "10px",
    marginLeft: "20px",
  };

  const flow = {
    start: {
      message: "Hello there! Welcome to the museum ticket booking assistant.",
      path: "ask_name",
    },
    ask_name: {
      message: "What is your name?",
      function: (params) => setForm({ ...form, name: params.userInput }),
      path: "ask_city",
    },
    ask_city: {
      message:
        "Which city would you like to book a ticket for? Please choose from the options below.",
      options: ["Karur", "Trichy", "Salem"],
      chatDisabled: true,
      function: (params) => {
        setForm({ ...form, city: params.userInput });
        setCitySelected(true);
      },
      path: "ask_museum",
    },
    ask_museum: {
      message: "Please select the museum you would like to visit.",
      options: (params) => {
        const cityMuseums = {
          Karur: ["Veerakkumaran Patty Museum", "Government Museum Karur"],
          Trichy: [
            "Rail Museum",
            "Rani Mangammal District Museum",
            "Kallanai (Grand Anaicut) Museum",
          ],
          Salem: [
            "Salem Witch Museum",
            "Witch Dungeon Museum",
            "Salem Art Gallery",
          ],
        };
        return cityMuseums[form.city] || [];
      },
      chatDisabled: true,
      function: (params) => {
        setForm({ ...form, museum: params.userInput });
      },
      path: "ask_date",
    },
    ask_date: {
      message: "Please select a date for your visit.",
      type: "custom",
      component: (
        <div>
          <input
            type="date"
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={inputStyle}
            disabled={dateSelected}
          />
        </div>
      ),
      path: "ask_time",
    },

    ask_time: {
      message: "What time would you like to visit?",
      type: "custom",
      component: (
        <div>
          <input
            type="time"
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            style={inputStyle}
            disabled={timeSelected}
          />
        </div>
      ),
      path: "ask_members",
    },
    ask_members: {
      message: "How many members will be attending the journey?",
      type: "number",
      function: (params) => setForm({ ...form, members: params.userInput }),
      path: "ask_email",
    },
    ask_email: {
      message: "Please enter your email ID for confirmation.",
      function: async (params) => {
        setForm({ ...form, email: params.userInput });
        console.log(params.userInput);
        await sendOtpEmail(params.userInput);
      },
      path: "ask_otp",
    },
    ask_otp: {
      message:
        "A 4-digit OTP has been sent to your email. Please enter the OTP to continue.",
      type: "number",
      function: async (params) => {
        const otp = params.userInput;
        const isValid = await verifyOtp(otp, form.email);
        if (isValid) {
          setOtpSent(true);
          sendConfirmationEmail(form);
        } else {
          setOtpSent(false);
        }
      },
      path: () => (otpSent ? "ask_payment" : "ask_otp_retry"),
    },
    ask_otp_retry: {
      message:
        "The OTP entered is incorrect. Please try again or request a new OTP.",
      options: ["Retry", "Resend OTP"],
      path: "ask_otp",
      function: async (params) => {
        if (params.userInput === "Resend OTP") {
          await sendOtpEmail(form);
        }
      },
    },
    ask_payment: {
      message: "Please complete the payment to confirm your booking.",
      type: "custom",
      component: () => {
        return (
          <div>
            <button
              onClick={openModal}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#491d8d",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
                marginLeft: "20px",
              }}
            >
              Pay Now
            </button>
          </div>
        );
      },
      path: "confirmation",
    },

    confirmation: {
      message: (params) => {
        const { name, city, museum, date, time, members, email } = form;
        const confirmationMessage = `Thank you, ${name}! Your ticket for ${museum} in ${city} has been successfully booked for ${date} at ${time}. Total members: ${members}. A confirmation will be sent to ${email}. Enjoy your visit!`;

        return confirmationMessage;
      },
      component: (
        <div style={{ ...formStyle, color: "blue" }}>
          <p>Name: {form.name}</p>
          <p>City: {form.city}</p>
          <p>Museum: {form.museum}</p>
          <p>Date: {form.date}</p>
          <p>Time: {form.time}</p>
          <p>Members: {form.members}</p>
          <p>Email: {form.email}</p>
        </div>
      ),
      options: ["New Application"],
      chatDisabled: true,
      path: "start",
    },
  };
  const sendOtpEmail = async (email) => {
    try {
      const response = await axios.post("http://localhost:3000/api/send-otp", {
        email, // Directly use the email string
      });

      if (response.data.success) {
        console.log("OTP sent successfully:", response.data.message);
      } else {
        console.error(
          "Failed to send OTP:",
          response.data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
    }
  };

  // Function to verify OTP
  const verifyOtp = async (otp, email) => {
    console.log("Verifying OTP", otp);
    console.log("Verifying email", email);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      if (response.data.success) {
        setOtpSent(true);
        console.log("Email verified successfully!");
        return true;
      } else {
        console.log("Incorrect OTP. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  };

  // Send the confirmation email after booking
  const sendConfirmationEmail = async (formData) => {
    const { name, city, date, time, members, email, museum } = formData;

    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          city,
          date,
          time,
          members,
          email,
          museum,
        }),
      });

      if (response.ok) {
        console.log("Email sent successfully!");
      } else {
        console.error("Error sending email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <Modal show={isModalOpen} onClose={closeModal} />
      <ChatBot
        settings={{
          audio: {
            disabled: false,
          },
          chatHistory: { storageKey: "museum_booking_form" },
        }}
        flow={flow}
      />
    </div>
  );
};

export default MyChatBot;
