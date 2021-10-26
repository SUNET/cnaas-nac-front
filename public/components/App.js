import React from "react";
import Header from "./Header";
import Panel from "./Panel";

// needed for routing
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import "../styles/reset.css";
import "../styles/main.css";

// import "../styles/prism.css";

export const history = createBrowserHistory();

class App extends React.Component {
    state = {
        token: localStorage.getItem("token")
    };

    setToken = token => {
        localStorage.setItem("token", token);
        this.setState({ token: token });
    };

    clearToken = () => {
        localStorage.removeItem("token");
        this.setState({ token: null });
    };

    render() {
        return (
            <div className="container">
                <Router history={history}>
                    <Header />
                    <Panel
                        token={this.state.token}
                        setToken={this.setToken}
                        clearToken={this.clearToken}
                    />
                </Router>
            </div>
        );
    }
}

export default App;
