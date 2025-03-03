import React from "react";
import { Route } from "react-router-dom";
import Callback from "./Callback";
import Dashboard from "./Dashboard";
import DeviceList from "./DeviceList";
import ErrorBoundary from "./ErrorBoundary";
import DeviceOui from "./DeviceOui";
import DeviceGroups from "./DeviceGroups";
import Login from "./Login/Login";

function Panel() {
    console.log("Panel.js");
    return (
	<div id="panel">
	    <Route exact path="/" render={() => <Login />} />
	    <Route exact path="/callback" component={Callback} />
	    <ErrorBoundary>
		<Route exact path="/dashboard" component={Dashboard} />
		<Route exact path="/clients" component={DeviceList} />
		<Route exact path="/oui" component={DeviceOui} />
		<Route exact path="/groups" component={DeviceGroups} />
	    </ErrorBoundary>
	</div>
    );
}

export default Panel;
