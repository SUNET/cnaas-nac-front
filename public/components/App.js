import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "../contexts/AuthContext";
import Header from "./Header/Header";
import Panel from "./Panel";
// needed for routing
import "../styles/reset.css";
import "../styles/main.css";

function App() {
  return (
    <div className="container">
      <AuthContextProvider>
        <BrowserRouter>
          <Header />
          <Panel />
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
