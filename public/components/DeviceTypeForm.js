import React from "react";
import PropTypes from 'prop-types'
import { Button, Select, Input, Icon } from 'semantic-ui-react'

class DeviceTypeForm extends React.Component {
    state = {
	typeField: ""
    };

    updateTypeField(e, option) {
	const val = option.value;

	this.setState({
	    typeField: val
	});

	this.props.typeAction({typeField: val});
    }

    render() {
	const typeOptions = [
	    { 'key': 'eap', 'value': 'eap', 'text': 'EAP' },
	    { 'key': 'mab', 'value': 'mab', 'text': 'MAB' },
	    { 'key': 'all', 'value': 'all', 'text': 'All' },
	]

	return (
	    <Select options={typeOptions} defaultValue='all' onChange={this.updateTypeField.bind(this)} />
	);
    }
}

DeviceTypeForm.propTypes = {
    typeAction: PropTypes.func.isRequired,
}

export default DeviceTypeForm;
