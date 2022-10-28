import React from "react";
import { Button, Select, Input, Icon, Pagination, Checkbox } from "semantic-ui-react";
import DeviceSearchForm from "./DeviceSearchForm";
import DeviceWhenForm from "./DeviceWhenForm";
import DeviceTypeForm from "./DeviceTypeForm";
import checkResponseStatus from "../utils/checkResponseStatus";
import Modal from "./Modal";
import fileDownload from 'js-file-download'

class DeviceGroups extends React.Component {
    constructor() {
	super();
	this.state = {
	    groupsData: [],
	    activePage: 1,
	    totalPages: 1,
	    checkedItems: {},
	    groupnameText: "",
	    fieldnameText: "",
	    conditionText: "",
	    showAddModal: false
	};

	this.handleCheck = this.handleCheck.bind(this);
	this.handleSelect = this.handleSelect.bind(this);

	this.setGroupnameText = this.setGroupnameText.bind(this);
	this.setFieldnameText = this.setFieldnameText.bind(this);
	this.setConditionText = this.setConditionText.bind(this);
    }

    componentDidMount() {
	this.getGroupsAPIData();
    }

    updateDeviceRemove = object => {
	const credentials = localStorage.getItem("token");

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/groups/" + key, {
		method: "DELETE",
		headers: {
		    Authorization: `Bearer ${credentials}`
		},
	    })
		.then(response => checkResponseStatus(response))
		.then(response => response.json())
	});

	this.forceUpdate();
    };

    handleSelect(event) {
	let newState = this.state;

	this.setState(newState);
	newState['fieldnameText'] = event.target.value;
	this.setState(newState);
    }

    handleRemove = object => {
	this.updateDeviceRemove();
	this.forceUpdate();
    }

    handleCheck(event) {
	let newState = this.state;

	this.setState(newState);
	newState['checkedItems'][event.target.name] = event.target.checked;
	this.setState(newState);
    }

    showAddModal = e => {
	this.setState({
	    showAddModal: !this.state.showAddModal
	});
    };

    submitAddModal = e => {
	let jsonData = {
	    "groupname": this.state.groupnameText,
	    "fieldname": this.state.fieldnameText,
	    "condition": this.state.conditionText
	};

	const credentials = localStorage.getItem("token");

	fetch(process.env.NAC_API_URL + "/api/v1.0/groups", {
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
	    groupnameText: ""
	});

	this.setState({
	    fieldnameText: ""
	});

	this.setState({
	    conditionText: ""
	});

	this.forceUpdate();
    };

    getGroupsAPIData = () => {
	const credentials = localStorage.getItem("token");
	fetch(process.env.NAC_API_URL + "/api/v1.0/groups", {
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
			    groupsData: data.data
			}
		    );
		}
	    });
    };

    setGroupnameText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['groupnameText'] = event.target.value;
	this.setState(newState);
    }

    setFieldnameText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['fieldnameText'] = event.target.value;
	this.setState(newState);
    }

    setConditionText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['conditionText'] = event.target.value;
	this.setState(newState);
    }

    render() {
	let deviceInfo = "";
	const groupsData = this.state.groupsData;

	deviceInfo = groupsData.map((items, index) => {
	    let clientStatus = "";
	    return [
		<tr key={index} bgcolor="lightgray">
		    <td key="0" align="left">
			<input
			    type="checkbox"
			    value={items.groupname}
			    onChange={this.handleCheck}
			    name={items.groupname}
			    checked={this.state.check}
			/>
		    </td>
		    <td key="1" align="left">
			{items.groupname}
		    </td>
		    <td key="2" align="left">
			{items.fieldname}
		    </td>
		    <td key="3" align="left">
			{items.condition}
		    </td>
		</tr>,
	    ];
	});

	return (
	    <section>
		<div id="action">
		    <Button.Group>
			<Button onClick={e => this.showAddModal(e)} title="Add group(s)">
			    ➕
			</Button>
			<Button onClick={this.handleRemove} title="Remove groups(s)">
			    ➖
			</Button>
		    </Button.Group>
		    &nbsp;
		</div>
		<div id="search">
		    <br/><br/>
		</div>
		<div id="groups_list">
		    <div id="data">
			<table>
			    <thead>
				<tr>
				    <th>
					Select
				    </th>
				    <th>
					Groupname
				    </th>
				    <th>
					Fieldname
				    </th>
				    <th>
					Condition
				    </th>
				</tr>
			    </thead>
			    <tbody>{deviceInfo}</tbody>
			</table>
		    </div>
		</div>
		<Modal onClose={this.showAddModal}
		       onSubmit={this.submitAddModal}
		       show={this.state.showAddModal}
		       messageBox="">
		    <input type="text" value={this.state.groupnameText}
			   onChange={this.setGroupnameText}
			   placeholder="Name (required)" />

		    <select value={this.state.fieldnameText} onChange={this.handleSelect} >
			<option>Field</option>
			<option value="username">Username</option>
			<option value="nasport">NAS port</option>
			<option value="vlan">VLAN</option>
			<option value="nasip">NAS IP address</option>
			<option value="nasport">NAS port</option>
			<option value="reason">Reason</option>
			<option value="comment">Comment</option>
		    </select>

		    <input type="text" value={this.state.conditionText}
			   onChange={this.setConditionText}
			   placeholder="Condition (required)" />
		</Modal>
	    </section>
	);
    }
}

export default DeviceGroups;
