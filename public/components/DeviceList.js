import React from "react";
import { Button, Select, Input, Icon, Pagination, Checkbox } from "semantic-ui-react";
import DeviceSearchForm from "./DeviceSearchForm";
import DeviceWhenForm from "./DeviceWhenForm";
import DeviceTypeForm from "./DeviceTypeForm";
import checkResponseStatus from "../utils/checkResponseStatus";
import Modal from "./Modal";
import fileDownload from "js-file-download";
import FileUploadButton from "./FileUpload";

class DeviceList extends React.Component {
    constructor() {
	super();
	this.state = {
	    sortField: "username",
	    filterField: null,
	    filterValue: null,
	    hostname_sort: "",
	    devicesData: [],
	    activePage: 1,
	    totalPages: 1,
	    checkedItems: {},
	    showAddModal: false,
	    showVlanModal: false,
	    showCommentModal: false,
	    usernameText: "",
	    passwordText: "",
	    vlanText: "",
	    commentText: "",
	    username_sort: "",
	    authdate_sort: "",
	    active_sort: "",
	    vlan_sort: "",
	    reason_sort: "",
	    whenField: "",
	    typeField: "",
	    fromDate: "",
	    toDate: "",
	    check: false
	};

	this.handleChange = this.handleChange.bind(this);
	this.setUsernameText = this.setUsernameText.bind(this);
	this.setPasswordText = this.setPasswordText.bind(this);
	this.setVlanText = this.setVlanText.bind(this);
	this.setCommentText = this.setCommentText.bind(this);
	this.setFromDate = this.setFromDate.bind(this);
	this.setToDate = this.setToDate.bind(this);
    }

    handleChange(event) {
	let newState = this.state;

	this.setState(newState);
	newState['checkedItems'][event.target.name] = event.target.checked;
	this.setState(newState);
    }

    setUsernameText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['usernameText'] = event.target.value;
	this.setState(newState);
    }

    setPasswordText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['passwordText'] = event.target.value;
	this.setState(newState);
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
    }

    setToDate(event) {
	let newState = this.state;

	this.setState(newState);
	newState['toDate'] = event.target.value;
	this.setState(newState);
    }

    setFromDate(event) {
	let newState = this.state;

	this.setState(newState);
	newState['fromDate'] = event.target.value;
	this.setState(newState);
    }


    getDevicesData = options => {
	if (options === undefined) options = {};

	let newState = this.state;

	if (options.groupName !== undefined) {
	    newState["groupName"] = options.groupName;
	}

	if (options.whenField !== undefined) {
	    newState["whenField"] = options.whenField;
	}

	if (options.typeField !== undefined) {
	    newState["typeField"] = options.typeField;
	}

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
	    newState["activePage"],
	    newState["whenField"],
	    newState["typeField"],
	    newState["groupName"]
	);
    };

    /**
     * Handle sorting on different columns when clicking the header fields
     */
    sortHeader = header => {
	let newState = this.state;
	let sortField = "username";
	const oldValue = this.state[header + "_sort"];

	newState["username_sort"] = "";
	newState["authdate_sort"] = "";
	newState["active_sort"] = "";
	newState["vlan_sort"] = "";
	newState["reason_sort"] = "";

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

	this.forceUpdate();
    };

    componentDidMount() {
	this.getDevicesData();
    }

    getDevicesAPIData = (sortField = "username", filterField, filterValue, pageNum, whenField = "week", typeField = "all", groupName = "all") => {
	const credentials = localStorage.getItem("token");
	let filterParams = "";
	let filterFieldOperator = "";
	let whenParams = "";
	let typeParams = "";
	let groupParams = "";

	if (filterField != null && filterValue != null) {
	    filterParams =
		"&filter[" +
		filterField +
		"]" +
		"=" +
		filterValue;
	}

	if (whenField == "" || whenField == null) {
	    whenField = "week";
	}

	if (typeField == "" || typeField == null) {
	    typeField = "all";
	}

	if (groupName == "" || groupName == null) {
	    groupName = "all"
	}

	whenParams = "&when=" + whenField;
	typeParams = "&type=" + typeField;
	groupParams = "&group=" + groupName;

	fetch(process.env.NAC_API_URL + "/api/v1.0/auth"+ "?sort=" + sortField + filterParams + whenParams + typeParams + groupParams, {
	    method: "GET",
	    headers: {
		Authorization: `Bearer ${credentials}`
	    }})
	    .then(response => checkResponseStatus(response))
	    .then(response => response.json())
	    .then(data => {
		{
		    this.setState(
			{
			    devicesData: data.data
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
	const credentials = localStorage.getItem("token");
	let jsonData = {"active": true};

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
	});
    };

    updateDeviceDisable = object => {
	const credentials = localStorage.getItem("token");
	let jsonData = {"active": false};

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
	});
    };

    updateDeviceRemove = object => {
	const credentials = localStorage.getItem("token");

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/auth/" + key, {
		method: "DELETE",
		headers: {
		    Authorization: `Bearer ${credentials}`
		},
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
	});
    };

    saveToCsv = object => {
	const credentials = localStorage.getItem("token");

	fetch(process.env.NAC_API_URL + "/api/v1.0/auth", {
	    method: "GET",
	    headers: {
		Authorization: `Bearer ${credentials}`,
		"Cotent-Type": "text/csv"
	    }
	});
    };

    portBounce = object => {
	let jsonData = {"bounce": true};
	const credentials = localStorage.getItem("token");

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
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

    handleSave = object => {
	const credentials = localStorage.getItem("token");
	const url = process.env.NAC_API_URL + "/api/v1.0/export/" + credentials;

	window.location.replace(url);
    }

    showAddModal = e => {
	this.setState({
	    showAddModal: !this.state.showAddModal
	});
    };

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
	const credentials = localStorage.getItem("token");

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
	});

	this.setState({
	    vlanText: ""
	});

	this.getDevicesData();
	this.forceUpdate();
    };

    submitAddModal = e => {
	let jsonData = {"username": this.state.usernameText,
			"password": this.state.passwordText,
			"vlan": this.state.vlanText,
			"comment": this.state.commentText,
			"access_start": this.state.fromDate,
			"access_stop": this.state.toDate
		       };

	const credentials = localStorage.getItem("token");

	fetch(process.env.NAC_API_URL + "/api/v1.0/auth", {
	    method: "POST",
	    headers: {
		Authorization: `Bearer ${credentials}`,
		"Content-Type": "application/json"
	    },
	    body: JSON.stringify(jsonData)
	})
	    .then(response => checkResponseStatus(response))
	    .then(response => response.json())

	this.setState({
	    usernameText: ""
	});

	this.setState({
	    passwordText: ""
	});

	this.setState({
	    vlanText: ""
	});

	this.setState({
	    commentText: ""
	});

	this.getDevicesData();
	this.forceUpdate();
    };

    submitCommentModal = e => {
	const credentials = localStorage.getItem("token");
	let jsonData = {"comment": this.state.commentText};

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/auth/" + key, {
		method: "PUT",
		headers: {
		    Authorization: `Bearer ${credentials}`,
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(jsonData)
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
	});

	this.setState({
	    commentText: ""
	});

	this.getDevicesData();
	this.forceUpdate();
    };

    handleUploadChange = event => {
	console.log(event.target.files[0]);
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
		<tr key={index} bgcolor="lightgray">
		    <td key="0" align="left">
			<input type="checkbox"
			       value={items.username}
			       onChange={this.handleChange}
			       onClick={this.handleChange}
			       name={items.username}
			       defaultChecked={this.state.check}
			/>
		    </td>
		    <td key="1" align="left">
			<Icon name="angle down" onClick={this.clickRow.bind(this)}/>
			{items.username}
		    </td>
		    <td key="2" align="left">{items.authdate}</td>
		    <td key="3" align="left">{clientStatus}</td>
		    <td key="4" align="left">{items.vlan}</td>
		    <td key="5" align="left">{items.reason}</td>
		</tr>,
		<tr key={index + "_content"} colSpan="4" className="device_details_row" hidden>
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
				<tr>
				    <td>Access start</td>
				    <td>{items.access_start}</td>
				</tr>
				<tr>
				    <td>Access stop</td>
				    <td>{items.access_stop}</td>
				</tr>
			    </tbody>
			</table>
		    </td>
		</tr>
	    ];
	});

	return (
	    <section>
		<div id="action">
		    <Button.Group>
			<Button onClick={e => this.showAddModal(e)} title="Add user(s)">
			    ➕
			</Button>
			<Button onClick={this.handleRemove} title="Remove user(s)">
			    ➖
			</Button>
			<FileUploadButton />
			<Button onClick={this.handleSave} title="Export user(s) to CSV">
			    💾
			</Button>
		    </Button.Group>
		    &nbsp;
		    <Button.Group>
			<Button onClick={this.handleEnable}>
			    <Icon name="check" color="green" title="Enable user(s)"/>
			</Button>
			<Button onClick={this.handleDisable} title="Disable user(s)">
			    <Icon name="delete" color="red" />
			</Button>
		    </Button.Group>
		    &nbsp;
		    <Button.Group>
			<Button onClick={e => this.showVlanModal(e)}>
			    VLAN
			</Button>
			<Button onClick={e => this.showCommentModal(e)}>
			    Comment
			</Button>
			<Button onClick={this.portBounce}>
			    Bounce
			</Button>
		    </Button.Group>
		    &nbsp;
		    <DeviceWhenForm whenAction={this.getDevicesData} />
		    &nbsp;
		    <DeviceTypeForm typeAction={this.getDevicesData} />
		    &nbsp;
		    <Modal onClose={this.showAddModal}
			   onSubmit={this.submitAddModal}
			   show={this.state.showAddModal}
			   messageBox="">
			<input type="text" value={this.state.usernameText}
			       onChange={this.setUsernameText}
			       placeholder="Username (required)" />
			<input type="text" value={this.state.passwordText}
			       onChange={this.setPasswordText}
			       placeholder="Password (optional)" />
			<input type="text" value={this.state.vlanText}
			       onChange={this.setVlanText}
			       placeholder="VLAN (optional)" />
			<input type="text" value={this.state.commentText}
			       onChange={this.setCommentText}
			       placeholder="Comment (optional)" />
			<input type="text" value={this.state.fromDate}
			       onChange={this.setFromDate}
			       placeholder="Start, 2022-07-22 12:00 (optional)" />
			<input type="text" value={this.state.toDate}
			       onChange={this.setToDate}
			       placeholder="End, 2022-07-23 12:00 (optional)" />
		    </Modal>
		    <Modal onClose={this.showVlanModal}
			   onSubmit={this.submitVlanModal}
			   show={this.state.showVlanModal}
			   messageBox="">
			<input type="text" value={this.state.vlanText}
			       onChange={this.setVlanText}
			       placeholder="Enter VLAN here..." />
		    </Modal>
		    <Modal onClose={this.showCommentModal}
			   onSubmit={this.submitCommentModal}
			   show={this.state.showCommentModal}
			   messageBox="" >
			<input type="text" value={this.state.commentText}
			       onChange={this.setCommentText}
			       placeholder="Enter comment here..." />
		    </Modal>
		</div>
		<div id="search">
		    <DeviceSearchForm searchAction={this.getDevicesData} />
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
					<div className="sort">
					    {this.state.authdate_sort}
					</div>
				    </th>
				    <th>
					Active
				    </th>
				    <th onClick={() => this.sortHeader("vlan")}>
					VLAN <Icon name="sort" />{" "}
					<div>
					    {this.state.vlan_sort}
					</div>
				    </th>
				    <th onClick={() => this.sortHeader("reason")}>
					Reason <Icon name="sort" />{" "}
					<div>
					    {this.state.reason_sort}
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
