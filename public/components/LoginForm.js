import React from "react";
import checkResponseStatus from "../utils/checkResponseStatus";

class LoginForm extends React.Component {
    state = {
	email: "",
	password: "",
	acceptData: [],
	rejectData: [],
	seenData: []
    };

    getStatsAPIData = () => {
	const credentials = localStorage.getItem("token");
	fetch(process.env.NAC_API_URL + "/api/v1.0/stats", {
	    method: "GET",
	    headers: {
		Authorization: `Bearer ${credentials}`
	    }
	})
	    .then(response => checkResponseStatus(response))
	    .then(response => response.json())
	    .then(data => {
		{
		    this.setState(
			{
			    acceptData: data.data.accepts,
			    rejectData: data.data.rejects,
			    seenData: data.data.last_seen
			}
		    );
		}
	    });
    };

    handleInput = event => {
	this.setState({
	    [event.target.name]: event.target.value
	});
    };

    componentDidMount() {
	this.getStatsAPIData();
    }

    render() {
	if (this.props.show !== true || process.env.DISABLE_JWT == 1) {
	    const acceptData = this.state.acceptData;
	    const rejectData = this.state.rejectData;
	    const seenData = this.state.seenData;

	    let acceptInfo = "";
	    let rejectInfo = "";
	    let seenInfo = "";

	    acceptInfo = acceptData.map((items, index) => {
		return [
		    <tr key={index} bgcolor="lightgray">
			<td key="1" align="left">
			    {items.username}
			</td>
			<td key="2" align="left">
			    {items.accepts}
			</td>
		    </tr>,
		];
	    });

	    rejectInfo = rejectData.map((items, index) => {
		return [
		    <tr key={index} bgcolor="lightgray">
			<td key="1" align="left">
			    {items.username}
			</td>
			<td key="2" align="left">
			    {items.rejects}
			</td>
		    </tr>,
		];
	    });


	    seenInfo = seenData.map((items, index) => {
		return [
		    <tr key={index} bgcolor="lightgray">
			<td key="1" align="left">
			    {items.username}
			</td>
			<td key="2" align="left">
			    {items.timestamp}
			</td>
			<td key="3" align="left">
			    {items.reason}
			</td>
		    </tr>,
		];
	    });

	    return (
		<div>
		    <h1>CNaaS NAC</h1>
		    <br/>
		    <br/>
		    <div style={{float: "left", width: "49%"}}>
			<h2>Most accepted clients</h2>
			<table>
			    <thead>
				<tr>
				    <th>
					Username
				    </th>
				    <th>
					Accepts
				    </th>
				</tr>
			    </thead>
			    <tbody>{acceptInfo}</tbody>
			</table>
		    </div>
		    <div style={{float: "right", width: "49%"}}>
			<h2>Most rejected clients</h2>
			<table>
			    <thead>
				<tr>
				    <th>
					Username
				    </th>
				    <th>
					Rejects
				    </th>
				</tr>
			    </thead>
			    <tbody>{rejectInfo}</tbody>
			</table>
		    </div>
		    <div style={{overflow: "hidden", width: "100%"}}>
			<h2><br/>Last seen clients</h2>
			<table>
			    <thead>
				<tr>
				    <th>
					Username
				    </th>
				    <th>
					Time
				    </th>
				    <th>
					Reason
				    </th>
				</tr>
			    </thead>
			    <tbody>{seenInfo}</tbody>
			</table>
		    </div>
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
