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
    render() {
        console.log("this is props (in panel)", this.props);
        if (this.props.token === null) {
            return (
                <div id="panel">
                    <LoginForm
                        setToken={this.props.setToken}
                        clearToken={this.props.clearToken}
                    />
                </div>
            );
        }

        return (
            <div id="panel">
                <Switch>
                    <Route exact path="/">
                        You have successfully logged in
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
