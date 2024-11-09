import { useState } from "react";
import reactLogo from "./assets/react.svg";
import bgimage from "./assets/bgimage.jpg";
import ChatBot from "react-chatbotify";
import "./App.css";
import MyChatBot from "./ChatbotApp";
import Form from "./Form";
import MyComponent from "./Mail";

function App() {
  const [count, setCount] = useState(0);

  const flow = {
    start: {
      message: "Hello world!",
    },
  };
  return (
    <>
      {/* Background image with blur effect */}
      <div className="blur-background">
        <img src={bgimage} />
      </div>

      <div className="content">
        <Form />
        <MyChatBot />
      </div>
    </>
  );
}

export default App;
