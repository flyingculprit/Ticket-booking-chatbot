class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  askForName = () => {
    const message = this.createChatBotMessage("Please enter your name:");
    this.addMessageToBotState(message);
  };

  askForCity = () => {
    const message = this.createChatBotMessage(
      "Which city would you like to book for: Karur, Trichy, or Salem?",
      {
        widget: "citySelector",
      }
    );
    this.addMessageToBotState(message);
  };

  askForDate = () => {
    const message = this.createChatBotMessage(
      "Please select a date and time for your visit:",
      {
        widget: "datePicker",
      }
    );
    this.addMessageToBotState(message);
  };

  askForMembers = () => {
    const message = this.createChatBotMessage("How many people will be going?");
    this.addMessageToBotState(message);
  };

  confirmBooking = () => {
    const message = this.createChatBotMessage(
      "Here is your booking confirmation. Thank you!"
    );
    this.addMessageToBotState(message);
  };

  addMessageToBotState = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
