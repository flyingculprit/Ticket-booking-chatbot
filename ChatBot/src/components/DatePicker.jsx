import React, { useState } from "react";

function DatePicker({ actionProvider }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleDateSubmit = () => {
    if (date && time) {
      actionProvider.askForMembers();
    }
  };

  return (
    <div>
      <p>Select a date and time for your visit:</p>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={handleDateSubmit}>Submit</button>
    </div>
  );
}

export default DatePicker;
