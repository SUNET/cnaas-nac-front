import React from "react";
import PropTypes from 'prop-types'
import { Button, Select, Input, Icon } from 'semantic-ui-react'
import checkResponseStatus from "../utils/checkResponseStatus";

class DeviceTypeForm extends React.Component {
    constructor() {
	super();

	this.state = {
	    typeOptions: []
	}

	const credentials = localStorage.getItem("token");

	fetch(process.env.NAC_API_URL + "/api/v1.0/groups?type=ui", {
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
			    typeOptions: data.data
			}
		    );
		}
	    });
    }

    updateTypeField(e, option) {
	this.props.typeAction({groupName: option.value});
    }

    render() {
	return (
	    <Select options={this.state.typeOptions} defaultValue='all' onChange={this.updateTypeField.bind(this)} />
	);
    }
}

DeviceTypeForm.propTypes = {
    typeAction: PropTypes.func.isRequired,
}

export default DeviceTypeForm;
