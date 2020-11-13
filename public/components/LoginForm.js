import React from "react";

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

    render() {
	if (this.props.show !== true) {
	    return (
		<div align="center">
		    <h1>You have successfully logged in!</h1>
		</div>
	    );
	}
	return (
	    <form onSubmit={event => this.props.login(this.state.email, this.state.password)}>
		<div id="login">
		    <br/>
		    <center><h1>CNaaS NAC</h1></center>
		    <input type="text" name="email" placeholder="Username..." onChange={this.handleInput} required />
		    <input type="password" placeholder="Password..." name="password" onChange={this.handleInput} required />
		    <p className="title error">{this.props.errorMessage}</p>
		    <center><button className="submit" type="submit">Login</button></center>
		</div>
	    </form>
	);
    }
}

export default LoginForm;
