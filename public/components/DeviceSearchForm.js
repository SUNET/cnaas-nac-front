import React from "react";
import PropTypes from 'prop-types'
import { Button, Select, Input, Icon } from 'semantic-ui-react'

class DeviceSearchForm extends React.Component {
    state = {
	searchText: "",
	searchField: "username"
    };

    updateSearchText(e) {
	const val = e.target.value;
	this.setState({
	    searchText: val
	});
    }

    updateSearchField(e, option) {
	const val = option.value;
	this.setState({
	    searchField: val
	});
    }

    clearSearch(e) {
	this.setState({
	    searchText: ""
	});
	this.props.searchAction({ filterField: null, filterValue: null });
    }

    submitSearch(e) {
	e.preventDefault();
	this.props.searchAction({filterField: this.state.searchField, filterValue: this.state.searchText});
    }

    render() {
	const searchOptions = [
	    { 'key': 'username', 'value': 'username', 'text': 'Username' },
	    { 'key': 'vlan', 'value': 'vlan', 'text': 'VLAN' },
	    { 'key': 'nasip', 'value': 'nasip', 'text': ' NAS IP' },
	    { 'key': 'nasport', 'value': 'nasport', 'text': 'NAS port' },
	    { 'key': 'reason', 'value': 'reason', 'text': 'Reason' },
	    { 'key': 'comment', 'value': 'comment', 'text': 'Comment' },
	]

	return (
	    <form onSubmit={this.submitSearch.bind(this)}>
		<Input type='text' placeholder='Search...' action
		       onChange={this.updateSearchText.bind(this)}
		       icon={<Icon name='delete' link onClick={this.clearSearch.bind(this)}/>}
		       value={this.state.searchText}
		/>
		&nbsp;&nbsp;
		<Select options={searchOptions} defaultValue='username' onChange={this.updateSearchField.bind(this)} />
		&nbsp;&nbsp;
		<Button type='submit'>🔍</Button>
	    </form>
	);
    }
}

DeviceSearchForm.propTypes = {
    searchAction: PropTypes.func.isRequired,
}

export default DeviceSearchForm;
