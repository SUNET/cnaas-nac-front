import React from "react";
import { Button, Select, Input, Icon, Pagination, Checkbox } from "semantic-ui-react";
import DeviceSearchForm from "./DeviceSearchForm";
import checkResponseStatus from "../utils/checkResponseStatus";
import Modal from "./Modal";

class DeviceList extends React.Component {
    constructor() {
	super();
	this.state = {
	    sortField: "id",
	    filterField: null,
	    filterValue: null,
	    hostname_sort: "",
	    device_type_sort: "",
	    synchronized_sort: "",
	    devicesData: [],
	    activePage: 1,
	    totalPages: 1,
	    checkedItems: {},
	    showVlanModal: false,
	    showCommentModal: false,
	    vlanText: "",
	    commentText: "",
	};

	this.handleChange = this.handleChange.bind(this);
	this.setVlanText = this.setVlanText.bind(this);
	this.setCommentText = this.setCommentText.bind(this);
    }

    handleChange(event) {
	let newState = this.state;

	this.setState(newState);
	newState['checkedItems'][event.target.name] = event.target.checked;
	this.setState(newState);

	console.log(this.state.checkedItems);
    }

    setVlanText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['vlanText'] = event.target.value;
	this.setState(newState);
    }

    setCommentText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['commentText'] = event.target.value;
	this.setState(newState);

	console.log(this.state.commentText);
    }

    getDevicesData = options => {
	if (options === undefined) options = {};
	let newState = this.state;
	if (options.sortField !== undefined) {
	    newState["sortField"] = options.sortField;
	}
	if (
	    options.filterField !== undefined &&
		options.filterValue !== undefined
	) {
	    newState["filterField"] = options.filterField;
	    newState["filterValue"] = options.filterValue;
	}
	if (options.pageNum !== undefined) {
	    newState["activePage"] = options.pageNum;
	}
	this.setState(newState);
	return this.getDevicesAPIData(
	    newState["sortField"],
	    newState["filterField"],
	    newState["filterValue"],
	    newState["activePage"]
	);
    };

    /**
     * Handle sorting on different columns when clicking the header fields
     */
    sortHeader = header => {
	let newState = this.state;
	let sortField = "id";
	const oldValue = this.state[header + "_sort"];
	newState["username_sort"] = "";
	newState["device_type_sort"] = "";
	newState["synchronized_sort"] = "";
	if (oldValue == "" || oldValue == "↑") {
	    newState[header + "_sort"] = "↓";
	    sortField = header;
	} else if (oldValue == "↓") {
	    newState[header + "_sort"] = "↑";
	    sortField = "-" + header;
	}
	this.setState(newState);
	this.getDevicesData({ sortField: sortField });
	// Close all expanded table rows when resorting the table
	var deviceDetails = document.getElementsByClassName("device_details_row");
	for (var i = 0; i < deviceDetails.length; i++) {
	    deviceDetails[i].hidden = true;
	}
    };

    componentDidMount() {
	this.getDevicesData();
    }

    getDevicesAPIData = (sortField = "id", filterField, filterValue, pageNum) => {
	//    const credentials = localStorage.getItem("token");
	const credentials = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1NzEwNTk2MTgsIm5iZiI6MTU3MTA1OTYxOCwianRpIjoiNTQ2MDk2YTUtZTNmOS00NzFlLWE2NTctZWFlYTZkNzA4NmVhIiwic3ViIjoiYWRtaW4iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.Sfffg9oZg_Kmoq7Oe8IoTcbuagpP6nuUXOQzqJpgDfqDq_GM_4zGzt7XxByD4G0q8g4gZGHQnV14TpDer2hJXw";
	// Build filter part of the URL to only return specific devices from the API
	// TODO: filterValue should probably be urlencoded?
	let filterParams = "";
	let filterFieldOperator = "";
	const stringFields = [
	    "username",
	    "vlan",
	    "nas_ip_address",
	    "nas_port_id",
	    "active",
	    "reason",
	    "authdate",
	    "comment"
	];
	if (filterField != null && filterValue != null) {
	    filterParams =
		"?filter[" +
		filterField +
		"]" +
		"=" +
		filterValue;
	}
	fetch(
	    process.env.API_URL +
		"/auth" + filterParams,
	    {
		method: "GET",
		headers: {
		    Authorization: `Bearer ${credentials}`
		}
	    }
	)
	    .then(response => checkResponseStatus(response))
	    .then(response => response.json())
	    .then(data => {
		{
		    this.setState(
			{
			    devicesData: data.data
			},
			() => {
			    console.log("this is new state", this.state.devicesData);
			}
		    );
		}
	    });
    };

    /**
     * Handle expand/collapse of device details when clicking a row in the table
     */
    clickRow(e) {
	const curState = e.target.closest("tr").nextElementSibling.hidden;
	if (curState) {
	    e.target.closest("tr").nextElementSibling.hidden = false;
	} else {
	    e.target.closest("tr").nextElementSibling.hidden = true;
	}
    }

    updateDeviceEnable = object => {
	const credentials = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1NzEwNTk2MTgsIm5iZiI6MTU3MTA1OTYxOCwianRpIjoiNTQ2MDk2YTUtZTNmOS00NzFlLWE2NTctZWFlYTZkNzA4NmVhIiwic3ViIjoiYWRtaW4iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.Sfffg9oZg_Kmoq7Oe8IoTcbuagpP6nuUXOQzqJpgDfqDq_GM_4zGzt7XxByD4G0q8g4gZGHQnV14TpDer2hJXw";
	let jsonData = {"enabled": true};

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    console.log('Enabling ' + key);
	    fetch(process.env.API_URL + "/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
		.then(data => {
		    {
			console.log(data);
		    }
		});
	});
    };

    updateDeviceDisable = object => {
	const credentials = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1NzEwNTk2MTgsIm5iZiI6MTU3MTA1OTYxOCwianRpIjoiNTQ2MDk2YTUtZTNmOS00NzFlLWE2NTctZWFlYTZkNzA4NmVhIiwic3ViIjoiYWRtaW4iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.Sfffg9oZg_Kmoq7Oe8IoTcbuagpP6nuUXOQzqJpgDfqDq_GM_4zGzt7XxByD4G0q8g4gZGHQnV14TpDer2hJXw";
	let jsonData = {"enabled": false};

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    console.log('Disabling ' + key);

	    fetch(process.env.API_URL + "/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
		.then(data => {
		    {
			console.log(data);
		    }
		});
	});
    };

    updateDeviceRemove = object => {
	const credentials = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1NzEwNTk2MTgsIm5iZiI6MTU3MTA1OTYxOCwianRpIjoiNTQ2MDk2YTUtZTNmOS00NzFlLWE2NTctZWFlYTZkNzA4NmVhIiwic3ViIjoiYWRtaW4iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.Sfffg9oZg_Kmoq7Oe8IoTcbuagpP6nuUXOQzqJpgDfqDq_GM_4zGzt7XxByD4G0q8g4gZGHQnV14TpDer2hJXw";

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    console.log('Removing ' + key);
	    fetch(process.env.API_URL + "/auth/" + key, {
		method: "DELETE",
		headers: {
		    Authorization: `Bearer ${credentials}`
		},
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
		.then(data => {
		    {
			console.log('Remove responded: ' + data);
		    }
		});
	});
    };

    handleEnable = object => {
	this.updateDeviceEnable();
	this.getDevicesData();
	this.forceUpdate();
    }

    handleDisable = object => {
	this.updateDeviceDisable();
	this.getDevicesData();
	this.forceUpdate();
    }

    handleRemove = object => {
	this.updateDeviceRemove();
	this.getDevicesData();
	this.forceUpdate();
    }

    handleBounce = object => {
	this.updateDeviceRemove();
	this.getDevicesData();
	this.forceUpdate();
    }

    showVlanModal = e => {
	this.setState({
	    showVlanModal: !this.state.showVlanModal
	});
    };

    showCommentModal = e => {
	this.setState({
	    showCommentModal: !this.state.showCommentModal
	});
    };

    submitVlanModal = e => {
	let jsonData = {"vlan": this.state.vlanText};
	const credentials = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1NzEwNTk2MTgsIm5iZiI6MTU3MTA1OTYxOCwianRpIjoiNTQ2MDk2YTUtZTNmOS00NzFlLWE2NTctZWFlYTZkNzA4NmVhIiwic3ViIjoiYWRtaW4iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.Sfffg9oZg_Kmoq7Oe8IoTcbuagpP6nuUXOQzqJpgDfqDq_GM_4zGzt7XxByD4G0q8g4gZGHQnV14TpDer2hJXw";

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.API_URL + "/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
		.then(data => {
		    {
			console.log('Update responded: ' + data);
		    }
		});
	});

	this.setState({
	    vlanText: ""
	});

	this.getDevicesData();
	this.forceUpdate();
    };

    submitCommentModal = e => {
	let jsonData = {"comment": this.state.vlanText};
	const credentials = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1NzEwNTk2MTgsIm5iZiI6MTU3MTA1OTYxOCwianRpIjoiNTQ2MDk2YTUtZTNmOS00NzFlLWE2NTctZWFlYTZkNzA4NmVhIiwic3ViIjoiYWRtaW4iLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.Sfffg9oZg_Kmoq7Oe8IoTcbuagpP6nuUXOQzqJpgDfqDq_GM_4zGzt7XxByD4G0q8g4gZGHQnV14TpDer2hJXw";

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.API_URL + "/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
		.then(data => {
		    {
			console.log('Update responded: ' + data);
		    }
		});
	});

	this.setState({
	    vlanText: ""
	});

	this.getDevicesData();
	this.forceUpdate();
    };

    render() {
	let deviceInfo = "";

	const devicesData = this.state.devicesData;
	deviceInfo = devicesData.map((items, index) => {
	    let clientStatus = "";
	    if (items.active === true) {
		clientStatus = (
		    <Icon name="check" color="green" />
		);
	    } else {
		clientStatus = (
		    <Icon name="delete" color="red" />
		);
	    }
	    return [
		<tr key={index}>
		    <td key="0" align="left">
			<input
			    type="checkbox"
			    value={items.username}
			    onChange={this.handleChange}
			    name={items.username}
			    checked={this.state.check}
			/>
		    </td>
		    <td key="1" align="left">
			<Icon name="angle down" onClick={this.clickRow.bind(this)}/>
			{items.username}
		    </td>
		    <td key="2" align="left">{items.authdate}</td>
		    <td key="3" align="left">{clientStatus}</td>
		    <td key="4" align="left">{items.vlan}</td>
		</tr>,
		<tr
		    key={index + "_content"}
		    colSpan="4"
		    className="device_details_row"
		    hidden
		>
		    <td>
			<table className="device_details_table">
			    <tbody>
				<tr>
				    <td>Username</td>
				    <td>{items.username}</td>
				</tr>
				<tr>
				    <td>VLAN</td>
				    <td>{items.vlan}</td>
				</tr>
				<tr>
				    <td>NAS IP address</td>
				    <td>{items.nas_ip_address}</td>
				</tr>
				<tr>
				    <td>NAS port ID</td>
				    <td>{items.nas_port_id}</td>
				</tr>
				<tr>
				    <td>Reason</td>
				    <td>{items.reason}</td>
				</tr>
				<tr>
				    <td>Authdate</td>
				    <td>{items.authdate}</td>
				</tr>
				<tr>
				    <td>Comment</td>
				    <td>{items.comment}</td>
				</tr>

			    </tbody>
			</table>
		    </td>
		</tr>
	    ];
	});

	return (
	    <section>
		<div>
		    <div id="action">
			<Button onClick={this.handleEnable}>Enable</Button>
			<Button onClick={this.handleDisable}>Disable</Button>
			<Button onClick={this.handleRemove}>Remove</Button>
			<Button onClick={e => this.showVlanModal(e)}>VLAN</Button>
			<Button onClick={e => this.showCommentModal(e)}>Comment</Button>
			<Button>Bounce port</Button>
			<Modal onClose={this.showVlanModal} onSubmit={this.submitVlanModal} show={this.state.showVlanModal}>
			    Enter VLAN name: {" "}
			    <input type="text" value={this.state.vlanText} onChange={this.setVlanText} />
			</Modal>
			<Modal onClose={this.showCommentModal} onSubmit={this.submitCommentModal} show={this.state.showCommentModal}>
			    Enter comment: {" "}
			    <input type="text" value={this.state.commentText} onChange={this.setCommentText} />
			</Modal>

		    </div>
		    <div id="search">
			<DeviceSearchForm searchAction={this.getDevicesData} />&nbsp;
		    </div>
		</div>
		<div id="device_list">
		    <div id="data">
			<table>
			    <thead>
				<tr>
				    <th>
					Select
				    </th>
				    <th onClick={() => this.sortHeader("username")}>
					Username <Icon name="sort" />{" "}
					<div className="username_sort">
					    {this.state.username_sort}
					</div>
				    </th>
				    <th onClick={() => this.sortHeader("authdate")}>
					Last seen <Icon name="sort" />{" "}
					<div className="device_type_sort">
					    {this.state.device_type_sort}
					</div>
				    </th>
				    <th onClick={() => this.sortHeader("active")}>
					Active <Icon name="sort" />{" "}
					<div>
					    {this.state.synchronized_sort}
					</div>
				    </th>
				    <th onClick={() => this.sortHeader("vlan")}>
					VLAN <Icon name="sort" />{" "}
					<div>
					    {this.state.synchronized_sort}
					</div>
				    </th>
				</tr>
			    </thead>
			    <tbody>{deviceInfo}</tbody>
			</table>
		    </div>
		</div>
	    </section>
	);
    }
}

export default DeviceList;
