import React, { useState } from "react";

function NameInput({ actionProvider }) {
  const [name, setName] = useState("");

  const handleNameSubmit = () => {
    if (name) {
      actionProvider.askForCity();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleNameSubmit}>Submit</button>
    </div>
  );
}

export default NameInput;
