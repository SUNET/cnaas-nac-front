import React from "react";
import DeviceList from "./DeviceList";
import LoginForm from "./LoginForm";
import { Route, Switch } from "react-router-dom";
import { postData } from "react-router-dom";
import { Button } from "semantic-ui-react";

// passible base64 encode function?
function btoaUTF16(sString) {
    var aUTF16CodeUnits = new Uint16Array(sString.length);
    Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) {
        arr[idx] = sString.charCodeAt(idx);
    });
    return btoa(
        String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer))
    );
}

class Panel extends React.Component {
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
        console.log("this is props (in panel)", this.props);
        if (this.state.token === null) {
            return (
                <div id="panel">
                    <LoginForm
                        setToken={this.setToken}
                        clearToken={this.clearToken}
                    />
                </div>
            );
        }

        return (
            <div id="panel">
                <Switch>
                    <Route exact path="/">
                        You have successfully logged in
                        <Button onClick={this.clearToken}>Log out</Button>
                    </Route>
                    <Route exact path="/clients">
                        <DeviceList />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default Panel;
