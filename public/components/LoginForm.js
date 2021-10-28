import React from "react";

import checkResponseStatus from "../utils/checkResponseStatus";

// NOTE: Currently not used
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

class LoginForm extends React.Component {
    state = {
        email: "",
        password: ""
    };

    handleInput = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    login = event => {
        event.preventDefault();
        console.log("this is email: ", this.state.email);
        fetch(process.env.AUTH_API_URL, {
            method: "POST",
            headers: {
                Authorization:
                    "Basic " +
                    btoa(this.state.email + ":" + this.state.password)
            }
        })
            .then(response => checkResponseStatus(response))
            .then(response => response.json())
            .then(data => {
                console.log("this is token: ", data["access_token"]);
                this.props.setToken(data["access_token"]);
            })
            .catch(error => {
                console.log(`Login error: ${error}`);
                this.props.clearToken();
            });
    };

    logout = () => {
        this.props.clearToken();
    };

    render() {
        return (
            <form onSubmit={this.login}>
                <div id="login">
                    <br />
                    <center>
                        <h1>CNaaS NAC</h1>
                    </center>
                    <input
                        type="text"
                        name="email"
                        placeholder="Username..."
                        onChange={this.handleInput}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password..."
                        name="password"
                        onChange={this.handleInput}
                        required
                    />
                    <p className="title error">{this.props.errorMessage}</p>
                    <center>
                        <button className="submit" type="submit">
                            Login
                        </button>
                    </center>
                </div>
            </form>
        );
    }
}

export default LoginForm;
