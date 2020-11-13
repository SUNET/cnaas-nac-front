import React from "react";
import PropTypes from "prop-types";

export default class Modal extends React.Component {
    onClose = e => {
	this.props.onClose && this.props.onClose(e);
    };

    onSubmit = e => {
	this.props.onSubmit && this.props.onSubmit(e);
	this.props.onClose && this.props.onClose(e);
    };

    render() {
	if (!this.props.show) {
	    return null;
	}

	if (this.props.messageBox !== "") {
	    return (
		<div className="modal" id="modal">
		    <div className="content">{this.props.children}</div>
		    <div className="actions">
			<button onClick={this.onClose}>Close</button>
		    </div>
		</div>
	    );

	} else {
	    return (
		<div className="modal" id="modal">
		    <div className="content">{this.props.children}</div>
		    <div className="actions">
			<button onClick={this.onSubmit}>OK</button>
			<button onClick={this.onClose}>Cancel</button>
		    </div>
		</div>
	    );
	}
    }
}

Modal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    messageBox: PropTypes.string.isRequired
};
