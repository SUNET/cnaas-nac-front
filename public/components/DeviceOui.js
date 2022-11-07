import React from "react";
import { Button, Select, Input, Icon, Pagination, Checkbox } from "semantic-ui-react";
import DeviceSearchForm from "./DeviceSearchForm";
import DeviceWhenForm from "./DeviceWhenForm";
import DeviceTypeForm from "./DeviceTypeForm";
import checkResponseStatus from "../utils/checkResponseStatus";
import Modal from "./Modal";
import fileDownload from 'js-file-download'

class DeviceOui extends React.Component {
    constructor() {
	super();
	this.state = {
	    ouiData: [],
	    activePage: 1,
	    totalPages: 1,
	    checkedItems: {},
	    ouiText: "",
	    vlanText: "",
	    descriptionText: "",
	    showAddModal: false
	};

	this.handleCheck = this.handleCheck.bind(this);
	this.handleSelect = this.handleSelect.bind(this);

	this.setOuiText = this.setOuiText.bind(this);
	this.setVlanText = this.setVlanText.bind(this);
	this.setDescriptionText = this.setDescriptionText.bind(this);
    }

    componentDidMount() {
	this.getOuiAPIData();
    }

    updateDeviceRemove = object => {
	const credentials = localStorage.getItem("token");

	Object.keys(this.state.checkedItems).forEach(function(key) {
	    fetch(process.env.NAC_API_URL + "/api/v1.0/oui/" + key, {
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
	newState['vlanText'] = event.target.value;
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
	    "oui": this.state.ouiText,
	    "vlan": this.state.vlanText,
	    "description": this.state.descriptionText
	};

	const credentials = localStorage.getItem("token");

	fetch(process.env.NAC_API_URL + "/api/v1.0/oui", {
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
	    ouiText: ""
	});

	this.setState({
	    vlanText: ""
	});

	this.setState({
	    descriptionText: ""
	});

	this.forceUpdate();
    };

    getOuiAPIData = () => {
	const credentials = localStorage.getItem("token");
	fetch(process.env.NAC_API_URL + "/api/v1.0/oui", {
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
			    ouiData: data.data
			}
		    );
		}
	    });
    };

    setOuiText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['ouiText'] = event.target.value;
	this.setState(newState);
    }

    setVlanText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['vlanText'] = event.target.value;
	this.setState(newState);
    }

    setDescriptionText(event) {
	let newState = this.state;

	this.setState(newState);
	newState['descriptionText'] = event.target.value;
	this.setState(newState);
    }

    render() {
	let deviceInfo = "";
	const ouiData = this.state.ouiData;

	deviceInfo = ouiData.map((items, index) => {
	    let clientStatus = "";
	    return [
		<tr key={index} bgcolor="lightgray">
		    <td key="0" align="left">
			<input
			    type="checkbox"
			    value={items.oui}
			    onChange={this.handleCheck}
			    name={items.oui}
			    checked={this.state.check}
			/>
		    </td>
		    <td key="1" align="left">
			{items.oui}
		    </td>
		    <td key="2" align="left">
			{items.vlan}
		    </td>
		    <td key="3" align="left">
			{items.description}
		    </td>
		</tr>,
	    ];
	});

	return (
	    <section>
		<div id="action">
		    <Button.Group>
			<Button onClick={e => this.showAddModal(e)} title="Add OUI(s)">
			    ➕
			</Button>
			<Button onClick={this.handleRemove} title="Remove OUI(s)">
			    ➖
			</Button>
		    </Button.Group>
		    &nbsp;
		</div>
		<div id="search">
		    <br/><br/>
		</div>
		<div id="ouis_list">
		    <div id="data">
			<table>
			    <thead>
				<tr>
				    <th>
					Select
				    </th>
				    <th>
					OUI
				    </th>
				    <th>
					VLAN
				    </th>
				    <th>
					Comment
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
		    <input type="text" value={this.state.ouiText}
			   onChange={this.setOuiText}
			   placeholder="OUI (required)" />
		    <input type="text" value={this.state.vlanText}
			   onChange={this.setVlanText}
			   placeholder="VLAN (required)" />
		    <input type="text" value={this.state.descriptionText}
			   onChange={this.setDescriptionText}
			   placeholder="Description" />
		</Modal>
	    </section>
	);
    }
}

export default DeviceOui;
