import React, { useState } from "react";

function MemberCount({ actionProvider }) {
  const [members, setMembers] = useState("");

  const handleMemberSubmit = () => {
    if (members) {
      actionProvider.confirmBooking();
    }
  };

  return (
    <div>
      <p>How many people will be going?</p>
      <input
        type="number"
        placeholder="Number of members"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
        min="1"
      />
      <button onClick={handleMemberSubmit}>Submit</button>
    </div>
  );
}

export default MemberCount;
