import React from "react";
import CommentsPage from "../src/components/pages/CommentsPage";
import backgroundImg from "../src/assets/backgroundImg.jpeg";

function App() {

  const appStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: 'fixed',
    filter: 'brightness(80%)',
    height: "100%",
  };

  return (
    <div style={appStyle}>
      <CommentsPage />
    </div>
  );
}

export default App;