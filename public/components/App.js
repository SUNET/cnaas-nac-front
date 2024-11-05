import React from "react";
import Header from "./Header";
import Panel from "./Panel";

// needed for routing
import { BrowserRouter } from "react-router-dom";
import "../styles/reset.css";
import "../styles/main.css";

// import "../styles/prism.css";

class App extends React.Component {
    render() {
	return (
	    <div className="container">
		<BrowserRouter>
		    <Header />
		    <Panel />
		</BrowserRouter>
	    </div>
	);
    }
}

export default App;
