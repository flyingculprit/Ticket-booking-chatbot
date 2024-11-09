import React from "react";

function CitySelector({ actionProvider }) {
  const handleCitySelect = (city) => {
    actionProvider.askForDate();
  };

  return (
    <div>
      <button onClick={() => handleCitySelect("Karur")}>Karur</button>
      <button onClick={() => handleCitySelect("Trichy")}>Trichy</button>
      <button onClick={() => handleCitySelect("Salem")}>Salem</button>
    </div>
  );
}

export default CitySelector;
