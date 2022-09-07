import React from "react";
import PropTypes from 'prop-types'
import { Button, Select, Input, Icon } from 'semantic-ui-react'

class DeviceWhenForm extends React.Component {
    state = {
	whenField: ""
    };

    updateWhenField(e, option) {
	const val = option.value;

	this.setState({
	    whenField: val
	});

	console.log("updateWhenField, whenField=" + this.state.whenField);
	
	this.props.whenAction({whenField: val});
    }

    render() {
	const whenOptions = [
	    { 'key': 'hour', 'value': 'hour', 'text': 'Hour' },
	    { 'key': 'day', 'value': 'day', 'text': 'Day' },
	    { 'key': 'week', 'value': 'week', 'text': 'Week' },
	    { 'key': 'month', 'value': 'month', 'text': ' Month' },
	    { 'key': 'year', 'value': 'year', 'text': 'Year' },
	    { 'key': 'all', 'value': 'all', 'text': 'All' },
	]

	return (
	    <Select options={whenOptions} defaultValue='week' onChange={this.updateWhenField.bind(this)} />
	);
    }
}

DeviceWhenForm.propTypes = {
    whenAction: PropTypes.func.isRequired,
}

export default DeviceWhenForm;
