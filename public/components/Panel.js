import React from "react";
import DeviceList from "./DeviceList";
import LoginForm from "./LoginForm";
import { Route, Switch } from "react-router-dom";
import { postData } from "react-router-dom";
import { Button } from "semantic-ui-react";
import DeviceMonitor from "./DeviceMonitor";

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
                        <DeviceMonitor />
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
