import React from "react";
import DeviceList from "./DeviceList";
import DeviceGroups from "./DeviceGroups";
import DeviceOui from "./DeviceOui";
import LoginForm from "./LoginForm";
import { Route, Routes } from "react-router-dom";
import { postData } from "react-router-dom";
import checkResponseStatus from "../utils/checkResponseStatus";
import ErrorBoundary from "./ErrorBoundary";

// passible base64 encode function?
function btoaUTF16 (sString) {
    var aUTF16CodeUnits = new Uint16Array(sString.length);
    Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx); });
    return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));
}

class Panel extends React.Component {
    state = {
	token: null,
	showLoginForm: true
	// errorMessage: ""
    };

    login = (email, password) => {
	event.preventDefault();

	const url = process.env.NAC_FRONT_URL + "/api/v1.0/auth";
	fetch(url, {
	    method: "POST",
	    headers: {"Authorization": 'Basic ' + btoa(email + ":" + password) }
	})
	    .then(response => checkResponseStatus(response))
	    .then(response => response.json())
	    .then(data => {
		this.setState(
		    {
			showLoginForm: false,
			token: data['access_token']
		    },
		    () => {
			localStorage.setItem("token", this.state.token);
		    }
		);
	    })
	    .catch(error => {
		this.setState(
		    {
			showLoginForm: false,
		    },
		    () => {
			localStorage.removeItem("token");
			this.setState({
			    showLoginForm: true,
			});
		    }
		);
	    });
    };

    logout = () => {
	localStorage.removeItem("token");
	this.setState({
	    showLoginForm: true,
	    errorMessage: "you have logged out"
	});
    };

    render() {
	return (
	    <div id="panel">
		<Route
		    path="/"
		    render={props => (
			<LoginForm
			    login={this.login}
			    logout={this.logout}
			    show={this.state.showLoginForm}
			/>
		    )}
		/>
		<ErrorBoundary>
		    <Route path="/clients" render={props => <DeviceList logout={this.logout} />} />
		    <Route path="/groups" render={props => <DeviceGroups logout={this.logout} />} />
		    <Route path="/oui" render={props => <DeviceOui logout={this.logout} />} />
		</ErrorBoundary>
	    </div>
	);
    }
}

export default Panel;
