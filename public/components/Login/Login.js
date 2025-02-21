import React, { useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";

import { useAuthToken } from "../../contexts/AuthTokenContext";
import { usePermissions } from "../../contexts/PermissionsContext";
import LoginForm from "./LoginForm";
import LoginOIDC from "./LoginOIDC";

function Login() {
    const { login, oidcLogin, logout, loginMessage, loggedIn } = useAuthToken();
    const { permissions } = usePermissions();
    const [permissionsLoading, setPermissionsLoading] = useState(true);
    const [permissionsErrorMsg, setPermissionsErrorMsg] = useState("");
    const [credentials, setCredentials] = useState({
	email: "",
	password: "",
    });

    useEffect(() => {
	// Set the token to localStorage if possible
	const params = new URLSearchParams(location.search);
	const token = params.get("token");

	// Fugly hack to get the token from the URL
	if (token) {
	    localStorage.setItem("token", token);
	    window.location.replace("/");
	}

	if (loggedIn) {
	    const noPermissions =
		  process.env.PERMISSIONS_DISABLED !== "true" && !permissions?.length;

	    console.log("noPermissions", noPermissions);

	    setPermissionsErrorMsg(
		noPermissions
		    ? "You don't seem to have any permissions. Check with an administrator if this is correct. "
		    : "",
            );
	    setPermissionsLoading(!permissions?.length);
	} else {
	    console.log("Not logged in");
	}
    }, [loggedIn, permissions]);

    const setValue = (name, value) => {
	setCredentials({
	    ...credentials,
	    [name]: value,
	});

	console.log("credentials", credentials);
    };

    if (loggedIn) {
	window.location.replace("/dashboard");
    } else {
	console.log("Not logged in");
	console.log(credentials);
    }

    if (loggedIn && permissionsLoading) {
	return <Icon name="spinner" loading />;
    }

    if (loggedIn && !permissionsLoading) {
	return (
	    <div>
		<p className="title error">{permissionsErrorMsg}</p>
		<button type="button" className="logout" onClick={logout}>
		    Logout
		</button>
	    </div>
	);
    }

    if (process.env.OIDC_ENABLED == "true") {
	console.log("OIDC enabled");
	return <LoginOIDC login={oidcLogin} errorMessage={loginMessage} />;
    }

    return (
	<LoginForm
	    handleSubmit={login}
	    formValues={credentials}
	    setValue={setValue}
	    errorMessage={loginMessage}
	/>
    );
}

export default Login;
