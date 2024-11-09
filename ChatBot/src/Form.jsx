import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "./Form.css";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Modal from "./Payment";
import Mail from "./Mail";
const Form = () => {
  const [form, setForm] = useState({
    name: "Tham",
    city: "Karur",
    date: "",
    time: "",
    members: "4",
    email: "thamizh5253@gmail.com",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [mailVerified, setMailVerified] = useState(false);

  const checkMailVerification = () => {
    // handlePaymentClose();
    // console.log(form);
    // setModalOpen(true);
    // uploadData();
    // sendConfirmationEmail(form);
    if (mailVerified === false) {
      alert("Please Verify your email address!");
    } else {
      setPaymentModalOpen(true); // Open the payment modal when "Book Now" is clicked
    }
  };

  const openModal = () => {
    handlePaymentClose();
    console.log(form);
    setModalOpen(true);
    // uploadData();
    sendConfirmationEmail(form);
  };
  const closeModal = () => setModalOpen(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleDateChange = (newValue) => {
    // const formattedDate = dayjs(newValue).format("MM/DD/YYYY");
    // console.log(newValue);
    const dateObject = dayjs(newValue); // `newValue` is a dayjs object

    const day = dateObject.date(); // Get the day
    const month = dateObject.month() + 1; // Get the month (add 1 since months are 0-indexed in dayjs)
    const year = dateObject.year(); // Get the year
    // Format the date as dd/mm/yyyy
    const dateString = `${String(day).padStart(2, "0")}/${String(
      month
    ).padStart(2, "0")}/${year}`;

    setForm({ ...form, date: dateString });
  };

  const handleTimeChange = (newValue) => {
    // Ensure newValue is formatted to HH:mm string format
    const formattedTime = newValue ? newValue.format("HH:mm") : "";
    // console.log(formattedTime);
    setForm({ ...form, time: formattedTime });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkMailVerification();
  };

  const handlePaymentClose = () => {
    setPaymentModalOpen(false);
  };

  // Send the confirmation email after booking
  const sendConfirmationEmail = async (formData) => {
    const { name, city, date, time, members, email } = formData;

    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, city, date, time, members, email }),
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
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          fullWidth
          required
        />

        <FormControl fullWidth required>
          <InputLabel
            id="demo-simple-select-helper-label"
            // style={{ textAlign: "left" }}
          >
            City
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            name="city"
            label="Age"
            value={form.city}
            onChange={handleInputChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Karur">Karur</MenuItem>
            <MenuItem value="Trichy">Trichy</MenuItem>
            <MenuItem value="Salem">Salem</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Date"
              name="date"
              value={form.date ? dayjs(form.date, "DD/MM/YYYY") : null} // Convert to dayjs if it's a string
              onChange={handleDateChange}
              fullWidth
              required
              className="custom-picker"
            />
          </DemoContainer>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker"]}>
            <TimePicker
              label="Time"
              name="time"
              value={form.time ? dayjs(form.time, "HH:mm") : null} // Convert to dayjs if it's a string
              onChange={handleTimeChange}
              fullWidth
              required
              className="custom-picker"
            />
          </DemoContainer>
        </LocalizationProvider>

        <TextField
          label="Members"
          name="members"
          value={form.members}
          onChange={handleInputChange}
          type="number"
          fullWidth
          required
        />
        {/* <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          type="email"
          fullWidth
          required
        /> */}
        <Mail setMailVerified={setMailVerified} />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Book Now
        </Button>
      </form>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onClose={handlePaymentClose}>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {/* Add your payment form fields here */}
          <p style={{ color: "black" }}>
            Please enter your payment details to complete the booking.
          </p>
          {/* Example payment fields */}
          <TextField label="Card Number" fullWidth margin="dense" />
          <TextField label="Cardholder Name" fullWidth margin="dense" />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"Expiry Date"}
              views={["month", "year"]}
              fullWidth
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
          <TextField label="CVV" type="password" fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentClose} color="secondary">
            Cancel
          </Button>
          <Button
            // onClick={() => alert("Payment processed!")}
            onClick={openModal}
            color="primary"
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
      <Modal show={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Form;
